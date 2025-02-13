const axios = require('axios');
const fs = require('fs');
const querystring = require('querystring');
const puppeteer = require('puppeteer');

// Configuration
const requestId = Math.random().toFixed(10);
const baseUrl = 'https://image-generation.perchance.org/api';

// Helper function to generate cache buster
const getCacheBuster = () => Math.random().toFixed(10);

async function getUserKey(browser) {
    const page = await browser.newPage();

    try {
        await page.goto('https://perchance.org/pershot', { waitUntil: 'networkidle2' });
        
        await page.waitForSelector('#outputIframeEl', { timeout: 30000 });
        const frameHandle = await page.$('#outputIframeEl');
        const frame = await frameHandle.contentFrame();

        // Wait for the generate button to be available and click it
        await frame.waitForSelector('#generateButtonEl');
        await frame.click('#generateButtonEl');

        var response;
        while (true) {
            response = await axios.get(
                `${baseUrl}/verifyUser?thread=1&__cacheBust=${getCacheBuster()}`
            );
            if (response && response.data && response.data.userKey) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        await browser.close();
        
        if (response.data.userKey) {
            console.log('User key:', response.data.userKey);
            return response.data.userKey;
        } else {
            console.error('Failed to obtain user key. Reason:', response);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        await browser.close();
        return null;
    }
}

async function generateImage(browser, prompt) {
    try {
        // Step 1: Get access code
        const adAccessCodeResponse = await axios.get(
            `https://perchance.org/api/getAccessCodeForAdPoweredStuff?__cacheBust=${getCacheBuster()}`
        );
        const adAccessCode = adAccessCodeResponse.data;
        console.log('Access code:', adAccessCode);

        // Step 2: Get user key
        let currentUserKey = await getUserKey(browser);
        if (!currentUserKey) {
            console.error('Failed to obtain user key');
            return false;
        }

        // Step 3: Check verification status
        let verificationStatus = await axios.get(
            `${baseUrl}/checkUserVerificationStatus?userKey=${currentUserKey}&__cacheBust=${getCacheBuster()}`
        );
        console.log('Verification status:', verificationStatus.data);

        if (verificationStatus.data.status === 'not_verified') {
            currentUserKey = adAccessCode;
            verificationStatus = await axios.get(
                `${baseUrl}/checkUserVerificationStatus?userKey=${currentUserKey}&__cacheBust=${getCacheBuster()}`
            );
        }
        console.log('Updated verification status:', verificationStatus.data);

        // Step 4: Verify user (multiple attempts)
        while (!['verified', 'already_verified'].includes(verificationStatus.data.status)) {
            const verifyResponse = await axios.get(
                `${baseUrl}/verifyUser?thread=5&__cacheBust=${getCacheBuster()}`
            );
            if (['success', 'already_verified'].includes(verifyResponse.data.status)) break;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('Generating image');

        // Step 5: Generate image
        const params = {
            prompt: prompt || '',
            seed: -1,
            resolution: '512x768',
            guidanceScale: 7,
            negativePrompt: '(worst quality, low quality, blurry:1.3)',
            channel: 'pershot',
            subChannel: 'public',
            userKey: currentUserKey,
            adAccessCode: adAccessCode,
            requestId: requestId,
            maybeNsfw: 'false'
        };

        const generateUrl = `${baseUrl}/generate?${querystring.stringify(params)}&__cacheBust=${getCacheBuster()}`;
        const generateResponse = await axios.get(generateUrl);

        if (generateResponse.data.status === 'invalid_key') {
            console.error('Failure when generating image.\n\nURL:', generateUrl, '\n\nResponse:', generateResponse.data);
            return false;
        }

        console.log('Successfully generated image.\n\nURL:', generateUrl, '\n\nResponse:', generateResponse.data);

        // Step 6: Download the generated image
        if (generateResponse.data.imageId) {
            const imageUrl = `${baseUrl}/downloadTemporaryImage?imageId=${generateResponse.data.imageId}`;
            /*const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
            const outputPath = 'generated_image.png';
            imageResponse.data.pipe(fs.createWriteStream(outputPath));
            console.log('Image saved as', outputPath);*/
            return imageUrl;
        }

        return false;
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

module.exports = { generateImage };

// Example usage:
// generateImage('a beautiful landscape');
