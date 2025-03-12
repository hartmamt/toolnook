/**
 * Physics Calculator Tool
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const calcType = document.getElementById('calc-type');
    const initialVelocity = document.getElementById('initial-velocity');
    const initialHeight = document.getElementById('initial-height');
    const angle = document.getElementById('angle');
    const units = document.getElementById('units');
    const processBtn = document.getElementById('process-btn');
    const resultArea = document.getElementById('result');
    const solutionSteps = document.getElementById('solution-steps');
    const stepsContent = document.getElementById('steps-content');

    // Add event listener to the process button
    processBtn.addEventListener('click', processInput);

    /**
     * Process the user input and calculate physics result
     */
    function processInput() {
        // Get input values
        const calcTypeValue = calcType.value;
        const v0 = parseFloat(initialVelocity.value);
        const h0 = parseFloat(initialHeight.value);
        const angleValue = parseFloat(angle.value);
        const unitsValue = units.value;
        
        // Validate input
        if (isNaN(v0) || isNaN(h0) || isNaN(angleValue)) {
            showError('Please enter valid numerical values for all fields');
            return;
        }
        
        try {
            // Calculate based on the selected calculation type
            const result = calculatePhysicsProblem(calcTypeValue, v0, h0, angleValue, unitsValue);
            
            // Display the result and solution steps
            displayResult(result);
        } catch (error) {
            showError(`An error occurred: ${error.message}`);
        }
    }

    /**
     * Calculate the physics problem based on input parameters
     * @param {string} calcType - The type of calculation to perform
     * @param {number} v0 - Initial velocity
     * @param {number} h0 - Initial height
     * @param {number} angle - Angle from horizontal in degrees
     * @param {string} unitSystem - Either 'imperial' or 'metric'
     * @returns {Object} - Result object with calculation results and steps
     */
    function calculatePhysicsProblem(calcType, v0, h0, angle, unitSystem) {
        // Convert angle to radians
        const angleRad = angle * Math.PI / 180;
        
        // Set gravity constant based on unit system
        const g = unitSystem === 'imperial' ? 32.17405 : 9.80665; // ft/s² or m/s²
        const units = {
            distance: unitSystem === 'imperial' ? 'ft' : 'm',
            velocity: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
            time: 's',
            acceleration: unitSystem === 'imperial' ? 'ft/s²' : 'm/s²'
        };
        
        // Calculate vertical and horizontal components of initial velocity
        const v0x = v0 * Math.cos(angleRad);
        const v0y = v0 * Math.sin(angleRad);
        
        // Initialize result object
        const result = {
            value: null,
            unit: '',
            steps: []
        };
        
        // Add initial values to steps
        result.steps.push(`Given information:`);
        result.steps.push(`• Initial velocity (v₀) = ${v0} ${units.velocity}`);
        result.steps.push(`• Initial height (h₀) = ${h0} ${units.distance}`);
        result.steps.push(`• Angle from horizontal = ${angle}° (${angleRad.toFixed(4)} radians)`);
        result.steps.push(`• Acceleration due to gravity (g) = ${g} ${units.acceleration} (downward)`);
        result.steps.push(`\nStep 1: Break velocity into components`);
        result.steps.push(`• v₀ₓ = v₀ × cos(θ) = ${v0} × ${Math.cos(angleRad).toFixed(4)} = ${v0x.toFixed(4)} ${units.velocity}`);
        result.steps.push(`• v₀ᵧ = v₀ × sin(θ) = ${v0} × ${Math.sin(angleRad).toFixed(4)} = ${v0y.toFixed(4)} ${units.velocity}`);
        
        // Perform specific calculations based on the calculation type
        if (calcType === 'time-to-ground') {
            // Calculate time to hit ground using quadratic formula
            // h(t) = h₀ + v₀ᵧ·t - ½g·t²
            // When h(t) = 0, we get: 0 = h₀ + v₀ᵧ·t - ½g·t²
            // Rearranging: ½g·t² - v₀ᵧ·t - h₀ = 0
            // This is in the form at² + bt + c = 0 where:
            // a = ½g, b = -v₀ᵧ, c = -h₀
            
            result.steps.push(`\nStep 2: Set up the equation for height as a function of time`);
            result.steps.push(`h(t) = h₀ + v₀ᵧ·t - ½g·t²`);
            result.steps.push(`When object hits ground, h(t) = 0, so:`);
            result.steps.push(`0 = ${h0} + ${v0y.toFixed(4)}·t - ½(${g})·t²`);
            result.steps.push(`0 = ${h0} + ${v0y.toFixed(4)}·t - ${g/2}·t²`);
            result.steps.push(`${g/2}·t² - ${v0y.toFixed(4)}·t - ${h0} = 0`);
            
            result.steps.push(`\nStep 3: Use the quadratic formula to solve for time`);
            result.steps.push(`t = [-b ± √(b² - 4ac)] / 2a where:`);
            result.steps.push(`a = ${g/2}, b = -${v0y.toFixed(4)}, c = -${h0}`);
            
            const a = g / 2;
            const b = -v0y;
            const c = -h0;
            
            const discriminant = b*b - 4*a*c;
            
            if (discriminant < 0) {
                throw new Error('The discriminant is negative, meaning the object never hits the ground');
            }
            
            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            
            result.steps.push(`discriminant = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);
            result.steps.push(`t₁ = [${-b} + √${discriminant}] / 2(${a}) = ${t1.toFixed(6)} ${units.time}`);
            result.steps.push(`t₂ = [${-b} - √${discriminant}] / 2(${a}) = ${t2.toFixed(6)} ${units.time}`);
            
            // Choose the positive time value
            let time;
            if (t1 > 0) {
                time = t1;
                result.steps.push(`\nSince we need the time when the object is in flight, we choose the positive value: t = ${time.toFixed(4)} ${units.time}`);
            } else if (t2 > 0) {
                time = t2;
                result.steps.push(`\nSince we need the time when the object is in flight, we choose the positive value: t = ${time.toFixed(4)} ${units.time}`);
            } else {
                throw new Error('No positive time solution found');
            }
            
            result.value = time;
            result.unit = units.time;
            
        } else if (calcType === 'max-height') {
            // Calculate maximum height
            // Maximum height occurs when vertical velocity = 0
            // Time to max height: tmax = v₀ᵧ/g
            // Max height: hmax = h₀ + v₀ᵧ²/(2g)
            
            result.steps.push(`\nStep 2: Calculate the time to reach maximum height`);
            result.steps.push(`At maximum height, vertical velocity = 0`);
            result.steps.push(`vᵧ(t) = v₀ᵧ - gt`);
            result.steps.push(`0 = ${v0y.toFixed(4)} - ${g}·t`);
            
            const timeToMax = v0y / g;
            result.steps.push(`t = ${v0y.toFixed(4)} / ${g} = ${timeToMax.toFixed(4)} ${units.time}`);
            
            result.steps.push(`\nStep 3: Calculate the maximum height`);
            result.steps.push(`h(t) = h₀ + v₀ᵧ·t - ½g·t²`);
            result.steps.push(`Substituting t = ${timeToMax.toFixed(4)}:`);
            
            const maxHeight = h0 + v0y * timeToMax - 0.5 * g * timeToMax * timeToMax;
            result.steps.push(`h(${timeToMax.toFixed(4)}) = ${h0} + ${v0y.toFixed(4)} × ${timeToMax.toFixed(4)} - ½(${g}) × ${timeToMax.toFixed(4)}²`);
            result.steps.push(`h(${timeToMax.toFixed(4)}) = ${h0} + ${(v0y * timeToMax).toFixed(4)} - ${(0.5 * g * timeToMax * timeToMax).toFixed(4)}`);
            result.steps.push(`Maximum height = ${maxHeight.toFixed(4)} ${units.distance}`);
            
            // Alternative calculation for verification
            const maxHeightAlt = h0 + (v0y * v0y) / (2 * g);
            result.steps.push(`\nAlternatively, we can calculate this directly using:`);
            result.steps.push(`Maximum height = h₀ + v₀ᵧ²/(2g) = ${h0} + (${v0y.toFixed(4)})²/(2 × ${g}) = ${maxHeightAlt.toFixed(4)} ${units.distance}`);
            
            result.value = maxHeight;
            result.unit = units.distance;
            
        } else if (calcType === 'range') {
            // Calculate horizontal range
            // First calculate time to hit ground using quadratic formula
            // h(t) = h₀ + v₀ᵧ·t - ½g·t²
            
            result.steps.push(`\nStep 2: Calculate time to hit ground (as in time-to-ground calculation)`);
            const a = g / 2;
            const b = -v0y;
            const c = -h0;
            
            const discriminant = b*b - 4*a*c;
            
            if (discriminant < 0) {
                throw new Error('The discriminant is negative, meaning the object never hits the ground');
            }
            
            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            
            result.steps.push(`Using the quadratic formula to solve when h(t) = 0:`);
            result.steps.push(`t = [-b ± √(b² - 4ac)] / 2a where a = ${a}, b = ${b}, c = ${c}`);
            result.steps.push(`t₁ = ${t1.toFixed(6)} ${units.time}, t₂ = ${t2.toFixed(6)} ${units.time}`);
            
            // Choose the positive time value
            let timeToGround;
            if (t1 > 0) {
                timeToGround = t1;
                result.steps.push(`We choose the positive value: t = ${timeToGround.toFixed(4)} ${units.time}`);
            } else if (t2 > 0) {
                timeToGround = t2;
                result.steps.push(`We choose the positive value: t = ${timeToGround.toFixed(4)} ${units.time}`);
            } else {
                throw new Error('No positive time solution found');
            }
            
            result.steps.push(`\nStep 3: Calculate horizontal distance covered in this time`);
            result.steps.push(`x(t) = v₀ₓ × t`);
            
            const range = v0x * timeToGround;
            result.steps.push(`x(${timeToGround.toFixed(4)}) = ${v0x.toFixed(4)} × ${timeToGround.toFixed(4)} = ${range.toFixed(4)} ${units.distance}`);
            
            result.value = range;
            result.unit = units.distance;
        }
        
        return result;
    }

    /**
     * Display the result and solution steps
     * @param {Object} result - Result object with calculation data and steps
     */
    function displayResult(result) {
        resultArea.innerHTML = `<div class="result-value">Result: ${result.value.toFixed(4)} ${result.unit}</div>`;
        
        // Show solution steps
        solutionSteps.classList.remove('hidden');
        stepsContent.innerHTML = result.steps.map(step => `<p>${step}</p>`).join('');
    }

    /**
     * Show an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        resultArea.innerHTML = `<p class="error">${message}</p>`;
        solutionSteps.classList.add('hidden');
    }
});