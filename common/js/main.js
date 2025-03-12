/**
 * Main JavaScript for ToolNook.dev
 */

document.addEventListener('DOMContentLoaded', () => {
    // This function can be used to load tools dynamically from a config file
    // For now, we're using static HTML for the tools list
    
    // Add any site-wide functionality here
    initSearchFunctionality();
    initThemeToggle();
});

/**
 * Initialize search functionality for tools
 */
function initSearchFunctionality() {
    // This would be implemented when you have many tools to search through
    console.log('Search functionality will be added when more tools are available');
}

/**
 * Initialize dark/light theme toggle functionality
 */
function initThemeToggle() {
    // This would be implemented for theme switching
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
    
    card.innerHTML = `
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <a href="/tools/${tool.id}/" class="btn">Open Tool</a>
    `;
    
    return card;
}