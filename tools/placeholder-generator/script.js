/**
 * Placeholder Image Generator
 * Instantly generate placeholder images with specified dimensions
 */

document.addEventListener('DOMContentLoaded', () => {
    initializePlaceholderGenerator();
});

/**
 * Initialize the placeholder generator functionality
 */
function initializePlaceholderGenerator() {
    // DOM Elements - Dimensions
    const imageWidth = document.getElementById('image-width');
    const imageHeight = document.getElementById('image-height');
    const maintainRatio = document.getElementById('maintain-ratio');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // DOM Elements - Colors
    const bgColor = document.getElementById('bg-color');
    const bgColorValue = document.getElementById('bg-color-value');
    const textColor = document.getElementById('text-color');
    const textColorValue = document.getElementById('text-color-value');
    const randomColorsBtn = document.getElementById('random-colors-btn');
    const swapColorsBtn = document.getElementById('swap-colors-btn');
    
    // DOM Elements - Text Options
    const textType = document.getElementById('text-type');
    const customTextContainer = document.getElementById('custom-text-container');
    const customText = document.getElementById('custom-text');
    
    // DOM Elements - Format
    const formatRadios = document.querySelectorAll('input[name="format"]');
    
    // DOM Elements - Actions & Preview
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewCanvas = document.getElementById('preview-canvas');
    const imageUrl = document.getElementById('image-url');
    const copyUrlBtn = document.getElementById('copy-url-btn');
    
    // Canvas Context
    const ctx = previewCanvas.getContext('2d');
    
    // State
    let aspectRatio = imageWidth.value / imageHeight.value;
    let currentFormat = 'png';
    
    // Event Listeners - Dimensions
    imageWidth.addEventListener('input', () => {
        if (maintainRatio.checked) {
            imageHeight.value = Math.round(imageWidth.value / aspectRatio);
        } else {
            aspectRatio = imageWidth.value / imageHeight.value;
        }
    });
    
    imageHeight.addEventListener('input', () => {
        if (maintainRatio.checked) {
            imageWidth.value = Math.round(imageHeight.value * aspectRatio);
        } else {
            aspectRatio = imageWidth.value / imageHeight.value;
        }
    });
    
    maintainRatio.addEventListener('change', () => {
        if (maintainRatio.checked) {
            aspectRatio = imageWidth.value / imageHeight.value;
        }
    });
    
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const width = button.getAttribute('data-width');
            const height = button.getAttribute('data-height');
            
            imageWidth.value = width;
            imageHeight.value = height;
            aspectRatio = width / height;
        });
    });
    
    // Event Listeners - Colors
    bgColor.addEventListener('input', () => {
        bgColorValue.value = bgColor.value;
    });
    
    bgColorValue.addEventListener('input', () => {
        bgColor.value = bgColorValue.value;
    });
    
    textColor.addEventListener('input', () => {
        textColorValue.value = textColor.value;
    });
    
    textColorValue.addEventListener('input', () => {
        textColor.value = textColorValue.value;
    });
    
    randomColorsBtn.addEventListener('click', generateRandomColors);
    swapColorsBtn.addEventListener('click', swapColors);
    
    // Event Listeners - Text Options
    textType.addEventListener('change', () => {
        if (textType.value === 'custom') {
            customTextContainer.style.display = 'block';
        } else {
            customTextContainer.style.display = 'none';
        }
    });
    
    // Event Listeners - Format
    formatRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                currentFormat = radio.value;
            }
        });
    });
    
    // Event Listeners - Actions
    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);
    copyUrlBtn.addEventListener('click', copyImageUrl);
    
    /**
     * Generate a random color
     */
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    /**
     * Generate random background and text colors
     */
    function generateRandomColors() {
        const randomBg = getRandomColor();
        let randomText = getRandomColor();
        
        // Ensure text and background have good contrast
        while (!hasGoodContrast(randomBg, randomText)) {
            randomText = getRandomColor();
        }
        
        bgColor.value = randomBg;
        bgColorValue.value = randomBg;
        textColor.value = randomText;
        textColorValue.value = randomText;
    }
    
    /**
     * Check if two colors have good contrast
     */
    function hasGoodContrast(color1, color2) {
        // Convert hex to RGB
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        // Calculate luminance
        const luminance1 = calculateLuminance(rgb1);
        const luminance2 = calculateLuminance(rgb2);
        
        // Calculate contrast ratio
        const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                     (Math.min(luminance1, luminance2) + 0.05);
        
        return ratio >= 4.5; // WCAG AA standard for normal text
    }
    
    /**
     * Convert hex to RGB
     */
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    /**
     * Calculate relative luminance of a color (WCAG)
     */
    function calculateLuminance(rgb) {
        const { r, g, b } = rgb;
        
        const rsrgb = r / 255;
        const gsrgb = g / 255;
        const bsrgb = b / 255;
        
        const rL = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
        const gL = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
        const bL = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    }
    
    /**
     * Swap background and text colors
     */
    function swapColors() {
        const tempBg = bgColor.value;
        const tempText = textColor.value;
        
        bgColor.value = tempText;
        bgColorValue.value = tempText;
        textColor.value = tempBg;
        textColorValue.value = tempBg;
    }
    
    /**
     * Generate the placeholder image
     */
    function generateImage() {
        // Get dimensions
        const width = parseInt(imageWidth.value);
        const height = parseInt(imageHeight.value);
        
        // Validate dimensions
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert('Please enter valid dimensions');
            return;
        }
        
        // Limit dimensions to reasonable values
        const maxDimension = 2000;
        if (width > maxDimension || height > maxDimension) {
            alert(`Maximum dimension is ${maxDimension}px`);
            return;
        }
        
        // Set canvas dimensions
        previewCanvas.width = width;
        previewCanvas.height = height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, width, height);
        
        // Add text if needed
        if (textType.value !== 'none') {
            let text = '';
            
            if (textType.value === 'dimensions') {
                text = `${width} × ${height}`;
            } else if (textType.value === 'custom') {
                text = customText.value || 'Placeholder';
            }
            
            // Draw text
            ctx.fillStyle = textColor.value;
            
            // Adjust font size based on image dimensions
            const baseFontSize = Math.min(width, height) / 10;
            const fontSize = Math.max(10, Math.min(baseFontSize, 48));
            
            ctx.font = `bold ${fontSize}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add a subtle shadow for better visibility on all backgrounds
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            ctx.fillText(text, width / 2, height / 2);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
        }
        
        // Update data URL
        updateImageUrl();
    }
    
    /**
     * Update the image URL based on the canvas content
     */
    function updateImageUrl() {
        const format = currentFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality = currentFormat === 'jpeg' ? 0.9 : 1.0;
        
        // Get data URL
        const dataUrl = previewCanvas.toDataURL(format, quality);
        imageUrl.value = dataUrl;
    }
    
    /**
     * Download the generated image
     */
    function downloadImage() {
        // Check if canvas is empty
        if (previewCanvas.width === 0 || previewCanvas.height === 0) {
            alert('Please generate an image first');
            return;
        }
        
        const format = currentFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
        const extension = currentFormat === 'jpeg' ? 'jpg' : 'png';
        const quality = currentFormat === 'jpeg' ? 0.9 : 1.0;
        
        // Create download link
        const dataUrl = previewCanvas.toDataURL(format, quality);
        const link = document.createElement('a');
        
        // Set filename based on dimensions
        const width = previewCanvas.width;
        const height = previewCanvas.height;
        const filename = `placeholder-${width}x${height}.${extension}`;
        
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }
    
    /**
     * Copy the image URL to clipboard
     */
    function copyImageUrl() {
        if (!imageUrl.value) {
            alert('Please generate an image first');
            return;
        }
        
        imageUrl.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyUrlBtn.textContent;
        copyUrlBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyUrlBtn.textContent = originalText;
        }, 1500);
    }
    
    // Generate initial image on load
    generateImage();
};