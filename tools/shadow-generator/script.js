/**
 * CSS Shadow Generator
 * Customize shadows visually and copy the CSS
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeShadowGenerator();
});

/**
 * Initialize the shadow generator functionality
 */
function initializeShadowGenerator() {
    // DOM Elements - Shadow Type
    const boxShadowBtn = document.getElementById('box-shadow-btn');
    const textShadowBtn = document.getElementById('text-shadow-btn');
    
    // DOM Elements - Preview
    const boxShadowPreview = document.getElementById('box-shadow-preview');
    const textShadowPreview = document.getElementById('text-shadow-preview');
    const previewWrapper = document.querySelector('.preview-wrapper');
    const previewBgButtons = document.querySelectorAll('.preview-bg-btn');
    const shadowBox = document.querySelector('.shadow-box');
    const shadowText = document.querySelector('.shadow-text');
    
    // DOM Elements - Layers
    const layersContainer = document.getElementById('layers-container');
    const addLayerBtn = document.getElementById('add-layer');
    
    // DOM Elements - Box Customization
    const boxElementCustomization = document.getElementById('box-element-customization');
    const textElementCustomization = document.getElementById('text-element-customization');
    const boxBgColor = document.getElementById('box-bg-color');
    const boxBgColorValue = document.getElementById('box-bg-color-value');
    const borderRadius = document.getElementById('border-radius');
    const borderRadiusValue = document.getElementById('border-radius-value');
    const elementWidth = document.getElementById('element-width');
    const elementHeight = document.getElementById('element-height');
    
    // DOM Elements - Text Customization
    const textColor = document.getElementById('text-color');
    const textColorValue = document.getElementById('text-color-value');
    const fontSize = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontWeight = document.getElementById('font-weight');
    const fontFamily = document.getElementById('font-family');
    
    // DOM Elements - Code Output
    const cssCode = document.getElementById('css-code');
    const copyCssBtn = document.getElementById('copy-css');
    
    // DOM Elements - Presets
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // State
    let shadowType = 'box-shadow';
    let layers = [getDefaultLayer()];
    let activeLayerId = 0;
    
    // Event Listeners - Shadow Type
    boxShadowBtn.addEventListener('click', () => {
        setShadowType('box-shadow');
    });
    
    textShadowBtn.addEventListener('click', () => {
        setShadowType('text-shadow');
    });
    
    // Event Listeners - Preview Background
    previewBgButtons.forEach(button => {
        button.addEventListener('click', () => {
            previewBgButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const bgType = button.getAttribute('data-bg');
            previewWrapper.className = 'preview-wrapper';
            
            if (bgType !== 'light') {
                previewWrapper.classList.add(bgType);
            }
        });
    });
    
    // Event Listeners - Layers
    addLayerBtn.addEventListener('click', addNewLayer);
    
    // Event Listeners - Box Customization
    boxBgColor.addEventListener('input', () => {
        boxBgColorValue.value = boxBgColor.value;
        updateBoxStyle();
    });
    
    boxBgColorValue.addEventListener('input', () => {
        boxBgColor.value = boxBgColorValue.value;
        updateBoxStyle();
    });
    
    borderRadius.addEventListener('input', () => {
        borderRadiusValue.value = borderRadius.value;
        updateBoxStyle();
    });
    
    borderRadiusValue.addEventListener('input', () => {
        borderRadius.value = borderRadiusValue.value;
        updateBoxStyle();
    });
    
    elementWidth.addEventListener('input', updateBoxStyle);
    elementHeight.addEventListener('input', updateBoxStyle);
    
    // Event Listeners - Text Customization
    textColor.addEventListener('input', () => {
        textColorValue.value = textColor.value;
        updateTextStyle();
    });
    
    textColorValue.addEventListener('input', () => {
        textColor.value = textColorValue.value;
        updateTextStyle();
    });
    
    fontSize.addEventListener('input', () => {
        fontSizeValue.value = fontSize.value;
        updateTextStyle();
    });
    
    fontSizeValue.addEventListener('input', () => {
        fontSize.value = fontSizeValue.value;
        updateTextStyle();
    });
    
    fontWeight.addEventListener('change', updateTextStyle);
    fontFamily.addEventListener('change', updateTextStyle);
    
    // Event Listeners - Copy CSS
    copyCssBtn.addEventListener('click', () => {
        const cssText = cssCode.textContent;
        navigator.clipboard.writeText(cssText)
            .then(() => {
                const originalText = copyCssBtn.textContent;
                copyCssBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyCssBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                alert('Failed to copy CSS: ' + err);
            });
    });
    
    // Event Listeners - Presets
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const preset = button.getAttribute('data-preset');
            applyPreset(preset);
        });
    });
    
    /**
     * Set the active shadow type
     */
    function setShadowType(type) {
        shadowType = type;
        
        // Update UI
        boxShadowBtn.classList.toggle('active', type === 'box-shadow');
        textShadowBtn.classList.toggle('active', type === 'text-shadow');
        
        boxShadowPreview.classList.toggle('active', type === 'box-shadow');
        textShadowPreview.classList.toggle('active', type === 'text-shadow');
        
        boxElementCustomization.classList.toggle('active', type === 'box-shadow');
        textElementCustomization.classList.toggle('active', type === 'text-shadow');
        
        // Toggle spread and inset visibility
        const spreadRows = document.querySelectorAll('.spread-row');
        const insetRows = document.querySelectorAll('.inset-row');
        
        spreadRows.forEach(row => {
            row.style.display = type === 'box-shadow' ? 'flex' : 'none';
        });
        
        insetRows.forEach(row => {
            row.style.display = type === 'box-shadow' ? 'flex' : 'none';
        });
        
        // Update shadow
        updateShadow();
    }
    
    /**
     * Add a new shadow layer
     */
    function addNewLayer() {
        const layerId = layers.length;
        
        // Add to state
        layers.push(getDefaultLayer());
        
        // Create UI
        const layerElement = createLayerElement(layerId, layers[layerId]);
        layersContainer.appendChild(layerElement);
        
        // Setup event listeners
        setupLayerControls(layerId);
        
        // Set as active
        selectLayer(layerId);
        
        // Update shadow
        updateShadow();
        
        // Update layer deletion status
        updateLayerDeletionStatus();
    }
    
    /**
     * Create a layer element
     */
    function createLayerElement(id, layer) {
        const element = document.createElement('div');
        element.className = 'shadow-layer';
        element.dataset.id = id;
        
        element.innerHTML = `
            <div class="layer-header">
                <span class="layer-title">Layer ${id + 1}</span>
                <div class="layer-actions">
                    <button class="toggle-layer">⌄</button>
                    <button class="remove-layer">×</button>
                </div>
            </div>
            <div class="layer-controls">
                <!-- X Offset -->
                <div class="control-row">
                    <label for="x-offset-${id}">X Offset:</label>
                    <input type="range" id="x-offset-${id}" class="x-offset" min="-50" max="50" value="${layer.xOffset}">
                    <div class="value-display">
                        <input type="number" id="x-offset-value-${id}" class="x-offset-value" value="${layer.xOffset}">
                        <span class="unit">px</span>
                    </div>
                </div>
                
                <!-- Y Offset -->
                <div class="control-row">
                    <label for="y-offset-${id}">Y Offset:</label>
                    <input type="range" id="y-offset-${id}" class="y-offset" min="-50" max="50" value="${layer.yOffset}">
                    <div class="value-display">
                        <input type="number" id="y-offset-value-${id}" class="y-offset-value" value="${layer.yOffset}">
                        <span class="unit">px</span>
                    </div>
                </div>
                
                <!-- Blur Radius -->
                <div class="control-row">
                    <label for="blur-${id}">Blur:</label>
                    <input type="range" id="blur-${id}" class="blur" min="0" max="100" value="${layer.blur}">
                    <div class="value-display">
                        <input type="number" id="blur-value-${id}" class="blur-value" min="0" value="${layer.blur}">
                        <span class="unit">px</span>
                    </div>
                </div>
                
                <!-- Spread Radius (Box Shadow only) -->
                <div class="control-row spread-row" ${shadowType === 'text-shadow' ? 'style="display: none;"' : ''}>
                    <label for="spread-${id}">Spread:</label>
                    <input type="range" id="spread-${id}" class="spread" min="-50" max="50" value="${layer.spread}">
                    <div class="value-display">
                        <input type="number" id="spread-value-${id}" class="spread-value" value="${layer.spread}">
                        <span class="unit">px</span>
                    </div>
                </div>
                
                <!-- Color -->
                <div class="control-row">
                    <label for="color-${id}">Color:</label>
                    <input type="color" id="color-${id}" class="color" value="${layer.color}">
                    <div class="value-display">
                        <input type="text" id="color-value-${id}" class="color-value" value="${layer.color}">
                        <input type="range" id="opacity-${id}" class="opacity" min="0" max="100" value="${layer.opacity}">
                        <span class="opacity-value" id="opacity-value-${id}">${layer.opacity}%</span>
                    </div>
                </div>
                
                <!-- Inset (Box Shadow only) -->
                <div class="control-row inset-row" ${shadowType === 'text-shadow' ? 'style="display: none;"' : ''}>
                    <label for="inset-${id}">Inset:</label>
                    <div class="toggle-switch">
                        <input type="checkbox" id="inset-${id}" class="inset" ${layer.inset ? 'checked' : ''}>
                        <label for="inset-${id}"></label>
                    </div>
                </div>
            </div>
        `;
        
        return element;
    }
    
    /**
     * Setup event listeners for layer controls
     */
    function setupLayerControls(id) {
        const layerElement = document.querySelector(`.shadow-layer[data-id="${id}"]`);
        
        // Header
        const layerHeader = layerElement.querySelector('.layer-header');
        const toggleBtn = layerElement.querySelector('.toggle-layer');
        const removeBtn = layerElement.querySelector('.remove-layer');
        
        layerHeader.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-layer')) {
                selectLayer(id);
            }
        });
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const controls = layerElement.querySelector('.layer-controls');
            
            if (controls.style.display === 'none') {
                controls.style.display = 'block';
                toggleBtn.classList.remove('collapsed');
            } else {
                controls.style.display = 'none';
                toggleBtn.classList.add('collapsed');
            }
        });
        
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeLayer(id);
        });
        
        // Controls
        const xOffset = layerElement.querySelector('.x-offset');
        const yOffset = layerElement.querySelector('.y-offset');
        const blur = layerElement.querySelector('.blur');
        const spread = layerElement.querySelector('.spread');
        const color = layerElement.querySelector('.color');
        const inset = layerElement.querySelector('.inset');
        
        const xOffsetValue = layerElement.querySelector('.x-offset-value');
        const yOffsetValue = layerElement.querySelector('.y-offset-value');
        const blurValue = layerElement.querySelector('.blur-value');
        const spreadValue = layerElement.querySelector('.spread-value');
        const colorValue = layerElement.querySelector('.color-value');
        const opacity = layerElement.querySelector('.opacity');
        const opacityValue = layerElement.querySelector('.opacity-value');
        
        // X Offset
        xOffset.addEventListener('input', () => {
            xOffsetValue.value = xOffset.value;
            layers[id].xOffset = parseInt(xOffset.value);
            updateShadow();
        });
        
        xOffsetValue.addEventListener('input', () => {
            xOffset.value = xOffsetValue.value;
            layers[id].xOffset = parseInt(xOffsetValue.value);
            updateShadow();
        });
        
        // Y Offset
        yOffset.addEventListener('input', () => {
            yOffsetValue.value = yOffset.value;
            layers[id].yOffset = parseInt(yOffset.value);
            updateShadow();
        });
        
        yOffsetValue.addEventListener('input', () => {
            yOffset.value = yOffsetValue.value;
            layers[id].yOffset = parseInt(yOffsetValue.value);
            updateShadow();
        });
        
        // Blur
        blur.addEventListener('input', () => {
            blurValue.value = blur.value;
            layers[id].blur = parseInt(blur.value);
            updateShadow();
        });
        
        blurValue.addEventListener('input', () => {
            blur.value = blurValue.value;
            layers[id].blur = parseInt(blurValue.value);
            updateShadow();
        });
        
        // Spread (Box Shadow only)
        if (spread) {
            spread.addEventListener('input', () => {
                spreadValue.value = spread.value;
                layers[id].spread = parseInt(spread.value);
                updateShadow();
            });
            
            spreadValue.addEventListener('input', () => {
                spread.value = spreadValue.value;
                layers[id].spread = parseInt(spreadValue.value);
                updateShadow();
            });
        }
        
        // Color
        color.addEventListener('input', () => {
            colorValue.value = color.value;
            layers[id].color = color.value;
            updateShadow();
        });
        
        colorValue.addEventListener('input', () => {
            color.value = colorValue.value;
            layers[id].color = colorValue.value;
            updateShadow();
        });
        
        // Opacity
        opacity.addEventListener('input', () => {
            layers[id].opacity = parseInt(opacity.value);
            opacityValue.textContent = `${opacity.value}%`;
            updateShadow();
        });
        
        // Inset (Box Shadow only)
        if (inset) {
            inset.addEventListener('change', () => {
                layers[id].inset = inset.checked;
                updateShadow();
            });
        }
    }
    
    /**
     * Select a layer
     */
    function selectLayer(id) {
        activeLayerId = id;
        
        // Update UI
        document.querySelectorAll('.shadow-layer').forEach(layer => {
            layer.classList.toggle('active', layer.dataset.id == id);
        });
    }
    
    /**
     * Remove a layer
     */
    function removeLayer(id) {
        // Check if we can remove (need at least one layer)
        if (layers.length <= 1) {
            return;
        }
        
        // Remove from DOM
        const layerElement = document.querySelector(`.shadow-layer[data-id="${id}"]`);
        layerElement.remove();
        
        // Remove from state
        layers = layers.filter((_, index) => index != id);
        
        // Reassign IDs
        document.querySelectorAll('.shadow-layer').forEach((layer, index) => {
            layer.dataset.id = index;
            layer.querySelector('.layer-title').textContent = `Layer ${index + 1}`;
            
            // Update input IDs
            updateLayerInputIds(layer, index);
        });
        
        // Select first layer if the active layer was removed
        if (activeLayerId == id) {
            selectLayer(0);
        } else if (activeLayerId > id) {
            // If active layer was after the removed one, adjust the index
            selectLayer(activeLayerId - 1);
        }
        
        // Update shadow
        updateShadow();
        
        // Update layer deletion status
        updateLayerDeletionStatus();
    }
    
    /**
     * Update layer input IDs after reordering
     */
    function updateLayerInputIds(layerElement, newId) {
        const inputs = layerElement.querySelectorAll('input, label');
        
        inputs.forEach(input => {
            if (input.id) {
                const baseName = input.id.split('-').slice(0, -1).join('-');
                input.id = `${baseName}-${newId}`;
            }
            
            if (input.tagName === 'LABEL' && input.getAttribute('for')) {
                const baseName = input.getAttribute('for').split('-').slice(0, -1).join('-');
                input.setAttribute('for', `${baseName}-${newId}`);
            }
        });
    }
    
    /**
     * Update layer deletion status (disable delete button if only one layer)
     */
    function updateLayerDeletionStatus() {
        const removeButtons = document.querySelectorAll('.remove-layer');
        
        removeButtons.forEach(button => {
            button.disabled = layers.length <= 1;
        });
    }
    
    /**
     * Update box style
     */
    function updateBoxStyle() {
        shadowBox.style.backgroundColor = boxBgColor.value;
        shadowBox.style.borderRadius = `${borderRadius.value}px`;
        shadowBox.style.width = `${elementWidth.value}px`;
        shadowBox.style.height = `${elementHeight.value}px`;
    }
    
    /**
     * Update text style
     */
    function updateTextStyle() {
        shadowText.style.color = textColor.value;
        shadowText.style.fontSize = `${fontSize.value}px`;
        shadowText.style.fontWeight = fontWeight.value;
        shadowText.style.fontFamily = fontFamily.value;
    }
    
    /**
     * Update shadow
     */
    function updateShadow() {
        const shadowValue = generateShadowValue();
        
        if (shadowType === 'box-shadow') {
            shadowBox.style.boxShadow = shadowValue;
        } else {
            shadowText.style.textShadow = shadowValue;
        }
        
        // Update CSS code
        updateCssCode(shadowValue);
    }
    
    /**
     * Generate shadow value from layers
     */
    function generateShadowValue() {
        const shadowParts = layers.map(layer => {
            const rgba = hexToRgba(layer.color, layer.opacity);
            
            if (shadowType === 'box-shadow') {
                const insetStr = layer.inset ? 'inset ' : '';
                return `${insetStr}${layer.xOffset}px ${layer.yOffset}px ${layer.blur}px ${layer.spread}px ${rgba}`;
            } else {
                return `${layer.xOffset}px ${layer.yOffset}px ${layer.blur}px ${rgba}`;
            }
        });
        
        return shadowParts.join(', ');
    }
    
    /**
     * Update CSS code
     */
    function updateCssCode(shadowValue) {
        let code = '';
        
        if (shadowType === 'box-shadow') {
            code = `.element {\n  ${shadowType}: ${shadowValue};\n`;
            
            // Add additional styling
            if (boxBgColor.value !== '#ffffff') {
                code += `  background-color: ${boxBgColor.value};\n`;
            }
            
            if (borderRadius.value !== '0') {
                code += `  border-radius: ${borderRadius.value}px;\n`;
            }
            
            code += '}';
        } else {
            code = `.element {\n  ${shadowType}: ${shadowValue};\n`;
            
            // Add additional styling
            if (textColor.value !== '#000000') {
                code += `  color: ${textColor.value};\n`;
            }
            
            if (fontSize.value !== '16') {
                code += `  font-size: ${fontSize.value}px;\n`;
            }
            
            if (fontWeight.value !== 'normal') {
                code += `  font-weight: ${fontWeight.value};\n`;
            }
            
            if (fontFamily.value !== 'Arial, sans-serif') {
                code += `  font-family: ${fontFamily.value};\n`;
            }
            
            code += '}';
        }
        
        cssCode.textContent = code;
    }
    
    /**
     * Convert hex color to rgba
     */
    function hexToRgba(hex, opacity) {
        // Remove hash if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Calculate alpha from opacity percentage
        const a = opacity / 100;
        
        // Return rgba value
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
    /**
     * Get default layer values
     */
    function getDefaultLayer() {
        return {
            xOffset: 5,
            yOffset: 5,
            blur: 10,
            spread: 0,
            color: '#000000',
            opacity: 20,
            inset: false
        };
    }
    
    /**
     * Apply preset
     */
    function applyPreset(preset) {
        // Clear existing layers
        layersContainer.innerHTML = '';
        
        switch (preset) {
            case 'subtle':
                setShadowType('box-shadow');
                layers = [{
                    xOffset: 0,
                    yOffset: 2,
                    blur: 5,
                    spread: 0,
                    color: '#000000',
                    opacity: 10,
                    inset: false
                }];
                break;
                
            case 'medium':
                setShadowType('box-shadow');
                layers = [{
                    xOffset: 0,
                    yOffset: 5,
                    blur: 15,
                    spread: 0,
                    color: '#000000',
                    opacity: 20,
                    inset: false
                }];
                break;
                
            case 'large':
                setShadowType('box-shadow');
                layers = [{
                    xOffset: 0,
                    yOffset: 10,
                    blur: 30,
                    spread: 0,
                    color: '#000000',
                    opacity: 30,
                    inset: false
                }];
                break;
                
            case 'inset':
                setShadowType('box-shadow');
                layers = [{
                    xOffset: 0,
                    yOffset: 5,
                    blur: 15,
                    spread: -3,
                    color: '#000000',
                    opacity: 20,
                    inset: true
                }];
                break;
                
            case 'layered':
                setShadowType('box-shadow');
                layers = [
                    {
                        xOffset: 0,
                        yOffset: 2,
                        blur: 5,
                        spread: 0,
                        color: '#000000',
                        opacity: 15,
                        inset: false
                    },
                    {
                        xOffset: 0,
                        yOffset: 15,
                        blur: 30,
                        spread: -5,
                        color: '#000000',
                        opacity: 10,
                        inset: false
                    }
                ];
                break;
                
            case 'neon':
                setShadowType('box-shadow');
                layers = [
                    {
                        xOffset: 0,
                        yOffset: 0,
                        blur: 10,
                        spread: 0,
                        color: '#ff00ff',
                        opacity: 80,
                        inset: false
                    },
                    {
                        xOffset: 0,
                        yOffset: 0,
                        blur: 20,
                        spread: 5,
                        color: '#0000ff',
                        opacity: 50,
                        inset: false
                    }
                ];
                break;
                
            case '3d':
                setShadowType('text-shadow');
                layers = [
                    {
                        xOffset: 1,
                        yOffset: 1,
                        blur: 0,
                        spread: 0,
                        color: '#cccccc',
                        opacity: 100,
                        inset: false
                    },
                    {
                        xOffset: 2,
                        yOffset: 2,
                        blur: 0,
                        spread: 0,
                        color: '#aaaaaa',
                        opacity: 100,
                        inset: false
                    },
                    {
                        xOffset: 3,
                        yOffset: 3,
                        blur: 0,
                        spread: 0,
                        color: '#888888',
                        opacity: 100,
                        inset: false
                    }
                ];
                break;
        }
        
        // Create new layer elements
        layers.forEach((layer, index) => {
            const layerElement = createLayerElement(index, layer);
            layersContainer.appendChild(layerElement);
            setupLayerControls(index);
        });
        
        // Select first layer
        selectLayer(0);
        
        // Update layer deletion status
        updateLayerDeletionStatus();
        
        // Update shadow
        updateShadow();
    }
    
    // Initialize box and text styles
    updateBoxStyle();
    updateTextStyle();
    
    // Set default shadow type
    setShadowType('box-shadow');
    
    // Set up the first layer controls
    setupLayerControls(0);
    
    // Update the layer deletion status
    updateLayerDeletionStatus();
    
    // Update shadow
    updateShadow();
};