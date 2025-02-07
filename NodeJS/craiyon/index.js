const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate', async (req, res) => {
    let browser;
    try {
        const CookieBlocker = './extensions/cookie_blocker';
        const { prompt } = req.body;
        browser = await puppeteer.launch({
            headless: false, // Make browser visible
            slowMo: 50, // Slow down operations by 50ms
            args: [
                `--disable-extensions-except=${CookieBlocker}`,
                `--load-extension=${CookieBlocker}`,
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

        res.json({ images: [imageUrl] });
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
