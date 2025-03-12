/**
 * JSON to YAML Converter
 * Converts between JSON and YAML formats
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load required libraries
    loadLibraries().then(() => {
        initializeConverter();
    });
});

/**
 * Load required external libraries
 */
async function loadLibraries() {
    // Load js-yaml for YAML parsing and stringifying
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js');
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
 * Initialize the converter functionality
 */
function initializeConverter() {
    // DOM Elements
    const jsonInputBtn = document.getElementById('json-input-btn');
    const yamlInputBtn = document.getElementById('yaml-input-btn');
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const copyBtn = document.getElementById('copy-btn');
    const statusMessage = document.getElementById('status-message');
    const outputFormatLabel = document.getElementById('output-format-label');
    
    // Options elements
    const indentSize = document.getElementById('indent-size');
    const prettyJson = document.getElementById('pretty-json');
    const useQuotes = document.getElementById('use-quotes');
    const flowStyle = document.getElementById('flow-style');
    
    // State
    let inputFormat = 'json';
    let outputFormat = 'yaml';
    
    // Event listeners for format selection
    jsonInputBtn.addEventListener('click', () => {
        setInputFormat('json');
    });
    
    yamlInputBtn.addEventListener('click', () => {
        setInputFormat('yaml');
    });
    
    // Event listener for convert button
    convertBtn.addEventListener('click', () => {
        convert();
    });
    
    // Event listener for clear button
    clearBtn.addEventListener('click', () => {
        inputArea.value = '';
        outputArea.value = '';
        statusMessage.textContent = '';
        statusMessage.className = '';
    });
    
    // Event listener for sample button
    sampleBtn.addEventListener('click', () => {
        loadSample();
    });
    
    // Event listener for paste button
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputArea.value = text;
        } catch (err) {
            showStatus('Cannot access clipboard', 'error');
        }
    });
    
    // Event listener for copy button
    copyBtn.addEventListener('click', () => {
        if (outputArea.value) {
            navigator.clipboard.writeText(outputArea.value)
                .then(() => {
                    showStatus('Copied!', 'success');
                })
                .catch(() => {
                    showStatus('Copy failed', 'error');
                });
        }
    });
    
    /**
     * Set the input format and update UI
     */
    function setInputFormat(format) {
        inputFormat = format;
        outputFormat = format === 'json' ? 'yaml' : 'json';
        
        // Update buttons
        jsonInputBtn.classList.toggle('active', format === 'json');
        yamlInputBtn.classList.toggle('active', format === 'yaml');
        
        // Update output format label
        outputFormatLabel.textContent = outputFormat.toUpperCase();
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
     * Convert between formats
     */
    function convert() {
        const input = inputArea.value.trim();
        
        if (!input) {
            showStatus('Please enter input', 'error');
            return;
        }
        
        try {
            if (inputFormat === 'json') {
                convertJsonToYaml(input);
            } else {
                convertYamlToJson(input);
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
        }
    }
    
    /**
     * Convert JSON to YAML
     */
    function convertJsonToYaml(jsonString) {
        // Parse JSON
        const jsonData = JSON.parse(jsonString);
        
        // Convert to YAML
        const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value);
        const quotedStrings = useQuotes.checked;
        const useFlowStyle = flowStyle.checked;
        
        try {
            const yamlString = jsyaml.dump(jsonData, {
                indent: indent,
                quotingType: quotedStrings ? '"' : '',
                flowLevel: useFlowStyle ? 3 : -1
            });
            
            outputArea.value = yamlString;
            showStatus('Converted to YAML', 'success');
        } catch (error) {
            throw new Error('Error converting to YAML: ' + error.message);
        }
    }
    
    /**
     * Convert YAML to JSON
     */
    function convertYamlToJson(yamlString) {
        // Parse YAML
        const yamlData = jsyaml.load(yamlString);
        
        // Convert to JSON
        const prettyPrint = prettyJson.checked;
        const indent = indentSize.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize.value));
        
        try {
            const jsonString = prettyPrint
                ? JSON.stringify(yamlData, null, indent)
                : JSON.stringify(yamlData);
            
            outputArea.value = jsonString;
            showStatus('Converted to JSON', 'success');
        } catch (error) {
            throw new Error('Error converting to JSON: ' + error.message);
        }
    }
    
    /**
     * Load sample data based on selected format
     */
    function loadSample() {
        if (inputFormat === 'json') {
            inputArea.value = `{
  "name": "ToolNook",
  "version": "1.0.0",
  "description": "A collection of handy micro-tools",
  "tools": [
    {
      "id": "json-yaml",
      "name": "JSON to YAML Converter",
      "category": "developer"
    },
    {
      "id": "svg-to-png",
      "name": "SVG Converter",
      "category": "design"
    }
  ],
  "settings": {
    "darkMode": false,
    "language": "en",
    "notifications": true
  }
}`;
        } else {
            inputArea.value = `name: ToolNook
version: 1.0.0
description: A collection of handy micro-tools
tools:
  - id: json-yaml
    name: JSON to YAML Converter
    category: developer
  - id: svg-to-png
    name: SVG Converter
    category: design
settings:
  darkMode: false
  language: en
  notifications: true`;
        }
    }
});