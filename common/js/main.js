/**
 * Main JavaScript for ToolNook.dev
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add site-wide functionality
    initCategoryFilter();
    initSearchFunctionality();
    initThemeToggle();
});

/**
 * Initialize category filtering
 */
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                
                // Show/hide cards based on category
                toolCards.forEach(card => {
                    if (category === 'all') {
                        card.style.display = 'block';
                    } else {
                        const cardCategory = card.getAttribute('data-category');
                        card.style.display = (cardCategory === category) ? 'block' : 'none';
                    }
                });
            });
        });
    }
}

/**
 * Initialize search functionality for tools
 */
function initSearchFunctionality() {
    // This will be implemented in the future
    console.log('Search functionality will be added in a future update');
}

/**
 * Initialize dark/light theme toggle functionality
 */
function initThemeToggle() {
    // This will be implemented in the future
    console.log('Theme toggle will be added in a future update');
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
    
    card.innerHTML = `
        <div class="tool-card-tag">${tool.category}</div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <a href="/tools/${tool.id}/" class="btn">Open Tool</a>
    `;
    
    return card;
}