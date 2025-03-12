/**
 * Hash Generator
 * Generate various cryptographic hashes from text or files
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load required libraries
    loadLibraries().then(() => {
        initializeHashGenerator();
    });
});

/**
 * Load required external libraries
 */
async function loadLibraries() {
    // Load CryptoJS for various hashing algorithms
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');
}

/**
 * Helper function to load a script
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Initialize the hash generator functionality
 */
function initializeHashGenerator() {
    // DOM Elements - Mode Selection
    const textModeBtn = document.getElementById('text-mode-btn');
    const fileModeBtn = document.getElementById('file-mode-btn');
    const compareModeBtn = document.getElementById('compare-mode-btn');
    const textMode = document.getElementById('text-mode');
    const fileMode = document.getElementById('file-mode');
    const compareMode = document.getElementById('compare-mode');
    
    // DOM Elements - Text Mode
    const textInput = document.getElementById('text-input');
    const clearTextBtn = document.getElementById('clear-text-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const generateBtn = document.getElementById('generate-btn');
    const hashResults = document.getElementById('hash-results');
    const uppercase = document.getElementById('uppercase');
    
    // Algorithm checkboxes
    const algorithmCheckboxes = {
        md5: document.getElementById('md5'),
        sha1: document.getElementById('sha1'),
        sha256: document.getElementById('sha256'),
        sha384: document.getElementById('sha384'),
        sha512: document.getElementById('sha512'),
        sha3_256: document.getElementById('sha3-256'),
        sha3_512: document.getElementById('sha3-512'),
        ripemd160: document.getElementById('ripemd160')
    };
    
    // DOM Elements - File Mode
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const fileModified = document.getElementById('file-modified');
    const hashFileBtn = document.getElementById('hash-file-btn');
    const fileHashResults = document.getElementById('file-hash-results');
    const fileUppercase = document.getElementById('file-uppercase');
    
    // File Algorithm checkboxes
    const fileAlgorithmCheckboxes = {
        md5: document.getElementById('file-md5'),
        sha1: document.getElementById('file-sha1'),
        sha256: document.getElementById('file-sha256'),
        sha512: document.getElementById('file-sha512')
    };
    
    // DOM Elements - Compare Mode
    const hash1 = document.getElementById('hash1');
    const hash2 = document.getElementById('hash2');
    const compareBtn = document.getElementById('compare-btn');
    const comparisonResult = document.getElementById('comparison-result');
    
    // State
    let selectedFile = null;
    
    // Event Listeners - Mode Selection
    textModeBtn.addEventListener('click', () => {
        setMode('text');
    });
    
    fileModeBtn.addEventListener('click', () => {
        setMode('file');
    });
    
    compareModeBtn.addEventListener('click', () => {
        setMode('compare');
    });
    
    // Event Listeners - Text Mode
    clearTextBtn.addEventListener('click', () => {
        textInput.value = '';
        hashResults.innerHTML = '<div class="placeholder">Hash results will appear here</div>';
    });
    
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            textInput.value = text;
        } catch (err) {
            alert('Cannot access clipboard. Make sure you have granted permission.');
        }
    });
    
    sampleBtn.addEventListener('click', () => {
        textInput.value = 'The quick brown fox jumps over the lazy dog';
    });
    
    generateBtn.addEventListener('click', () => {
        generateTextHashes();
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
    
    hashFileBtn.addEventListener('click', () => {
        hashFile();
    });
    
    // Event Listeners - Compare Mode
    compareBtn.addEventListener('click', () => {
        compareHashes();
    });
    
    /**
     * Set the active mode
     */
    function setMode(mode) {
        // Update buttons
        textModeBtn.classList.toggle('active', mode === 'text');
        fileModeBtn.classList.toggle('active', mode === 'file');
        compareModeBtn.classList.toggle('active', mode === 'compare');
        
        // Show/hide panels
        textMode.classList.toggle('active', mode === 'text');
        fileMode.classList.toggle('active', mode === 'file');
        compareMode.classList.toggle('active', mode === 'compare');
    }
    
    /**
     * Generate hashes from text input
     */
    function generateTextHashes() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to hash');
            return;
        }
        
        // Check if at least one algorithm is selected
        if (!isAnyAlgorithmSelected(algorithmCheckboxes)) {
            alert('Please select at least one hash algorithm');
            return;
        }
        
        // Generate hashes
        const hashes = {};
        
        if (algorithmCheckboxes.md5.checked) {
            hashes.md5 = CryptoJS.MD5(text).toString();
        }
        
        if (algorithmCheckboxes.sha1.checked) {
            hashes.sha1 = CryptoJS.SHA1(text).toString();
        }
        
        if (algorithmCheckboxes.sha256.checked) {
            hashes.sha256 = CryptoJS.SHA256(text).toString();
        }
        
        if (algorithmCheckboxes.sha384.checked) {
            hashes.sha384 = CryptoJS.SHA384(text).toString();
        }
        
        if (algorithmCheckboxes.sha512.checked) {
            hashes.sha512 = CryptoJS.SHA512(text).toString();
        }
        
        if (algorithmCheckboxes.sha3_256.checked) {
            hashes.sha3_256 = CryptoJS.SHA3(text, { outputLength: 256 }).toString();
        }
        
        if (algorithmCheckboxes.sha3_512.checked) {
            hashes.sha3_512 = CryptoJS.SHA3(text, { outputLength: 512 }).toString();
        }
        
        if (algorithmCheckboxes.ripemd160.checked) {
            hashes.ripemd160 = CryptoJS.RIPEMD160(text).toString();
        }
        
        // Display the hashes
        displayHashes(hashes, hashResults, uppercase.checked);
    }
    
    /**
     * Check if any algorithm is selected
     */
    function isAnyAlgorithmSelected(checkboxes) {
        return Object.values(checkboxes).some(checkbox => checkbox.checked);
    }
    
    /**
     * Display hash results
     */
    function displayHashes(hashes, resultsContainer, isUppercase) {
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Generate HTML for each hash
        for (const [algorithm, value] of Object.entries(hashes)) {
            const displayValue = isUppercase ? value.toUpperCase() : value;
            const algorithmName = getAlgorithmDisplayName(algorithm);
            
            const hashElement = document.createElement('div');
            hashElement.className = 'hash-result';
            hashElement.innerHTML = `
                <div class="hash-algorithm">${algorithmName}</div>
                <div class="hash-value-container">
                    <div class="hash-value">${displayValue}</div>
                    <button class="btn-copy" data-value="${displayValue}">Copy</button>
                </div>
            `;
            
            resultsContainer.appendChild(hashElement);
        }
        
        // Add event listeners to copy buttons
        const copyButtons = resultsContainer.querySelectorAll('.btn-copy');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                copyToClipboard(value, button);
            });
        });
    }
    
    /**
     * Get display name for hash algorithm
     */
    function getAlgorithmDisplayName(algorithm) {
        const names = {
            md5: 'MD5',
            sha1: 'SHA-1',
            sha256: 'SHA-256',
            sha384: 'SHA-384',
            sha512: 'SHA-512',
            sha3_256: 'SHA3-256',
            sha3_512: 'SHA3-512',
            ripemd160: 'RIPEMD-160'
        };
        
        return names[algorithm] || algorithm.toUpperCase();
    }
    
    /**
     * Handle file selection
     */
    function handleFileSelect(file) {
        selectedFile = file;
        fileName.textContent = file.name;
        
        // Update file information
        fileSize.textContent = formatFileSize(file.size);
        fileModified.textContent = new Date(file.lastModified).toLocaleString();
        
        // Clear previous results
        fileHashResults.innerHTML = '<div class="placeholder">Select algorithms and click "Hash File" to generate hashes</div>';
    }
    
    /**
     * Format file size
     */
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        } else if (bytes < 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        } else {
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
        }
    }
    
    /**
     * Hash the selected file
     */
    function hashFile() {
        if (!selectedFile) {
            alert('Please select a file to hash');
            return;
        }
        
        // Check if at least one algorithm is selected
        if (!isAnyAlgorithmSelected(fileAlgorithmCheckboxes)) {
            alert('Please select at least one hash algorithm');
            return;
        }
        
        // Update results with loading message
        fileHashResults.innerHTML = '<div class="placeholder">Computing hashes... (this may take a while for large files)</div>';
        
        // Use FileReader to read the file
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const fileContent = event.target.result;
            
            // Generate hashes
            const hashes = {};
            
            if (fileAlgorithmCheckboxes.md5.checked) {
                hashes.md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileContent)).toString();
            }
            
            if (fileAlgorithmCheckboxes.sha1.checked) {
                hashes.sha1 = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(fileContent)).toString();
            }
            
            if (fileAlgorithmCheckboxes.sha256.checked) {
                hashes.sha256 = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(fileContent)).toString();
            }
            
            if (fileAlgorithmCheckboxes.sha512.checked) {
                hashes.sha512 = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(fileContent)).toString();
            }
            
            // Display the hashes
            displayHashes(hashes, fileHashResults, fileUppercase.checked);
        };
        
        reader.onerror = () => {
            fileHashResults.innerHTML = '<div class="placeholder">Error reading file</div>';
        };
        
        reader.readAsArrayBuffer(selectedFile);
    }
    
    /**
     * Compare two hash values
     */
    function compareHashes() {
        const value1 = hash1.value.trim();
        const value2 = hash2.value.trim();
        
        if (!value1 || !value2) {
            alert('Please enter both hash values to compare');
            return;
        }
        
        // Normalize hashes for comparison (remove spaces, convert to lowercase)
        const normalized1 = value1.replace(/\s+/g, '').toLowerCase();
        const normalized2 = value2.replace(/\s+/g, '').toLowerCase();
        
        // Compare and display result
        if (normalized1 === normalized2) {
            comparisonResult.innerHTML = '<div class="match">✓ Hashes match!</div>';
        } else {
            comparisonResult.innerHTML = '<div class="no-match">✗ Hashes do not match!</div>';
        }
    }
    
    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Update button text temporarily
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            })
            .catch(() => {
                alert('Failed to copy to clipboard');
            });
    }
});