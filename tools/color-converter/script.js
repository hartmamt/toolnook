/**
 * Color Converter Tool
 * Converts between different color formats (HEX, RGB, HSL)
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const colorInput = document.getElementById('color-input');
    const inputFormat = document.getElementById('input-format');
    const convertBtn = document.getElementById('convert-btn');
    const colorPreview = document.getElementById('color-preview');
    const colorName = document.getElementById('color-name');
    const resultHex = document.getElementById('result-hex');
    const resultRgb = document.getElementById('result-rgb');
    const resultHsl = document.getElementById('result-hsl');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Set up event listeners
    convertBtn.addEventListener('click', convertColor);
    colorInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') convertColor();
    });
    
    // Setup copy buttons
    copyButtons.forEach(btn => {
        btn.addEventListener('click', copyToClipboard);
    });
    
    // Initialize with a default color
    setInitialValues();
    
    /**
     * Set initial values
     */
    function setInitialValues() {
        colorInput.value = '#3a86ff';
        convertColor();
    }
    
    /**
     * Convert color based on input format
     */
    function convertColor() {
        const value = colorInput.value.trim();
        if (!value) return;
        
        let rgb;
        
        try {
            // Convert input to RGB based on selected format
            switch(inputFormat.value) {
                case 'hex':
                    rgb = hexToRgb(value);
                    break;
                case 'rgb':
                    rgb = parseRgb(value);
                    break;
                case 'hsl':
                    rgb = hslToRgb(parseHsl(value));
                    break;
                default:
                    throw new Error('Invalid format selected');
            }
            
            if (!rgb) {
                throw new Error('Could not parse color value');
            }
            
            // Convert RGB to other formats
            const hex = rgbToHex(rgb);
            const hsl = rgbToHsl(rgb);
            
            // Update the UI
            updateResults(hex, rgb, hsl);
            updatePreview(hex);
            
        } catch (error) {
            showError(error.message);
        }
    }
    
    /**
     * Update result fields
     */
    function updateResults(hex, rgb, hsl) {
        resultHex.textContent = hex;
        resultRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        resultHsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }
    
    /**
     * Update color preview
     */
    function updatePreview(hex) {
        colorPreview.style.backgroundColor = hex;
        colorName.textContent = getColorName(hex) || 'Custom color';
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        resultHex.textContent = 'Error';
        resultRgb.textContent = 'Error';
        resultHsl.textContent = 'Error';
        colorName.textContent = message;
        colorPreview.style.backgroundColor = '#ff3333';
    }
    
    /**
     * Copy color value to clipboard
     */
    function copyToClipboard(e) {
        const targetId = e.target.getAttribute('data-target');
        const element = document.getElementById(targetId);
        
        if (element) {
            const text = element.textContent;
            navigator.clipboard.writeText(text).then(
                () => {
                    // Temporarily change button text to show copied
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 1500);
                },
                () => {
                    e.target.textContent = 'Failed!';
                    setTimeout(() => {
                        e.target.textContent = 'Copy';
                    }, 1500);
                }
            );
        }
    }
    
    /* Color Conversion Functions */
    
    /**
     * Parse HEX color to RGB
     */
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Handle shorthand hex (#RGB)
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Validate hex format
        if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
            throw new Error('Invalid HEX color format');
        }
        
        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    /**
     * Parse RGB string to RGB object
     */
    function parseRgb(rgb) {
        // Match formats: "r,g,b" or "r, g, b" or "rgb(r,g,b)" or "rgb(r, g, b)"
        const regex = /^(?:rgb\s*\(\s*)?(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:\s*\))?$/i;
        const match = rgb.match(regex);
        
        if (!match) {
            throw new Error('Invalid RGB format. Use "r,g,b" or "rgb(r,g,b)"');
        }
        
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        
        // Validate ranges
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            throw new Error('RGB values must be between 0 and 255');
        }
        
        return { r, g, b };
    }
    
    /**
     * Parse HSL string to HSL object
     */
    function parseHsl(hsl) {
        // Match formats: "h,s,l" or "h, s%, l%" or "hsl(h,s%,l%)" or "hsl(h, s%, l%)"
        const regex = /^(?:hsl\s*\(\s*)?(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*(?:\s*\))?$/i;
        const match = hsl.match(regex);
        
        if (!match) {
            throw new Error('Invalid HSL format. Use "h,s,l" or "hsl(h,s%,l%)"');
        }
        
        const h = parseInt(match[1], 10) % 360;
        const s = parseInt(match[2], 10);
        const l = parseInt(match[3], 10);
        
        // Validate ranges
        if (s < 0 || s > 100 || l < 0 || l > 100) {
            throw new Error('Saturation and lightness must be between 0 and 100');
        }
        
        return { h, s, l };
    }
    
    /**
     * Convert RGB to HEX
     */
    function rgbToHex(rgb) {
        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    }
    
    /**
     * Convert RGB to HSL
     */
    function rgbToHsl(rgb) {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            // Achromatic
            h = 0;
            s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    
    /**
     * Convert HSL to RGB
     */
    function hslToRgb(hsl) {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;
        
        let r, g, b;
        
        if (s === 0) {
            // Achromatic
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    /**
     * Get approximate color name
     */
    function getColorName(hex) {
        // Basic color map - could be expanded
        const colorMap = {
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#FF0000': 'Red',
            '#00FF00': 'Lime',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#00FFFF': 'Cyan',
            '#FF00FF': 'Magenta',
            '#C0C0C0': 'Silver',
            '#808080': 'Gray',
            '#800000': 'Maroon',
            '#808000': 'Olive',
            '#008000': 'Green',
            '#800080': 'Purple',
            '#008080': 'Teal',
            '#000080': 'Navy'
        };
        
        // Convert to uppercase for comparison
        const upperHex = hex.toUpperCase();
        
        return colorMap[upperHex] || null;
    }
});