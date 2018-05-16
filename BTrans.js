

var binToOct = {"000": "0", "001": "1", "010":"2", "011": "3", "100": "4", "101":"5", "110": "6", "111": "7"};
var binToHex = {"0000": "0", "0001": "1", "0010":"2", "0011": "3", "0100": "4", "0101":"5", "0110": "6", "0111": "7",
                "1000": "8", "1001": "9", "1010":"A", "1011": "B", "1100": "C", "1101":"D", "1110": "E", "1111": "F"};
var hexToBin = {'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F':15}

/**
* The Entry point into the converter
* Reads input from HTML form, checks its validity
* and passes it to the convertNumber function if the input is valid.
*/
function runConverter(){
    var fromBase = document.getElementById('fromBasePicker').value;
    var toBase = document.getElementById('toBasePicker').value;
    var number = document.getElementById('numberInputId').value;
    if(!inputIsValid(number, fromBase)){
        document.getElementById('output').innerHTML= "Invalid input: must enter nonnegative number corresponding to base";
        return;
    }
    let result = convertNumber(number, fromBase, toBase);
    document.getElementById('output').innerHTML= "Result is " + result;
}

function inputIsValid(number, base){
    if(base != 16 && isNaN(number)){
        alert("not a number");
        return false;
    }
    if(number < 0){
        alert("negative number");
        return false;
    }
    if(number.search(getPattern(base)) == -1){
        alert("didn't match");
        return false;
    }
    return true;
}

function getPattern(base){
    if(base == 2){
        return /^[0-1]+$/;
    }
    if(base == 8){
        return /^[0-7]+$/;
    }
    if(base == 10){
        return /^[0-9]+$/;
    }
    if(base == 16){
        return /^[0-9a-fA-F]+$/;
    }
}

function convertNumber(number, fromBase, toBase){
    if(fromBase == toBase){
        return number;
    }

    let binaryVal = number;
    if(fromBase != 2){
        binaryVal = getBinaryVal(number, fromBase);
    }


    if(toBase == 2){
        return binaryVal;
    }
    return binaryToResult(binaryVal, toBase);
}

function getBinaryVal(number, fromBase){
    if(fromBase == 10){
        return decToBin(number);
    }
    if(fromBase == 16){
        number = number.toUpperCase();
    }
    return toBinFromMap(number, fromBase);
}

function toBinFromMap(number, fromBase){
    let binVal = "";
    var i;
    for(i = 0; i < number.length; i++){
        let c = number.charAt(i);
        if(fromBase == 8){
            binVal = binVal.concat(getKeyByVal(binToOct, c));
        }
        else {
            binVal = binVal.concat(getKeyByVal(binToHex, c));
        }
    }
    return binVal;
}

function binaryToResult(binVal, toBase){
    if(toBase == 10){
        return binToDec(binVal);
    }
    let result = "";
    let blockSize = (toBase == 8)? 3: 4;
    let object = (toBase == 8)? binToOct: binToHex;
    binVal = formatBinString(binVal, blockSize);
    let numBlocks = ~~(binVal.length/blockSize);
    var i;
    for(i = 0; i < numBlocks; i++){
        let block = binVal.substring(blockSize*i, blockSize*(i+1));
        result = result.concat(object[block]);
    }
    return result;
}

function formatBinString(binVal, blockSize){
    if(binVal.length == blockSize){
        return binVal;
    }
    let rem = binVal.length % blockSize;
    let leadingZeroes = (rem == 0)? 0: blockSize-rem;
    let zStr = "";
    var i;
    for(i = 0; i < leadingZeroes; i++){
        zStr += '0';
    }
    return zStr.concat(binVal);
}

function decToBin(number){
    let binVal = "";
    if(number == 0 || number == 1){
        return number;
    }
    while(number > 0){
        let isDivis = number % 2;
        binVal += (isDivis == 1)? "1":"0";
        number = ~~(number/2);
    }
    let splitStr = binVal.split("");
    let reversed = splitStr.reverse();
    return reversed.join("");
}

function binToDec(number){
    let decVal = 0;
    var i;
    for(i = number.length-1; i >= 0; i--){
        let power = number.length-i-1;
        if(number.charAt(i) == "1"){
            decVal += (2 ** power);
        }
    }
    return decVal;
}

function getKeyByVal(object, val){
    return Object.keys(object).find(key => object[key] === val);
}
