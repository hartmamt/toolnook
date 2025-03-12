/**
 * Base64 Encoder/Decoder
 * Converts text to Base64 and vice versa
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Mode Selection
    const textModeBtn = document.getElementById('text-mode-btn');
    const fileModeBtn = document.getElementById('file-mode-btn');
    const textPanel = document.getElementById('text-panel');
    const filePanel = document.getElementById('file-panel');

    // DOM Elements - Text Mode
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    const convertBtn = document.getElementById('convert-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const statusMessage = document.getElementById('status-message');
    const urlSafeCheck = document.getElementById('url-safe');
    
    // DOM Elements - File Mode
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const encodeFileBtn = document.getElementById('encode-file-btn');
    const fileOutput = document.getElementById('file-output');
    const copyFileOutputBtn = document.getElementById('copy-file-output-btn');
    const downloadDataUrlBtn = document.getElementById('download-data-url-btn');

    // State
    let operation = 'encode'; // 'encode' or 'decode'
    let selectedFile = null;
    let dataUrl = null;

    // Event Listeners - Mode Selection
    textModeBtn.addEventListener('click', () => {
        setMode('text');
    });

    fileModeBtn.addEventListener('click', () => {
        setMode('file');
    });

    // Event Listeners - Text Mode
    encodeBtn.addEventListener('click', () => {
        setOperation('encode');
    });

    decodeBtn.addEventListener('click', () => {
        setOperation('decode');
    });

    convertBtn.addEventListener('click', () => {
        convertText();
    });

    clearInputBtn.addEventListener('click', () => {
        inputArea.value = '';
        outputArea.value = '';
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputArea.value = text;
        } catch (err) {
            showStatus('Cannot access clipboard', 'error');
        }
    });

    sampleBtn.addEventListener('click', () => {
        loadSample();
    });

    copyBtn.addEventListener('click', () => {
        copyToClipboard(outputArea.value);
    });

    // Event Listeners - File Mode
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('active');
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('active');
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('active');
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });

    encodeFileBtn.addEventListener('click', () => {
        encodeFile();
    });

    copyFileOutputBtn.addEventListener('click', () => {
        copyToClipboard(fileOutput.value);
    });

    downloadDataUrlBtn.addEventListener('click', () => {
        if (dataUrl) {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${selectedFile.name}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // Key event listener for Enter key
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            convertText();
        }
    });

    /**
     * Set the active mode (text or file)
     */
    function setMode(mode) {
        // Update buttons
        textModeBtn.classList.toggle('active', mode === 'text');
        fileModeBtn.classList.toggle('active', mode === 'file');

        // Show/hide panels
        textPanel.classList.toggle('active', mode === 'text');
        filePanel.classList.toggle('active', mode === 'file');
    }

    /**
     * Set the operation (encode or decode)
     */
    function setOperation(op) {
        operation = op;

        // Update buttons
        encodeBtn.classList.toggle('active', op === 'encode');
        decodeBtn.classList.toggle('active', op === 'decode');

        // Update labels
        if (op === 'encode') {
            inputLabel.textContent = 'Plain Text';
            outputLabel.textContent = 'Base64';
            inputArea.placeholder = 'Enter text to encode...';
        } else {
            inputLabel.textContent = 'Base64';
            outputLabel.textContent = 'Plain Text';
            inputArea.placeholder = 'Enter Base64 to decode...';
        }

        // Clear output
        outputArea.value = '';
    }

    /**
     * Convert text based on selected operation
     */
    function convertText() {
        const input = inputArea.value.trim();

        if (!input) {
            showStatus('Please enter input', 'error');
            return;
        }

        try {
            if (operation === 'encode') {
                const encoded = encodeText(input);
                outputArea.value = encoded;
                showStatus('Encoded successfully', 'success');
            } else {
                const decoded = decodeText(input);
                outputArea.value = decoded;
                showStatus('Decoded successfully', 'success');
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
            outputArea.value = '';
        }
    }

    /**
     * Encode text to Base64
     */
    function encodeText(text) {
        try {
            let encoded = btoa(unescape(encodeURIComponent(text)));
            
            // Convert to URL-safe Base64 if needed
            if (urlSafeCheck.checked) {
                encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            }
            
            return encoded;
        } catch (error) {
            throw new Error('Invalid input for Base64 encoding');
        }
    }

    /**
     * Decode Base64 to text
     */
    function decodeText(base64) {
        try {
            // Handle URL-safe Base64
            if (urlSafeCheck.checked) {
                base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
                // Add padding if needed
                while (base64.length % 4) {
                    base64 += '=';
                }
            }
            
            return decodeURIComponent(escape(atob(base64)));
        } catch (error) {
            throw new Error('Invalid Base64 input');
        }
    }

    /**
     * Handle file selection
     */
    function handleFileSelect(file) {
        selectedFile = file;
        fileName.textContent = file.name;
        
        // Clear previous results
        fileOutput.value = '';
        dataUrl = null;
    }

    /**
     * Encode file to Base64
     */
    function encodeFile() {
        if (!selectedFile) {
            showStatus('Please select a file', 'error');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (event) => {
            const result = event.target.result;
            // Extract the Base64 part from the data URL
            const base64 = result.split(',')[1];
            fileOutput.value = base64;
            dataUrl = result;
            
            // Enable download button
            downloadDataUrlBtn.disabled = false;
        };
        
        reader.onerror = () => {
            showStatus('Error reading file', 'error');
        };
        
        reader.readAsDataURL(selectedFile);
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (!text) {
            showStatus('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                showStatus('Copied to clipboard!', 'success');
            })
            .catch(() => {
                showStatus('Failed to copy', 'error');
            });
    }

    /**
     * Show status message
     */
    function showStatus(message, type = '') {
        statusMessage.textContent = message;
        statusMessage.className = type ? `status-${type}` : '';

        // Clear status after 3 seconds
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 3000);
    }

    /**
     * Load sample text based on selected operation
     */
    function loadSample() {
        if (operation === 'encode') {
            inputArea.value = 'Hello, World! This is a sample text for Base64 encoding.';
        } else {
            inputArea.value = 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=';
        }
    }
});