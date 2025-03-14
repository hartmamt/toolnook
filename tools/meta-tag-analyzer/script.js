/**
 * Meta Tag Analyzer Tool
 * Client-side implementation for analyzing meta tags and SEO factors
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Input
    const urlInput = document.getElementById('url-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const htmlInput = document.getElementById('html-input');
    const analyzeHtmlBtn = document.getElementById('analyze-html-btn');
    const siteBtns = document.querySelectorAll('.site-btn');
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
    
    // DOM Elements - Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM Elements - Basic SEO Tags
    const titleTagValue = document.getElementById('title-tag-value');
    const titleTagInfo = document.getElementById('title-tag-info');
    const titleTagStatus = document.getElementById('title-tag-status');
    const titleTagRec = document.getElementById('title-tag-rec');
    
    const metaDescValue = document.getElementById('meta-desc-value');
    const metaDescInfo = document.getElementById('meta-desc-info');
    const metaDescStatus = document.getElementById('meta-desc-status');
    const metaDescRec = document.getElementById('meta-desc-rec');
    
    const metaKeywordsValue = document.getElementById('meta-keywords-value');
    const metaKeywordsInfo = document.getElementById('meta-keywords-info');
    const metaKeywordsStatus = document.getElementById('meta-keywords-status');
    const metaKeywordsRec = document.getElementById('meta-keywords-rec');
    
    const canonicalValue = document.getElementById('canonical-value');
    const canonicalInfo = document.getElementById('canonical-info');
    const canonicalStatus = document.getElementById('canonical-status');
    const canonicalRec = document.getElementById('canonical-rec');
    
    const robotsValue = document.getElementById('robots-value');
    const robotsInfo = document.getElementById('robots-info');
    const robotsStatus = document.getElementById('robots-status');
    const robotsRec = document.getElementById('robots-rec');
    
    const viewportValue = document.getElementById('viewport-value');
    const viewportInfo = document.getElementById('viewport-info');
    const viewportStatus = document.getElementById('viewport-status');
    const viewportRec = document.getElementById('viewport-rec');
    
    // DOM Elements - Social Media Tags
    const ogTitleValue = document.getElementById('og-title-value');
    const ogTitleInfo = document.getElementById('og-title-info');
    const ogTitleStatus = document.getElementById('og-title-status');
    
    const ogDescValue = document.getElementById('og-desc-value');
    const ogDescInfo = document.getElementById('og-desc-info');
    const ogDescStatus = document.getElementById('og-desc-status');
    
    const ogImageValue = document.getElementById('og-image-value');
    const ogImageInfo = document.getElementById('og-image-info');
    const ogImageStatus = document.getElementById('og-image-status');
    const ogImagePreview = document.getElementById('og-image-preview');
    
    const ogUrlValue = document.getElementById('og-url-value');
    const ogUrlInfo = document.getElementById('og-url-info');
    const ogUrlStatus = document.getElementById('og-url-status');
    
    const ogTypeValue = document.getElementById('og-type-value');
    const ogTypeInfo = document.getElementById('og-type-info');
    const ogTypeStatus = document.getElementById('og-type-status');
    
    const twitterCardValue = document.getElementById('twitter-card-value');
    const twitterCardInfo = document.getElementById('twitter-card-info');
    const twitterCardStatus = document.getElementById('twitter-card-status');
    
    const twitterTitleValue = document.getElementById('twitter-title-value');
    const twitterTitleInfo = document.getElementById('twitter-title-info');
    const twitterTitleStatus = document.getElementById('twitter-title-status');
    
    const twitterDescValue = document.getElementById('twitter-desc-value');
    const twitterDescInfo = document.getElementById('twitter-desc-info');
    const twitterDescStatus = document.getElementById('twitter-desc-status');
    
    const twitterImageValue = document.getElementById('twitter-image-value');
    const twitterImageInfo = document.getElementById('twitter-image-info');
    const twitterImageStatus = document.getElementById('twitter-image-status');
    const twitterImagePreview = document.getElementById('twitter-image-preview');
    
    // DOM Elements - Advanced Tags
    const charsetValue = document.getElementById('charset-value');
    const charsetInfo = document.getElementById('charset-info');
    const charsetStatus = document.getElementById('charset-status');
    
    const languageValue = document.getElementById('language-value');
    const languageInfo = document.getElementById('language-info');
    const languageStatus = document.getElementById('language-status');
    
    const faviconValue = document.getElementById('favicon-value');
    const faviconInfo = document.getElementById('favicon-info');
    const faviconStatus = document.getElementById('favicon-status');
    const faviconPreview = document.getElementById('favicon-preview');
    
    const structuredDataValue = document.getElementById('structured-data-value');
    const structuredDataInfo = document.getElementById('structured-data-info');
    const structuredDataStatus = document.getElementById('structured-data-status');
    
    const headingsValue = document.getElementById('headings-value');
    const headingsInfo = document.getElementById('headings-info');
    const headingsStatus = document.getElementById('headings-status');
    
    // DOM Elements - Raw Tags
    const rawTagsContent = document.getElementById('raw-tags-content');
    const copyRawTagsBtn = document.getElementById('copy-raw-tags');
    
    // DOM Elements - Actions
    const downloadReportBtn = document.getElementById('download-report');
    const saveAnalysisBtn = document.getElementById('save-analysis');
    const savedAnalysesContainer = document.getElementById('saved-analyses-container');
    
    // Store the current analysis
    let currentAnalysis = null;
    
    // Event Listeners
    analyzeBtn.addEventListener('click', () => analyzeUrl(urlInput.value));
    analyzeHtmlBtn.addEventListener('click', () => analyzeHtml(htmlInput.value));
    
    // Popular sites buttons
    siteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            urlInput.value = btn.dataset.url;
            analyzeUrl(urlInput.value);
        });
    });
    
    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Copy raw tags
    copyRawTagsBtn.addEventListener('click', () => {
        copyToClipboard(rawTagsContent.textContent);
    });
    
    // Download report
    downloadReportBtn.addEventListener('click', downloadAnalysisReport);
    
    // Save analysis
    saveAnalysisBtn.addEventListener('click', saveCurrentAnalysis);
    
    // Load saved analyses on startup
    loadSavedAnalyses();
    
    // Enter key in URL input
    urlInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            analyzeUrl(urlInput.value);
        }
    });
    
    /**
     * Analyze a URL for meta tags and SEO information
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
                "PRIVACY NOTICE: This tool will use a server-side proxy to fetch the webpage you entered. " +
                "The URL and its content will be temporarily processed on our server. " +
                "We don't store any data from analyzed websites.\n\n" +
                "Click OK to continue or Cancel to use manual HTML input instead."
            );
            
            if (!shouldContinue) {
                // User canceled, switch to HTML input tab
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                const htmlInputTab = document.querySelector('[data-tab="html-input"]');
                htmlInputTab.classList.add('active');
                document.getElementById('html-input-tab').classList.add('active');
                
                hideLoading();
                return;
            }
            
            // Use the server-side proxy
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Server error: ${errorData.details || response.status}`);
            }
            
            const html = await response.text();
            analyzeHtml(html, url);
        } catch (error) {
            showError(`Could not fetch URL: ${error.message}. Try pasting the HTML directly instead.`);
            hideLoading();
        }
    }
    
    /**
     * Show a message box
     */
    function showMessage(message) {
        resultsPlaceholder.classList.add('hidden');
        analysisResults.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        errorDetails.innerHTML = message;
        
        // Add event listeners to buttons in the error message (if they exist)
        const htmlInputTabBtn = document.getElementById('html-input-tab-btn');
        const serverSideInfoBtn = document.getElementById('server-side-info-btn');
        
        if (htmlInputTabBtn) {
            htmlInputTabBtn.addEventListener('click', () => {
                // Switch to HTML input tab
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                const htmlInputTab = document.querySelector('[data-tab="html-input"]');
                htmlInputTab.classList.add('active');
                document.getElementById('html-input-tab').classList.add('active');
            });
        }
        
        if (serverSideInfoBtn) {
            serverSideInfoBtn.addEventListener('click', () => {
                // Show info about server-side solution
                showMessage(`<strong>About CORS and Server-Side Solutions</strong>
                <p>Cross-Origin Resource Sharing (CORS) is a security feature implemented by browsers that prevents a webpage from making requests to a different domain than the one that served the page.</p>
                
                <p>For this tool to directly analyze external websites, you would need a server-side solution such as:</p>
                
                <ol>
                    <li>A backend API that fetches the website content on your behalf</li>
                    <li>A proxy server that adds the necessary CORS headers</li>
                </ol>
                
                <p>Currently, this tool operates purely client-side, which is why we ask you to manually copy and paste HTML.</p>
                
                <button id="go-back-btn" class="btn">Go Back</button>`);
                
                // Add event listener to the go back button
                document.getElementById('go-back-btn').addEventListener('click', () => {
                    // Show the original CORS message
                    analyzeUrl(urlInput.value || 'https://example.com');
                });
            });
        }
    }
    
    /**
     * Analyze HTML content directly
     */
    function analyzeHtml(html, sourceUrl = '') {
        if (!html) {
            showError('Please enter HTML content to analyze');
            return;
        }
        
        showLoading();
        
        try {
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract all meta tags and analyze
            const metaTags = extractMetaTags(doc);
            const pageUrl = sourceUrl || 'HTML Input';
            const pageTitle = doc.title || 'Untitled Page';
            
            // Analyze meta tags
            const analysis = analyzeTags(doc, metaTags, pageUrl);
            
            // Update UI with results
            updateResultsUI(analysis, pageTitle, pageUrl, metaTags);
            
            // Show results
            hideLoading();
            showResults();
        } catch (error) {
            showError(`Error analyzing HTML: ${error.message}`);
            hideLoading();
        }
    }
    
    /**
     * Extract all meta tags from a document
     */
    function extractMetaTags(doc) {
        const result = {
            title: doc.title || '',
            meta: {},
            link: {},
            script: []
        };
        
        // Extract all meta tags
        const metaTags = doc.querySelectorAll('meta');
        metaTags.forEach(tag => {
            // Handle different types of meta tags (name, property, http-equiv)
            if (tag.hasAttribute('name')) {
                result.meta[tag.getAttribute('name')] = tag.getAttribute('content');
            } else if (tag.hasAttribute('property')) {
                result.meta[tag.getAttribute('property')] = tag.getAttribute('content');
            } else if (tag.hasAttribute('http-equiv')) {
                result.meta[tag.getAttribute('http-equiv')] = tag.getAttribute('content');
            } else if (tag.hasAttribute('charset')) {
                result.meta['charset'] = tag.getAttribute('charset');
            }
        });
        
        // Extract link tags (canonical, favicon, etc.)
        const linkTags = doc.querySelectorAll('link');
        linkTags.forEach(tag => {
            const rel = tag.getAttribute('rel');
            if (rel) {
                if (!result.link[rel]) {
                    result.link[rel] = [];
                }
                result.link[rel].push({
                    href: tag.getAttribute('href'),
                    type: tag.getAttribute('type'),
                    sizes: tag.getAttribute('sizes')
                });
            }
        });
        
        // Extract structured data
        const scriptTags = doc.querySelectorAll('script[type="application/ld+json"]');
        scriptTags.forEach(tag => {
            try {
                result.script.push(JSON.parse(tag.textContent));
            } catch (e) {
                // Invalid JSON in script tag
                result.script.push({ error: 'Invalid JSON', content: tag.textContent });
            }
        });
        
        // Extract headings
        const headingCounts = {
            h1: doc.querySelectorAll('h1').length,
            h2: doc.querySelectorAll('h2').length,
            h3: doc.querySelectorAll('h3').length,
            h4: doc.querySelectorAll('h4').length,
            h5: doc.querySelectorAll('h5').length,
            h6: doc.querySelectorAll('h6').length
        };
        result.headings = headingCounts;
        
        // Extract language
        result.language = doc.documentElement.getAttribute('lang') || 'Not specified';
        
        return result;
    }
    
    /**
     * Analyze meta tags and calculate SEO score
     */
    function analyzeTags(doc, metaTags, pageUrl) {
        const analysis = {
            score: 0,
            issues: [],
            llmsLink: null,
            title: {
                value: metaTags.title,
                status: 'warning',
                info: '',
                recommendation: ''
            },
            metaDesc: {
                value: metaTags.meta.description || '',
                status: 'warning',
                info: '',
                recommendation: ''
            },
            metaKeywords: {
                value: metaTags.meta.keywords || '',
                status: 'info',
                info: '',
                recommendation: ''
            },
            canonical: {
                value: metaTags.link.canonical ? metaTags.link.canonical[0].href : '',
                status: 'warning',
                info: '',
                recommendation: ''
            },
            robots: {
                value: metaTags.meta.robots || '',
                status: 'info',
                info: '',
                recommendation: ''
            },
            viewport: {
                value: metaTags.meta.viewport || '',
                status: 'warning',
                info: '',
                recommendation: ''
            },
            ogTitle: {
                value: metaTags.meta['og:title'] || '',
                status: 'warning',
                info: ''
            },
            ogDesc: {
                value: metaTags.meta['og:description'] || '',
                status: 'warning',
                info: ''
            },
            ogImage: {
                value: metaTags.meta['og:image'] || '',
                status: 'warning',
                info: ''
            },
            ogUrl: {
                value: metaTags.meta['og:url'] || '',
                status: 'warning',
                info: ''
            },
            ogType: {
                value: metaTags.meta['og:type'] || '',
                status: 'info',
                info: ''
            },
            twitterCard: {
                value: metaTags.meta['twitter:card'] || '',
                status: 'warning',
                info: ''
            },
            twitterTitle: {
                value: metaTags.meta['twitter:title'] || '',
                status: 'warning',
                info: ''
            },
            twitterDesc: {
                value: metaTags.meta['twitter:description'] || '',
                status: 'warning',
                info: ''
            },
            twitterImage: {
                value: metaTags.meta['twitter:image'] || '',
                status: 'warning',
                info: ''
            },
            charset: {
                value: metaTags.meta.charset || metaTags.meta['Content-Type'] || '',
                status: 'warning',
                info: ''
            },
            language: {
                value: metaTags.language,
                status: 'info',
                info: ''
            },
            favicon: {
                value: '',
                status: 'warning',
                info: ''
            },
            structuredData: {
                value: metaTags.script.length > 0 ? 'Present' : 'Not found',
                status: metaTags.script.length > 0 ? 'good' : 'warning',
                info: ''
            },
            headings: {
                value: formatHeadings(metaTags.headings),
                status: 'info',
                info: ''
            }
        };
        
        // Calculate score and generate recommendations
        let scorePoints = 0;
        let maxPoints = 0;
        
        // Title analysis
        maxPoints += 10;
        if (analysis.title.value) {
            const titleLength = analysis.title.value.length;
            
            if (titleLength > 0 && titleLength <= 60) {
                analysis.title.status = 'good';
                analysis.title.info = `Good length (${titleLength} characters). Ideal title length is 50-60 characters.`;
                scorePoints += 10;
            } else if (titleLength > 60 && titleLength <= 70) {
                analysis.title.status = 'warning';
                analysis.title.info = `Slightly long (${titleLength} characters). Consider shortening to 50-60 characters for optimal display in search results.`;
                analysis.title.recommendation = 'Shorten your title to 50-60 characters while keeping your primary keyword near the beginning.';
                scorePoints += 6;
                analysis.issues.push('Title is slightly too long');
            } else if (titleLength > 70) {
                analysis.title.status = 'error';
                analysis.title.info = `Too long (${titleLength} characters). Search engines typically display only the first 50-60 characters.`;
                analysis.title.recommendation = 'Significantly shorten your title to 50-60 characters while keeping your primary keyword near the beginning.';
                scorePoints += 3;
                analysis.issues.push('Title is too long');
            } else if (titleLength < 20 && titleLength > 0) {
                analysis.title.status = 'warning';
                analysis.title.info = `Too short (${titleLength} characters). Consider adding more descriptive content.`;
                analysis.title.recommendation = 'Expand your title to 50-60 characters, including your primary keyword and a compelling description.';
                scorePoints += 5;
                analysis.issues.push('Title is too short');
            }
        } else {
            analysis.title.status = 'error';
            analysis.title.info = 'Missing title tag. A descriptive title is essential for SEO.';
            analysis.title.recommendation = 'Add a title tag that includes your primary keyword and describes the page content accurately.';
            analysis.issues.push('Title tag is missing');
        }
        
        // Meta description analysis
        maxPoints += 10;
        if (analysis.metaDesc.value) {
            const descLength = analysis.metaDesc.value.length;
            
            if (descLength >= 120 && descLength <= 160) {
                analysis.metaDesc.status = 'good';
                analysis.metaDesc.info = `Good length (${descLength} characters). Ideal description length is 120-160 characters.`;
                scorePoints += 10;
            } else if ((descLength >= 100 && descLength < 120) || (descLength > 160 && descLength <= 180)) {
                analysis.metaDesc.status = 'warning';
                analysis.metaDesc.info = `Suboptimal length (${descLength} characters). Consider adjusting to 120-160 characters.`;
                analysis.metaDesc.recommendation = 'Adjust your meta description to be between 120-160 characters for optimal display in search results.';
                scorePoints += 7;
                analysis.issues.push('Meta description length is not optimal');
            } else if (descLength > 180) {
                analysis.metaDesc.status = 'error';
                analysis.metaDesc.info = `Too long (${descLength} characters). Search engines typically truncate descriptions after 155-160 characters.`;
                analysis.metaDesc.recommendation = 'Shorten your meta description to 120-160 characters while maintaining a clear call-to-action.';
                scorePoints += 4;
                analysis.issues.push('Meta description is too long');
            } else {
                analysis.metaDesc.status = 'warning';
                analysis.metaDesc.info = `Too short (${descLength} characters). Consider adding more descriptive content.`;
                analysis.metaDesc.recommendation = 'Expand your meta description to 120-160 characters, including your primary keyword and a call-to-action.';
                scorePoints += 4;
                analysis.issues.push('Meta description is too short');
            }
        } else {
            analysis.metaDesc.status = 'error';
            analysis.metaDesc.info = 'Missing meta description. A compelling description can improve click-through rates from search results.';
            analysis.metaDesc.recommendation = 'Add a meta description that summarizes the page content in 120-160 characters and includes a call-to-action.';
            analysis.issues.push('Meta description is missing');
        }
        
        // Meta keywords analysis
        // Note: Not as important for modern SEO, but still worth checking
        maxPoints += 5;
        if (analysis.metaKeywords.value) {
            const keywordCount = analysis.metaKeywords.value.split(',').filter(k => k.trim().length > 0).length;
            
            if (keywordCount > 0 && keywordCount <= 10) {
                analysis.metaKeywords.status = 'good';
                analysis.metaKeywords.info = `Found ${keywordCount} keywords. Although not as important for modern SEO, they can still provide context.`;
                scorePoints += 5;
            } else if (keywordCount > 10) {
                analysis.metaKeywords.status = 'warning';
                analysis.metaKeywords.info = `Found ${keywordCount} keywords. Consider reducing to focus on your most important keywords.`;
                analysis.metaKeywords.recommendation = 'While meta keywords have limited impact on modern SEO, it\'s still good practice to keep them focused (5-7 keywords max).';
                scorePoints += 3;
            }
        } else {
            analysis.metaKeywords.status = 'info';
            analysis.metaKeywords.info = 'No meta keywords found. While not critical for modern SEO, some search engines still consider them.';
            analysis.metaKeywords.recommendation = 'Consider adding meta keywords that reflect your most important topics, though they have limited impact on modern SEO.';
            scorePoints += 3; // Not penalized heavily since meta keywords are less important now
        }
        
        // Canonical URL analysis
        maxPoints += 10;
        if (analysis.canonical.value) {
            analysis.canonical.status = 'good';
            analysis.canonical.info = 'Canonical URL is properly specified.';
            
            // Check if canonical URL matches the current URL or is different (suggesting duplicate content)
            if (pageUrl !== 'HTML Input' && !urlsMatch(analysis.canonical.value, pageUrl)) {
                analysis.canonical.status = 'warning';
                analysis.canonical.info = 'Canonical URL differs from the current URL, which suggests this page may be a duplicate.';
                analysis.canonical.recommendation = 'If this is intentional (to handle duplicate content), this is correct. Otherwise, update the canonical URL to match the current page URL.';
                scorePoints += 7;
                analysis.issues.push('Canonical URL does not match page URL');
            } else {
                scorePoints += 10;
            }
        } else {
            analysis.canonical.status = 'warning';
            analysis.canonical.info = 'No canonical URL specified. This can lead to duplicate content issues if this page has multiple URLs.';
            analysis.canonical.recommendation = 'Add a canonical tag to indicate the preferred version of this page, especially if it can be accessed via multiple URLs.';
            scorePoints += 5;
            analysis.issues.push('Canonical URL is missing');
        }
        
        // Robots meta tag analysis
        maxPoints += 5;
        if (analysis.robots.value) {
            // Check for noindex directive
            if (analysis.robots.value.toLowerCase().includes('noindex')) {
                analysis.robots.status = 'warning';
                analysis.robots.info = 'Page has a "noindex" directive, which prevents search engines from indexing it.';
                analysis.robots.recommendation = 'If you want this page to appear in search results, remove the "noindex" directive from the robots meta tag.';
                scorePoints += 2;
                analysis.issues.push('Page has noindex directive');
            } else {
                analysis.robots.status = 'good';
                analysis.robots.info = 'Robots meta tag is present and allows indexing.';
                scorePoints += 5;
            }
        } else {
            analysis.robots.status = 'info';
            analysis.robots.info = 'No robots meta tag found. The default behavior allows indexing and following links.';
            analysis.robots.recommendation = 'While not required, you can add a robots meta tag to explicitly control how search engines interact with your page.';
            scorePoints += 5; // Not penalized since default behavior is acceptable
        }
        
        // Viewport meta tag analysis
        maxPoints += 10;
        if (analysis.viewport.value) {
            // Check for responsive viewport
            if (analysis.viewport.value.includes('width=device-width')) {
                analysis.viewport.status = 'good';
                analysis.viewport.info = 'Responsive viewport meta tag is present, which is good for mobile optimization.';
                scorePoints += 10;
            } else {
                analysis.viewport.status = 'warning';
                analysis.viewport.info = 'Viewport meta tag is present but may not be properly configured for responsive design.';
                analysis.viewport.recommendation = 'Update your viewport meta tag to include "width=device-width, initial-scale=1" for proper mobile optimization.';
                scorePoints += 5;
                analysis.issues.push('Viewport meta tag may not be properly configured');
            }
        } else {
            analysis.viewport.status = 'error';
            analysis.viewport.info = 'No viewport meta tag found. This is important for mobile optimization.';
            analysis.viewport.recommendation = 'Add a viewport meta tag with content="width=device-width, initial-scale=1" for proper mobile optimization.';
            analysis.issues.push('Viewport meta tag is missing');
        }
        
        // Open Graph tags analysis
        maxPoints += 10;
        let ogScore = 0;
        // og:title
        if (analysis.ogTitle.value) {
            analysis.ogTitle.status = 'good';
            analysis.ogTitle.info = 'Open Graph title is present for social sharing.';
            ogScore += 2;
        } else {
            analysis.ogTitle.status = 'warning';
            analysis.ogTitle.info = 'No Open Graph title found. This affects how your content appears when shared on social media.';
            analysis.issues.push('Open Graph title is missing');
        }
        
        // og:description
        if (analysis.ogDesc.value) {
            analysis.ogDesc.status = 'good';
            analysis.ogDesc.info = 'Open Graph description is present for social sharing.';
            ogScore += 2;
        } else {
            analysis.ogDesc.status = 'warning';
            analysis.ogDesc.info = 'No Open Graph description found. This affects how your content appears when shared on social media.';
            analysis.issues.push('Open Graph description is missing');
        }
        
        // og:image
        if (analysis.ogImage.value) {
            analysis.ogImage.status = 'good';
            analysis.ogImage.info = 'Open Graph image is present for social sharing.';
            ogScore += 3;
        } else {
            analysis.ogImage.status = 'warning';
            analysis.ogImage.info = 'No Open Graph image found. Images can significantly improve engagement when content is shared on social media.';
            analysis.issues.push('Open Graph image is missing');
        }
        
        // og:url
        if (analysis.ogUrl.value) {
            analysis.ogUrl.status = 'good';
            analysis.ogUrl.info = 'Open Graph URL is present for social sharing.';
            ogScore += 2;
        } else {
            analysis.ogUrl.status = 'warning';
            analysis.ogUrl.info = 'No Open Graph URL found. This helps ensure the correct URL is shared on social media.';
            analysis.issues.push('Open Graph URL is missing');
        }
        
        // og:type
        if (analysis.ogType.value) {
            analysis.ogType.status = 'good';
            analysis.ogType.info = `Open Graph type is set to "${analysis.ogType.value}".`;
            ogScore += 1;
        } else {
            analysis.ogType.status = 'info';
            analysis.ogType.info = 'No Open Graph type found. This helps social platforms understand what kind of content is being shared.';
        }
        
        // Calculate overall OG score
        scorePoints += Math.round((ogScore / 10) * 10);
        
        // Twitter Card tags analysis
        maxPoints += 10;
        let twitterScore = 0;
        // twitter:card
        if (analysis.twitterCard.value) {
            analysis.twitterCard.status = 'good';
            analysis.twitterCard.info = `Twitter card type is set to "${analysis.twitterCard.value}".`;
            twitterScore += 3;
        } else {
            analysis.twitterCard.status = 'warning';
            analysis.twitterCard.info = 'No Twitter card type found. This affects how your content appears when shared on Twitter.';
            analysis.issues.push('Twitter card type is missing');
        }
        
        // twitter:title
        if (analysis.twitterTitle.value) {
            analysis.twitterTitle.status = 'good';
            analysis.twitterTitle.info = 'Twitter title is present for social sharing.';
            twitterScore += 2;
        } else if (analysis.ogTitle.value) {
            analysis.twitterTitle.status = 'info';
            analysis.twitterTitle.info = 'No specific Twitter title found, but Open Graph title will be used as fallback.';
            analysis.twitterTitle.value = analysis.ogTitle.value + ' (from og:title)';
            twitterScore += 1;
        } else {
            analysis.twitterTitle.status = 'warning';
            analysis.twitterTitle.info = 'No Twitter title or Open Graph title found. This affects how your content appears when shared on Twitter.';
            analysis.issues.push('Twitter title is missing');
        }
        
        // twitter:description
        if (analysis.twitterDesc.value) {
            analysis.twitterDesc.status = 'good';
            analysis.twitterDesc.info = 'Twitter description is present for social sharing.';
            twitterScore += 2;
        } else if (analysis.ogDesc.value) {
            analysis.twitterDesc.status = 'info';
            analysis.twitterDesc.info = 'No specific Twitter description found, but Open Graph description will be used as fallback.';
            analysis.twitterDesc.value = analysis.ogDesc.value + ' (from og:description)';
            twitterScore += 1;
        } else {
            analysis.twitterDesc.status = 'warning';
            analysis.twitterDesc.info = 'No Twitter description or Open Graph description found. This affects how your content appears when shared on Twitter.';
            analysis.issues.push('Twitter description is missing');
        }
        
        // twitter:image
        if (analysis.twitterImage.value) {
            analysis.twitterImage.status = 'good';
            analysis.twitterImage.info = 'Twitter image is present for social sharing.';
            twitterScore += 3;
        } else if (analysis.ogImage.value) {
            analysis.twitterImage.status = 'info';
            analysis.twitterImage.info = 'No specific Twitter image found, but Open Graph image will be used as fallback.';
            analysis.twitterImage.value = analysis.ogImage.value + ' (from og:image)';
            twitterScore += 2;
        } else {
            analysis.twitterImage.status = 'warning';
            analysis.twitterImage.info = 'No Twitter image or Open Graph image found. Images can significantly improve engagement when content is shared on Twitter.';
            analysis.issues.push('Twitter image is missing');
        }
        
        // Calculate overall Twitter score
        scorePoints += Math.round((twitterScore / 10) * 10);
        
        // Charset analysis
        maxPoints += 5;
        if (analysis.charset.value) {
            analysis.charset.status = 'good';
            analysis.charset.info = `Character encoding is specified as "${analysis.charset.value}".`;
            scorePoints += 5;
        } else {
            analysis.charset.status = 'warning';
            analysis.charset.info = 'No character encoding specified. This can lead to incorrect rendering of special characters.';
            analysis.issues.push('Character encoding not specified');
        }
        
        // Language analysis
        maxPoints += 5;
        if (analysis.language.value && analysis.language.value !== 'Not specified') {
            analysis.language.status = 'good';
            analysis.language.info = `Page language is specified as "${analysis.language.value}".`;
            scorePoints += 5;
        } else {
            analysis.language.status = 'warning';
            analysis.language.info = 'No language specified. This can impact accessibility and search engine understanding.';
            analysis.issues.push('Page language not specified');
        }
        
        // Favicon analysis
        maxPoints += 5;
        if (metaTags.link.icon || metaTags.link['shortcut icon'] || metaTags.link.apple) {
            analysis.favicon.status = 'good';
            let favicons = [];
            
            if (metaTags.link.icon) {
                favicons = favicons.concat(metaTags.link.icon.map(icon => icon.href));
            }
            
            if (metaTags.link['shortcut icon']) {
                favicons = favicons.concat(metaTags.link['shortcut icon'].map(icon => icon.href));
            }
            
            if (metaTags.link.apple) {
                favicons = favicons.concat(metaTags.link.apple.map(icon => icon.href));
            }
            
            analysis.favicon.value = favicons.join(', ');
            analysis.favicon.info = `Found ${favicons.length} favicon(s).`;
            scorePoints += 5;
        } else {
            analysis.favicon.status = 'warning';
            analysis.favicon.info = 'No favicon found. Favicons help with brand recognition and enhance user experience.';
            analysis.issues.push('Favicon is missing');
        }
        
        // Headings analysis
        maxPoints += 5;
        const h1Count = metaTags.headings.h1;
        if (h1Count === 1) {
            analysis.headings.status = 'good';
            analysis.headings.info = 'Page has a single H1 heading, which is ideal for SEO.';
            scorePoints += 5;
        } else if (h1Count === 0) {
            analysis.headings.status = 'error';
            analysis.headings.info = 'No H1 heading found. H1 is important for indicating the primary topic of the page.';
            analysis.issues.push('H1 heading is missing');
        } else {
            analysis.headings.status = 'warning';
            analysis.headings.info = `Found ${h1Count} H1 headings. It's generally best to have only one H1 per page.`;
            analysis.issues.push('Multiple H1 headings found');
            scorePoints += 2;
        }
        
        // Calculate final score
        analysis.score = Math.round((scorePoints / maxPoints) * 100);
        
        // Generate score message
        if (analysis.score >= 90) {
            analysis.scoreMessage = 'Excellent! Your page has very good SEO implementation.';
        } else if (analysis.score >= 70) {
            analysis.scoreMessage = 'Good job! Your page has decent SEO implementation with some room for improvement.';
        } else if (analysis.score >= 50) {
            analysis.scoreMessage = 'Needs improvement. Your page has several SEO issues that should be addressed.';
        } else {
            analysis.scoreMessage = 'Poor SEO implementation. Your page has significant SEO issues that need immediate attention.';
        }
        
        return analysis;
    }
    
    /**
     * Update the UI with analysis results
     */
    function updateResultsUI(analysis, pageTitle, pageUrl, metaTags) {
        // Store the current analysis for use in other functions
        currentAnalysis = analysis;
        
        // Set site info
        siteTitle.textContent = pageTitle;
        siteUrl.textContent = pageUrl;
        
        // Check for AI Readiness (llms.txt) if this is a URL analysis, not direct HTML input
        if (pageUrl !== 'HTML Input') {
            checkAIReadiness(pageUrl);
        }
        
        // Set score
        scoreValue.textContent = analysis.score;
        scoreMessage.textContent = analysis.scoreMessage;
        
        // Update score circle visualization
        scoreCircleValue.style.strokeDasharray = `${analysis.score}, 100`;
        
        // Set color based on score
        if (analysis.score >= 90) {
            scoreCircleValue.style.stroke = '#2ecc71'; // Green
        } else if (analysis.score >= 70) {
            scoreCircleValue.style.stroke = '#3498db'; // Blue
        } else if (analysis.score >= 50) {
            scoreCircleValue.style.stroke = '#f39c12'; // Orange
        } else {
            scoreCircleValue.style.stroke = '#e74c3c'; // Red
        }
        
        // Set issues list
        if (analysis.issues.length > 0) {
            scoreIssues.innerHTML = 'Issues found: ' + analysis.issues.map(issue => `<li>${issue}</li>`).join('');
        } else {
            scoreIssues.textContent = 'No major issues found.';
        }
        
        // Basic SEO Tags
        setTagUI(titleTagValue, titleTagInfo, titleTagStatus, titleTagRec, analysis.title);
        setTagUI(metaDescValue, metaDescInfo, metaDescStatus, metaDescRec, analysis.metaDesc);
        setTagUI(metaKeywordsValue, metaKeywordsInfo, metaKeywordsStatus, metaKeywordsRec, analysis.metaKeywords);
        setTagUI(canonicalValue, canonicalInfo, canonicalStatus, canonicalRec, analysis.canonical);
        setTagUI(robotsValue, robotsInfo, robotsStatus, robotsRec, analysis.robots);
        setTagUI(viewportValue, viewportInfo, viewportStatus, viewportRec, analysis.viewport);
        
        // Social Media Tags
        setTagUI(ogTitleValue, ogTitleInfo, ogTitleStatus, null, analysis.ogTitle);
        setTagUI(ogDescValue, ogDescInfo, ogDescStatus, null, analysis.ogDesc);
        setTagUI(ogImageValue, ogImageInfo, ogImageStatus, null, analysis.ogImage);
        setTagUI(ogUrlValue, ogUrlInfo, ogUrlStatus, null, analysis.ogUrl);
        setTagUI(ogTypeValue, ogTypeInfo, ogTypeStatus, null, analysis.ogType);
        
        setTagUI(twitterCardValue, twitterCardInfo, twitterCardStatus, null, analysis.twitterCard);
        setTagUI(twitterTitleValue, twitterTitleInfo, twitterTitleStatus, null, analysis.twitterTitle);
        setTagUI(twitterDescValue, twitterDescInfo, twitterDescStatus, null, analysis.twitterDesc);
        setTagUI(twitterImageValue, twitterImageInfo, twitterImageStatus, null, analysis.twitterImage);
        
        // Advanced Tags
        setTagUI(charsetValue, charsetInfo, charsetStatus, null, analysis.charset);
        setTagUI(languageValue, languageInfo, languageStatus, null, analysis.language);
        setTagUI(faviconValue, faviconInfo, faviconStatus, null, analysis.favicon);
        setTagUI(structuredDataValue, structuredDataInfo, structuredDataStatus, null, analysis.structuredData);
        setTagUI(headingsValue, headingsInfo, headingsStatus, null, analysis.headings);
        
        // Set image previews if available
        if (analysis.ogImage.value) {
            ogImagePreview.innerHTML = `<img src="${analysis.ogImage.value}" alt="Open Graph image preview">`;
        } else {
            ogImagePreview.innerHTML = '';
        }
        
        if (analysis.twitterImage.value && !analysis.twitterImage.value.includes('from og:image')) {
            twitterImagePreview.innerHTML = `<img src="${analysis.twitterImage.value}" alt="Twitter image preview">`;
        } else if (analysis.twitterImage.value && analysis.twitterImage.value.includes('from og:image')) {
            const imgSrc = analysis.twitterImage.value.split(' (from og:image)')[0];
            twitterImagePreview.innerHTML = `<img src="${imgSrc}" alt="Twitter image preview (from og:image)">`;
        } else {
            twitterImagePreview.innerHTML = '';
        }
        
        // Set favicon previews
        if (analysis.favicon.value) {
            const faviconUrls = analysis.favicon.value.split(', ');
            const faviconHTML = faviconUrls.map(url => `<img src="${url}" alt="Favicon">`).join('');
            faviconPreview.innerHTML = faviconHTML;
        } else {
            faviconPreview.innerHTML = '';
        }
        
        // Set raw meta tags
        rawTagsContent.textContent = formatRawTags(metaTags);
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
     * Format headings count for display
     */
    function formatHeadings(headings) {
        return `H1: ${headings.h1}, H2: ${headings.h2}, H3: ${headings.h3}, H4: ${headings.h4}, H5: ${headings.h5}, H6: ${headings.h6}`;
    }
    
    /**
     * Format meta tags object into a readable string
     */
    function formatRawTags(metaTags) {
        let result = '';
        
        // Title
        result += `<title>${metaTags.title}</title>\n\n`;
        
        // Meta tags
        result += '<!-- Meta Tags -->\n';
        for (const [name, content] of Object.entries(metaTags.meta)) {
            result += `<meta name="${name}" content="${content}">\n`;
        }
        
        // Link tags
        result += '\n<!-- Link Tags -->\n';
        for (const [rel, links] of Object.entries(metaTags.link)) {
            links.forEach(link => {
                let attrs = `rel="${rel}" href="${link.href}"`;
                if (link.type) attrs += ` type="${link.type}"`;
                if (link.sizes) attrs += ` sizes="${link.sizes}"`;
                result += `<link ${attrs}>\n`;
            });
        }
        
        // Structured data
        result += '\n<!-- Structured Data -->\n';
        metaTags.script.forEach((script, index) => {
            result += `<script type="application/ld+json">\n${JSON.stringify(script, null, 2)}\n</script>\n`;
        });
        
        return result;
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
    
    /**
     * Check AI Readiness (llms.txt existence and AI guidance links)
     */
    async function checkAIReadiness(pageUrl) {
        try {
            const llmsTxtUrl = new URL('/llms.txt', pageUrl).href;
            
            // Check for AI guidance link in the document's head
            const linkTags = document.getElementsByTagName('link');
            let aiGuidanceFound = null;
            
            for (const link of linkTags) {
                if (link.getAttribute('rel') === 'ai-guidance') {
                    aiGuidanceFound = link.getAttribute('href');
                    break;
                }
            }
            
            currentAnalysis.llmsLink = aiGuidanceFound;
            
            // Set AI guidance link check UI
            setTagUI(
                document.getElementById('ai-guidance-value'),
                document.getElementById('ai-guidance-info'),
                document.getElementById('ai-guidance-status'),
                document.getElementById('ai-guidance-rec'),
                {
                    value: aiGuidanceFound || 'Not found',
                    status: aiGuidanceFound ? 'good' : 'warning',
                    info: aiGuidanceFound 
                        ? 'AI guidance link found in your HTML head section. This helps AI systems find your llms.txt file.' 
                        : 'No AI guidance link found. Adding a link element pointing to your llms.txt helps AI systems discover it.',
                    recommendation: aiGuidanceFound ? '' : 'Add the following to your HTML head section: <link rel="ai-guidance" href="/llms.txt" type="text/plain">'
                }
            );
            
            // Try to fetch llms.txt
            try {
                // Create a server-side proxy request to check the llms.txt file
                const response = await fetch(`/api/proxy?url=${encodeURIComponent(llmsTxtUrl)}`);
                
                if (response.ok) {
                    const llmsTxtContent = await response.text();
                    analyzeLLMSTxt(llmsTxtContent, llmsTxtUrl);
                } else {
                    // llms.txt not found
                    setTagUI(
                        document.getElementById('llms-txt-value'),
                        document.getElementById('llms-txt-info'),
                        document.getElementById('llms-txt-status'),
                        document.getElementById('llms-txt-rec'),
                        {
                            value: 'Not found',
                            status: 'warning',
                            info: 'No llms.txt file found at ' + llmsTxtUrl,
                            recommendation: 'Create a llms.txt file at your domain root to provide guidance to AI systems about your site. Visit llmstxt.org for more information.'
                        }
                    );
                    
                    // Clear content analysis
                    setTagUI(
                        document.getElementById('llms-content-value'),
                        document.getElementById('llms-content-info'),
                        document.getElementById('llms-content-status'),
                        document.getElementById('llms-content-rec'),
                        {
                            value: 'N/A',
                            status: 'warning',
                            info: 'No llms.txt file to analyze',
                            recommendation: 'Create a llms.txt file with site information, preferred behavior, and AI crawling preferences.'
                        }
                    );
                }
            } catch (error) {
                // Error checking llms.txt
                setTagUI(
                    document.getElementById('llms-txt-value'),
                    document.getElementById('llms-txt-info'),
                    document.getElementById('llms-txt-status'),
                    document.getElementById('llms-txt-rec'),
                    {
                        value: 'Error checking',
                        status: 'error',
                        info: 'Error checking for llms.txt: ' + error.message,
                        recommendation: 'Check if llms.txt exists at your domain root and is accessible.'
                    }
                );
            }
        } catch (error) {
            console.error('Error in AI readiness check:', error);
        }
    }
    
    /**
     * Get the llms.txt link from meta tags
     */
    function getLLMSLinkFromMetaTags() {
        // Need to extract this from the document being analyzed, not the current document
        const linkElements = document.querySelectorAll('link[rel="ai-guidance"]');
        if (linkElements.length > 0) {
            return linkElements[0].getAttribute('href');
        }
        
        // Also check the analyzed document's link tags
        const linkTags = currentAnalysis?.canonical?.value || '';
        if (linkTags.includes('ai-guidance')) {
            return linkTags;
        }
        
        return null;
    }
    
    /**
     * Analyze llms.txt content
     */
    function analyzeLLMSTxt(content, url) {
        // Set llms.txt found status
        setTagUI(
            document.getElementById('llms-txt-value'),
            document.getElementById('llms-txt-info'),
            document.getElementById('llms-txt-status'),
            document.getElementById('llms-txt-rec'),
            {
                value: url,
                status: 'good',
                info: 'llms.txt file found at ' + url,
                recommendation: ''
            }
        );
        
        // Check required sections
        const sections = {
            'site information': content.toLowerCase().includes('# site information') || 
                               content.toLowerCase().includes('name:') || 
                               content.toLowerCase().includes('description:'),
                               
            'preferred behavior': content.toLowerCase().includes('# preferred behavior') || 
                                 content.toLowerCase().includes('preferred-') || 
                                 content.toLowerCase().includes('tone:'),
                                 
            'contact': content.toLowerCase().includes('# contact') || 
                      content.toLowerCase().includes('contact:'),
                      
            'crawling preferences': content.toLowerCase().includes('# crawling') || 
                                   content.toLowerCase().includes('allow-ai-') || 
                                   content.toLowerCase().includes('do-not-index')
        };
        
        // Count valid sections
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
            info = `llms.txt contains ${validSections} of ${totalSections} recommended sections. Missing: ${Object.keys(sections).filter(key => !sections[key]).join(', ')}.`;
            recommendation = 'Add the missing sections to provide more complete guidance to AI systems.';
        } else {
            status = 'error';
            info = `llms.txt is missing most recommended sections. Only found ${validSections} of ${totalSections}.`;
            recommendation = 'Enhance your llms.txt by adding Site Information, Preferred Behavior, Contact, and Crawling Preferences sections. See llmstxt.org for formatting guidelines.';
        }
        
        // Set content analysis status
        setTagUI(
            document.getElementById('llms-content-value'),
            document.getElementById('llms-content-info'),
            document.getElementById('llms-content-status'),
            document.getElementById('llms-content-rec'),
            {
                value: `${validSections}/${totalSections} sections found`,
                status: status,
                info: info,
                recommendation: recommendation
            }
        );
    }
    
    /**
     * Compare if two URLs match (ignoring protocol and trailing slash)
     */
    function urlsMatch(url1, url2) {
        // Normalize URLs by removing protocol and trailing slashes
        const normalize = (url) => {
            return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        };
        
        return normalize(url1) === normalize(url2);
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
     * Download analysis report as HTML
     */
    function downloadAnalysisReport() {
        // Check if there's a current analysis
        if (!currentAnalysis) {
            showToast('No analysis available to download', 'error');
            return;
        }
        
        const title = siteTitle.textContent;
        const url = siteUrl.textContent;
        const score = scoreValue.textContent;
        const date = new Date().toLocaleString();
        
        // Create HTML report
        const reportHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SEO Analysis Report - ${title}</title>
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
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>SEO Analysis Report</h1>
                    <p>URL: <a href="${url}" target="_blank">${url}</a></p>
                    <p>Generated: ${date}</p>
                </div>
                <div class="score-badge">${score}%</div>
            </div>
            
            <h2>Overall Assessment</h2>
            <p>${scoreMessage.textContent}</p>
            
            <div class="issues">
                <h3>Issues Found</h3>
                <ul>
                    ${currentAnalysis.issues.length > 0 ? currentAnalysis.issues.map(issue => `<li>${issue}</li>`).join('') : '<li>No major issues found.</li>'}
                </ul>
            </div>
            
            <h2>Basic SEO Factors</h2>
            
            <div class="meta-tag-item">
                <h3>Title Tag <span class="status ${currentAnalysis.title.status}">${getStatusText(currentAnalysis.title.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.title.value || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.title.info}</div>
                ${currentAnalysis.title.recommendation ? `<div class="tag-recommendation">${currentAnalysis.title.recommendation}</div>` : ''}
            </div>
            
            <div class="meta-tag-item">
                <h3>Meta Description <span class="status ${currentAnalysis.metaDesc.status}">${getStatusText(currentAnalysis.metaDesc.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.metaDesc.value || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.metaDesc.info}</div>
                ${currentAnalysis.metaDesc.recommendation ? `<div class="tag-recommendation">${currentAnalysis.metaDesc.recommendation}</div>` : ''}
            </div>
            
            <div class="meta-tag-item">
                <h3>Canonical URL <span class="status ${currentAnalysis.canonical.status}">${getStatusText(currentAnalysis.canonical.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.canonical.value || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.canonical.info}</div>
                ${currentAnalysis.canonical.recommendation ? `<div class="tag-recommendation">${currentAnalysis.canonical.recommendation}</div>` : ''}
            </div>
            
            <div class="meta-tag-item">
                <h3>Viewport <span class="status ${currentAnalysis.viewport.status}">${getStatusText(currentAnalysis.viewport.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.viewport.value || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.viewport.info}</div>
                ${currentAnalysis.viewport.recommendation ? `<div class="tag-recommendation">${currentAnalysis.viewport.recommendation}</div>` : ''}
            </div>
            
            <h2>Social Media Optimization</h2>
            
            <div class="meta-tag-item">
                <h3>Open Graph Tags <span class="status ${currentAnalysis.ogTitle.status}">${getStatusText(currentAnalysis.ogTitle.status)}</span></h3>
                <p>Title: ${currentAnalysis.ogTitle.value || 'Not found'}</p>
                <p>Description: ${currentAnalysis.ogDesc.value || 'Not found'}</p>
                <p>Image: ${currentAnalysis.ogImage.value || 'Not found'}</p>
                <p>URL: ${currentAnalysis.ogUrl.value || 'Not found'}</p>
                <p>Type: ${currentAnalysis.ogType.value || 'Not found'}</p>
                <div class="tag-info">Open Graph tags are essential for proper display when content is shared on social media platforms like Facebook.</div>
            </div>
            
            <div class="meta-tag-item">
                <h3>Twitter Card Tags <span class="status ${currentAnalysis.twitterCard.status}">${getStatusText(currentAnalysis.twitterCard.status)}</span></h3>
                <p>Card Type: ${currentAnalysis.twitterCard.value || 'Not found'}</p>
                <p>Title: ${currentAnalysis.twitterTitle.value || 'Not found'}</p>
                <p>Description: ${currentAnalysis.twitterDesc.value || 'Not found'}</p>
                <p>Image: ${currentAnalysis.twitterImage.value || 'Not found'}</p>
                <div class="tag-info">Twitter Card tags help control how your content appears when shared on Twitter.</div>
            </div>
            
            <h2>Other Technical Factors</h2>
            
            <div class="meta-tag-item">
                <h3>Charset <span class="status ${currentAnalysis.charset.status}">${getStatusText(currentAnalysis.charset.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.charset.value || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.charset.info}</div>
            </div>
            
            <div class="meta-tag-item">
                <h3>Language <span class="status ${currentAnalysis.language.status}">${getStatusText(currentAnalysis.language.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.language.value || 'Not found'}</div>
                <div class="tag-info">${currentAnalysis.language.info}</div>
            </div>
            
            <div class="meta-tag-item">
                <h3>Heading Structure <span class="status ${currentAnalysis.headings.status}">${getStatusText(currentAnalysis.headings.status)}</span></h3>
                <div class="tag-value">${currentAnalysis.headings.value}</div>
                <div class="tag-info">${currentAnalysis.headings.info}</div>
            </div>
            
            <h2>AI Readiness</h2>
            
            <div class="meta-tag-item">
                <h3>llms.txt and AI Guidance</h3>
                <p>AI systems like ChatGPT and Claude can better understand and represent your website if you provide clear guidance.</p>
                <p>Check for a llms.txt file at your domain root and add a link tag to help AI systems discover it.</p>
                <p>Learn more at <a href="https://llmstxt.org" target="_blank">llmstxt.org</a></p>
            </div>
            
            <div class="footer">
                <p>Report generated by ToolNook.dev Meta Tag Analyzer</p>
                <p><a href="https://toolnook.dev/tools/meta-tag-analyzer/" target="_blank">https://toolnook.dev/tools/meta-tag-analyzer/</a></p>
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
            const urlObj = new URL(siteUrl.textContent);
            filename = urlObj.hostname.replace(/\./g, '-');
        }
        
        link.download = `seo-report-${filename}-${new Date().toISOString().slice(0, 10)}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    }
    
    /**
     * Save the current analysis to local storage
     */
    function saveCurrentAnalysis() {
        if (!analysisResults.classList.contains('hidden') && currentAnalysis) {
            const savedAnalyses = JSON.parse(localStorage.getItem('metaTagAnalyses') || '[]');
            
            const newAnalysis = {
                url: siteUrl.textContent,
                title: siteTitle.textContent,
                score: scoreValue.textContent,
                date: new Date().toISOString(),
                issues: currentAnalysis.issues
            };
            
            // Check if this URL is already saved
            const existingIndex = savedAnalyses.findIndex(item => item.url === newAnalysis.url);
            if (existingIndex !== -1) {
                // Update existing analysis
                savedAnalyses[existingIndex] = newAnalysis;
            } else {
                // Add new analysis
                savedAnalyses.push(newAnalysis);
            }
            
            // Save to localStorage
            localStorage.setItem('metaTagAnalyses', JSON.stringify(savedAnalyses));
            
            // Update the UI
            showToast('Analysis saved successfully');
            loadSavedAnalyses();
        }
    }
    
    /**
     * Load saved analyses from local storage
     */
    function loadSavedAnalyses() {
        const savedAnalyses = JSON.parse(localStorage.getItem('metaTagAnalyses') || '[]');
        
        if (savedAnalyses.length === 0) {
            savedAnalysesContainer.innerHTML = '<p class="placeholder">No saved analyses yet. Click "Save Analysis" after analyzing a website.</p>';
            return;
        }
        
        // Sort analyses by date (newest first)
        savedAnalyses.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Create grid of saved analyses
        const grid = document.createElement('div');
        grid.className = 'saved-analyses-grid';
        
        savedAnalyses.forEach(analysis => {
            const card = document.createElement('div');
            card.className = 'saved-analysis-card';
            
            const formattedDate = new Date(analysis.date).toLocaleDateString();
            
            card.innerHTML = `
                <div class="saved-analysis-url" title="${analysis.url}">${analysis.title || analysis.url}</div>
                <div class="saved-analysis-date">${formattedDate}</div>
                <div class="saved-analysis-score">Score: <span>${analysis.score}%</span></div>
                <div class="saved-analysis-actions">
                    <button class="btn btn-small load-analysis" data-url="${analysis.url}">Load</button>
                    <button class="btn btn-small btn-outline delete-analysis" data-url="${analysis.url}">Delete</button>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        // Clear and update container
        savedAnalysesContainer.innerHTML = '';
        savedAnalysesContainer.appendChild(grid);
        
        // Add event listeners
        document.querySelectorAll('.load-analysis').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                if (url !== 'HTML Input') {
                    urlInput.value = url;
                    analyzeUrl(url);
                }
            });
        });
        
        document.querySelectorAll('.delete-analysis').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                deleteSavedAnalysis(url);
            });
        });
    }
    
    /**
     * Delete a saved analysis
     */
    function deleteSavedAnalysis(url) {
        let savedAnalyses = JSON.parse(localStorage.getItem('metaTagAnalyses') || '[]');
        savedAnalyses = savedAnalyses.filter(analysis => analysis.url !== url);
        localStorage.setItem('metaTagAnalyses', JSON.stringify(savedAnalyses));
        
        showToast('Analysis deleted');
        loadSavedAnalyses();
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