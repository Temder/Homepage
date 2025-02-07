document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const imageGrid = document.getElementById('imageGrid');

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        loading.style.display = 'block';
        imageGrid.innerHTML = '';
        generateBtn.disabled = true;

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();
            data.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                imageGrid.appendChild(img);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate images');
        } finally {
            loading.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});
