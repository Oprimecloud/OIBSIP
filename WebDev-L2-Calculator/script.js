/*===================================
calculator class definition
=====================================*/
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear(); //set initial state as soon as the calculator is created
        }
        //clears all the entire screen and resets the calculator to its initial state
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }
    //removes the last typed character from the current operand//
    delete() {
        if (this.currentOperand === 'can\'t be divided by 0') 
            { this.clear();
                return; }
                // if it's just '0' or empty, don't delete anything
                
                if(this.currentOperand === '0')
                    return;
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if(this.currentOperand === '') this.currentOperand = '0';}

                //Adds a number or decimal to the screen.
                appendNumber(number) {
                    if(this.currentOperand === 'can\'t be divided by 0') this.clear();
                    //prevent mutiple decimals in the current operand//
                    if (number === '.' && this.currentOperand.includes('.')) return;
                    //overwrite the initial '0' unless the user is trying to add a decimal point//
                    if (this.currentOperand === '0' && number !== '.') {
                        this.currentOperand = number.toString();
                    } else {    
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }
            //select the mathematical operation (+,-,*,/) to be performed//
            chooseOperation(operation) {
                if (this.currentOperand === 'can\'t be divided by 0') return;
                if (this.currentOperand === '' && this.previousOperand === '') return;
               
                // if we already have a previous number, compute the result first (OPERATOR CHAINING) 
                if (this.previousOperand !== '') {
                    this.compute();
                }

                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
            }

           // Selects the mathematical operation (+, -, *, /)
    chooseOperation(operation) {
        if (this.currentOperand === 'can\'t be divided by 0') return;
        if (this.currentOperand === '' && this.previousOperand === '') return;
        
        // If we already have a previous number, compute the result first (OPERATOR CHAINING)
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    //performs the calculation based on the selected operation and updates the current operand with the result (NO eval() USED)//
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // If user hits equals without a proper equation, do nothing
        if (isNaN(prev) || isNaN(current)) return;

        // Mathematical logic using a switch statement
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−': // 
                computation = prev - current;
                break;
            case '×': // 
                computation = prev * current;
                break;
            case '÷': // Error handling for division by zero
                if (current === 0) {
                    this.currentOperand = 'can\'t be divided by 0';
                    this.operation = undefined;
                    this.previousOperand = '';
                    return; // 
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    //updates the calculator display with the current and previous operands, as well as the selected operation//
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

/* =========================================
   ELEMENT SELECTION
   ========================================= */
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('.btn-operator');
const equalsButton = document.querySelector('.btn-equals');
const deleteButton = document.querySelector('.btn-delete');
const clearButton = document.querySelector('.btn-clear');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

/* =========================================
   INITIALIZE CALCULATOR & EVENT LISTENERS
   ========================================= */
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Attach Event Listeners to Number Buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

// Attach Event Listeners to Operation Buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

// Equals Button
equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Clear Button
clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Delete Button
deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});