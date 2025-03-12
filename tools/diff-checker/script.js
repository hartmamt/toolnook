/**
 * Diff Checker Tool
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const originalText = document.getElementById('original-text');
    const modifiedText = document.getElementById('modified-text');
    const diffType = document.getElementById('diff-type');
    const ignoreCase = document.getElementById('ignore-case');
    const ignoreWhitespace = document.getElementById('ignore-whitespace');
    const compareBtn = document.getElementById('compare-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const clearBtn = document.getElementById('clear-btn');
    const swapBtn = document.getElementById('swap-btn');
    const diffStats = document.getElementById('diff-stats');
    const diffResult = document.getElementById('diff-result');

    // Add event listeners
    compareBtn.addEventListener('click', compareTexts);
    sampleBtn.addEventListener('click', loadSample);
    clearBtn.addEventListener('click', clearAll);
    swapBtn.addEventListener('click', swapTexts);

    /**
     * Compare the two text inputs and display differences
     */
    function compareTexts() {
        // Get input values
        let text1 = originalText.value;
        let text2 = modifiedText.value;
        
        // Validate input
        if (!text1 || !text2) {
            showError('Please enter both original and modified text');
            return;
        }
        
        try {
            // Apply options
            if (ignoreCase.checked) {
                text1 = text1.toLowerCase();
                text2 = text2.toLowerCase();
            }
            
            if (ignoreWhitespace.checked) {
                text1 = text1.replace(/\s+/g, ' ').trim();
                text2 = text2.replace(/\s+/g, ' ').trim();
            }
            
            // Check if texts are identical after options
            if (text1 === text2) {
                diffStats.innerHTML = '<div class="diff-identical">Texts are identical</div>';
                diffResult.innerHTML = '<div class="identical-text">' + escapeHTML(text1) + '</div>';
                return;
            }
            
            // Split based on diff type
            const type = diffType.value;
            let parts1, parts2;
            
            if (type === 'char') {
                parts1 = text1.split('');
                parts2 = text2.split('');
            } else if (type === 'word') {
                parts1 = text1.match(/\S+|\s+/g) || [];
                parts2 = text2.match(/\S+|\s+/g) || [];
            } else { // line
                parts1 = text1.split(/\r?\n/);
                parts2 = text2.split(/\r?\n/);
            }
            
            // Calculate diff
            const diff = calculateDiff(parts1, parts2);
            
            // Display diff statistics
            const stats = generateDiffStats(diff);
            diffStats.innerHTML = stats;
            
            // Display visual diff
            const visualDiff = generateVisualDiff(diff, parts1, parts2);
            diffResult.innerHTML = visualDiff;
        } catch (error) {
            showError('Error comparing texts: ' + error.message);
        }
    }

    /**
     * Calculate the difference between two arrays using a simplified diff algorithm
     */
    function calculateDiff(array1, array2) {
        const matrix = [];
        
        // Initialize the matrix
        for (let i = 0; i <= array1.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 1; j <= array2.length; j++) {
            matrix[0][j] = j;
        }
        
        // Fill the matrix
        for (let i = 1; i <= array1.length; i++) {
            for (let j = 1; j <= array2.length; j++) {
                if (array1[i - 1] === array2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1, // deletion
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j - 1] + 1 // substitution
                    );
                }
            }
        }
        
        // Backtrack to find the actual diff operations
        let i = array1.length;
        let j = array2.length;
        const diff = [];
        
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && array1[i - 1] === array2[j - 1]) {
                // Equal elements
                diff.unshift({ type: 'equal', value: array1[i - 1] });
                i--;
                j--;
            } else if (j > 0 && (i === 0 || matrix[i][j - 1] <= matrix[i - 1][j] && matrix[i][j - 1] <= matrix[i - 1][j - 1])) {
                // Insertion
                diff.unshift({ type: 'insert', value: array2[j - 1] });
                j--;
            } else if (i > 0 && (j === 0 || matrix[i - 1][j] <= matrix[i][j - 1] && matrix[i - 1][j] <= matrix[i - 1][j - 1])) {
                // Deletion
                diff.unshift({ type: 'delete', value: array1[i - 1] });
                i--;
            } else {
                // Substitution (should not happen with this algorithm, but just in case)
                diff.unshift({ type: 'delete', value: array1[i - 1] });
                diff.unshift({ type: 'insert', value: array2[j - 1] });
                i--;
                j--;
            }
        }
        
        return diff;
    }

    /**
     * Generate statistics based on the diff
     */
    function generateDiffStats(diff) {
        const stats = {
            equal: 0,
            deleted: 0,
            inserted: 0
        };
        
        diff.forEach(item => {
            if (item.type === 'equal') stats.equal++;
            if (item.type === 'delete') stats.deleted++;
            if (item.type === 'insert') stats.inserted++;
        });
        
        const totalChanges = stats.deleted + stats.inserted;
        const totalParts = stats.equal + stats.deleted + stats.inserted;
        const percentChanged = Math.round((totalChanges / totalParts) * 100);
        
        return `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Matched:</span>
                    <span class="stat-value">${stats.equal}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Deleted:</span>
                    <span class="stat-value deleted">${stats.deleted}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Inserted:</span>
                    <span class="stat-value inserted">${stats.inserted}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Changed:</span>
                    <span class="stat-value">${percentChanged}%</span>
                </div>
            </div>
        `;
    }

    /**
     * Generate a visual representation of the diff
     */
    function generateVisualDiff(diff, parts1, parts2) {
        const type = diffType.value;
        let html = '';
        
        if (type === 'line') {
            // Line by line diff
            let originalLines = '';
            let modifiedLines = '';
            
            diff.forEach(item => {
                if (item.type === 'equal') {
                    originalLines += `<div class="line equal">${escapeHTML(item.value)}</div>`;
                    modifiedLines += `<div class="line equal">${escapeHTML(item.value)}</div>`;
                } else if (item.type === 'delete') {
                    originalLines += `<div class="line deleted">${escapeHTML(item.value)}</div>`;
                } else if (item.type === 'insert') {
                    modifiedLines += `<div class="line inserted">${escapeHTML(item.value)}</div>`;
                }
            });
            
            html = `
                <div class="diff-line-by-line">
                    <div class="diff-column">
                        <div class="diff-header">Original</div>
                        <div class="diff-content">${originalLines}</div>
                    </div>
                    <div class="diff-column">
                        <div class="diff-header">Modified</div>
                        <div class="diff-content">${modifiedLines}</div>
                    </div>
                </div>
            `;
        } else {
            // Character or word diff
            let inlineHtml = '';
            
            diff.forEach(item => {
                if (item.type === 'equal') {
                    inlineHtml += `<span class="equal">${escapeHTML(item.value)}</span>`;
                } else if (item.type === 'delete') {
                    inlineHtml += `<span class="deleted">${escapeHTML(item.value)}</span>`;
                } else if (item.type === 'insert') {
                    inlineHtml += `<span class="inserted">${escapeHTML(item.value)}</span>`;
                }
            });
            
            html = `<div class="diff-inline">${inlineHtml}</div>`;
        }
        
        return html;
    }

    /**
     * Load sample text for comparison
     */
    function loadSample() {
        originalText.value = `function calculateTotal(items) {
  return items
    .map(item => item.price * item.quantity)
    .reduce((total, value) => total + value, 0);
}

// Calculate the order total
const orderItems = [
  { name: "Product 1", price: 10, quantity: 2 },
  { name: "Product 2", price: 15, quantity: 1 },
  { name: "Product 3", price: 5, quantity: 4 }
];
const total = calculateTotal(orderItems);
console.log("Order total: $" + total);`;

        modifiedText.value = `function calculateTotal(items) {
  // Add tax calculation
  const TAX_RATE = 0.08;
  return items
    .map(item => item.price * item.quantity)
    .reduce((total, value) => total + value, 0) * (1 + TAX_RATE);
}

// Calculate the order total with tax
const orderItems = [
  { name: "Product 1", price: 10, quantity: 2 },
  { name: "Product 2", price: 15, quantity: 1 },
  { name: "Product 3", price: 7.5, quantity: 4 }
];
const total = calculateTotal(orderItems);
console.log("Order total (incl. tax): $" + total.toFixed(2));`;
        
        compareTexts();
    }

    /**
     * Clear all text inputs
     */
    function clearAll() {
        originalText.value = '';
        modifiedText.value = '';
        diffStats.innerHTML = '<p class="placeholder">Compare texts to see statistics</p>';
        diffResult.innerHTML = '<p class="placeholder">Results will appear here after comparing</p>';
    }

    /**
     * Swap the original and modified texts
     */
    function swapTexts() {
        const temp = originalText.value;
        originalText.value = modifiedText.value;
        modifiedText.value = temp;
        
        if (originalText.value && modifiedText.value) {
            compareTexts();
        }
    }

    /**
     * Show an error message
     */
    function showError(message) {
        diffStats.innerHTML = '';
        diffResult.innerHTML = `<p class="error">${message}</p>`;
    }

    /**
     * Escape HTML characters
     */
    function escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});