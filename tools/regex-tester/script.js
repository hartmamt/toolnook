/**
 * Regular Expression Tester
 * Tests regular expressions against text with real-time highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Input
    const regexPattern = document.getElementById('regex-pattern');
    const flagGlobal = document.getElementById('flag-global');
    const flagCaseInsensitive = document.getElementById('flag-case-insensitive');
    const flagMultiline = document.getElementById('flag-multiline');
    const flagDotall = document.getElementById('flag-dotall');
    const clearPatternBtn = document.getElementById('clear-pattern-btn');
    const regexError = document.getElementById('regex-error');
    
    // DOM Elements - Test String
    const testString = document.getElementById('test-string');
    const clearTextBtn = document.getElementById('clear-text-btn');
    const sampleBtn = document.getElementById('sample-btn');
    
    // DOM Elements - Results
    const highlightedText = document.getElementById('highlighted-text');
    const matchCount = document.getElementById('match-count');
    const captureGroups = document.getElementById('capture-groups');
    
    // DOM Elements - Examples
    const examples = document.querySelectorAll('.example');
    
    // Add event listeners
    regexPattern.addEventListener('input', testRegex);
    testString.addEventListener('input', testRegex);
    flagGlobal.addEventListener('change', testRegex);
    flagCaseInsensitive.addEventListener('change', testRegex);
    flagMultiline.addEventListener('change', testRegex);
    flagDotall.addEventListener('change', testRegex);
    clearPatternBtn.addEventListener('click', clearPattern);
    clearTextBtn.addEventListener('click', clearText);
    sampleBtn.addEventListener('click', loadSample);
    
    // Add example click handlers
    examples.forEach(example => {
        example.addEventListener('click', () => {
            const pattern = example.getAttribute('data-pattern');
            regexPattern.value = pattern;
            
            // Load appropriate sample text based on pattern
            if (pattern.includes('@')) {
                // Email
                testString.value = 'Contact me at john.doe@example.com or support@company.co.uk\nInvalid emails: john@.com, @example.com, john@com';
            } else if (pattern.includes('https?')) {
                // URL
                testString.value = 'Valid URLs:\nhttps://www.example.com\nhttp://subdomain.example.co.uk/page?param=value\n\nInvalid URLs:\nwww.example\nexample.com';
            } else if (pattern.includes('\\d{3}')) {
                // Phone Number
                testString.value = 'Contact numbers:\n555-123-4567\n(555) 123-4567\n555.123.4567\n5551234567\nInvalid: 55-123-4567';
            } else if (pattern.includes('(?=.*[A-Za-z])')) {
                // Password
                testString.value = 'Valid passwords:\nPassword123\nSecure@123\n\nInvalid passwords:\npass (too short)\n12345678 (no letters)\nPASSWORD (no numbers)';
            } else if (pattern.includes('\\d{1,3}\\.\\d{1,3}')) {
                // IP Address
                testString.value = 'IP Addresses:\n192.168.1.1\n10.0.0.1\n172.16.254.1\nInvalid: 256.0.0.1, 172.16.254, 1.2.3.4.5';
            }
            
            testRegex();
        });
    });
    
    // Initial state
    highlightedText.innerHTML = '<p class="placeholder">Enter a regular expression pattern and test string above.</p>';
    
    /**
     * Test regex against input string
     */
    function testRegex() {
        const pattern = regexPattern.value.trim();
        const text = testString.value;
        
        // Clear error message
        regexError.textContent = '';
        regexError.classList.remove('active');
        
        // Clear results if pattern or text is empty
        if (!pattern || !text) {
            highlightedText.innerHTML = '<p class="placeholder">Matches will be highlighted here</p>';
            matchCount.textContent = '0 matches found';
            captureGroups.innerHTML = '';
            return;
        }
        
        try {
            // Build flags
            let flags = '';
            if (flagGlobal.checked) flags += 'g';
            if (flagCaseInsensitive.checked) flags += 'i';
            if (flagMultiline.checked) flags += 'm';
            if (flagDotall.checked) flags += 's';
            
            // Create regex
            const regex = new RegExp(pattern, flags);
            
            // Handle global and non-global cases differently
            if (flagGlobal.checked) {
                processGlobalMatches(regex, text);
            } else {
                processSingleMatch(regex, text);
            }
            
        } catch (error) {
            // Show error message
            regexError.textContent = error.message;
            regexError.classList.add('active');
            
            // Clear results
            highlightedText.innerHTML = '<p class="placeholder">Invalid regular expression</p>';
            matchCount.textContent = '0 matches found';
            captureGroups.innerHTML = '';
        }
    }
    
    /**
     * Process global matches (g flag)
     */
    function processGlobalMatches(regex, text) {
        let match;
        let matches = [];
        let groupMatches = {};
        let html = text;
        let offset = 0;
        
        // Find all matches
        while ((match = regex.exec(text)) !== null) {
            // Avoid infinite loops
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // Store match information
            matches.push({
                matchText: match[0],
                startIndex: match.index,
                endIndex: match.index + match[0].length,
                groups: match.slice(1)
            });
            
            // Store group information for display
            match.slice(1).forEach((group, i) => {
                if (group !== undefined) {
                    if (!groupMatches[i + 1]) {
                        groupMatches[i + 1] = [];
                    }
                    groupMatches[i + 1].push(group);
                }
            });
        }
        
        // Handle no matches
        if (matches.length === 0) {
            highlightedText.textContent = text;
            matchCount.textContent = '0 matches found';
            captureGroups.innerHTML = '';
            return;
        }
        
        // Sort matches in reverse order (to handle overlapping matches correctly)
        matches.sort((a, b) => b.startIndex - a.startIndex);
        
        // Replace matches with highlighted spans
        matches.forEach((match, i) => {
            const before = html.substring(0, match.startIndex + offset);
            const matchText = html.substring(match.startIndex + offset, match.endIndex + offset);
            const after = html.substring(match.endIndex + offset);
            
            // Determine classes based on capture groups
            let classes = 'match';
            match.groups.forEach((group, i) => {
                if (group !== undefined) {
                    classes += ` group-${i + 1}`;
                }
            });
            
            // Replace with highlighted span
            html = before + `<span class="${classes}" data-match-index="${i}">${matchText}</span>` + after;
            
            // Update offset for next replacement
            offset += (`<span class="${classes}" data-match-index="${i}">`.length + '</span>'.length);
        });
        
        // Convert newlines to <br> for proper display
        html = html.replace(/\n/g, '<br>');
        
        // Update results
        highlightedText.innerHTML = html;
        matchCount.textContent = `${matches.length} match${matches.length === 1 ? '' : 'es'} found`;
        
        // Display capture groups
        displayCaptureGroups(groupMatches);
    }
    
    /**
     * Process single match (no g flag)
     */
    function processSingleMatch(regex, text) {
        const match = text.match(regex);
        
        if (!match) {
            highlightedText.textContent = text;
            matchCount.textContent = '0 matches found';
            captureGroups.innerHTML = '';
            return;
        }
        
        const startIndex = text.indexOf(match[0]);
        const endIndex = startIndex + match[0].length;
        
        // Create highlighted text
        const before = text.substring(0, startIndex);
        const matchText = text.substring(startIndex, endIndex);
        const after = text.substring(endIndex);
        
        // Determine classes based on capture groups
        let classes = 'match';
        match.slice(1).forEach((group, i) => {
            if (group !== undefined) {
                classes += ` group-${i + 1}`;
            }
        });
        
        // Convert newlines to <br> for proper display
        const htmlBefore = before.replace(/\n/g, '<br>');
        const htmlMatchText = matchText.replace(/\n/g, '<br>');
        const htmlAfter = after.replace(/\n/g, '<br>');
        
        const html = htmlBefore + `<span class="${classes}" data-match-index="0">${htmlMatchText}</span>` + htmlAfter;
        
        // Update results
        highlightedText.innerHTML = html;
        matchCount.textContent = '1 match found';
        
        // Display capture groups
        const groupMatches = {};
        match.slice(1).forEach((group, i) => {
            if (group !== undefined) {
                groupMatches[i + 1] = [group];
            }
        });
        
        displayCaptureGroups(groupMatches);
    }
    
    /**
     * Display capture groups information
     */
    function displayCaptureGroups(groupMatches) {
        if (Object.keys(groupMatches).length === 0) {
            captureGroups.innerHTML = '<p>No capture groups</p>';
            return;
        }
        
        let html = '<div class="groups-list">';
        
        for (const groupNumber in groupMatches) {
            const matches = groupMatches[groupNumber];
            
            html += `<div class="group">
                <span class="group-label">Group ${groupNumber}:</span>
                <span class="group-values">${matches.map(m => `"${m}"`).join(', ')}</span>
            </div>`;
        }
        
        html += '</div>';
        captureGroups.innerHTML = html;
    }
    
    /**
     * Clear pattern input
     */
    function clearPattern() {
        regexPattern.value = '';
        regexError.textContent = '';
        regexError.classList.remove('active');
        testRegex();
    }
    
    /**
     * Clear test string
     */
    function clearText() {
        testString.value = '';
        testRegex();
    }
    
    /**
     * Load sample regex and text
     */
    function loadSample() {
        regexPattern.value = '\\b[A-Z][a-z]+\\b';
        testString.value = 'The Quick Brown Fox Jumps Over The Lazy Dog.\nThis sentence has Words with Capital Letters.';
        testRegex();
    }
});