/**
 * SEO Keyword Generator Tool
 * Client-side implementation that generates SEO keywords and content ideas
 * based on user input topics and preferences.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const topicInput = document.getElementById('topic-input');
    const generateBtn = document.getElementById('generate-btn');
    const topicBtns = document.querySelectorAll('.topic-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const copyKeywordsBtn = document.getElementById('copy-keywords');
    const copyQuestionsBtn = document.getElementById('copy-questions');
    const copyIdeasBtn = document.getElementById('copy-ideas');
    const copyClustersBtn = document.getElementById('copy-clusters');
    const exportCsvBtn = document.getElementById('export-csv');
    const saveKeywordsBtn = document.getElementById('save-keywords');
    const keywordsList = document.getElementById('keywords-list');
    const questionsList = document.getElementById('questions-list');
    const ideasList = document.getElementById('ideas-list');
    const clustersList = document.getElementById('clusters-list');
    const savedKeywordsContainer = document.getElementById('saved-keywords-container');
    
    // Counters
    const keywordsCount = document.getElementById('keywords-count');
    const questionsCount = document.getElementById('questions-count');
    const ideasCount = document.getElementById('ideas-count');
    const clustersCount = document.getElementById('clusters-count');
    
    // Checkboxes
    const informationalCheck = document.getElementById('intent-informational');
    const commercialCheck = document.getElementById('intent-commercial');
    const transactionalCheck = document.getElementById('intent-transactional');
    const questionsCheck = document.getElementById('include-questions');
    const longTailCheck = document.getElementById('long-tail');
    const locationCheck = document.getElementById('include-location');
    
    // Data storage object
    let keywordData = {
        keywords: [],
        questions: [],
        ideas: [],
        clusters: []
    };
    
    // Event Listeners
    generateBtn.addEventListener('click', generateKeywords);
    topicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            topicInput.value = btn.dataset.topic;
            generateKeywords();
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
            document.getElementById(`${btn.dataset.tab}-content`).classList.add('active');
        });
    });
    
    // Copy buttons
    copyKeywordsBtn.addEventListener('click', () => copyToClipboard(keywordData.keywords.join('\n')));
    copyQuestionsBtn.addEventListener('click', () => copyToClipboard(keywordData.questions.join('\n')));
    copyIdeasBtn.addEventListener('click', () => copyToClipboard(keywordData.ideas.join('\n')));
    copyClustersBtn.addEventListener('click', () => {
        const clusterText = keywordData.clusters.map(cluster => 
            `${cluster.name}:\n${cluster.keywords.join('\n')}`
        ).join('\n\n');
        copyToClipboard(clusterText);
    });
    
    // Export as CSV
    exportCsvBtn.addEventListener('click', exportAsCSV);
    
    // Save keywords to local storage
    saveKeywordsBtn.addEventListener('click', saveKeywordsToStorage);
    
    // Load saved keywords on startup
    loadSavedKeywords();
    
    /**
     * Main function to generate keywords based on the input topic
     */
    function generateKeywords() {
        const topic = topicInput.value.trim();
        
        if (!topic) {
            alert('Please enter a topic or keyword');
            return;
        }
        
        // Clear previous results
        keywordData = {
            keywords: [],
            questions: [],
            ideas: [],
            clusters: []
        };
        
        // Get selected options
        const options = {
            informational: informationalCheck.checked,
            commercial: commercialCheck.checked,
            transactional: transactionalCheck.checked,
            includeQuestions: questionsCheck.checked,
            longTail: longTailCheck.checked,
            includeLocation: locationCheck.checked
        };
        
        // Generate basic keywords
        generateBasicKeywords(topic, options);
        
        // Generate question keywords if selected
        if (options.includeQuestions) {
            generateQuestionKeywords(topic, options);
        }
        
        // Generate content ideas
        generateContentIdeas(topic, options);
        
        // Generate clusters
        generateKeywordClusters(topic, options);
        
        // Update the UI
        updateUI();
    }
    
    /**
     * Generates basic keywords based on the topic and options
     */
    function generateBasicKeywords(topic, options) {
        // Basic modifiers
        const basicModifiers = [
            '', 'best', 'top', 'guide', 'tutorial', 'tips',
            'how to', 'benefits of', 'advantages of', 'vs'
        ];
        
        // Commercial modifiers
        const commercialModifiers = [
            'best', 'top', 'review', 'reviews', 'comparison',
            'vs', 'versus', 'alternative', 'alternatives',
            'cheap', 'affordable', 'premium', 'professional'
        ];
        
        // Transactional modifiers
        const transactionalModifiers = [
            'buy', 'purchase', 'order', 'shop', 'price',
            'cost', 'deal', 'deals', 'discount', 'sale',
            'coupon', 'free', 'download', 'subscription', 'service'
        ];
        
        // Location modifiers
        const locationModifiers = [
            'near me', 'online', 'local',
            'in [city]', '[city]', '[country]'
        ];
        
        // Add basic keywords
        let keywords = [];
        
        // Basic variations
        if (options.informational) {
            basicModifiers.forEach(modifier => {
                if (modifier) {
                    keywords.push(`${modifier} ${topic}`);
                } else {
                    keywords.push(topic);
                }
            });
        }
        
        // Commercial variations
        if (options.commercial) {
            commercialModifiers.forEach(modifier => {
                keywords.push(`${modifier} ${topic}`);
                
                // Add some combinations
                if (options.longTail) {
                    keywords.push(`${modifier} ${topic} for beginners`);
                    keywords.push(`${modifier} ${topic} for professionals`);
                    keywords.push(`${modifier} ${topic} 2025`); // Current year
                }
            });
        }
        
        // Transactional variations
        if (options.transactional) {
            transactionalModifiers.forEach(modifier => {
                keywords.push(`${modifier} ${topic}`);
                
                // Add some combinations
                if (options.longTail) {
                    keywords.push(`${modifier} ${topic} online`);
                    keywords.push(`${modifier} ${topic} today`);
                }
            });
        }
        
        // Location-based variations
        if (options.includeLocation) {
            locationModifiers.forEach(location => {
                keywords.push(`${topic} ${location}`);
                
                if (options.commercial) {
                    keywords.push(`best ${topic} ${location}`);
                }
                
                if (options.transactional) {
                    keywords.push(`buy ${topic} ${location}`);
                }
            });
        }
        
        // Add long-tail variations
        if (options.longTail) {
            // Time-based modifiers
            const timeModifiers = ['2025', 'today', 'new', 'latest', 'modern', 'updated'];
            
            timeModifiers.forEach(modifier => {
                keywords.push(`${topic} ${modifier}`);
                
                if (options.commercial) {
                    keywords.push(`best ${topic} ${modifier}`);
                }
            });
            
            // Add audience-specific variations
            const audienceModifiers = [
                'for beginners', 'for professionals', 'for experts',
                'for kids', 'for students', 'for businesses', 'for companies',
                'for small business', 'DIY', 'easy', 'advanced'
            ];
            
            audienceModifiers.forEach(audience => {
                keywords.push(`${topic} ${audience}`);
                
                if (options.commercial) {
                    keywords.push(`best ${topic} ${audience}`);
                }
            });
        }
        
        // Remove duplicates and sort alphabetically
        keywords = [...new Set(keywords)].sort();
        
        // Store in our data object
        keywordData.keywords = keywords;
    }
    
    /**
     * Generates question-based keywords
     */
    function generateQuestionKeywords(topic, options) {
        const questionPrefixes = [
            'what is', 'what are', 'how to', 'how do', 'where to',
            'where can I', 'why is', 'why are', 'when to', 'when is',
            'who can', 'which', 'can I', 'do I need', 'should I'
        ];
        
        let questions = [];
        
        questionPrefixes.forEach(prefix => {
            questions.push(`${prefix} ${topic}`);
            
            // Add some variations
            if (prefix === 'how to') {
                questions.push(`${prefix} start ${topic}`);
                questions.push(`${prefix} learn ${topic}`);
                questions.push(`${prefix} improve ${topic}`);
            }
            
            if (prefix === 'what is') {
                questions.push(`${prefix} the best ${topic}`);
                questions.push(`${prefix} a good ${topic}`);
            }
            
            if (options.transactional) {
                if (prefix === 'where to' || prefix === 'where can I') {
                    questions.push(`${prefix} buy ${topic}`);
                    questions.push(`${prefix} get ${topic}`);
                }
                
                if (prefix === 'how to') {
                    questions.push(`${prefix} choose ${topic}`);
                    questions.push(`${prefix} select ${topic}`);
                }
            }
        });
        
        // Remove duplicates and sort
        questions = [...new Set(questions)].sort();
        
        // Store in our data object
        keywordData.questions = questions;
    }
    
    /**
     * Generates content ideas based on the topic
     */
    function generateContentIdeas(topic, options) {
        const contentTemplates = [
            `The Ultimate Guide to ${topic}`,
            `${topic} 101: A Beginner's Guide`,
            `10 Tips for Better ${topic}`,
            `How to Get Started with ${topic}`,
            `${topic} Best Practices`,
            `Common ${topic} Mistakes to Avoid`,
            `${topic} vs Traditional Methods`
        ];
        
        let ideas = [...contentTemplates];
        
        // Add more content ideas based on options
        if (options.informational) {
            ideas.push(`${topic} Step by Step Tutorial`);
            ideas.push(`The History of ${topic}`);
            ideas.push(`Understanding ${topic}: Key Concepts`);
            ideas.push(`Why ${topic} Matters for Your Business`);
            ideas.push(`${topic} FAQs: Everything You Need to Know`);
        }
        
        if (options.commercial) {
            ideas.push(`Top 10 ${topic} Tools Comparison`);
            ideas.push(`${topic} Review: Pros and Cons`);
            ideas.push(`Best ${topic} Services in 2025`);
            ideas.push(`How to Choose the Right ${topic} for Your Needs`);
            ideas.push(`${topic} ROI: Is It Worth the Investment?`);
        }
        
        if (options.transactional) {
            ideas.push(`Where to Buy the Best ${topic}`);
            ideas.push(`${topic} Pricing Guide`);
            ideas.push(`How to Save Money on ${topic}`);
            ideas.push(`The Best Time to Buy ${topic}`);
            ideas.push(`${topic} Deals and Discounts`);
        }
        
        // Add combo ideas
        ideas.push(`The Future of ${topic}: Trends to Watch`);
        ideas.push(`${topic} Case Study: Real-World Results`);
        ideas.push(`${topic} Statistics and Data`);
        ideas.push(`How to Measure ${topic} Success`);
        
        // Sort alphabetically
        ideas.sort();
        
        // Store in our data object
        keywordData.ideas = ideas;
    }
    
    /**
     * Creates logical keyword clusters around related topics
     */
    function generateKeywordClusters(topic, options) {
        // Define main cluster categories
        const clusters = [
            {
                name: 'Informational',
                keywords: []
            },
            {
                name: 'Commercial',
                keywords: []
            },
            {
                name: 'Transactional',
                keywords: []
            },
            {
                name: 'Questions',
                keywords: []
            }
        ];
        
        // Add keywords to appropriate clusters
        if (options.informational) {
            clusters[0].keywords = [
                `what is ${topic}`,
                `${topic} guide`,
                `${topic} tutorial`,
                `how to ${topic}`,
                `${topic} tips`,
                `${topic} examples`,
                `${topic} benefits`,
                `${topic} explanation`,
                `${topic} basics`,
                `learn ${topic}`
            ];
        }
        
        if (options.commercial) {
            clusters[1].keywords = [
                `best ${topic}`,
                `top ${topic}`,
                `${topic} reviews`,
                `${topic} comparison`,
                `${topic} alternatives`,
                `${topic} vs`,
                `professional ${topic}`,
                `${topic} tools`,
                `${topic} software`,
                `${topic} services`
            ];
        }
        
        if (options.transactional) {
            clusters[2].keywords = [
                `buy ${topic}`,
                `${topic} price`,
                `${topic} cost`,
                `${topic} deals`,
                `${topic} discount`,
                `${topic} for sale`,
                `${topic} subscription`,
                `${topic} purchase`,
                `${topic} order`,
                `free ${topic}`
            ];
        }
        
        if (options.includeQuestions) {
            clusters[3].keywords = [
                `what is ${topic}`,
                `how to use ${topic}`,
                `why ${topic} is important`,
                `when to use ${topic}`,
                `where to find ${topic}`,
                `who needs ${topic}`,
                `which ${topic} is best`,
                `can ${topic} help me`,
                `should I learn ${topic}`,
                `will ${topic} work for me`
            ];
        }
        
        // Add a topic-specific cluster based on the input
        const topicWords = topic.split(' ');
        if (topicWords.length > 1) {
            // For multi-word topics, create a specific cluster
            const specificCluster = {
                name: `${topic} Specific`,
                keywords: [
                    `${topic} techniques`,
                    `${topic} methods`,
                    `${topic} strategies`,
                    `${topic} solutions`,
                    `${topic} ideas`,
                    `${topic} templates`,
                    `${topic} examples`,
                    `${topic} trends`,
                    `${topic} industry`,
                    `${topic} jobs`
                ]
            };
            clusters.push(specificCluster);
        }
        
        // Filter out empty clusters
        const filteredClusters = clusters.filter(cluster => cluster.keywords.length > 0);
        
        // Store in our data object
        keywordData.clusters = filteredClusters;
    }
    
    /**
     * Updates the UI with generated data
     */
    function updateUI() {
        // Update keyword count
        keywordsCount.textContent = keywordData.keywords.length;
        questionsCount.textContent = keywordData.questions.length;
        ideasCount.textContent = keywordData.ideas.length;
        clustersCount.textContent = keywordData.clusters.length;
        
        // Clear previous content
        keywordsList.innerHTML = '';
        questionsList.innerHTML = '';
        ideasList.innerHTML = '';
        clustersList.innerHTML = '';
        
        // Add keywords to the UI
        if (keywordData.keywords.length > 0) {
            keywordData.keywords.forEach(keyword => {
                const keywordItem = document.createElement('div');
                keywordItem.className = 'keyword-item';
                keywordItem.innerHTML = `
                    <span class="keyword-text">${keyword}</span>
                    <div class="keyword-actions">
                        <button class="keyword-btn" data-action="copy" title="Copy to clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                            </svg>
                        </button>
                        <button class="keyword-btn" data-action="save" title="Save for later">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path>
                            </svg>
                        </button>
                    </div>
                `;
                keywordsList.appendChild(keywordItem);
                
                // Add event listeners to buttons
                const copyBtn = keywordItem.querySelector('[data-action="copy"]');
                const saveBtn = keywordItem.querySelector('[data-action="save"]');
                
                copyBtn.addEventListener('click', () => copyToClipboard(keyword));
                saveBtn.addEventListener('click', () => saveKeyword(keyword));
            });
        } else {
            keywordsList.innerHTML = '<p class="placeholder">No keywords generated yet.</p>';
        }
        
        // Add question keywords to the UI
        if (keywordData.questions.length > 0) {
            keywordData.questions.forEach(question => {
                const questionItem = document.createElement('div');
                questionItem.className = 'keyword-item';
                questionItem.innerHTML = `
                    <span class="keyword-text">${question}</span>
                    <div class="keyword-actions">
                        <button class="keyword-btn" data-action="copy" title="Copy to clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                            </svg>
                        </button>
                        <button class="keyword-btn" data-action="save" title="Save for later">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path>
                            </svg>
                        </button>
                    </div>
                `;
                questionsList.appendChild(questionItem);
                
                // Add event listeners to buttons
                const copyBtn = questionItem.querySelector('[data-action="copy"]');
                const saveBtn = questionItem.querySelector('[data-action="save"]');
                
                copyBtn.addEventListener('click', () => copyToClipboard(question));
                saveBtn.addEventListener('click', () => saveKeyword(question));
            });
        } else {
            questionsList.innerHTML = '<p class="placeholder">No question keywords generated.</p>';
        }
        
        // Add content ideas to the UI
        if (keywordData.ideas.length > 0) {
            keywordData.ideas.forEach(idea => {
                const ideaItem = document.createElement('div');
                ideaItem.className = 'keyword-item';
                ideaItem.innerHTML = `
                    <span class="keyword-text">${idea}</span>
                    <div class="keyword-actions">
                        <button class="keyword-btn" data-action="copy" title="Copy to clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                            </svg>
                        </button>
                        <button class="keyword-btn" data-action="save" title="Save for later">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path>
                            </svg>
                        </button>
                    </div>
                `;
                ideasList.appendChild(ideaItem);
                
                // Add event listeners to buttons
                const copyBtn = ideaItem.querySelector('[data-action="copy"]');
                const saveBtn = ideaItem.querySelector('[data-action="save"]');
                
                copyBtn.addEventListener('click', () => copyToClipboard(idea));
                saveBtn.addEventListener('click', () => saveKeyword(idea));
            });
        } else {
            ideasList.innerHTML = '<p class="placeholder">No content ideas generated.</p>';
        }
        
        // Add clusters to the UI
        if (keywordData.clusters.length > 0) {
            keywordData.clusters.forEach(cluster => {
                const clusterItem = document.createElement('div');
                clusterItem.className = 'cluster-item';
                
                const keywordsHtml = cluster.keywords.map(keyword => 
                    `<div class="cluster-keyword">${keyword}</div>`
                ).join('');
                
                clusterItem.innerHTML = `
                    <div class="cluster-header">${cluster.name}</div>
                    <div class="cluster-keywords">
                        ${keywordsHtml}
                    </div>
                `;
                clustersList.appendChild(clusterItem);
            });
        } else {
            clustersList.innerHTML = '<p class="placeholder">No keyword clusters generated.</p>';
        }
    }
    
    /**
     * Copies text to clipboard
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Show a brief success message
                const notification = document.createElement('div');
                notification.className = 'copy-notification';
                notification.textContent = 'Copied to clipboard!';
                document.body.appendChild(notification);
                
                // Remove after animation
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy to clipboard');
            });
    }
    
    /**
     * Exports keyword data as CSV
     */
    function exportAsCSV() {
        // Create CSV content
        let csvContent = 'Type,Keyword\n';
        
        // Add keywords
        keywordData.keywords.forEach(keyword => {
            csvContent += `Basic,"${keyword}"\n`;
        });
        
        // Add questions
        keywordData.questions.forEach(question => {
            csvContent += `Question,"${question}"\n`;
        });
        
        // Add content ideas
        keywordData.ideas.forEach(idea => {
            csvContent += `Content Idea,"${idea}"\n`;
        });
        
        // Add clusters
        keywordData.clusters.forEach(cluster => {
            cluster.keywords.forEach(keyword => {
                csvContent += `${cluster.name},"${keyword}"\n`;
            });
        });
        
        // Create a blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `seo-keywords-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * Saves current keywords to local storage
     */
    function saveKeywordsToStorage() {
        const allKeywords = [
            ...keywordData.keywords,
            ...keywordData.questions,
            ...keywordData.ideas
        ];
        
        if (allKeywords.length === 0) {
            alert('No keywords to save');
            return;
        }
        
        // Get existing saved keywords
        let savedKeywords = JSON.parse(localStorage.getItem('savedKeywords')) || [];
        
        // Add new keywords (avoiding duplicates)
        const uniqueKeywords = allKeywords.filter(keyword => !savedKeywords.includes(keyword));
        savedKeywords = [...savedKeywords, ...uniqueKeywords];
        
        // Save back to storage
        localStorage.setItem('savedKeywords', JSON.stringify(savedKeywords));
        
        // Update UI
        loadSavedKeywords();
        
        // Show success message
        alert(`Saved ${uniqueKeywords.length} new keywords!`);
    }
    
    /**
     * Saves an individual keyword
     */
    function saveKeyword(keyword) {
        // Get existing saved keywords
        let savedKeywords = JSON.parse(localStorage.getItem('savedKeywords')) || [];
        
        // Check if already saved
        if (savedKeywords.includes(keyword)) {
            alert('This keyword is already saved');
            return;
        }
        
        // Add new keyword
        savedKeywords.push(keyword);
        
        // Save back to storage
        localStorage.setItem('savedKeywords', JSON.stringify(savedKeywords));
        
        // Update UI
        loadSavedKeywords();
    }
    
    /**
     * Loads saved keywords from local storage
     */
    function loadSavedKeywords() {
        const savedKeywords = JSON.parse(localStorage.getItem('savedKeywords')) || [];
        
        if (savedKeywords.length === 0) {
            savedKeywordsContainer.innerHTML = '<p class="placeholder">No saved keywords yet. Click the bookmark icon next to any keyword to save it.</p>';
            return;
        }
        
        // Create saved keywords list
        const savedList = document.createElement('div');
        savedList.className = 'saved-list';
        
        savedKeywords.forEach(keyword => {
            const item = document.createElement('div');
            item.className = 'saved-item';
            item.innerHTML = `
                ${keyword}
                <button class="remove-btn" data-keyword="${keyword}">×</button>
            `;
            savedList.appendChild(item);
        });
        
        // Replace container content
        savedKeywordsContainer.innerHTML = '';
        savedKeywordsContainer.appendChild(savedList);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const keywordToRemove = e.target.dataset.keyword;
                removeKeyword(keywordToRemove);
            });
        });
    }
    
    /**
     * Removes a keyword from local storage
     */
    function removeKeyword(keyword) {
        let savedKeywords = JSON.parse(localStorage.getItem('savedKeywords')) || [];
        savedKeywords = savedKeywords.filter(k => k !== keyword);
        localStorage.setItem('savedKeywords', JSON.stringify(savedKeywords));
        loadSavedKeywords();
    }
    
    // Add some CSS for the copy notification
    const style = document.createElement('style');
    style.textContent = `
        .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: var(--radius-sm);
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});