const OPERANDS = ['+', '-', '*', '/'];
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const entryNode = document.querySelector('#current');
const historyNode = document.querySelector('#prev');

let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;
let justCalculated = false;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "ERROR";
    }
    return a / b;
}

function operate(operator, a, b) {
    let result;
    switch(operator) {
        case '+': result = add(a, b); break;
        case '-': result = subtract(a, b); break;
        case '*': result = multiply(a, b); break;
        case '/': result = divide(a, b); break;
        default: return "ERROR";
    }
    
    if (result === "ERROR") {
        return "ERROR";
    }
    
    // Round long decimals
    if (typeof result === 'number' && !Number.isInteger(result)) {
        const resultStr = result.toString();
        if (resultStr.length > 12) {
            result = Math.round(result * 1000000000) / 1000000000;
        }
    }
    
    return result;
}

function updateDisplay(value) {
    entryNode.textContent = value;
}

function updateHistory(text) {
    historyNode.textContent = text;
}

function clearCalculator() {
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    shouldResetDisplay = false;
    justCalculated = false;
    updateDisplay('0');
    updateHistory('0');
}

function handleNumber(num) {
    // If we just calculated, start fresh
    if (justCalculated) {
        clearCalculator();
    }
    
    // If we should reset display (after operator), clear it first
    if (shouldResetDisplay) {
        updateDisplay(num);
        shouldResetDisplay = false;
    } else {
        // Append to display
        if (entryNode.textContent === '0') {
            updateDisplay(num);
        } else {
            updateDisplay(entryNode.textContent + num);
        }
    }
}

function handleOperator(operator) {
    const currentValue = parseFloat(entryNode.textContent);
    
    // If we just calculated, use the result as first number
    if (justCalculated) {
        firstNumber = currentValue;
        currentOperator = operator;
        updateHistory(`${firstNumber} ${operator} `);
        shouldResetDisplay = true;
        justCalculated = false;
        return;
    }
    
    // If there's no first number yet, store current value as first number
    if (firstNumber === null) {
        firstNumber = currentValue;
        currentOperator = operator;
        updateHistory(`${firstNumber} ${operator} `);
        shouldResetDisplay = true;
        return;
    }
    
    // If there's a first number and operator, but display wasn't reset yet
    // This means consecutive operator press - just replace the operator
    if (shouldResetDisplay) {
        currentOperator = operator;
        updateHistory(`${firstNumber} ${operator} `);
        return;
    }
    
    // If we have first number, operator, and a second number has been entered
    // Calculate the result first, then set up for next operation
    if (currentOperator && firstNumber !== null) {
        secondNumber = currentValue;
        const result = operate(currentOperator, firstNumber, secondNumber);
        
        if (result === "ERROR") {
            alert("Error: Cannot divide by zero!");
            clearCalculator();
            updateDisplay("Error");
            return;
        }
        
        updateDisplay(result);
        firstNumber = result;
        currentOperator = operator;
        updateHistory(`${result} ${operator} `);
        shouldResetDisplay = true;
    }
}

function handleEquals() {
    // Need first number, operator, and second number to calculate
    if (firstNumber === null || currentOperator === null || shouldResetDisplay) {
        return; // Not enough information to calculate
    }
    
    secondNumber = parseFloat(entryNode.textContent);
    const result = operate(currentOperator, firstNumber, secondNumber);
    
    if (result === "ERROR") {
        alert("Error: Cannot divide by zero!");
        clearCalculator();
        updateDisplay("Error");
        return;
    }
    
    updateHistory(`${firstNumber} ${currentOperator} ${secondNumber} = `);
    updateDisplay(result);
    
    // Reset state but keep result for potential reuse
    firstNumber = result;
    secondNumber = null;
    currentOperator = null;
    justCalculated = true;
}

function handleDecimal() {
    // If we just calculated, start fresh with "0."
    if (justCalculated) {
        clearCalculator();
        updateDisplay('0.');
        return;
    }
    
    // If we should reset display (after operator), start with "0."
    if (shouldResetDisplay) {
        updateDisplay('0.');
        shouldResetDisplay = false;
        return;
    }
    
    // Only add decimal if there isn't one already
    if (!entryNode.textContent.includes('.')) {
        updateDisplay(entryNode.textContent + '.');
    }
}

function handleBackspace() {
    if (justCalculated) {
        return; // Don't backspace on results
    }
    
    let currentText = entryNode.textContent;
    if (currentText.length > 1) {
        updateDisplay(currentText.slice(0, -1));
    } else {
        updateDisplay('0');
    }
}

function input(node) {
    const text = node.textContent;
    
    if (node.id === 'clr') {
        clearCalculator();
    } else if (text.length > 1) {
        // Backspace button
        handleBackspace();
    } else if (OPERANDS.includes(text)) {
        handleOperator(text);
    } else if (NUMBERS.includes(text)) {
        handleNumber(text);
    } else if (text === '.') {
        handleDecimal();
    } else {
        // Equals button
        handleEquals();
    }
    
    // Debug output
    console.log({
        display: entryNode.textContent,
        first: firstNumber,
        second: secondNumber,
        operator: currentOperator,
        shouldReset: shouldResetDisplay,
        justCalc: justCalculated
    });
}

const buttons = document.querySelectorAll(".buttons button");
for (const button of buttons) {
    if (!button.id) button.id = button.textContent;
    button.addEventListener('click', () => input(button));
}

// Keyboard support
window.addEventListener('keydown', (e) => {
    // Ignore modifier combos (Ctrl/Alt/Meta) to avoid interfering with browser shortcuts
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const key = e.key;

    // Digits (both numpad and top row) - key gives '0'..'9'
    if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleNumber(key);
        return;
    }

    // Operators: + - * /
    if (['+', '-', '*', '/'].includes(key)) {
        e.preventDefault();
        handleOperator(key);
        return;
    }

    // Enter or '=' to calculate
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
        return;
    }

    // Decimal point ('.' or numpad decimal)
    if (key === '.' ) {
        e.preventDefault()
        handleDecimal();
        return;
    }

    // Backspace to delete last digit
    if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
    }

    // Escape or Delete to clear calculator
    if (key === 'Escape' || key === 'Delete') {
        e.preventDefault();
        clearCalculator();
        return;
    }
});