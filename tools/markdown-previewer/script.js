/**
 * Markdown Previewer Tool
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const markdownInput = document.getElementById('markdown-input');
    const markdownPreview = document.getElementById('markdown-preview');
    const sampleBtn = document.getElementById('sample-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyHtmlBtn = document.getElementById('copy-html-btn');
    const downloadHtmlBtn = document.getElementById('download-html-btn');

    // Add event listeners
    markdownInput.addEventListener('input', updatePreview);
    sampleBtn.addEventListener('click', loadSample);
    clearBtn.addEventListener('click', clearInput);
    copyHtmlBtn.addEventListener('click', copyHtml);
    downloadHtmlBtn.addEventListener('click', downloadHtml);

    // Initialize with empty preview
    updatePreview();

    /**
     * Update the preview based on markdown input
     */
    function updatePreview() {
        const markdown = markdownInput.value.trim();
        
        if (!markdown) {
            markdownPreview.innerHTML = '<p class="placeholder">Preview will appear here</p>';
            return;
        }
        
        try {
            // Convert markdown to HTML
            const html = markdownToHtml(markdown);
            
            // Display the preview
            markdownPreview.innerHTML = html;
            
            // Add syntax highlighting to code blocks
            highlightCodeBlocks();
        } catch (error) {
            markdownPreview.innerHTML = `<p class="error">Error rendering markdown: ${error.message}</p>`;
        }
    }

    /**
     * Convert markdown to HTML
     */
    function markdownToHtml(markdown) {
        // Process headers
        let html = markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
            .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
            .replace(/^###### (.*$)/gm, '<h6>$1</h6>');
        
        // Process emphasis (bold, italic, strikethrough)
        html = html
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>')
            .replace(/\_(.*?)\_/g, '<em>$1</em>')
            .replace(/\~\~(.*?)\~\~/g, '<del>$1</del>');
        
        // Process code blocks with language specification
        html = html.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, (match, language, code) => {
            return `<pre><code class="language-${language || 'plaintext'}">${escapeHTML(code)}</code></pre>`;
        });
        
        // Process inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Process lists
        // Unordered lists
        html = html.replace(/^\s*[\-\*]\s+(.*)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
        
        // Ordered lists
        html = html.replace(/^\s*\d+\.\s+(.*)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n)+/g, (match) => {
            // Avoid double-wrapping
            if (match.startsWith('<ul>')) return match;
            return `<ol>${match}</ol>`;
        });
        
        // Process blockquotes
        html = html.replace(/^\>\s+(.*)/gm, '<blockquote>$1</blockquote>');
        
        // Process horizontal rules
        html = html.replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '<hr>');
        
        // Process links
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Process images
        html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
        
        // Process paragraphs (any line that doesn't match above)
        // First, split into lines
        const lines = html.split('\n');
        let inParagraph = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip if already wrapped in HTML tag
            if (line === '' || 
                line.startsWith('<h') || 
                line.startsWith('<ul') || 
                line.startsWith('<ol') || 
                line.startsWith('<li') || 
                line.startsWith('<blockquote') || 
                line.startsWith('<hr') || 
                line.startsWith('<pre') || 
                line.startsWith('<p')) {
                
                // End paragraph if needed
                if (inParagraph) {
                    lines[i-1] = lines[i-1] + '</p>';
                    inParagraph = false;
                }
                continue;
            }
            
            // Start new paragraph
            if (!inParagraph) {
                lines[i] = '<p>' + line;
                inParagraph = true;
            } else {
                // Continue paragraph, add line break
                lines[i] = line + '<br>';
            }
            
            // End paragraph at last line if needed
            if (inParagraph && i === lines.length - 1) {
                lines[i] = lines[i] + '</p>';
            }
        }
        
        return lines.join('\n');
    }

    /**
     * Apply syntax highlighting to code blocks
     */
    function highlightCodeBlocks() {
        // Basic highlighting for code blocks
        // In a real implementation, you would use a library like highlight.js
        const codeBlocks = markdownPreview.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            // Get language class
            const lang = Array.from(block.classList)
                .find(cls => cls.startsWith('language-'))?.replace('language-', '') || 'plaintext';
            
            // Add a class for styling
            block.parentElement.classList.add('code-block');
            
            // Add language indicator
            if (lang && lang !== 'plaintext') {
                const langIndicator = document.createElement('div');
                langIndicator.className = 'language-indicator';
                langIndicator.textContent = lang;
                block.parentElement.prepend(langIndicator);
            }
        });
    }

    /**
     * Load a sample markdown document
     */
    function loadSample() {
        const sample = `# Markdown Sample

This is a sample **markdown** document to help you get started.

## Features

* Easy to learn
* Plain text format
* Converts to HTML

## Code Example

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Links and Images

[Visit ToolNook.dev](/)

![Sample Image](https://via.placeholder.com/150)

> This is a blockquote.

---

1. First ordered item
2. Second ordered item
   * Unordered sub-list item
   * Another item`;
        
        markdownInput.value = sample;
        updatePreview();
    }

    /**
     * Clear the input area
     */
    function clearInput() {
        markdownInput.value = '';
        updatePreview();
    }

    /**
     * Copy generated HTML to clipboard
     */
    function copyHtml() {
        if (!markdownInput.value.trim()) {
            showError('No markdown to copy');
            return;
        }
        
        try {
            // Get the HTML content
            const html = markdownPreview.innerHTML;
            
            // Copy to clipboard
            navigator.clipboard.writeText(html)
                .then(() => {
                    // Show success message
                    const originalText = copyHtmlBtn.textContent;
                    copyHtmlBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyHtmlBtn.textContent = originalText;
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
     * Download HTML as a file
     */
    function downloadHtml() {
        if (!markdownInput.value.trim()) {
            showError('No markdown to download');
            return;
        }
        
        try {
            // Get the HTML content
            const rawHtml = markdownPreview.innerHTML;
            
            // Create a full HTML document
            const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown to HTML</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        pre {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: Consolas, Monaco, 'Andale Mono', monospace;
            font-size: 0.9em;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 15px;
            color: #666;
            margin: 20px 0;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
${rawHtml}
</body>
</html>`;
            
            // Create blob and download link
            const blob = new Blob([fullHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'markdown-export.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            showError('Failed to download: ' + error.message);
        }
    }

    /**
     * Show an error message
     */
    function showError(message) {
        markdownPreview.innerHTML = `<p class="error">${message}</p>`;
        
        // Reset after a few seconds
        setTimeout(() => {
            updatePreview();
        }, 3000);
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