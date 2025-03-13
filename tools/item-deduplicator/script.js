// Item Deduplicator Tool JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputList = document.getElementById('input-list');
    const outputList = document.getElementById('output-list');
    const deduplicateBtn = document.getElementById('deduplicate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const caseSensitiveCheckbox = document.getElementById('case-sensitive');
    const trimWhitespaceCheckbox = document.getElementById('trim-whitespace');
    const ignoreEmptyCheckbox = document.getElementById('ignore-empty');
    const sortResultsCheckbox = document.getElementById('sort-results');
    const resultsStats = document.getElementById('results-stats');
    
    // Sample data
    const sampleData = `apple
banana
Apple
orange
banana
kiwi
APPLE
strawberry
  orange  
blueberry
kiwi
raspberry
banana
blackberry`;

    // Function to deduplicate the list
    function deduplicateList() {
        // Get options
        const caseSensitive = caseSensitiveCheckbox.checked;
        const trimWhitespace = trimWhitespaceCheckbox.checked;
        const ignoreEmpty = ignoreEmptyCheckbox.checked;
        const sortResults = sortResultsCheckbox.checked;
        
        // Get input and split into lines
        let items = inputList.value.split('\n');
        const originalCount = items.length;
        
        // Process according to options
        if (trimWhitespace) {
            items = items.map(item => item.trim());
        }
        
        if (ignoreEmpty) {
            items = items.filter(item => item.length > 0);
        }
        
        // Remove duplicates
        const uniqueItems = [];
        const seen = new Set();
        
        for (const item of items) {
            const checkItem = caseSensitive ? item : item.toLowerCase();
            
            if (!seen.has(checkItem)) {
                seen.add(checkItem);
                uniqueItems.push(item);
            }
        }
        
        // Sort if requested
        if (sortResults) {
            uniqueItems.sort((a, b) => {
                if (!caseSensitive) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                }
                return a.localeCompare(b);
            });
        }
        
        // Set the output
        outputList.value = uniqueItems.join('\n');
        
        // Update stats
        const duplicatesRemoved = (originalCount - uniqueItems.length);
        updateStats(originalCount, uniqueItems.length, duplicatesRemoved);
    }
    
    // Function to update stats
    function updateStats(originalCount, uniqueCount, duplicatesRemoved) {
        resultsStats.innerHTML = `
            <strong>Original items:</strong> ${originalCount} &nbsp;|&nbsp;
            <strong>Unique items:</strong> ${uniqueCount} &nbsp;|&nbsp;
            <strong>Duplicates removed:</strong> ${duplicatesRemoved} &nbsp;|&nbsp;
            <strong>Reduction:</strong> ${Math.round((duplicatesRemoved / originalCount) * 100)}%
        `;
        resultsStats.classList.add('has-results');
    }
    
    // Function to copy output to clipboard
    function copyToClipboard() {
        outputList.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    }
    
    // Function to download as text file
    function downloadText() {
        const text = outputList.value;
        if (!text) return;
        
        const blob = new Blob([text], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'deduplicated-list.txt';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
    
    // Event Listeners
    deduplicateBtn.addEventListener('click', deduplicateList);
    
    clearBtn.addEventListener('click', () => {
        inputList.value = '';
        outputList.value = '';
        resultsStats.innerHTML = '';
        resultsStats.classList.remove('has-results');
    });
    
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputList.value = text;
        } catch (error) {
            alert('Could not access clipboard. Please paste manually.');
        }
    });
    
    sampleBtn.addEventListener('click', () => {
        inputList.value = sampleData;
    });
    
    copyBtn.addEventListener('click', copyToClipboard);
    
    downloadBtn.addEventListener('click', downloadText);
    
    // Process on Enter key in input
    inputList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            deduplicateList();
        }
    });
});