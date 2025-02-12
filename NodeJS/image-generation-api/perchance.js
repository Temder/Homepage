const axios = require('axios');
const fs = require('fs');
const querystring = require('querystring');

// Configuration
const userKey = '9a219f6681b16c9014044d64b42c465a24f6383296f5c7e16655f8832f2a75f1';
const requestId = Math.random().toFixed(10);
const baseUrl = 'https://image-generation.perchance.org/api';

// Helper function to generate cache buster
const getCacheBuster = () => Math.random().toFixed(10);

async function generateImage(prompt) {
    try {
        // Step 1: Get access code
        const adAccessCodeResponse = await axios.get(
            `https://perchance.org/api/getAccessCodeForAdPoweredStuff?__cacheBust=${getCacheBuster()}`
        );
        const adAccessCode = adAccessCodeResponse.data;
        console.log('Access code:', adAccessCode);

        // Step 2: Check verification status
        let currentUserKey = userKey;
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

        // Step 3: Verify user (multiple attempts)
        while (!['verified', 'already_verified'].includes(verificationStatus.data.status)) {
            const verifyResponse = await axios.get(
                `${baseUrl}/verifyUser?thread=5&__cacheBust=${getCacheBuster()}`
            );
            if (['success', 'already_verified'].includes(verifyResponse.data.status)) break;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('Generating image');

        // Step 4: Generate image
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

        // Step 5: Download the generated image
        if (generateResponse.data.imageId) {
            const imageUrl = `${baseUrl}/downloadTemporaryImage?imageId=${generateResponse.data.imageId}`;
            const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
            const outputPath = 'generated_image.png';
            imageResponse.data.pipe(fs.createWriteStream(outputPath));
            console.log('Image saved as', outputPath);
            return true;
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
