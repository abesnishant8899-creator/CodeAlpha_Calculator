const previousTextElement = document.getElementById('previousOperand');
const currentTextElement = document.getElementById('currentOperand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const equalsButton = document.getElementById('equals');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;

// --- Core functions ---
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    if (currentOperand === '0') return;
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
}

function chooseOperation(selectedOperation) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = selectedOperation;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '−':
        case '-':
            computation = prev - current;
            break;
        case '×':
        case '*':
            computation = prev * current;
            break;
        case '÷':
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function updateDisplay() {
    currentTextElement.innerText = currentOperand;
    if (operation != null) {
        previousTextElement.innerText = `${previousOperand} ${operation}`;
    } else {
        previousTextElement.innerText = '';
    }
}

// --- Event Listeners (UI Click) ---
numberButtons.forEach(button => {
    button.addEventListener('click', () => appendNumber(button.innerText));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => chooseOperation(button.innerText));
});

equalsButton.addEventListener('click', compute);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);

// --- Bonus: Keyboard Support ---
document.addEventListener('keydown', (e) => {
    let key = e.key;

    // Normalizing standard keyboard keys to math symbols used in UI
    if (key === '*') key = '×';
    if (key === '/') key = '÷';
    if (key === '-') key = '−';

    if ((key >= '0' && key <= '9') || key === '.') {
        appendNumber(key);
        triggerVisualEffect(key);
    } else if (key === '+' || key === '−' || key === '×' || key === '÷') {
        chooseOperation(key);
        triggerVisualEffect(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        compute();
        triggerVisualEffect('=');
    } else if (key === 'Backspace') {
        deleteNumber();
        triggerVisualEffect('DEL');
    } else if (key === 'Escape') {
        clear();
        triggerVisualEffect('AC');
    }
});

// UI key click effect simulation on physical key press
function triggerVisualEffect(key) {
    let targetButton;
    if (key === 'AC' || key === 'DEL' || key === '=') {
        targetButton = document.getElementById(key === 'AC' ? 'clear' : key === 'DEL' ? 'delete' : 'equals');
    } else if (['+', '−', '×', '÷'].includes(key)) {
        targetButton = document.querySelector(`[data-operator="${key}"]`);
    } else {
        targetButton = Array.from(numberButtons).find(btn => btn.innerText === key);
    }

    if (targetButton) {
        targetButton.classList.add('active-key');
        setTimeout(() => targetButton.classList.remove('active-key'), 100);
    }
}