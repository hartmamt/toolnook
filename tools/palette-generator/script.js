/**
 * Color Palette Generator
 * Generate attractive, matching palettes for UI projects
 */

document.addEventListener('DOMContentLoaded', () => {
    initializePaletteGenerator();
});

/**
 * Initialize the palette generator functionality
 */
function initializePaletteGenerator() {
    // DOM Elements - Controls
    const baseColor = document.getElementById('base-color');
    const paletteType = document.getElementById('palette-type');
    const generateBtn = document.getElementById('generate-palette');
    const randomBtn = document.getElementById('random-palette');
    
    // DOM Elements - Format
    const formatRadios = document.querySelectorAll('input[name="color-format"]');
    
    // DOM Elements - Display
    const colorsContainer = document.getElementById('colors-container');
    const copyAllBtn = document.getElementById('copy-all');
    const exportCssBtn = document.getElementById('export-css');
    
    // DOM Elements - Export
    const exportCode = document.getElementById('export-code');
    const copyExportBtn = document.getElementById('copy-export');
    
    // DOM Elements - Adjuster
    const colorAdjusterContent = document.getElementById('color-adjuster-content');
    
    // State
    let currentPalette = [];
    let selectedColorIndex = -1;
    let colorFormat = 'hex';
    
    // Get initial color format
    formatRadios.forEach(radio => {
        if (radio.checked) {
            colorFormat = radio.value;
        }
    });
    
    // Event Listeners - Controls
    generateBtn.addEventListener('click', () => generatePalette(false));
    randomBtn.addEventListener('click', () => generatePalette(true));
    
    // Event Listeners - Format
    formatRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            colorFormat = radio.value;
            updateColorDisplay();
        });
    });
    
    // Event Listeners - Actions
    copyAllBtn.addEventListener('click', copyAllColors);
    exportCssBtn.addEventListener('click', showCssExport);
    
    // Event Listeners - Export
    copyExportBtn.addEventListener('click', () => {
        const code = exportCode.textContent;
        navigator.clipboard.writeText(code)
            .then(() => {
                const originalText = copyExportBtn.textContent;
                copyExportBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyExportBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                alert('Failed to copy: ' + err);
            });
    });
    
    /**
     * Generate a color palette
     */
    function generatePalette(randomize) {
        // Get base color
        let baseColorValue = baseColor.value;
        
        // Randomize base color if needed
        if (randomize) {
            baseColorValue = getRandomColor();
            baseColor.value = baseColorValue;
        }
        
        // Convert base color to HSL for easier manipulation
        const baseHsl = hexToHSL(baseColorValue);
        
        // Generate palette based on selected type
        const type = paletteType.value;
        
        switch (type) {
            case 'monochromatic':
                currentPalette = generateMonochromaticPalette(baseHsl);
                break;
            case 'analogous':
                currentPalette = generateAnalogousPalette(baseHsl);
                break;
            case 'complementary':
                currentPalette = generateComplementaryPalette(baseHsl);
                break;
            case 'triadic':
                currentPalette = generateTriadicPalette(baseHsl);
                break;
            case 'tetradic':
                currentPalette = generateTetradicPalette(baseHsl);
                break;
            case 'split-complementary':
                currentPalette = generateSplitComplementaryPalette(baseHsl);
                break;
            default:
                currentPalette = generateMonochromaticPalette(baseHsl);
        }
        
        // Update display
        updateColorDisplay();
        resetColorAdjuster();
    }
    
    /**
     * Generate a monochromatic palette (variations of same hue)
     */
    function generateMonochromaticPalette(baseHsl) {
        const palette = [];
        const count = 5;
        
        // Keep the same hue but vary saturation and lightness
        for (let i = 0; i < count; i++) {
            // Distribute lightness from light to dark
            const lightness = 90 - (i * (80 / (count - 1)));
            // Adjust saturation slightly
            const saturation = Math.min(baseHsl.s + (i * 5), 100);
            
            palette.push({
                h: baseHsl.h,
                s: saturation,
                l: lightness
            });
        }
        
        return palette;
    }
    
    /**
     * Generate an analogous palette (colors next to each other on the color wheel)
     */
    function generateAnalogousPalette(baseHsl) {
        const palette = [];
        const count = 5;
        const hueStep = 12; // 12 degrees difference
        
        // Base hue in the middle, other colors around it
        const startHue = (baseHsl.h - (hueStep * 2) + 360) % 360;
        
        for (let i = 0; i < count; i++) {
            const hue = (startHue + (i * hueStep)) % 360;
            // Adjust saturation and lightness slightly for variety
            const saturation = Math.min(baseHsl.s - 5 + (i * 5), 100);
            const lightness = Math.max(baseHsl.l + 10 - (i * 5), 30);
            
            palette.push({
                h: hue,
                s: saturation,
                l: lightness
            });
        }
        
        return palette;
    }
    
    /**
     * Generate a complementary palette (opposite colors on the color wheel)
     */
    function generateComplementaryPalette(baseHsl) {
        const palette = [];
        
        // Add base color variants
        palette.push(
            {h: baseHsl.h, s: baseHsl.s - 10, l: baseHsl.l + 20},
            {h: baseHsl.h, s: baseHsl.s, l: baseHsl.l},
            {h: baseHsl.h, s: baseHsl.s + 10, l: baseHsl.l - 20}
        );
        
        // Add complementary color (opposite on the color wheel) and variants
        const complementaryHue = (baseHsl.h + 180) % 360;
        palette.push(
            {h: complementaryHue, s: baseHsl.s, l: baseHsl.l},
            {h: complementaryHue, s: baseHsl.s + 10, l: baseHsl.l - 20}
        );
        
        return palette;
    }
    
    /**
     * Generate a triadic palette (three equally spaced colors on the color wheel)
     */
    function generateTriadicPalette(baseHsl) {
        const palette = [];
        
        // Base color and its variant
        palette.push(
            {h: baseHsl.h, s: baseHsl.s, l: baseHsl.l + 15},
            {h: baseHsl.h, s: baseHsl.s, l: baseHsl.l}
        );
        
        // First triadic color (120 degrees from base) and its variant
        const triadic1 = (baseHsl.h + 120) % 360;
        palette.push(
            {h: triadic1, s: baseHsl.s, l: baseHsl.l}
        );
        
        // Second triadic color (240 degrees from base) and its variant
        const triadic2 = (baseHsl.h + 240) % 360;
        palette.push(
            {h: triadic2, s: baseHsl.s, l: baseHsl.l},
            {h: triadic2, s: baseHsl.s, l: baseHsl.l + 15}
        );
        
        return palette;
    }
    
    /**
     * Generate a tetradic palette (four colors - two complementary pairs)
     */
    function generateTetradicPalette(baseHsl) {
        const palette = [];
        
        // Base color
        palette.push({h: baseHsl.h, s: baseHsl.s, l: baseHsl.l});
        
        // Second color (90 degrees from base)
        const second = (baseHsl.h + 90) % 360;
        palette.push({h: second, s: baseHsl.s, l: baseHsl.l});
        
        // Third color (complementary to base)
        const third = (baseHsl.h + 180) % 360;
        palette.push({h: third, s: baseHsl.s, l: baseHsl.l});
        
        // Fourth color (complementary to second)
        const fourth = (baseHsl.h + 270) % 360;
        palette.push({h: fourth, s: baseHsl.s, l: baseHsl.l});
        
        // Add a lighter variant of the base color
        palette.push({h: baseHsl.h, s: baseHsl.s - 15, l: baseHsl.l + 25});
        
        return palette;
    }
    
    /**
     * Generate a split-complementary palette (base + two colors adjacent to its complement)
     */
    function generateSplitComplementaryPalette(baseHsl) {
        const palette = [];
        
        // Base color and variants
        palette.push(
            {h: baseHsl.h, s: baseHsl.s - 10, l: baseHsl.l + 20},
            {h: baseHsl.h, s: baseHsl.s, l: baseHsl.l}
        );
        
        // Complementary hue
        const complementaryHue = (baseHsl.h + 180) % 360;
        
        // Split complementary colors (30 degrees from complementary)
        const split1 = (complementaryHue - 30 + 360) % 360;
        const split2 = (complementaryHue + 30) % 360;
        
        palette.push(
            {h: split1, s: baseHsl.s, l: baseHsl.l},
            {h: complementaryHue, s: baseHsl.s, l: baseHsl.l},
            {h: split2, s: baseHsl.s, l: baseHsl.l}
        );
        
        return palette;
    }
    
    /**
     * Update the color display with the current palette
     */
    function updateColorDisplay() {
        // Clear container
        colorsContainer.innerHTML = '';
        
        // Add color swatches
        currentPalette.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.dataset.index = index;
            
            // Set background color (always in RGB format for CSS)
            const hslColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
            swatch.style.backgroundColor = hslColor;
            
            // Add color value in selected format
            let displayValue;
            switch (colorFormat) {
                case 'hex':
                    displayValue = hslToHex(color);
                    break;
                case 'rgb':
                    displayValue = hslToRGB(color);
                    break;
                case 'hsl':
                    displayValue = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
                    break;
                default:
                    displayValue = hslToHex(color);
            }
            
            // Add color value display
            const colorValue = document.createElement('div');
            colorValue.className = 'color-value';
            colorValue.textContent = displayValue;
            swatch.appendChild(colorValue);
            
            // Add click event to select color
            swatch.addEventListener('click', () => {
                selectColor(index);
            });
            
            colorsContainer.appendChild(swatch);
        });
        
        // Update export code if a color is selected
        if (selectedColorIndex >= 0) {
            setupColorAdjuster(selectedColorIndex);
        }
    }
    
    /**
     * Select a color from the palette
     */
    function selectColor(index) {
        selectedColorIndex = index;
        
        // Add/remove selected class from swatches
        document.querySelectorAll('.color-swatch').forEach((swatch, i) => {
            swatch.classList.toggle('selected', i === index);
        });
        
        // Set up color adjuster
        setupColorAdjuster(index);
        
        // Update export
        updateExportCode();
    }
    
    /**
     * Set up the color adjuster for the selected color
     */
    function setupColorAdjuster(index) {
        const color = currentPalette[index];
        
        colorAdjusterContent.innerHTML = `
            <div class="preview-container">
                <div class="color-preview" id="color-preview"></div>
                <div class="color-code" id="color-code"></div>
            </div>
            <div class="slider-group">
                <label>
                    Hue
                    <span class="value-display" id="hue-value">${Math.round(color.h)}°</span>
                </label>
                <input type="range" id="hue-slider" min="0" max="359" value="${Math.round(color.h)}">
            </div>
            <div class="slider-group">
                <label>
                    Saturation
                    <span class="value-display" id="saturation-value">${Math.round(color.s)}%</span>
                </label>
                <input type="range" id="saturation-slider" min="0" max="100" value="${Math.round(color.s)}">
            </div>
            <div class="slider-group">
                <label>
                    Lightness
                    <span class="value-display" id="lightness-value">${Math.round(color.l)}%</span>
                </label>
                <input type="range" id="lightness-slider" min="0" max="100" value="${Math.round(color.l)}">
            </div>
        `;
        
        // Get new DOM elements
        const hueSlider = document.getElementById('hue-slider');
        const saturationSlider = document.getElementById('saturation-slider');
        const lightnessSlider = document.getElementById('lightness-slider');
        const hueValue = document.getElementById('hue-value');
        const saturationValue = document.getElementById('saturation-value');
        const lightnessValue = document.getElementById('lightness-value');
        const colorPreview = document.getElementById('color-preview');
        const colorCode = document.getElementById('color-code');
        
        // Update preview
        updatePreview();
        
        // Add event listeners to sliders
        hueSlider.addEventListener('input', () => {
            const value = parseInt(hueSlider.value);
            hueValue.textContent = `${value}°`;
            currentPalette[index].h = value;
            updatePreview();
            updateColorDisplay();
        });
        
        saturationSlider.addEventListener('input', () => {
            const value = parseInt(saturationSlider.value);
            saturationValue.textContent = `${value}%`;
            currentPalette[index].s = value;
            updatePreview();
            updateColorDisplay();
        });
        
        lightnessSlider.addEventListener('input', () => {
            const value = parseInt(lightnessSlider.value);
            lightnessValue.textContent = `${value}%`;
            currentPalette[index].l = value;
            updatePreview();
            updateColorDisplay();
        });
        
        /**
         * Update the color preview
         */
        function updatePreview() {
            const hslColor = `hsl(${currentPalette[index].h}, ${currentPalette[index].s}%, ${currentPalette[index].l}%)`;
            colorPreview.style.backgroundColor = hslColor;
            
            // Update color code
            let displayValue;
            switch (colorFormat) {
                case 'hex':
                    displayValue = hslToHex(currentPalette[index]);
                    break;
                case 'rgb':
                    displayValue = hslToRGB(currentPalette[index]);
                    break;
                case 'hsl':
                    displayValue = hslColor;
                    break;
                default:
                    displayValue = hslToHex(currentPalette[index]);
            }
            colorCode.textContent = displayValue;
        }
    }
    
    /**
     * Reset the color adjuster to the default state
     */
    function resetColorAdjuster() {
        selectedColorIndex = -1;
        colorAdjusterContent.innerHTML = '<p class="select-color-prompt">Select a color from the palette to adjust it</p>';
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
        });
    }
    
    /**
     * Copy all colors to clipboard
     */
    function copyAllColors() {
        if (currentPalette.length === 0) {
            alert('Please generate a palette first');
            return;
        }
        
        // Format colors based on selected format
        const colorValues = currentPalette.map(color => {
            switch (colorFormat) {
                case 'hex':
                    return hslToHex(color);
                case 'rgb':
                    return hslToRGB(color);
                case 'hsl':
                    return `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`;
                default:
                    return hslToHex(color);
            }
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(colorValues.join('\n'))
            .then(() => {
                alert('All colors copied to clipboard!');
            })
            .catch(err => {
                alert('Failed to copy colors: ' + err);
            });
    }
    
    /**
     * Show CSS export for the current palette
     */
    function showCssExport() {
        if (currentPalette.length === 0) {
            alert('Please generate a palette first');
            return;
        }
        
        let css = '/* CSS Variables */\n:root {\n';
        
        // Add variables for each color
        currentPalette.forEach((color, index) => {
            const colorName = `--color-${index + 1}`;
            const hexValue = hslToHex(color);
            css += `  ${colorName}: ${hexValue};\n`;
        });
        
        css += '}\n\n/* Example usage */\n.element {\n  background-color: var(--color-1);\n  color: var(--color-5);\n}';
        
        // Update export code
        exportCode.textContent = css;
    }
    
    /**
     * Update the export code based on the current state
     */
    function updateExportCode() {
        if (selectedColorIndex >= 0) {
            const color = currentPalette[selectedColorIndex];
            
            let code = '/* Selected Color */\n\n';
            
            // Add color in all formats
            code += `HEX: ${hslToHex(color)}\n`;
            code += `RGB: ${hslToRGB(color)}\n`;
            code += `HSL: hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)\n\n`;
            
            // Add CSS examples
            code += '/* CSS Examples */\n\n';
            code += `.element {\n  color: ${hslToHex(color)};\n}\n\n`;
            code += `.element {\n  background-color: ${hslToRGB(color)};\n}`;
            
            exportCode.textContent = code;
        }
    }
    
    /**
     * Generate a random color in hex format
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
     * Convert hex to HSL
     */
    function hexToHSL(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex values
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;
        
        // Find min and max
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        
        // Calculate lightness
        let l = (max + min) / 2;
        
        // Calculate saturation
        let s = 0;
        let h = 0;
        
        if (max !== min) {
            s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
            
            // Calculate hue
            if (max === r) {
                h = (g - b) / (max - min) + (g < b ? 6 : 0);
            } else if (max === g) {
                h = (b - r) / (max - min) + 2;
            } else {
                h = (r - g) / (max - min) + 4;
            }
            
            h = Math.round(h * 60);
        }
        
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return { h, s, l };
    }
    
    /**
     * Convert HSL to hex
     */
    function hslToHex(hslColor) {
        const h = hslColor.h / 360;
        const s = hslColor.s / 100;
        const l = hslColor.l / 100;
        
        let r, g, b;
        
        if (s === 0) {
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
        
        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    /**
     * Convert HSL to RGB
     */
    function hslToRGB(hslColor) {
        const h = hslColor.h / 360;
        const s = hslColor.s / 100;
        const l = hslColor.l / 100;
        
        let r, g, b;
        
        if (s === 0) {
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
        
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }
    
    // Generate initial palette
    generatePalette(false);
};