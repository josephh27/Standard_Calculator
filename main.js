const calculatorScreen = document.querySelector(".screen");
const numberButtons =  document.querySelectorAll('.num');
const operands = document.querySelector('.operand');
const operators = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.clear');
const equalButton = document.querySelector('.equal');
const backspaceButton = document.querySelector('.backspace');
const memoryPlus = document.querySelector('.memory-plus');
const memoryMinus = document.querySelector('.memory-minus');
const memoryRecallClear = document.querySelector('.memory-recall-clear');
const binaryButton = document.querySelector('.binary');
const decimalButton = document.querySelector('.dec');

class Calculator {
    constructor(previousOperand, currentOperand) {
        this.previousOperand = previousOperand;
        this.currentOperand = currentOperand;
        this.currentOperator = "";
        this.isBetweenOperation = false;
        this.operatorClicked = false;
        this.memoryValue = 0;
        this.refreshScreen = false;
        this.fromBinary = false;
    }

    addToScreen(number) {
        this.operatorClicked = false;
        if ((this.isBetweenOperation && this.currentOperand === '') || this.refreshScreen) {
            this.currentOperand = number.toString()
            this.refreshScreen = false;
            this.displayToScreen(this.currentOperand);
            return;
        }

        if ((this.currentOperand.length >= 12 && !this.currentOperand.includes('.'))) {
            return;
        }
        if (number === '.' && this.currentOperand.includes('.')) {
            return;
        } 
        
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.displayToScreen(this.currentOperand);
    }

    clearScreen() {
        this.operatorClicked =  false;
        this.previousOperand = "";
        this.currentOperand = "";
        calculatorScreen.innerText = "";
        this.isBetweenOperation = false;
        this.memoryValue = 0;
    }

    setOperator(operator) {
        if (this.operatorClicked) {
            this.currentOperator = operator;
            return;
        }
        if (this.isBetweenOperation) {
            this.calculate();
            this.isBetweenOperation = false;
        }
        this.currentOperator = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
        this.isBetweenOperation = true;
        this.operatorClicked =  true;
    }

    memoryAddition() {
        if (this.currentOperand === "" || !parseFloat(this.currentOperand)) return;
        this.calculate();
        this.memoryValue = parseFloat(this.memoryValue) + parseFloat(this.currentOperand);
        this.refreshScreen = true;
    }

    memorySubtraction() {
        if (this.currentOperand === "" || !parseFloat(this.currentOperand)) return;
        this.calculate();
        this.memoryValue = parseFloat(this.memoryValue) - parseFloat(this.currentOperand);
        this.refreshScreen = true;
    }

    memoryRecallClear() {
        this.currentOperand = parseFloat(this.memoryValue);
        this.displayToScreen(this.currentOperand);
        this.refreshScreen = true;
    }

    binaryConvert() {
        if (this.currentOperand === "") return;
        this.calculate();
        this.operator = ""
        this.refreshScreen = true;
        if (parseFloat(this.currentOperand) > 0) {
            if (parseFloat(this.currentOperand).toString(2).length > 12) {
                this.displayToScreen("ERROR");
            } else {
                this.displayToScreen(parseFloat(this.currentOperand).toString(2));
            }
        } else {
            this.currentOperand = ((Math.abs(this.currentOperand)).toString(2)).replace(/[01]/g, function (match) {
                return match === "0" ? "1" : "0";
            });
            
            if ((parseFloat(this.currentOperand, 2) + 1).toString(2).length > 12) {
                this.displayToScreen("ERROR");
            } else {
                this.displayToScreen((parseFloat(this.currentOperand, 2) + 1).toString(2));
            }
        }
        this.currentOperand = "";
        this.previousOperand = "";
        this.fromBinary = true;
    }

    decimalConvert() {
        let screenValue = calculatorScreen.innerText;
        let parsedValue = parseInt(screenValue, 2);
        if (Number.isNaN(parsedValue)) return;
        this.currentOperand = parsedValue;
        this.refreshScreen = false;
        this.displayToScreen(this.currentOperand);
    }

    backspace() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        console.log(this.currentOperand);
        this.displayToScreen(this.currentOperand);
    }

    displayToScreen(text) {
        if (text.toString().length > 12) {
            calculatorScreen.innerText = convertToScientificNotation(text);
        } else {
            calculatorScreen.innerText = text;
        }
    }

    calculate() {
        if (this.previousOperand === "") return;
        switch (this.currentOperator) {
            case '+':
                this.currentOperand = parseFloat(this.previousOperand) + parseFloat(this.currentOperand);
                this.displayToScreen(this.currentOperand);
                this.currentOperator = "";
                break
            case '-':
                this.currentOperand = parseFloat(this.previousOperand) - parseFloat(this.currentOperand);
                this.displayToScreen(this.currentOperand);
                this.currentOperator = "";
                break
            case '*':
                this.currentOperand = parseFloat(this.previousOperand) * parseFloat(this.currentOperand);
                this.displayToScreen(this.currentOperand);
                this.currentOperator = "";
                break
            case '/':
                this.currentOperand = parseFloat(this.previousOperand) / parseFloat(this.currentOperand);
                this.displayToScreen(this.currentOperand);
                this.currentOperator = "";
                break
        }
    }    
}

const calculator = new Calculator("", "");

// Event listeners for the buttons
numberButtons.forEach((elem) => {
    elem.addEventListener('click', (e) => {
        calculator.addToScreen(e.currentTarget.dataset.value);
    })
})

operators.forEach((elem) => {
    elem.addEventListener('click', (e) => {
        calculator.setOperator(e.currentTarget.dataset.value);
    })
})

// Event listenrs for each buttons
equalButton.addEventListener('click', () => calculator.calculate());
clearButton.addEventListener('click', () => calculator.clearScreen());
backspaceButton.addEventListener('click', () => calculator.backspace());
memoryPlus.addEventListener('click', () => calculator.memoryAddition());
memoryMinus.addEventListener('click', () => calculator.memorySubtraction());
memoryRecallClear.addEventListener('click', () => calculator.memoryRecallClear());
binaryButton.addEventListener('click',  () => calculator.binaryConvert())
decimalButton.addEventListener('click',  () => calculator.decimalConvert())

function convertToScientificNotation(numberString) {
    const number = parseFloat(numberString);
    const scientificNotation = number.toExponential(5);
    return scientificNotation;
}
  