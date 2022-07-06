const OPERANDS = ['+', '-', '*', '/'];

function add(a,b){
    if (typeof (a + b) != "number") return NaN;
    else return a + b;
}

function subtract(a,b){
    if (typeof (a - b) != "number") return NaN;
    else return a - b;
}

function multiply(a,b){
    if (typeof (a * b) != "number") return NaN;
    else return a * b;
}

function divide(a,b){
    if (typeof (a / b) != "number") return NaN;
    else return a / b;
}

function operate(op, num1, num2){
    if (op == '+') add(num1, num2);
    else if (op == '-') subtract(num1, num2);
    else if (op == '*') multiply(num1, num2);
    else if (op == '/') divide(num1, num2);
    else alert(`${op} is not a supported operand.`);
}