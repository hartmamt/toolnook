/**
 * AI Readiness Scanner Tool
 * Client-side implementation for analyzing website AI readiness
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Input
    const urlInput = document.getElementById('url-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingIndicator = document.getElementById('loading');
    
    // DOM Elements - Results sections
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const errorMessage = document.getElementById('error-message');
    const errorDetails = document.getElementById('error-details');
    const analysisResults = document.getElementById('analysis-results');
    
    // DOM Elements - Analysis overview
    const siteTitle = document.getElementById('site-title');
    const siteUrl = document.getElementById('site-url');
    const scoreValue = document.getElementById('score-value');
    const scoreMessage = document.getElementById('score-message');
    const scoreIssues = document.getElementById('score-issues');
    const scoreCircleValue = document.getElementById('score-circle-value');
    
    // DOM Elements - AI Readiness factors
    const llmsTxtValue = document.getElementById('llms-txt-value');
    const llmsTxtInfo = document.getElementById('llms-txt-info');
    const llmsTxtStatus = document.getElementById('llms-txt-status');
    const llmsTxtRec = document.getElementById('llms-txt-rec');
    
    const aiGuidanceValue = document.getElementById('ai-guidance-value');
    const aiGuidanceInfo = document.getElementById('ai-guidance-info');
    const aiGuidanceStatus = document.getElementById('ai-guidance-status');
    const aiGuidanceRec = document.getElementById('ai-guidance-rec');
    
    const llmsContentValue = document.getElementById('llms-content-value');
    const llmsContentInfo = document.getElementById('llms-content-info');
    const llmsContentStatus = document.getElementById('llms-content-status');
    const llmsContentRec = document.getElementById('llms-content-rec');
    
    // DOM Elements - LLMS Preview
    const llmsPreviewContainer = document.getElementById('llms-preview-container');
    const llmsPreview = document.getElementById('llms-preview');
    const copyLlmsBtn = document.getElementById('copy-llms-btn');
    
    // DOM Elements - Actions
    const downloadReportBtn = document.getElementById('download-report');
    const generateLlmsBtn = document.getElementById('generate-llms');
    const templateGenerator = document.getElementById('template-generator');
    const llmsGeneratorForm = document.getElementById('llms-generator-form');
    const templateResult = document.getElementById('template-result');
    const templateContent = document.getElementById('template-content');
    const copyTemplateBtn = document.getElementById('copy-template-btn');
    const downloadTemplateBtn = document.getElementById('download-template-btn');
    
    // Store current analysis results
    let currentAnalysis = null;
    let currentLlmsContent = null;
    
    // Event Listeners
    analyzeBtn.addEventListener('click', () => analyzeUrl(urlInput.value));
    
    // Enter key in URL input
    urlInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            analyzeUrl(urlInput.value);
        }
    });
    
    // Show template generator button click
    generateLlmsBtn.addEventListener('click', () => {
        templateGenerator.classList.remove('hidden');
        templateGenerator.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Copy LLMS content
    copyLlmsBtn.addEventListener('click', () => {
        copyToClipboard(llmsPreview.textContent);
    });
    
    // Download report
    downloadReportBtn.addEventListener('click', downloadAnalysisReport);
    
    // Template generator form submit
    llmsGeneratorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        generateLlmsTemplate();
    });
    
    // Copy template
    copyTemplateBtn.addEventListener('click', () => {
        copyToClipboard(templateContent.textContent);
    });
    
    // Download template
    downloadTemplateBtn.addEventListener('click', () => {
        downloadLlmsTemplate();
    });
    
    /**
     * Analyze a URL for AI readiness
     */
    async function analyzeUrl(url) {
        if (!url || !isValidUrl(url)) {
            showError('Please enter a valid URL including https:// or http://');
            return;
        }
        
        showLoading();
        
        try {
            // Display privacy notice with option to continue or cancel
            const shouldContinue = confirm(
                "PRIVACY NOTICE: This tool will use a server-side proxy to fetch the webpage and llms.txt from the URL you entered. " +
                "The URL and its content will be temporarily processed on our server. " +
                "We don't store any data from analyzed websites.\n\n" +
                "Click OK to continue or Cancel to exit."
            );
            
            if (!shouldContinue) {
                hideLoading();
                return;
            }
            
            // First, fetch the main page to check for AI guidance links
            const pageResponse = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!pageResponse.ok) {
                throw new Error(`HTTP error: ${pageResponse.status}`);
            }
            
            const html = await pageResponse.text();
            
            // Parse HTML to check for AI guidance links
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const pageTitle = doc.title || new URL(url).hostname;
            
            // Initialize analysis
            currentAnalysis = {
                url: url,
                title: pageTitle,
                score: 0,
                issues: [],
                aiGuidanceLink: null,
                llmsTxtFound: false,
                llmsTxtContent: null,
                llmsTxtSections: {
                    siteInfo: false,
                    preferredBehavior: false,
                    contact: false,
                    crawlingPreferences: false
                }
            };
            
            // Check for AI guidance link
            const aiGuidanceLink = getAiGuidanceLink(doc);
            currentAnalysis.aiGuidanceLink = aiGuidanceLink;
            
            // Now check for llms.txt file
            const llmsTxtUrl = new URL('/llms.txt', url).href;
            try {
                const llmsResponse = await fetch(`/api/proxy?url=${encodeURIComponent(llmsTxtUrl)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (llmsResponse.ok) {
                    const llmsTxtContent = await llmsResponse.text();
                    currentAnalysis.llmsTxtFound = true;
                    currentAnalysis.llmsTxtContent = llmsTxtContent;
                    currentLlmsContent = llmsTxtContent;
                    
                    // Analyze llms.txt content
                    analyzeLlmsTxtContent(llmsTxtContent);
                } else {
                    currentAnalysis.llmsTxtFound = false;
                    currentAnalysis.issues.push('No llms.txt file found');
                }
            } catch (error) {
                console.error('Error fetching llms.txt:', error);
                currentAnalysis.llmsTxtFound = false;
                currentAnalysis.issues.push('Error fetching llms.txt file');
            }
            
            // Calculate AI readiness score
            calculateAiReadinessScore();
            
            // Update UI with results
            updateResultsUI();
            
            // Show results
            hideLoading();
            showResults();
        } catch (error) {
            showError(`Could not analyze URL: ${error.message}. Please try again.`);
            hideLoading();
        }
    }
    
    /**
     * Get AI guidance link from document
     */
    function getAiGuidanceLink(doc) {
        const aiGuidanceLinks = doc.querySelectorAll('link[rel="ai-guidance"]');
        if (aiGuidanceLinks.length > 0) {
            return aiGuidanceLinks[0].getAttribute('href');
        }
        return null;
    }
    
    /**
     * Analyze llms.txt content for required sections
     */
    function analyzeLlmsTxtContent(content) {
        // Check for Site Information section
        if (
            content.toLowerCase().includes('# site information') || 
            content.toLowerCase().includes('name:') || 
            content.toLowerCase().includes('description:')
        ) {
            currentAnalysis.llmsTxtSections.siteInfo = true;
        }
        
        // Check for Preferred Behavior section
        if (
            content.toLowerCase().includes('# preferred behavior') ||
            content.toLowerCase().includes('preferred-') ||
            content.toLowerCase().includes('tone:')
        ) {
            currentAnalysis.llmsTxtSections.preferredBehavior = true;
        }
        
        // Check for Contact section
        if (
            content.toLowerCase().includes('# contact') ||
            content.toLowerCase().includes('contact:')
        ) {
            currentAnalysis.llmsTxtSections.contact = true;
        }
        
        // Check for Crawling Preferences section
        if (
            content.toLowerCase().includes('# crawling') ||
            content.toLowerCase().includes('allow-ai-') ||
            content.toLowerCase().includes('do-not-index')
        ) {
            currentAnalysis.llmsTxtSections.crawlingPreferences = true;
        }
    }
    
    /**
     * Calculate AI readiness score
     */
    function calculateAiReadinessScore() {
        let score = 0;
        const totalPoints = 100;
        
        // Points allocation
        const llmsTxtFoundPoints = 50;
        const aiGuidanceLinkPoints = 20;
        const sectionPoints = 30; // Divided among the 4 sections
        
        // Check if llms.txt exists
        if (currentAnalysis.llmsTxtFound) {
            score += llmsTxtFoundPoints;
            
            // Check sections
            const sectionKeys = Object.keys(currentAnalysis.llmsTxtSections);
            const perSectionPoints = sectionPoints / sectionKeys.length;
            
            sectionKeys.forEach(key => {
                if (currentAnalysis.llmsTxtSections[key]) {
                    score += perSectionPoints;
                } else {
                    currentAnalysis.issues.push(`Missing ${formatSectionName(key)} section in llms.txt`);
                }
            });
        }
        
        // Check if AI guidance link exists
        if (currentAnalysis.aiGuidanceLink) {
            score += aiGuidanceLinkPoints;
        } else {
            currentAnalysis.issues.push('No AI guidance link in HTML head');
        }
        
        // Round to nearest integer
        currentAnalysis.score = Math.round(score);
        
        // Generate score message
        if (currentAnalysis.score >= 90) {
            currentAnalysis.scoreMessage = 'Excellent! Your website has very good AI readiness implementation.';
        } else if (currentAnalysis.score >= 70) {
            currentAnalysis.scoreMessage = 'Good job! Your website has decent AI readiness with some room for improvement.';
        } else if (currentAnalysis.score >= 50) {
            currentAnalysis.scoreMessage = 'Needs improvement. Your website has several AI readiness issues that should be addressed.';
        } else {
            currentAnalysis.scoreMessage = 'Poor AI readiness implementation. Your website needs significant improvements for better AI interaction.';
        }
    }
    
    /**
     * Format section name for display
     */
    function formatSectionName(key) {
        switch (key) {
            case 'siteInfo':
                return 'Site Information';
            case 'preferredBehavior':
                return 'Preferred Behavior';
            case 'contact':
                return 'Contact';
            case 'crawlingPreferences':
                return 'Crawling Preferences';
            default:
                return key;
        }
    }
    
    /**
     * Update the UI with analysis results
     */
    function updateResultsUI() {
        // Set site info
        siteTitle.textContent = currentAnalysis.title;
        siteUrl.textContent = currentAnalysis.url;
        
        // Set score
        scoreValue.textContent = currentAnalysis.score;
        scoreMessage.textContent = currentAnalysis.scoreMessage;
        
        // Update score circle visualization
        scoreCircleValue.style.strokeDasharray = `${currentAnalysis.score}, 100`;
        
        // Set color based on score
        if (currentAnalysis.score >= 90) {
            scoreCircleValue.style.stroke = '#2ecc71'; // Green
        } else if (currentAnalysis.score >= 70) {
            scoreCircleValue.style.stroke = '#3498db'; // Blue
        } else if (currentAnalysis.score >= 50) {
            scoreCircleValue.style.stroke = '#f39c12'; // Orange
        } else {
            scoreCircleValue.style.stroke = '#e74c3c'; // Red
        }
        
        // Set issues list
        if (currentAnalysis.issues.length > 0) {
            scoreIssues.innerHTML = 'Issues found: ' + currentAnalysis.issues.map(issue => `<li>${issue}</li>`).join('');
        } else {
            scoreIssues.textContent = 'No major issues found.';
        }
        
        // Set llms.txt status
        setTagUI(
            llmsTxtValue,
            llmsTxtInfo,
            llmsTxtStatus,
            llmsTxtRec,
            {
                value: currentAnalysis.llmsTxtFound ? new URL('/llms.txt', currentAnalysis.url).href : 'Not found',
                status: currentAnalysis.llmsTxtFound ? 'good' : 'warning',
                info: currentAnalysis.llmsTxtFound 
                    ? 'llms.txt file found at the root of your domain. This helps AI systems understand your website.'
                    : 'No llms.txt file found at the root of your domain.',
                recommendation: currentAnalysis.llmsTxtFound 
                    ? ''
                    : 'Create a llms.txt file in your domain root to provide guidance to AI systems. Click "Generate llms.txt Template" below to get started.'
            }
        );
        
        // Set AI guidance link status
        setTagUI(
            aiGuidanceValue,
            aiGuidanceInfo,
            aiGuidanceStatus,
            aiGuidanceRec,
            {
                value: currentAnalysis.aiGuidanceLink || 'Not found',
                status: currentAnalysis.aiGuidanceLink ? 'good' : 'warning',
                info: currentAnalysis.aiGuidanceLink 
                    ? 'AI guidance link found in your HTML head section. This helps AI systems find your llms.txt file.'
                    : 'No AI guidance link found in your HTML head section.',
                recommendation: currentAnalysis.aiGuidanceLink
                    ? ''
                    : 'Add the following to your HTML head section: <link rel="ai-guidance" href="/llms.txt" type="text/plain">'
            }
        );
        
        // Set llms.txt content analysis
        if (currentAnalysis.llmsTxtFound) {
            // Count valid sections
            const sections = currentAnalysis.llmsTxtSections;
            const validSections = Object.values(sections).filter(Boolean).length;
            const totalSections = Object.keys(sections).length;
            
            // Determine analysis quality
            let status, info, recommendation;
            
            if (validSections === totalSections) {
                status = 'good';
                info = 'llms.txt contains all recommended sections: Site Information, Preferred Behavior, Contact, and Crawling Preferences.';
                recommendation = '';
            } else if (validSections >= totalSections / 2) {
                status = 'warning';
                info = `llms.txt contains ${validSections} of ${totalSections} recommended sections. Missing: ${Object.keys(sections)
                    .filter(key => !sections[key])
                    .map(key => formatSectionName(key))
                    .join(', ')}.`;
                recommendation = 'Add the missing sections to provide more complete guidance to AI systems.';
            } else {
                status = 'error';
                info = `llms.txt is missing most recommended sections. Only found ${validSections} of ${totalSections}.`;
                recommendation = 'Enhance your llms.txt by adding Site Information, Preferred Behavior, Contact, and Crawling Preferences sections. See llmstxt.org for formatting guidelines.';
            }
            
            setTagUI(
                llmsContentValue,
                llmsContentInfo,
                llmsContentStatus,
                llmsContentRec,
                {
                    value: `${validSections}/${totalSections} sections found`,
                    status: status,
                    info: info,
                    recommendation: recommendation
                }
            );
            
            // Show the llms.txt preview if content is available
            if (currentLlmsContent) {
                llmsPreview.textContent = currentLlmsContent;
                llmsPreviewContainer.classList.remove('hidden');
            } else {
                llmsPreviewContainer.classList.add('hidden');
            }
        } else {
            // Clear content analysis if no llms.txt found
            setTagUI(
                llmsContentValue,
                llmsContentInfo,
                llmsContentStatus,
                llmsContentRec,
                {
                    value: 'N/A',
                    status: 'warning',
                    info: 'No llms.txt file to analyze',
                    recommendation: 'Create a llms.txt file with Site Information, Preferred Behavior, Contact, and Crawling Preferences sections.'
                }
            );
            
            llmsPreviewContainer.classList.add('hidden');
        }
    }
    
    /**
     * Helper function to set tag UI elements
     */
    function setTagUI(valueElement, infoElement, statusElement, recElement, tagData) {
        valueElement.textContent = tagData.value || 'Not found';
        infoElement.textContent = tagData.info;
        statusElement.textContent = getStatusText(tagData.status);
        statusElement.className = 'tag-status ' + tagData.status;
        
        if (recElement && tagData.recommendation) {
            recElement.textContent = tagData.recommendation;
            recElement.style.display = 'block';
        } else if (recElement) {
            recElement.style.display = 'none';
        }
    }
    
    /**
     * Convert status code to human-readable text
     */
    function getStatusText(status) {
        switch (status) {
            case 'good':
                return 'Good';
            case 'warning':
                return 'Warning';
            case 'error':
                return 'Error';
            case 'info':
                return 'Info';
            default:
                return 'Unknown';
        }
    }
    
    /**
     * Generate llms.txt template based on form input
     */
    function generateLlmsTemplate() {
        const siteName = document.getElementById('site-name').value;
        const siteDescription = document.getElementById('site-description').value;
        const sitePurpose = document.getElementById('site-purpose').value || 'Providing information and resources';
        const siteAudience = document.getElementById('site-audience').value || 'General audience';
        const siteLanguage = document.getElementById('site-language').value || 'English';
        const siteOwner = document.getElementById('site-owner').value || '';
        const preferredTone = document.getElementById('preferred-tone').value;
        const crawlingPreference = document.getElementById('crawling-preference').value;
        const contactInfo = document.getElementById('contact-info').value || '';
        
        const today = new Date().toISOString().split('T')[0];
        
        const template = `# llms.txt for ${siteName}
# This file provides guidance to AI language models about how to interact with our site

# Site Information
Name: ${siteName}
Description: ${siteDescription}
Purpose: ${sitePurpose}
Audience: ${siteAudience}

# Preferred Behavior
Preferred-Knowledge-Depth: Detailed
Preferred-Response-Style: Helpful, concise, technically accurate
Preferred-Tone: ${preferredTone}

# Context Information
Primary-Language: ${siteLanguage}
Last-Updated: ${today}
${siteOwner ? `Owner: ${siteOwner}` : ''}

# Crawling Preferences
Allow-AI-Crawling: ${crawlingPreference}
Allow-AI-Knowledge-Building: ${crawlingPreference}
Do-Not-Index-Paths: None

# Contact
${contactInfo ? `Contact: ${contactInfo}` : 'Contact: [add your contact information or contact page URL]'}
${siteOwner ? `Creator: ${siteOwner}` : ''}
`;
        
        // Show the template result
        templateContent.textContent = template;
        templateResult.classList.remove('hidden');
        templateResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Download the generated llms.txt template
     */
    function downloadLlmsTemplate() {
        const content = templateContent.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'llms.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Download analysis report as HTML
     */
    function downloadAnalysisReport() {
        // Check if there's a current analysis
        if (!currentAnalysis) {
            showToast('No analysis available to download', 'error');
            return;
        }
        
        const title = currentAnalysis.title;
        const url = currentAnalysis.url;
        const score = currentAnalysis.score;
        const date = new Date().toLocaleString();
        
        // Create HTML report
        const reportHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Readiness Report - ${title}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h2, h3 {
                    color: #10a37f;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                }
                .score-badge {
                    font-size: 24px;
                    font-weight: bold;
                    padding: 10px 20px;
                    border-radius: 50px;
                    background-color: ${score >= 90 ? '#2ecc71' : score >= 70 ? '#3498db' : score >= 50 ? '#f39c12' : '#e74c3c'};
                    color: white;
                }
                .meta-tag-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                    border-left: 4px solid #10a37f;
                }
                .meta-tag-item h3 {
                    margin-top: 0;
                    margin-bottom: 10px;
                }
                .tag-value {
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    word-break: break-all;
                }
                .tag-info {
                    margin-top: 10px;
                    color: #666;
                }
                .tag-recommendation {
                    margin-top: 10px;
                    padding: 10px;
                    background-color: #e8f7f3;
                    border-radius: 4px;
                    color: #10a37f;
                }
                .status {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 3px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: 10px;
                }
                .status.good { background-color: #d5f5e3; color: #27ae60; }
                .status.warning { background-color: #fef9e7; color: #f39c12; }
                .status.error { background-color: #fadbd8; color: #e74c3c; }
                .status.info { background-color: #ebf5fb; color: #3498db; }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #888;
                    font-size: 14px;
                    text-align: center;
                }
                .resource-section {
                    margin-top: 30px;
                    padding: 15px;
                    background-color: #f0f7f4;
                    border-radius: 5px;
                }
                .resource-section h2 {
                    margin-top: 0;
                }
                pre {
                    background-color: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>AI Readiness Report</h1>
                    <p>URL: <a href="${url}" target="_blank">${url}</a></p>
                    <p>Generated: ${date}</p>
                </div>
                <div class="score-badge">${score}%</div>
            </div>
            
            <h2>Overall Assessment</h2>
            <p>${currentAnalysis.scoreMessage}</p>
            
            <div class="issues">
                <h3>Issues Found</h3>
                <ul>
                    ${currentAnalysis.issues.length > 0 ? currentAnalysis.issues.map(issue => `<li>${issue}</li>`).join('') : '<li>No major issues found.</li>'}
                </ul>
            </div>
            
            <h2>AI Readiness Checks</h2>
            
            <div class="meta-tag-item">
                <h3>llms.txt File <span class="status ${currentAnalysis.llmsTxtFound ? 'good' : 'warning'}">${currentAnalysis.llmsTxtFound ? 'Good' : 'Warning'}</span></h3>
                <div class="tag-value">${currentAnalysis.llmsTxtFound ? new URL('/llms.txt', url).href : 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.llmsTxtFound 
                    ? 'llms.txt file found at the root of your domain. This helps AI systems understand your website.'
                    : 'No llms.txt file found at the root of your domain.'}</div>
                ${!currentAnalysis.llmsTxtFound 
                    ? '<div class="tag-recommendation">Create a llms.txt file in your domain root to provide guidance to AI systems.</div>' 
                    : ''}
            </div>
            
            <div class="meta-tag-item">
                <h3>AI Guidance Link <span class="status ${currentAnalysis.aiGuidanceLink ? 'good' : 'warning'}">${currentAnalysis.aiGuidanceLink ? 'Good' : 'Warning'}</span></h3>
                <div class="tag-value">${currentAnalysis.aiGuidanceLink || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.aiGuidanceLink 
                    ? 'AI guidance link found in your HTML head section. This helps AI systems find your llms.txt file.'
                    : 'No AI guidance link found in your HTML head section.'}</div>
                ${!currentAnalysis.aiGuidanceLink 
                    ? '<div class="tag-recommendation">Add the following to your HTML head section: &lt;link rel="ai-guidance" href="/llms.txt" type="text/plain"&gt;</div>' 
                    : ''}
            </div>
            
            ${currentAnalysis.llmsTxtFound ? `
            <div class="meta-tag-item">
                <h3>llms.txt Content Analysis <span class="status ${
                    Object.values(currentAnalysis.llmsTxtSections).filter(Boolean).length === Object.keys(currentAnalysis.llmsTxtSections).length 
                        ? 'good' : Object.values(currentAnalysis.llmsTxtSections).filter(Boolean).length >= Object.keys(currentAnalysis.llmsTxtSections).length / 2 
                        ? 'warning' : 'error'
                }">${
                    Object.values(currentAnalysis.llmsTxtSections).filter(Boolean).length === Object.keys(currentAnalysis.llmsTxtSections).length 
                        ? 'Good' : Object.values(currentAnalysis.llmsTxtSections).filter(Boolean).length >= Object.keys(currentAnalysis.llmsTxtSections).length / 2 
                        ? 'Warning' : 'Error'
                }</span></h3>
                <div class="tag-value">${Object.values(currentAnalysis.llmsTxtSections).filter(Boolean).length}/${Object.keys(currentAnalysis.llmsTxtSections).length} recommended sections found</div>
                <div class="tag-info">
                    <ul>
                        <li>Site Information: ${currentAnalysis.llmsTxtSections.siteInfo ? '✓ Present' : '✗ Missing'}</li>
                        <li>Preferred Behavior: ${currentAnalysis.llmsTxtSections.preferredBehavior ? '✓ Present' : '✗ Missing'}</li>
                        <li>Contact: ${currentAnalysis.llmsTxtSections.contact ? '✓ Present' : '✗ Missing'}</li>
                        <li>Crawling Preferences: ${currentAnalysis.llmsTxtSections.crawlingPreferences ? '✓ Present' : '✗ Missing'}</li>
                    </ul>
                </div>
                ${Object.values(currentAnalysis.llmsTxtSections).filter(Boolean).length < Object.keys(currentAnalysis.llmsTxtSections).length
                    ? `<div class="tag-recommendation">Add the missing sections to provide more complete guidance to AI systems.</div>`
                    : ''}
            </div>` : ''}
            
            ${currentLlmsContent ? `
            <div class="meta-tag-item">
                <h3>llms.txt Content Preview</h3>
                <pre>${currentLlmsContent}</pre>
            </div>` : ''}
            
            <div class="resource-section">
                <h2>AI Readiness Resources</h2>
                <p>Here are some resources to help improve your website's AI readiness:</p>
                <ul>
                    <li><a href="https://llmstxt.org/" target="_blank">llmstxt.org</a> - Official documentation for the llms.txt format</li>
                    <li><a href="https://www.anthropic.com/news/claude-gets-better-at-accurately-citing-sources" target="_blank">Anthropic's Guide to AI Citation</a> - Learn how Claude cites web content</li>
                    <li><a href="https://toolnook.dev/tools/ai-readiness-scanner/" target="_blank">ToolNook AI Readiness Scanner</a> - Further analyze your website's AI readiness</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Report generated by ToolNook.dev AI Readiness Scanner</p>
                <p><a href="https://toolnook.dev/tools/ai-readiness-scanner/" target="_blank">https://toolnook.dev/tools/ai-readiness-scanner/</a></p>
            </div>
        </body>
        </html>
        `;
        
        // Create a blob and download
        const blob = new Blob([reportHTML], { type: 'text/html' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // Generate filename from page title or URL
        let filename = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        if (filename === 'untitled-page') {
            // Extract domain from URL if title is generic
            const urlObj = new URL(url);
            filename = urlObj.hostname.replace(/\./g, '-');
        }
        
        link.download = `ai-readiness-report-${filename}-${new Date().toISOString().slice(0, 10)}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    }
    
    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy to clipboard', 'error');
            });
    }
    
    /**
     * Show a toast notification
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    /**
     * Show loading indicator
     */
    function showLoading() {
        loadingIndicator.classList.add('active');
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoading() {
        loadingIndicator.classList.remove('active');
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        resultsPlaceholder.classList.add('hidden');
        analysisResults.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        errorDetails.textContent = message;
    }
    
    /**
     * Show results section
     */
    function showResults() {
        resultsPlaceholder.classList.add('hidden');
        errorMessage.classList.add('hidden');
        analysisResults.classList.remove('hidden');
    }
    
    /**
     * Check if a URL is valid
     */
    function isValidUrl(url) {
        try {
            const parsedUrl = new URL(url);
            return ['http:', 'https:'].includes(parsedUrl.protocol);
        } catch (e) {
            return false;
        }
    }
    
    // Add CSS for toast notifications
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: var(--radius-sm);
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        }
        
        .toast.error {
            background-color: #e74c3c;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});