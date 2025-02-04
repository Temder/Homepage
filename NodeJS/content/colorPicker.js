document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const colorKnob = document.getElementById('colorKnob');
    const colorPicker = document.getElementById('colorPicker');
    const colorDisplay = document.getElementById('colorDisplay');
    const ctx = colorPicker.getContext('2d');
    
    // Set canvas size
    colorPicker.width = 300;
    colorPicker.height = 300;
    
    // Cache geometric values
    const rect = colorPicker.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY);

    // Draw color wheel using small segments
    for (let angle = 0; angle < 360; angle++) {
        const startAngle = (angle - 2) * Math.PI / 180;
        const endAngle = angle * Math.PI / 180;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 1, startAngle, endAngle);
        ctx.closePath();
        
        const hue = angle;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fill();
    }

    // Add white/black radial gradient
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radialGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
    radialGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0)');
    radialGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = radialGradient;
    ctx.fill();

    // Initialize knob position
    let isDragging = false;
    let animationFrameId = null;
    let currentX = centerX;
    let currentY = centerY;

    colorKnob.style.left = centerX + 'px';
    colorKnob.style.top = centerY + 'px';

    function updateColor(x, y) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        colorDisplay.textContent = `Selected Color: ${rgbToHex(pixel[0], pixel[1], pixel[2])}`;
        colorDisplay.style.color = color;
        colorKnob.style.backgroundColor = color;
    }

    function handleKnobPosition(e) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Cache calculations
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const constrainedDistance = Math.min(distance, radius - 0.5);
        
        currentX = centerX + constrainedDistance * Math.cos(angle);
        currentY = centerY + constrainedDistance * Math.sin(angle);
        
        requestAnimationFrame(updateUI);
    }

    function updateUI() {
        colorKnob.style.left = currentX + 'px';
        colorKnob.style.top = currentY + 'px';
        updateColor(currentX, currentY);
    }

    // Mouse events for dragging
    // Use passive listeners for better scroll performance
    colorKnob.addEventListener('pointerdown', () => isDragging = true, { passive: true });
    colorPicker.addEventListener('pointerdown', () => isDragging = true, { passive: true });

    document.addEventListener('pointermove', (e) => {
        if (isDragging) {
            handleKnobPosition(e);
        }
    }, { passive: true });
    
    document.addEventListener('pointerup', () => {
        isDragging = false;
        cancelAnimationFrame(animationFrameId);
    }, { passive: true });

    // Click event for direct color selection
    colorPicker.addEventListener('click', (e) => {
        if (e.target !== colorKnob) {
            handleKnobPosition(e);
        }
    }, { passive: true });

    // Initial color update
    updateColor(parseInt(colorKnob.style.left), parseInt(colorKnob.style.top));

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    // Add fallback for pointer events
    if (!window.PointerEvent) {
        colorKnob.addEventListener('mousedown', () => isDragging = true);
        colorKnob.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);
    }

    // Fallback for requestAnimationFrame
    const requestFrame = window.requestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.mozRequestAnimationFrame || 
                        (cb => setTimeout(cb, 16));
});
