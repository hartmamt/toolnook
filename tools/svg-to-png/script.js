/**
 * SVG Converter Tool
 * Converts SVG files to various web formats with customizable settings
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const previewTabButtons = document.querySelectorAll('.preview-tab-btn');
    const previewContents = document.querySelectorAll('.preview-content');
    
    // DOM Elements - Upload
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    
    // DOM Elements - Paste
    const svgPasteArea = document.getElementById('svg-paste');
    const pasteBtn = document.getElementById('paste-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // DOM Elements - Settings
    const settings = document.getElementById('settings');
    const outputFormat = document.getElementById('output-format');
    const scaleInput = document.getElementById('scale');
    const bgColorInput = document.getElementById('background');
    const qualityInput = document.getElementById('quality');
    const qualityValue = document.querySelector('.quality-value');
    const qualityGroup = document.getElementById('quality-group');
    const convertBtn = document.getElementById('convert-btn');
    
    // DOM Elements - Output
    const previewSvg = document.getElementById('preview-svg');
    const previewOutput = document.getElementById('preview-output');
    const conversionInfo = document.getElementById('conversion-info');
    const originalSize = document.getElementById('original-size');
    const convertedSize = document.getElementById('converted-size');
    const dimensions = document.getElementById('dimensions');
    const downloadContainer = document.getElementById('download-container');
    const downloadLink = document.getElementById('download-link');
    const copyDataUrlBtn = document.getElementById('copy-data-url');
    
    // Variables
    let svgFile = null;
    let svgText = null;
    let svgSize = 0;
    let convertedImageUrl = null;
    
    // Event Listeners - Tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    previewTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const preview = button.getAttribute('data-preview');
            
            // Update active preview tab button
            previewTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected preview content
            previewContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`preview-${preview}`).classList.add('active');
        });
    });
    
    // Event Listeners - Upload
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Event Listeners - Paste
    pasteBtn.addEventListener('click', async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            svgPasteArea.value = clipboardText;
            processPastedSvg(clipboardText);
        } catch (error) {
            showError('Failed to read from clipboard. Make sure you\'ve granted permission.');
        }
    });
    
    svgPasteArea.addEventListener('input', () => {
        processPastedSvg(svgPasteArea.value);
    });
    
    clearBtn.addEventListener('click', () => {
        svgPasteArea.value = '';
        svgText = null;
        previewSvg.innerHTML = '<p class="placeholder">SVG preview will appear here</p>';
        settings.classList.remove('active');
        downloadContainer.classList.add('hidden');
        conversionInfo.classList.remove('active');
    });
    
    // Event Listeners - Settings
    outputFormat.addEventListener('change', updateSettingsVisibility);
    qualityInput.addEventListener('input', () => {
        qualityValue.textContent = `${qualityInput.value}%`;
    });
    convertBtn.addEventListener('click', convertSvg);
    copyDataUrlBtn.addEventListener('click', copyDataUrl);
    
    // Initialize settings visibility
    updateSettingsVisibility();
    
    /**
     * Handle file upload via input change
     */
    function handleFileUpload(e) {
        if (e.target.files.length) {
            handleFiles(e.target.files);
        }
    }
    
    /**
     * Process uploaded files
     */
    function handleFiles(files) {
        const file = files[0];
        
        if (file.type !== 'image/svg+xml') {
            showError('Please upload an SVG file (.svg)');
            return;
        }
        
        svgFile = file;
        svgSize = file.size;
        fileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            svgText = e.target.result;
            renderSvgPreview(svgText);
            settings.classList.add('active');
            // Switch to SVG preview tab
            previewTabButtons[0].click();
        };
        reader.onerror = () => {
            showError('Error reading the file');
        };
        reader.readAsText(file);
    }
    
    /**
     * Process pasted SVG text
     */
    function processPastedSvg(text) {
        if (!text) return;
        
        // Check if the text is valid SVG
        if (text.trim().startsWith('<svg') || text.includes('<svg')) {
            svgText = text;
            svgSize = new Blob([text]).size;
            renderSvgPreview(svgText);
            settings.classList.add('active');
            // Switch to SVG preview tab
            previewTabButtons[0].click();
        } else {
            showError('The pasted content does not appear to be valid SVG');
        }
    }
    
    /**
     * Render SVG preview
     */
    function renderSvgPreview(svgText) {
        // Check if the text is valid SVG
        if (!svgText.includes('<svg')) {
            showError('Invalid SVG content');
            return;
        }
        
        previewSvg.innerHTML = svgText;
        const svgElement = previewSvg.querySelector('svg');
        
        if (svgElement) {
            // Clean up SVG for display
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.style.maxHeight = '300px';
        } else {
            showError('Unable to render SVG preview');
        }
    }
    
    /**
     * Update settings visibility based on output format
     */
    function updateSettingsVisibility() {
        const format = outputFormat.value;
        
        // Show/hide quality slider based on format
        if (format === 'png') {
            qualityGroup.classList.add('hidden');
        } else {
            qualityGroup.classList.remove('hidden');
        }
    }
    
    /**
     * Convert SVG to selected format
     */
    function convertSvg() {
        if (!svgText) {
            showError('Please upload or paste an SVG file first');
            return;
        }
        
        const format = outputFormat.value;
        const scale = parseFloat(scaleInput.value) || 2;
        const bgColor = bgColorInput.value || '#ffffff';
        const quality = parseInt(qualityInput.value) / 100;
        
        try {
            // Create a new SVG with the background color
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            
            // Get SVG dimensions
            let width = svgElement.getAttribute('width');
            let height = svgElement.getAttribute('height');
            
            // Handle percentage values or no dimensions
            if (!width || width.includes('%') || !height || height.includes('%')) {
                // Use viewBox if available
                const viewBox = svgElement.getAttribute('viewBox');
                if (viewBox) {
                    const [, , vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
                    width = vbWidth || 300;
                    height = vbHeight || 150;
                } else {
                    // Default dimensions
                    width = 300;
                    height = 150;
                }
            }
            
            // Remove units (px, pt, etc.) if present
            width = parseFloat(width);
            height = parseFloat(height);
            
            // Create canvas with scaled dimensions
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            
            const ctx = canvas.getContext('2d');
            
            // Fill background
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Convert SVG to data URL
            const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            const URL = window.URL || window.webkitURL || window;
            const svgUrl = URL.createObjectURL(svgBlob);
            
            // Draw SVG on canvas
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(svgUrl);
                
                // Convert canvas to selected format
                const mimeType = `image/${format}`;
                let outputUrl;
                
                if (format === 'png') {
                    outputUrl = canvas.toDataURL(mimeType);
                } else {
                    outputUrl = canvas.toDataURL(mimeType, quality);
                }
                
                convertedImageUrl = outputUrl;
                
                // Update file name based on format
                let outputFileName = 'converted';
                if (svgFile) {
                    outputFileName = svgFile.name.replace('.svg', '');
                }
                
                // Create download link
                downloadLink.href = outputUrl;
                downloadLink.download = `${outputFileName}.${format}`;
                downloadLink.textContent = `Download ${format.toUpperCase()}`;
                downloadContainer.classList.remove('hidden');
                
                // Show converted preview
                const outputPreview = new Image();
                outputPreview.src = outputUrl;
                previewOutput.innerHTML = '';
                previewOutput.appendChild(outputPreview);
                
                // Switch to output preview tab
                previewTabButtons[1].click();
                
                // Update conversion info
                updateConversionInfo(outputUrl, canvas.width, canvas.height);
            };
            
            img.onerror = function() {
                URL.revokeObjectURL(svgUrl);
                showError(`Error converting SVG to ${format.toUpperCase()}`);
            };
            
            img.src = svgUrl;
            
        } catch (error) {
            showError(`Conversion error: ${error.message}`);
        }
    }
    
    /**
     * Update conversion info display
     */
    function updateConversionInfo(dataUrl, width, height) {
        // Calculate converted size in KB
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const convertedBytes = base64Length * 0.75; // Base64 size to actual bytes
        
        // Update size displays
        originalSize.textContent = formatFileSize(svgSize);
        convertedSize.textContent = formatFileSize(convertedBytes);
        dimensions.textContent = `${width}×${height}px`;
        
        // Show conversion info
        conversionInfo.classList.add('active');
    }
    
    /**
     * Format file size to human-readable string
     */
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
    }
    
    /**
     * Copy data URL to clipboard
     */
    function copyDataUrl() {
        if (!convertedImageUrl) return;
        
        navigator.clipboard.writeText(convertedImageUrl)
            .then(() => {
                const originalText = copyDataUrlBtn.textContent;
                copyDataUrlBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyDataUrlBtn.textContent = originalText;
                }, 1500);
            })
            .catch(() => {
                copyDataUrlBtn.textContent = 'Failed to copy';
                setTimeout(() => {
                    copyDataUrlBtn.textContent = 'Copy Data URL';
                }, 1500);
            });
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        previewSvg.innerHTML = `<p class="error">${message}</p>`;
        previewOutput.innerHTML = `<p class="error">${message}</p>`;
        downloadContainer.classList.add('hidden');
        conversionInfo.classList.remove('active');
    }
});