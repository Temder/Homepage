document.addEventListener('DOMContentLoaded', async () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const imageGrid = document.getElementById('imageGrid');
    const savedImagesContainer = document.getElementById('savedImages');
    const styleSelect = document.getElementById('styleSelect');
    const shapeSelect = document.getElementById('shapeSelect');

    // Sort style options
    const options = Array.from(styleSelect.options);
    
    // Skip the first "No Specific Style" option
    const firstOption = options.shift();
    
    // Sort remaining options by text
    options.sort((a, b) => a.text.localeCompare(b.text));
    
    // Clear and rebuild select
    styleSelect.innerHTML = '';
    styleSelect.appendChild(firstOption);
    options.forEach(option => styleSelect.appendChild(option));
    styleSelect.value = '';
    shapeSelect.value = 'edit_shape_3';

    // Load saved images
    async function loadSavedImages() {
        try {
            const response = await fetch('/images');
            const data = await response.json();
            data.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                savedImagesContainer.appendChild(img);
            });
        } catch (error) {
            console.error('Error loading saved images:', error);
        }
    }

    // Load saved images on page load
    await loadSavedImages();

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const style = styleSelect.value;
        const shape = shapeSelect.value;
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
                body: JSON.stringify({ prompt, style, shape })
            });

            const data = await response.json();
            // Clear previous images
            imageGrid.innerHTML = '';
            
            data.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                imageGrid.appendChild(img);
                
                // Also add to saved images container
                const savedImg = img.cloneNode(true);
                savedImagesContainer.appendChild(savedImg);
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
