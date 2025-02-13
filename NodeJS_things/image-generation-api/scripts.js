document.addEventListener('DOMContentLoaded', async () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const imageGrid = document.getElementById('imageGrid');
    const savedImagesContainer = document.getElementById('savedImages');
    const styleSelect = document.getElementById('styleSelect');
    const shapeSelect = document.getElementById('shapeSelect');
    const siteSelect = document.getElementById('siteSelect');
    const negativePromptInput = document.getElementById('negativePromptInput');

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

    // Handle site selection change
    siteSelect.addEventListener('change', () => {
        const site = siteSelect.value;
        
        // Show/hide negative prompt input for pershot
        negativePromptInput.style.display = site === 'pershot' ? 'block' : 'none';
        
        // Update style options based on selected site
        updateStyleOptions(site);
    });

    function updateStyleOptions(site) {
        styleSelect.innerHTML = '';
        
        if (site === 'deepai') {
            // Add original DeepAI options
            styleSelect.innerHTML = '<option value="" selected>No Specific Style</option>';
            // ...existing DeepAI options...
        } else if (site === 'pershot') {
            // Add Pershot options from site.html
            const pershotStyles = [
                "Painted Anime Plus", "Painted Anime", "Casual Photo", "Cinematic",
                // Add more styles from site.html...
            ];
            
            pershotStyles.forEach(style => {
                const option = document.createElement('option');
                option.value = style;
                option.textContent = style;
                styleSelect.appendChild(option);
            });
        }
    }

    // Load saved images
    async function loadSavedImages() {
        try {
            const response = await fetch('/images');
            const data = await response.json();
            data.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.tabIndex = 0;
                savedImagesContainer.insertAdjacentElement('afterbegin', img);
            });
        } catch (error) {
            console.error('Error loading saved images:', error);
        }
    }

    // Load saved images on page load
    await loadSavedImages();

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const negative = negativePromptInput.value.trim();
        const style = styleSelect.value;
        const shape = shapeSelect.value;
        const site = siteSelect.value;
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
                body: JSON.stringify({ 
                    prompt, 
                    negative, 
                    style, 
                    shape,
                    site
                })
            });

            const data = await response.json();
            // Clear previous images
            imageGrid.innerHTML = '';
            
            data.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.tabIndex = 0;
                imageGrid.appendChild(img);
                
                // Also add to saved images container
                const savedImg = img.cloneNode(true);
                savedImagesContainer.insertAdjacentElement('afterbegin', savedImg);
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
