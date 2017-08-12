var exp=""; 
var curValue; 
var expArr = []; 
var valueArr= []; 

$(document).ready(function() {

	$(".button").on("click" , function() {
		curValue = $(this).attr("name"); 
		console.log("ATTR: " + $(this).attr("name"));
		if(curValue == "AC") {
			$(".calc-values").html(curValue);
			expArr=[]; 
			valueArr = []; 
			exp = ""; 

			log_("EXP ARR: " + expArr); 
			log_("VALUE ARR: " + valueArr);
		} else if (curValue == "C") {
			if(exp.length>0) {
				exp = exp.substring(0,exp.length -1); 
			}

		}else if (curValue == "="){
			expArr=[]; 
			valueArr = []; 
			// evaluate expression
			convertExpressionString(exp);
			if(valueArr.length>1 || expArr.length>0) {
				$(".calc-values").html(arrayPeek("Incorrect Expression"));
			} else {
				$(".calc-values").html(arrayPeek(valueArr));
			}
		}else {
			exp+=curValue; 
			$(".calc-values").html(curValue);
		}
		console.log(exp);
		$(".expressions").html(exp);
	});


});

function convertExpressionString(str) {
	var curChCode; 
	var numValue; 
	var operatorValue; 
	var prevOperatorIndex=-1; 

	var fStr = friendlyExpressionMaker(str);

	for (var i=0;i<fStr.length;i++){
		curChCode =fStr.charCodeAt(i)
		//+ - * /
		if(isOperator(curChCode)) {
			numValue = fStr.substring(prevOperatorIndex+1, i);
			prevOperatorIndex=i;
			expressionAlgo(numValue);
			operatorValue = fStr.substring(i,i+1);
			expressionAlgo(operatorValue);
		} else if ((i == fStr.length -1) && !isOperator(curChCode)) {
			numValue = fStr.substring(prevOperatorIndex+1,fStr.length);
			expressionAlgo(numValue); 
		}
	}

	while(expArr.length>0) {
		let curOperator= arrayPop(expArr); 
		let secNum = arrayPop(valueArr);
		let firstNum= arrayPop(valueArr); 
		let res = applyOp(curOperator, firstNum, secNum); 
		arrayPush(valueArr, res);
	}
	console.log("RESULT ARRAY: " + arrayPeek(valueArr)); 
	$(".calc-values").html(arrayPeek(valueArr));

} 

function expressionAlgo(val) {


	let num = Number(val); 
	if(!isOperator(val.charCodeAt(0))) {
		log_("## NUM: " + val); 
		arrayPush(valueArr , val); 
	} else if (isNaN(num)) {
		log_("%%OP: " + val);
		//must be + - * / 
		if(expArr.length == 0 || !isArrPrecedenceGreaterEqual(arrayPeek(expArr) , val)) {
			arrayPush(expArr,val); 
		} else if(isArrPrecedenceGreaterEqual(arrayPeek(expArr) , val)) {
			while(isArrPrecedenceGreaterEqual(arrayPeek(expArr) , val)) {
				log_("arrayPeek(expArr): " + arrayPeek(expArr)); 
				log_("VALUE: " + val); 
				let secNum = arrayPop (valueArr);
				let firstNum = arrayPop(valueArr); 
				let oper = arrayPop(expArr); 
				let res = applyOp(oper , firstNum,secNum);
				arrayPush(valueArr , res);
				log_("expArr" + expArr);
				log_("valueArr"  + valueArr) ;
			}
			arrayPush(expArr , val);
		} 
	} else {
		log_("STH ELSE");
	}

	log_("VALUE ARR: "+ valueArr);
	log_("EXP ARR: " + expArr);

}

function isOperator1(str) {
	console.log("CHAT CODE COMING: " + str);
	if(str="+" || str == "-" || str == "+" || str == "/") {
		return true;
	} 
	return false; 
}


function isOperator(curChCode) {
	if(curChCode==43 || curChCode == 45 || curChCode == 42 || curChCode == 47) {
		return true;
	} 
	return false; 
}

function friendlyExpressionMaker(str) {
	if(str == null || str.length ==0) {
		return ""; 
	} 

	let prefix ="";
	let postFix= ""; 
	
	let last = str.charAt(str.length-1); 
	let first = str.charAt(0); 
	
	if(first =="+"|| first == "-") {
		prefix = "0"; 
	}

	if(last == "+" || last == "-") {
		postFix = "0"; 
	}

	var newStr = prefix+str+postFix;
	return newStr;  
}


function arrayPush(arr , value) {
	arr.unshift(value); 

}

function arrayPop(arr) {
	if(arr!=null || arr.size() !=0) {
		return arr.shift(); 
	} else {
		log_("ARRAY POP  ELSE");
	}
}

function arrayPeek(arr) {
	if(arr == null || arr.length == 0) {
		return null; 
	} else {
		return arr[0]; 
	}
}

function isArrPrecedenceGreaterEqual(arrSymbol , curSymbol) {
	if(arrSymbol == null)
		return ;
	if(curSymbol == "+" && (arrSymbol == "+" || arrSymbol == "-" || arrSymbol == "*" || arrSymbol=="/")) { 
		return true;  
	} else if (curSymbol == "-" && (arrSymbol == "+" ||arrSymbol == "-" || arrSymbol == "*" || arrSymbol=="/")) {
		return true; 
	} else if (curSymbol== "*" && (arrSymbol == "*" || arrSymbol == "/")) {
		return true; 
	}else if (curSymbol== "/" && (arrSymbol == "*" || arrSymbol == "/")) {
		return true; 
	}
	return false; 
} 

function applyOp(operator , op1 , op2 ) {
	op1 = Number(op1);
	op2 = Number(op2); 
	if(operator == "+") {
		return op1 + op2; 
	} else if (operator == "-") {
		return op1 - op2;
	} else if (operator == "*") {
		return op1 * op2; 
	} else if (operator == "/") {
		return op1 / op2; 
	}
}

function log_(str) {
	console.log(str); 
}