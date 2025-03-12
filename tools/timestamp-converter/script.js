/**
 * Unix Timestamp Converter
 * Converts between Unix timestamps and human-readable dates
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load required libraries
    loadLibraries().then(() => {
        initializeConverter();
    });
});

/**
 * Load required external libraries
 */
async function loadLibraries() {
    // Load dayjs for date handling (much lighter than moment.js)
    await loadScript('https://cdn.jsdelivr.net/npm/dayjs@1.11.7/dayjs.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/dayjs@1.11.7/plugin/utc.js');
    await loadScript('https://cdn.jsdelivr.net/npm/dayjs@1.11.7/plugin/timezone.js');
    await loadScript('https://cdn.jsdelivr.net/npm/dayjs@1.11.7/plugin/relativeTime.js');
    
    // Initialize dayjs plugins
    dayjs.extend(window.dayjs_plugin_utc);
    dayjs.extend(window.dayjs_plugin_timezone);
    dayjs.extend(window.dayjs_plugin_relativeTime);
}

/**
 * Helper function to load a script
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Initialize the converter functionality
 */
function initializeConverter() {
    // DOM Elements - Current Time
    const currentDate = document.getElementById('current-date');
    const currentTime = document.getElementById('current-time');
    const currentTimestamp = document.getElementById('current-timestamp');
    const currentTimezone = document.getElementById('current-timezone');
    const refreshBtn = document.getElementById('refresh-btn');

    // DOM Elements - Conversion Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // DOM Elements - Timestamp to Date
    const unixTimestamp = document.getElementById('unix-timestamp');
    const timestampMilliseconds = document.getElementById('timestamp-milliseconds');
    const nowBtn = document.getElementById('now-btn');
    const clearTimestampBtn = document.getElementById('clear-timestamp-btn');
    const convertToDateBtn = document.getElementById('convert-to-date-btn');
    const resultTabButtons = document.querySelectorAll('.result-tab-btn');
    const dateResult = document.getElementById('date-result');
    const timezoneSelector = document.getElementById('timezone-selector-row');
    const timezoneSelect = document.getElementById('timezone-select');
    const relativeTime = document.getElementById('relative-time');
    const isoTime = document.getElementById('iso-time');
    const copyDateBtn = document.getElementById('copy-date-btn');

    // DOM Elements - Date to Timestamp
    const dateInput = document.getElementById('date-input');
    const dateTimezone = document.getElementById('date-timezone');
    const nowDateBtn = document.getElementById('now-date-btn');
    const convertToTimestampBtn = document.getElementById('convert-to-timestamp-btn');
    const timestampResult = document.getElementById('timestamp-result');
    const timestampMs = document.getElementById('timestamp-ms');
    const copyTimestampBtn = document.getElementById('copy-timestamp-btn');

    // Event Listeners - Current Time
    refreshBtn.addEventListener('click', updateCurrentTime);

    // Event Listeners - Conversion Tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show the selected tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
        });
    });

    // Event Listeners - Timestamp to Date
    nowBtn.addEventListener('click', () => {
        unixTimestamp.value = Math.floor(Date.now() / 1000);
    });

    clearTimestampBtn.addEventListener('click', () => {
        unixTimestamp.value = '';
        dateResult.textContent = '--';
        relativeTime.textContent = '--';
        isoTime.textContent = '--';
    });

    convertToDateBtn.addEventListener('click', convertTimestampToDate);

    resultTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab button
            resultTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide timezone selector for custom tab
            timezoneSelector.style.display = tab === 'custom' ? 'flex' : 'none';
            
            // Update result if we have a timestamp
            if (unixTimestamp.value) {
                updateDateResult(tab);
            }
        });
    });

    timezoneSelect.addEventListener('change', () => {
        if (unixTimestamp.value) {
            updateDateResult('custom');
        }
    });

    copyDateBtn.addEventListener('click', () => {
        copyToClipboard(dateResult.textContent);
    });

    // Event Listeners - Date to Timestamp
    nowDateBtn.addEventListener('click', () => {
        const now = new Date();
        dateInput.value = formatDatetimeLocal(now);
    });

    convertToTimestampBtn.addEventListener('click', convertDateToTimestamp);

    copyTimestampBtn.addEventListener('click', () => {
        copyToClipboard(timestampResult.textContent);
    });

    // Example timestamps click handlers
    document.querySelectorAll('.example').forEach(example => {
        example.addEventListener('click', () => {
            const firstChild = example.querySelector('div:first-child');
            if (firstChild) {
                unixTimestamp.value = firstChild.textContent;
            }
        });
    });

    // Initialize with current time
    updateCurrentTime();
    
    // Set up auto-updating clock
    setInterval(updateCurrentTime, 1000);

    /**
     * Update current time display
     */
    function updateCurrentTime() {
        const now = new Date();
        
        // Format date: March 12, 2025
        currentDate.textContent = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Format time: 15:30:45
        currentTime.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // Current timestamp
        currentTimestamp.textContent = Math.floor(now.getTime() / 1000);
        
        // Current timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        currentTimezone.textContent = timezone || 'Unknown';
    }

    /**
     * Convert Unix timestamp to human-readable date
     */
    function convertTimestampToDate() {
        const timestamp = unixTimestamp.value.trim();
        
        if (!timestamp) {
            alert('Please enter a Unix timestamp');
            return;
        }
        
        // Get currently active result tab
        const activeTab = document.querySelector('.result-tab-btn.active');
        const tab = activeTab ? activeTab.getAttribute('data-tab') : 'local';
        
        updateDateResult(tab);
        updateAdditionalInfo();
    }
    
    /**
     * Update date result based on selected tab
     */
    function updateDateResult(tab) {
        let timestamp = parseInt(unixTimestamp.value.trim());
        
        if (isNaN(timestamp)) {
            dateResult.textContent = 'Invalid timestamp';
            return;
        }
        
        // Convert from milliseconds if needed
        if (timestampMilliseconds.checked) {
            timestamp = Math.floor(timestamp / 1000);
        }
        
        let date;
        
        if (tab === 'utc') {
            // UTC time
            date = dayjs.unix(timestamp).utc();
            dateResult.textContent = date.format('YYYY-MM-DD HH:mm:ss [UTC]');
        } else if (tab === 'custom') {
            // Custom timezone
            const timezone = timezoneSelect.value;
            date = dayjs.unix(timestamp).tz(timezone);
            dateResult.textContent = date.format('YYYY-MM-DD HH:mm:ss z');
        } else {
            // Local time
            date = dayjs.unix(timestamp);
            dateResult.textContent = date.format('YYYY-MM-DD HH:mm:ss');
        }
    }
    
    /**
     * Update additional date information
     */
    function updateAdditionalInfo() {
        let timestamp = parseInt(unixTimestamp.value.trim());
        
        if (isNaN(timestamp)) {
            relativeTime.textContent = '--';
            isoTime.textContent = '--';
            return;
        }
        
        // Convert from milliseconds if needed
        if (timestampMilliseconds.checked) {
            timestamp = Math.floor(timestamp / 1000);
        }
        
        const date = dayjs.unix(timestamp);
        
        // Relative time (e.g., "2 hours ago")
        relativeTime.textContent = date.fromNow();
        
        // ISO 8601 format
        isoTime.textContent = date.toISOString();
    }

    /**
     * Convert date to Unix timestamp
     */
    function convertDateToTimestamp() {
        const dateValue = dateInput.value;
        
        if (!dateValue) {
            alert('Please enter a date and time');
            return;
        }
        
        let date = new Date(dateValue);
        
        if (isNaN(date.getTime())) {
            alert('Invalid date format');
            return;
        }
        
        // Convert to UTC if selected
        let timestamp;
        
        if (dateTimezone.value === 'UTC') {
            // Adjust to UTC
            timestamp = Math.floor(Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            ) / 1000);
        } else {
            // Use local timestamp
            timestamp = Math.floor(date.getTime() / 1000);
        }
        
        // Display results
        timestampResult.textContent = timestamp;
        timestampMs.textContent = timestamp * 1000;
    }

    /**
     * Format a Date object for datetime-local input
     */
    function formatDatetimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (text === '--' || !text) {
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy to clipboard');
            });
    }
};