/**
 * Modern Main JavaScript for ToolNook.dev
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add site-wide functionality
    initCategoryFilter();
    initSearchFunctionality();
    initThemeToggle();
    initAnimations();
    initToolCardAccessibility();
});

/**
 * Initialize category filtering with smooth transitions
 */
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    const toolsContainer = document.getElementById('tools-container');
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                
                // Add fade-out effect to container
                toolsContainer.classList.add('category-transition');
                
                // Show/hide cards based on category with a short delay for transition
                setTimeout(() => {
                    let visibleCount = 0;
                    
                    toolCards.forEach(card => {
                        if (category === 'all') {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50 * visibleCount);
                            visibleCount++;
                        } else {
                            const cardCategory = card.getAttribute('data-category');
                            if (cardCategory === category) {
                                card.style.display = 'block';
                                setTimeout(() => {
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                }, 50 * visibleCount);
                                visibleCount++;
                            } else {
                                card.style.opacity = '0';
                                card.style.transform = 'translateY(10px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        }
                    });
                    
                    // Remove transition class after animation completes
                    setTimeout(() => {
                        toolsContainer.classList.remove('category-transition');
                    }, 350);
                }, 50);
            });
        });
    }
}

/**
 * Initialize search functionality for tools
 */
function initSearchFunctionality() {
    // Create search bar if it doesn't exist
    if (!document.getElementById('tool-search-container') && document.querySelector('.category-nav')) {
        const categoryNav = document.querySelector('.category-nav');
        const searchContainer = document.createElement('div');
        searchContainer.id = 'tool-search-container';
        searchContainer.innerHTML = `
            <div class="search-wrapper">
                <input type="text" id="tool-search" placeholder="Search tools..." aria-label="Search tools">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
        `;
        categoryNav.prepend(searchContainer);
        
        // Add search functionality
        const searchInput = document.getElementById('tool-search');
        const toolCards = document.querySelectorAll('.tool-card');
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            toolCards.forEach(card => {
                const toolName = card.querySelector('h3').textContent.toLowerCase();
                const toolDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (toolName.includes(searchTerm) || toolDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Reset active category button
            if (searchTerm.length > 0) {
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
            } else {
                // If search is cleared, activate "All" button
                document.querySelector('.category-btn[data-category="all"]').click();
            }
        });
    }
}

/**
 * Initialize dark/light theme toggle functionality
 */
function initThemeToggle() {
    // Add theme toggle if it doesn't exist
    if (!document.getElementById('theme-toggle') && document.querySelector('header .container')) {
        const headerContainer = document.querySelector('header .container');
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.innerHTML = `
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        headerContainer.appendChild(themeToggle);
        
        // Check for user preference
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // Apply theme based on saved preference or system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.documentElement.classList.add('dark-mode');
            themeToggle.classList.add('active');
        }
        
        // Add toggle functionality
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            themeToggle.classList.toggle('active');
            
            // Save preference
            const isDarkMode = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
}

/**
 * Add animations to enhance UI
 */
function initAnimations() {
    // Add CSS variables for animations if needed
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .tool-card {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeIn 0.3s ease forwards;
            animation-delay: calc(var(--animation-order, 0) * 0.1s);
        }
        
        .category-transition {
            transition: height 0.3s ease;
        }
        
        #theme-toggle {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            transition: all 0.3s ease;
        }
        
        #theme-toggle:hover {
            transform: scale(1.05);
        }
        
        #theme-toggle .sun-icon {
            display: none;
        }
        
        #theme-toggle .moon-icon {
            display: block;
        }
        
        #theme-toggle.active .sun-icon {
            display: block;
        }
        
        #theme-toggle.active .moon-icon {
            display: none;
        }
        
        #tool-search-container {
            margin-bottom: 1.5rem;
            width: 100%;
            max-width: 500px;
        }
        
        .search-wrapper {
            position: relative;
            width: 100%;
        }
        
        #tool-search {
            width: 100%;
            padding: 0.75rem 1rem;
            padding-left: 2.5rem;
            border: 1px solid var(--border-color);
            border-radius: 2rem;
            font-size: 1rem;
            transition: all 0.2s ease;
        }
        
        #tool-search:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px var(--primary-light);
        }
        
        .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
        }
        
        /* Dark mode styles */
        .dark-mode {
            --light-color: #1e1e2e;
            --dark-color: #f7f7f8;
            --text-color: #e4e4e7;
            --text-light: #a1a1aa;
            --border-color: #27272a;
            --card-color: #2d2d3a;
            --hover-color: #3f3f4d;
        }
        
        .dark-mode .tool-card-tag {
            background-color: rgba(16, 163, 127, 0.2);
        }
        
        .dark-mode .ad-container {
            background-color: #2d2d3a;
        }
        
        .dark-mode #tool-search {
            background-color: #2d2d3a;
            color: var(--text-color);
        }
        
        /* Header keeps consistent styling in dark mode */
        .dark-mode header {
            background-color: var(--primary-color);
        }
        
        /* Tool headers in dark mode */
        .dark-mode .tool-header h2 {
            color: var(--dark-color);
        }
    `;
    document.head.appendChild(style);
    
    // Set animation delays for tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
}

/**
 * Enhance tool cards with better accessibility
 */
function initToolCardAccessibility() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const link = card.querySelector('a.btn');
        if (link) {
            // Make entire card clickable but keep proper accessibility
            card.addEventListener('click', (e) => {
                if (e.target !== link) {
                    e.preventDefault();
                    link.click();
                }
            });
            
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
            
            // Add aria attributes and visual cue
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Open ${card.querySelector('h3').textContent}`);
        }
    });
}

/**
 * Helper function to create tool cards dynamically
 * @param {Object} tool - Tool data object
 * @returns {HTMLElement} - Tool card element
 */
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('data-tool-id', tool.id);
    card.setAttribute('data-category', tool.category);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${tool.name}`);
    
    card.innerHTML = `
        <div class="tool-card-tag">${tool.categoryName || tool.category}</div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <a href="/tools/${tool.id}/" class="btn">Open Tool</a>
    `;
    
    return card;
}