const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const app = express();
const port = 3000;

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/images', (req, res) => {
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read images directory' });
        }
        const images = files.map(file => `/images/${file}`);
        res.json({ images });
    });
});

app.use('/images', express.static(path.join(__dirname, 'images')));

async function saveImage(imageUrl) {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `image_${Date.now()}.jpg`;
    const filepath = path.join(imagesDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    return `/images/${filename}`;
}

async function generateWithDeepAI(browser, prompt, style, shape) {
    const page = await browser.newPage();
    try {
        await page.goto('https://deepai.org/machine-learning-model/text2img', { waitUntil: 'networkidle0' });
        
        // Handle cookie consent if present
        try {
            await page.waitForSelector('#sp_message_iframe_1230780', { timeout: 5000 });
            const frameHandle = await page.$('#sp_message_iframe_1230780');
            const frame = await frameHandle.contentFrame();
            await frame.waitForSelector('button[title="Accept"], button[title="Zustimmen"]');
            await frame.click('button[title="Accept"], button[title="Zustimmen"]');
        } catch (error) {
            console.log('No cookie consent popup or already accepted');
        }

        // Select style if provided
        if (style) {
            await page.waitForSelector('a.all-other-models');
            await page.click('a.all-other-models');
            await page.waitForSelector(`a.other-model-button[href*="${style}"]`);
            await page.click(`a.other-model-button[href*="${style}"]`);
        }

        // Select shape if provided
        if (shape) {
            await page.waitForSelector('button[id="modelEditButton"]');
            await page.click('button[id="modelEditButton"]');
            await page.waitForSelector(`div[id="${shape}"]`);
            await page.click(`div[id="${shape}"]`);
        }

        // Enter prompt and generate
        await page.waitForSelector('textarea[name="text"]');
        await page.type('textarea[name="text"]', prompt);
        
        // Click generate button
        const generateButton = await page.waitForSelector('button[id="modelSubmitButton"]');
        await generateButton.click();

        // Wait for real image (not placeholder)
        await page.waitForFunction(
            () => {
                const img = document.querySelector('#place_holder_picture_model > img');
                return img && !img.classList.contains('placeholder-image');
            },
            { timeout: 60000 }
        );
        
        // Get the generated image URL
        const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('#place_holder_picture_model > img');
            return img && !img.classList.contains('placeholder-image') ? img.src : null;
        });

        return imageUrl;
    } finally {
        await page.close();
    }
}

async function generateWithPershot(browser, params) {
    const page = await browser.newPage();
    try {
        // Set more realistic browser behavior
        await page.setDefaultNavigationTimeout(60000);
        await page.setViewport({ width: 1280, height: 800 });
        
        // Set a more browser-like user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Add browser-like characteristics
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en']
            });
        });

        // Navigate with standard browser-like behavior
        await page.goto('https://perchance.org/pershot', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for and handle potential verification popup
        try {
            const verificationSelector = '#verification-dialog'; // Adjust based on actual popup
            await page.waitForSelector(verificationSelector, { timeout: 5000 });
            if (await page.$(verificationSelector)) {
                // Handle verification - this depends on the specific verification type
                // For example, clicking a button or solving a simple challenge
                await page.click('#verify-button'); // Adjust selector as needed
                await page.waitForTimeout(2000);
            }
        } catch (e) {
            console.log('No verification popup detected, continuing...');
        }

        // Rest of the existing generateWithPershot code...
        await page.waitForSelector('#outputIframeEl', { timeout: 30000 });
        const frameHandle = await page.$('#outputIframeEl');
        const frame = await frameHandle.contentFrame();
        
        // Add random delays between actions to appear more human-like
        await page.waitForTimeout(Math.random() * 1000 + 500);
        
        // Input prompt with human-like typing
        await frame.waitForSelector('textarea[data-name="description"]');
        await frame.type('textarea[data-name="description"]', params.prompt, {
            delay: Math.random() * 100 + 50 // Random typing delay
        });

        // Input negative prompt if provided
        if (params.negative) {
            await frame.waitForSelector('textarea[data-name="negative"]');
            await frame.type('textarea[data-name="negative"]', params.negative);
        }

        // Select style
        if (params.style) {
            await frame.waitForSelector('select[data-name="artStyle"]');
            await frame.select('select[data-name="artStyle"]', `ref:optionKeyName:${params.style}`);
        }

        // Select number of images
        await frame.waitForSelector('select[data-name="numImages"]');
        await frame.select('select[data-name="numImages"]', '1');

        // Click generate button
        await frame.waitForSelector('#generateButtonEl');
        await frame.click('#generateButtonEl');

        // Wait for generated image and get its URL
        await frame.waitForSelector('.t2i-image-ctn img', { timeout: 60000 });
        const imageUrl = await frame.evaluate(() => {
            const img = document.querySelector('.t2i-image-ctn img');
            return img ? img.src : null;
        });

        return imageUrl;
    } catch (error) {
        console.error('Pershot generation error:', error);
        throw error;
    } finally {
        await page.close();
    }
}

app.post('/generate', async (req, res) => {
    let browser;
    try {
        const { prompt, negative, style, shape, site } = req.body;
        
        browser = await puppeteer.launch({
            headless: false, // Use false for debugging
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-size=1280,800',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--hide-scrollbars',
                '--disable-notifications'
            ],
            ignoreHTTPSErrors: true,
            defaultViewport: {
                width: 1280,
                height: 800
            }
        });

        let imageUrl;
        if (site === 'deepai') {
            imageUrl = await generateWithDeepAI(browser, prompt, style, shape);
        } else if (site === 'pershot') {
            imageUrl = await generateWithPershot(browser, { prompt, negative, style, shape });
        }

        if (!imageUrl) {
            throw new Error('No image was generated');
        }

        const savedImagePath = await saveImage(imageUrl);
        res.json({ images: [savedImagePath] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate image: ' + error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
