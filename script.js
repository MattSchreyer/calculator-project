const OPERANDS = ['+', '-', '*', '/'];
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
const entryNode = document.querySelector('#current');
const historyNode = document.querySelector('#prev');

let preVal = '',
    currVal = ''
    currOp = ''
    lastType = false; //T- operand F- number

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
function operate(num1, num2){
    if (currOp == '+') add(num1, num2);
    else if (currOp == '-') return subtract(num1, num2);
    else if (currOp == '*') return multiply(num1, num2);
    else if (currOp == '/') return divide(num1, num2);
    else alert(`${currOp} is not a supported operand.`);
}

function input(node){
    if (node.id == 'clr') clearDisp();
    else if (node.textContent.length > 1){ //delete
        entryNode.textContent = entryNode.textContent.slice(0,-1);
        if (entryNode.textContent.length == 1) entryNode.textContent = '0';
    }
    else if (OPERANDS.includes(node.textContent)) {
        preVal = parseFloat(entryNode.textContent);
        if (historyNode.textContent == "0") {
            historyNode.textContent = "".concat(
                entryNode.textContent, " ", node.textContent, " ");
            entryNode.textContent = '0';
        }
        else if (node.textContent == "=") {
            
        }
        lastType = false;
    }
    else if (NUMBERS.includes(node.textContent)){
        if (entryNode.textContent=="0") 
            entryNode.textContent = node.textContent;
        else if (node.textContent == '.')
            entryNode.textContent = entryNode.textContent.concat(".");
        else
            entryNode.textContent = 
                entryNode.textContent.concat(node.textContent);
        lastType = true;
    }

    let debug = {label: node.textContent, disp: entryNode.textContent,
                 newDisp:entryNode.textContent.concat(node.textContent), 
                 inNumbers: NUMBERS.includes(node.textContent), 
                 preVal: preVal, currVal: currVal, currOp:currOp};
    console.log(debug);
}

function clearDisp(){
    preVal = '';
    currVal = '';
    currOp = '';
    lastType = false;
    entryNode.textContent = "0";
    historyNode.textContent = "0";
}

const buttons = document.querySelectorAll(".buttons button")
for (const button of buttons) {
    if (!button.id) button.id = button.textContent;
    button.addEventListener('click', () => input(button));
}