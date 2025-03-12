/**
 * CSS Gradient Generator
 * Generate CSS code for linear, radial, and conic gradients
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeGradientGenerator();
});

/**
 * Initialize the gradient generator functionality
 */
function initializeGradientGenerator() {
    // DOM Elements - Gradient Type
    const linearBtn = document.getElementById('linear-btn');
    const radialBtn = document.getElementById('radial-btn');
    const conicBtn = document.getElementById('conic-btn');
    
    // DOM Elements - Controls
    const linearControls = document.getElementById('linear-controls');
    const radialControls = document.getElementById('radial-controls');
    const conicControls = document.getElementById('conic-controls');
    
    // DOM Elements - Linear Gradient
    const linearDirection = document.getElementById('linear-direction');
    const angleContainer = document.getElementById('angle-container');
    const linearAngle = document.getElementById('linear-angle');
    
    // DOM Elements - Radial Gradient
    const radialShape = document.getElementById('radial-shape');
    const radialPosition = document.getElementById('radial-position');
    const radialSize = document.getElementById('radial-size');
    
    // DOM Elements - Conic Gradient
    const conicAngle = document.getElementById('conic-angle');
    const conicPosition = document.getElementById('conic-position');
    
    // DOM Elements - Color Stops
    const colorStopsContainer = document.getElementById('color-stops');
    const addColorStopBtn = document.getElementById('add-color-stop');
    
    // DOM Elements - Preview and Output
    const gradientPreview = document.getElementById('gradient-preview');
    const cssCodeOutput = document.getElementById('css-code');
    const copyCSS = document.getElementById('copy-css');
    const randomGradientBtn = document.getElementById('random-gradient');
    
    // State
    let currentGradientType = 'linear';
    
    // Event Listeners - Gradient Type
    linearBtn.addEventListener('click', () => setGradientType('linear'));
    radialBtn.addEventListener('click', () => setGradientType('radial'));
    conicBtn.addEventListener('click', () => setGradientType('conic'));
    
    // Event Listeners - Linear Gradient
    linearDirection.addEventListener('change', () => {
        if (linearDirection.value === 'custom') {
            angleContainer.style.display = 'block';
        } else {
            angleContainer.style.display = 'none';
        }
        updateGradient();
    });
    
    linearAngle.addEventListener('input', updateGradient);
    
    // Event Listeners - Radial Gradient
    radialShape.addEventListener('change', updateGradient);
    radialPosition.addEventListener('change', updateGradient);
    radialSize.addEventListener('change', updateGradient);
    
    // Event Listeners - Conic Gradient
    conicAngle.addEventListener('input', updateGradient);
    conicPosition.addEventListener('change', updateGradient);
    
    // Event Listeners - Color Stops
    addColorStopBtn.addEventListener('click', addColorStop);
    
    // Event Listeners - Copy CSS
    copyCSS.addEventListener('click', () => {
        const cssCode = cssCodeOutput.textContent;
        navigator.clipboard.writeText(cssCode)
            .then(() => {
                const originalText = copyCSS.textContent;
                copyCSS.textContent = 'Copied!';
                setTimeout(() => {
                    copyCSS.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                alert('Failed to copy CSS: ' + err);
            });
    });
    
    // Event Listener - Random Gradient
    randomGradientBtn.addEventListener('click', generateRandomGradient);
    
    /**
     * Set the active gradient type
     */
    function setGradientType(type) {
        currentGradientType = type;
        
        // Update tab buttons
        linearBtn.classList.toggle('active', type === 'linear');
        radialBtn.classList.toggle('active', type === 'radial');
        conicBtn.classList.toggle('active', type === 'conic');
        
        // Show/hide controls
        linearControls.classList.toggle('active', type === 'linear');
        radialControls.classList.toggle('active', type === 'radial');
        conicControls.classList.toggle('active', type === 'conic');
        
        // Update gradient
        updateGradient();
    }
    
    /**
     * Add a new color stop
     */
    function addColorStop() {
        const colorStops = document.querySelectorAll('.color-stop');
        const index = colorStops.length;
        
        // Generate a random color
        const randomColor = getRandomColor();
        
        // Calculate a position between the last two stops
        let position = 50;
        if (index > 0) {
            const lastStopPosition = parseInt(colorStops[index - 1].querySelector('.stop-position').value);
            const secondLastStopPosition = index > 1 
                ? parseInt(colorStops[index - 2].querySelector('.stop-position').value)
                : 0;
            position = secondLastStopPosition + (lastStopPosition - secondLastStopPosition) / 2;
            position = Math.round(position);
        }
        
        const colorStop = document.createElement('div');
        colorStop.className = 'color-stop';
        colorStop.dataset.index = index;
        colorStop.innerHTML = `
            <input type="color" class="color-picker" value="${randomColor}">
            <input type="number" class="stop-position" min="0" max="100" value="${position}">
            <span class="percent-sign">%</span>
            <button class="delete-stop">×</button>
        `;
        
        colorStopsContainer.appendChild(colorStop);
        
        // Add event listeners to the new color stop
        const colorPicker = colorStop.querySelector('.color-picker');
        const stopPosition = colorStop.querySelector('.stop-position');
        const deleteStop = colorStop.querySelector('.delete-stop');
        
        colorPicker.addEventListener('input', updateGradient);
        stopPosition.addEventListener('input', updateGradient);
        deleteStop.addEventListener('click', () => {
            colorStop.remove();
            updateDeleteButtonStates();
            updateGradient();
        });
        
        updateDeleteButtonStates();
        updateGradient();
    }
    
    /**
     * Update which delete buttons should be enabled/disabled
     */
    function updateDeleteButtonStates() {
        const colorStops = document.querySelectorAll('.color-stop');
        
        // Need at least 2 color stops
        const canDelete = colorStops.length > 2;
        
        colorStops.forEach(stop => {
            const deleteBtn = stop.querySelector('.delete-stop');
            deleteBtn.disabled = !canDelete;
        });
    }
    
    /**
     * Update the gradient preview and CSS code
     */
    function updateGradient() {
        const cssCode = generateGradientCSS();
        gradientPreview.style.background = cssCode;
        cssCodeOutput.textContent = `.element {\n  background: ${cssCode};\n}`;
    }
    
    /**
     * Generate the CSS gradient code based on current settings
     */
    function generateGradientCSS() {
        // Get color stops
        const colorStops = [];
        document.querySelectorAll('.color-stop').forEach(stop => {
            const color = stop.querySelector('.color-picker').value;
            const position = stop.querySelector('.stop-position').value;
            colorStops.push({ color, position });
        });
        
        // Sort color stops by position
        colorStops.sort((a, b) => a.position - b.position);
        
        // Format color stops
        const formattedStops = colorStops.map(stop => 
            `${stop.color} ${stop.position}%`
        ).join(', ');
        
        // Generate gradient based on type
        if (currentGradientType === 'linear') {
            let direction;
            if (linearDirection.value === 'custom') {
                direction = `${linearAngle.value}deg`;
            } else {
                direction = linearDirection.value;
            }
            return `linear-gradient(${direction}, ${formattedStops})`;
        } 
        else if (currentGradientType === 'radial') {
            const shape = radialShape.value;
            const position = radialPosition.value;
            const size = radialSize.value ? ` ${radialSize.value}` : '';
            return `radial-gradient(${shape}${size} at ${position}, ${formattedStops})`;
        } 
        else if (currentGradientType === 'conic') {
            const angle = conicAngle.value !== '0' ? ` from ${conicAngle.value}deg` : '';
            const position = conicPosition.value;
            return `conic-gradient(${angle} at ${position}, ${formattedStops})`;
        }
    }
    
    /**
     * Generate a random gradient
     */
    function generateRandomGradient() {
        // Randomly select gradient type
        const types = ['linear', 'radial', 'conic'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        setGradientType(randomType);
        
        // Clear existing color stops
        while (colorStopsContainer.children.length > 0) {
            colorStopsContainer.removeChild(colorStopsContainer.lastChild);
        }
        
        // Generate random number of color stops (2-5)
        const stopCount = Math.floor(Math.random() * 4) + 2;
        
        // Create color stops with random colors and positions
        for (let i = 0; i < stopCount; i++) {
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.dataset.index = i;
            
            // For first and last stops, use 0% and 100%
            let position;
            if (i === 0) position = 0;
            else if (i === stopCount - 1) position = 100;
            else position = Math.floor(Math.random() * 80) + 10; // 10-90%
            
            colorStop.innerHTML = `
                <input type="color" class="color-picker" value="${getRandomColor()}">
                <input type="number" class="stop-position" min="0" max="100" value="${position}">
                <span class="percent-sign">%</span>
                <button class="delete-stop">×</button>
            `;
            
            colorStopsContainer.appendChild(colorStop);
            
            // Add event listeners
            const colorPicker = colorStop.querySelector('.color-picker');
            const stopPosition = colorStop.querySelector('.stop-position');
            const deleteStop = colorStop.querySelector('.delete-stop');
            
            colorPicker.addEventListener('input', updateGradient);
            stopPosition.addEventListener('input', updateGradient);
            deleteStop.addEventListener('click', () => {
                colorStop.remove();
                updateDeleteButtonStates();
                updateGradient();
            });
        }
        
        // Randomize settings based on gradient type
        if (randomType === 'linear') {
            const directions = [
                'to right', 'to left', 'to bottom', 'to top',
                'to bottom right', 'to bottom left', 'to top right', 'to top left',
                'custom'
            ];
            linearDirection.value = directions[Math.floor(Math.random() * directions.length)];
            
            if (linearDirection.value === 'custom') {
                angleContainer.style.display = 'block';
                linearAngle.value = Math.floor(Math.random() * 360);
            } else {
                angleContainer.style.display = 'none';
            }
        } 
        else if (randomType === 'radial') {
            radialShape.value = Math.random() > 0.5 ? 'circle' : 'ellipse';
            
            const positions = [
                'center', 'top', 'bottom', 'left', 'right',
                'top left', 'top right', 'bottom left', 'bottom right'
            ];
            radialPosition.value = positions[Math.floor(Math.random() * positions.length)];
            
            const sizes = ['', 'closest-side', 'closest-corner', 'farthest-side', 'farthest-corner'];
            radialSize.value = sizes[Math.floor(Math.random() * sizes.length)];
        } 
        else if (randomType === 'conic') {
            conicAngle.value = Math.floor(Math.random() * 360);
            
            const positions = [
                'center', 'top', 'bottom', 'left', 'right',
                'top left', 'top right', 'bottom left', 'bottom right'
            ];
            conicPosition.value = positions[Math.floor(Math.random() * positions.length)];
        }
        
        updateDeleteButtonStates();
        updateGradient();
    }
    
    /**
     * Generate a random color in hex format
     */
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // Initialize event listeners for the initial color stops
    document.querySelectorAll('.color-stop').forEach(colorStop => {
        const colorPicker = colorStop.querySelector('.color-picker');
        const stopPosition = colorStop.querySelector('.stop-position');
        const deleteStop = colorStop.querySelector('.delete-stop');
        
        colorPicker.addEventListener('input', updateGradient);
        stopPosition.addEventListener('input', updateGradient);
        deleteStop.addEventListener('click', () => {
            colorStop.remove();
            updateDeleteButtonStates();
            updateGradient();
        });
    });
    
    // Initialize with default settings
    updateDeleteButtonStates();
    updateGradient();
};