const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
// Remove node-fetch require
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

app.post('/generate', async (req, res) => {
    let browser;
    try {
        //const ExtensionPath = 'NodeJS/craiyon/extensions/';
        const { prompt } = req.body;
        browser = await puppeteer.launch({
            headless: true, // Make browser visible
            slowMo: 50, // Slow down operations by 50ms
            args: [
                //`--disable-extensions-except=${ExtensionPath}`,
                //`--load-extension=${ExtensionPath}`,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1280,800' // Set a reasonable window size
            ],
            defaultViewport: {
                width: 1280,
                height: 800
            }
        });
        
        const page = await browser.newPage();
        await page.goto('https://deepai.org/machine-learning-model/text2img', { 
            waitUntil: 'networkidle0' 
        });


        // Continue with rest of the process
        await page.waitForSelector('textarea[name="text"]');
        await page.type('textarea[name="text"]', prompt);
        
        try {
            // Wait for iframe to be present
            await page.waitForSelector('#sp_message_iframe_1230780');
            
            // Get the iframe element
            const frameHandle = await page.$('#sp_message_iframe_1230780');
            const frame = await frameHandle.contentFrame();
            
            // Wait for and click the accept button inside the iframe
            await frame.waitForSelector('button[title="Zustimmen"]');
            await frame.click('button[title="Zustimmen"]');
        } catch (error) {
            console.error('Error handling the cookie popup:', error);
            // Continue execution even if cookie handling fails
        }

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

        if (!imageUrl) {
            throw new Error('No image was generated');
        }

        // After getting imageUrl, save it
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
