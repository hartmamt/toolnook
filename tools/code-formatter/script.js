/**
 * Code Formatter Tool
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const languageSelect = document.getElementById('language-select');
    const inputCode = document.getElementById('input-code');
    const indentSelect = document.getElementById('indent-select');
    const processBtn = document.getElementById('process-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resultArea = document.getElementById('result');

    // Add event listeners
    processBtn.addEventListener('click', formatCode);
    copyBtn.addEventListener('click', copyToClipboard);

    /**
     * Format the code based on selected language and indentation
     */
    function formatCode() {
        // Get input values
        const code = inputCode.value.trim();
        const language = languageSelect.value;
        const indentOption = indentSelect.value;
        
        // Validate input
        if (!code) {
            showError('Please enter code to format');
            return;
        }
        
        try {
            // Format the code based on language
            let formattedCode;
            const indentChar = indentOption === 'tab' ? '\t' : ' ';
            const indentSize = indentOption === 'tab' ? 1 : parseInt(indentOption);
            
            switch (language) {
                case 'javascript':
                    formattedCode = formatJavaScript(code, indentChar, indentSize);
                    break;
                case 'html':
                    formattedCode = formatHTML(code, indentChar, indentSize);
                    break;
                case 'css':
                    formattedCode = formatCSS(code, indentChar, indentSize);
                    break;
                case 'xml':
                    formattedCode = formatXML(code, indentChar, indentSize);
                    break;
                case 'json':
                    formattedCode = formatJSON(code, indentChar, indentSize);
                    break;
                case 'sql':
                    formattedCode = formatSQL(code, indentChar, indentSize);
                    break;
                default:
                    formattedCode = code;
            }
            
            // Display the result
            displayResult(formattedCode);
        } catch (error) {
            showError(`Failed to format code: ${error.message}`);
        }
    }

    /**
     * Format JavaScript code
     */
    function formatJavaScript(code, indentChar, indentSize) {
        try {
            // Simple JS formatting (for complex formatting, libraries like prettier would be used)
            // This is a basic implementation
            let formatted = '';
            let indentLevel = 0;
            let inString = false;
            let stringChar = '';
            let previousChar = '';
            
            for (let i = 0; i < code.length; i++) {
                const char = code[i];
                
                // Handle strings
                if ((char === '"' || char === "'" || char === '`') && previousChar !== '\\') {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (stringChar === char) {
                        inString = false;
                    }
                }
                
                if (!inString) {
                    // Handle braces and indentation
                    if (char === '{') {
                        formatted += char;
                        indentLevel++;
                        formatted += '\n' + indentChar.repeat(indentLevel * indentSize);
                    } else if (char === '}') {
                        indentLevel = Math.max(0, indentLevel - 1);
                        formatted += '\n' + indentChar.repeat(indentLevel * indentSize) + char;
                    } else if (char === ';') {
                        formatted += char;
                        if (i < code.length - 1 && code[i+1] !== '}') {
                            formatted += '\n' + indentChar.repeat(indentLevel * indentSize);
                        }
                    } else if (char === '\n') {
                        formatted += '\n' + indentChar.repeat(indentLevel * indentSize);
                    } else {
                        formatted += char;
                    }
                } else {
                    formatted += char;
                }
                
                previousChar = char;
            }
            
            return formatted;
        } catch (error) {
            throw new Error('Invalid JavaScript code');
        }
    }

    /**
     * Format HTML code
     */
    function formatHTML(code, indentChar, indentSize) {
        try {
            // Basic HTML formatting
            let formatted = '';
            let indentLevel = 0;
            let inTag = false;
            let inComment = false;
            let tagName = '';
            let currentTagName = '';
            
            // Self-closing tags
            const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
            
            for (let i = 0; i < code.length; i++) {
                const char = code[i];
                
                // Handle comments
                if (i < code.length - 3 && char === '<' && code[i+1] === '!' && code[i+2] === '-' && code[i+3] === '-') {
                    inComment = true;
                    formatted += '<!--';
                    i += 3;
                    continue;
                }
                
                if (inComment && i < code.length - 2 && char === '-' && code[i+1] === '-' && code[i+2] === '>') {
                    inComment = false;
                    formatted += '-->';
                    i += 2;
                    continue;
                }
                
                if (inComment) {
                    formatted += char;
                    continue;
                }
                
                // Handle tags
                if (char === '<' && code[i+1] !== '/') {
                    inTag = true;
                    tagName = '';
                    formatted += '\n' + indentChar.repeat(indentLevel * indentSize) + '<';
                } else if (char === '<' && code[i+1] === '/') {
                    inTag = true;
                    indentLevel = Math.max(0, indentLevel - 1);
                    formatted += '\n' + indentChar.repeat(indentLevel * indentSize) + '<';
                } else if (char === '>') {
                    inTag = false;
                    formatted += '>';
                    
                    if (tagName && !selfClosingTags.includes(tagName) && 
                        !(i > 0 && code[i-1] === '/')) {
                        indentLevel++;
                    }
                    
                    currentTagName = tagName;
                } else if (inTag && /[a-z0-9]/i.test(char) && tagName === '') {
                    tagName = char;
                } else if (inTag && /[a-z0-9]/i.test(char) && tagName.length > 0 && !/\s/.test(code[i-1])) {
                    tagName += char;
                } else {
                    formatted += char;
                }
            }
            
            return formatted.trim();
        } catch (error) {
            throw new Error('Invalid HTML code');
        }
    }

    /**
     * Format CSS code
     */
    function formatCSS(code, indentChar, indentSize) {
        try {
            // Basic CSS formatting
            let formatted = '';
            let inSelector = true;
            let inProperty = false;
            let inValue = false;
            let inComment = false;
            
            // Replace all newlines and multiple spaces
            code = code.replace(/\s+/g, ' ').trim();
            
            // Format braces and semicolons
            code = code.replace(/\s*{\s*/g, ' {');
            code = code.replace(/\s*}\s*/g, '}');
            code = code.replace(/\s*:\s*/g, ': ');
            code = code.replace(/\s*;\s*/g, ';');
            
            // Split by closing braces
            const blocks = code.split('}');
            
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].trim() === '') continue;
                
                // Split each block into selector and declarations
                const parts = blocks[i].split('{');
                if (parts.length === 2) {
                    const selector = parts[0].trim();
                    const declarations = parts[1].trim();
                    
                    // Add selector
                    formatted += selector + ' {\n';
                    
                    // Add declarations
                    const props = declarations.split(';');
                    for (let j = 0; j < props.length; j++) {
                        if (props[j].trim() === '') continue;
                        formatted += indentChar.repeat(indentSize) + props[j].trim() + ';\n';
                    }
                    
                    // Close block
                    formatted += '}\n\n';
                }
            }
            
            return formatted.trim();
        } catch (error) {
            throw new Error('Invalid CSS code');
        }
    }

    /**
     * Format XML code
     */
    function formatXML(code, indentChar, indentSize) {
        // For simplicity, reuse HTML formatter with some adjustments
        return formatHTML(code, indentChar, indentSize);
    }

    /**
     * Format JSON code
     */
    function formatJSON(code, indentChar, indentSize) {
        try {
            // Parse and stringify with proper indentation
            const obj = JSON.parse(code);
            return JSON.stringify(obj, null, indentOption === 'tab' ? '\t' : Number(indentOption));
        } catch (error) {
            throw new Error('Invalid JSON code');
        }
    }

    /**
     * Format SQL code
     */
    function formatSQL(code, indentChar, indentSize) {
        try {
            // Simple SQL formatting
            const keywords = [
                'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
                'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'GROUP BY', 'ORDER BY', 
                'HAVING', 'LIMIT', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 
                'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'
            ];
            
            // Replace multiple spaces and newlines
            let formatted = code.replace(/\s+/g, ' ').trim();
            
            // Uppercase keywords
            for (const keyword of keywords) {
                const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
                formatted = formatted.replace(regex, keyword);
            }
            
            // Add newlines after keywords
            for (const keyword of keywords) {
                const regex = new RegExp(keyword + ' ', 'g');
                formatted = formatted.replace(regex, '\n' + keyword + '\n' + indentChar.repeat(indentSize));
            }
            
            // Format commas
            formatted = formatted.replace(/,/g, ',\n' + indentChar.repeat(indentSize));
            
            // Clean up multiple newlines
            formatted = formatted.replace(/\n+/g, '\n');
            
            return formatted.trim();
        } catch (error) {
            throw new Error('Invalid SQL code');
        }
    }

    /**
     * Copy formatted code to clipboard
     */
    function copyToClipboard() {
        const resultContent = resultArea.querySelector('pre');
        if (!resultContent) {
            showError('No formatted code to copy');
            return;
        }
        
        try {
            const textToCopy = resultContent.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Temporary visual feedback
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    showError('Failed to copy: ' + err);
                });
        } catch (error) {
            showError('Failed to copy: ' + error.message);
        }
    }

    /**
     * Display the result in the result area
     */
    function displayResult(result) {
        resultArea.innerHTML = `<pre>${escapeHTML(result)}</pre>`;
    }

    /**
     * Show an error message
     */
    function showError(message) {
        resultArea.innerHTML = `<p class="error">${message}</p>`;
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