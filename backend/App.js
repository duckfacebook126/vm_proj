let count =0;
let count_sum= count+1;
function iseven(num){


if (num%2===0)
{

return true


}
else{return false}
}

function is_email(mail){

    if(mail.includes("@")){return true}

    else{ return false}
}

console.log(iseven(20));

console.log(is_email("examplegmail.com"));
let arr=[1,2,3,45]
red_arr=arr.reduce((current, prev)=>{return current+prev})
console.log(red_arr);
let i=0
while(i<8)
{i++
    console.log(i);
}

do{i++;
    console.log(i)
}
while(i<8)


  
//// callback function implementation
function logMessage() {
    console.log("This is a callback function");
}

function executeCallback(callback) {
    callback();  // Calls the callback function
}

executeCallback(logMessage);


//example of handling asynchnorous functions in js
function func1(callback)
{
    setTimeout(()=>{console.log(" task1");callback();},3000)
console.log("asynchnorous functions has been handled");
}


function func2(func){
console.log("task2");
console.log("task3");
}

func1(func2);
//closure function js


function closure()
{
count=0;
function increase_count()

{

    count++;
    console.log(`increase count is${count}`);
}

function decrease_count()

{

    count--;
    console.log(`decrease count is${count}`);
}

function curr_count()
{

    console.log(`current count is ${count}`);
}


    return{increase_count:increase_count, decrease_count:decrease_count,current_count:curr_count}
}

const counter= closure();
counter.increase_count();

counter.decrease_count();

counter.current_count();

///destructuring  and spread operator

let arr2=[1,2,3,4,5,6,7,8,9,10,11];

//each array elements will be asigned to corresponding variable in the array
let [first, ,second ,...rest] = arr2;
console.log(arr2);
console.log(second);
//it is used to passed the multiple values of array into the function
let wer=[2,3,4,];


function sun(a1,aw2,a3)
{

    return a1+aw2+a3;
}
 const sum =sun(...wer);
 console.log(sum);
// also can put arrayy values in to an object's key value pairs
let arrt=[1,2,4,3]
let obj1={...arrt}
console.log(obj1);
//also used to replace object attributes with custom values
    let man={name:"Hussain", age:10};
            console.log({...man,name:"Jon"})

//classes in js

class Animal{
    constructor(name,age){
        this.name=name;
        this.age=age;
    }

    eat(){
        console.log(`${this.name} is eating`);
    }

    sleep(){
        console.log(`${this.name} is sleeping`);
    }
}                       

//promises are used to accept or reject the request in asynchnorous code

function walk()
{


    return new Promise((resolve,reject)=>{
    setTimeout(()=>{resolve(" promise has been resolved walked")},3000)
                       }
                      ); 
}
walk().then(result => {
    console.log(result); // Output: promise has been resolved walked
});
// rest parameters are used to apssed the multiple values into the unction and also used to
// typically pass an array into function uses 3 dots

function sum_sp(...numbers){
let sum =0;
for(number of numbers){

    sum=sum+number
}
console .log (`This function uses the ..rest parameters sum is ${sum}`)
return sum;
}

sum_sp(1,2,3,4,5);


//generator functions are used for pausing the execution and then resuming the 
// execiution that will help with the calling the on demand iteration
// yield key word willl pause the execution and return the value written after yield
// function* is used for the decalring of the generator function
function* fib_gen()
{
let  a=0;
b=1;
while(true) {

yield a;
let temp=a;
a=b
b=temp+a;
}
}

const sol= fib_gen();
console.log(sol.next());
console.log(sol.next());
console.log(sol.next());


//iterator  are used as generators tha iterate
// they alos return the boolean value for the success or failure of the boolean 
function* iterator_0(start, end)
{

    for(i=start;i<=end;i++){

        yield i;
    }
}

const number_iterator = iterator_0(1,5);
console.log(number_iterator.next());
console.log(number_iterator.next());
console.log(number_iterator.next());
console.log(number_iterator.next());


/// \dom manipulation  functions and working is giving is below

//console.log("DOM manipulation")
//const getebyid= document.getElementById("Paragraph-container1");
//console.log(getebyid);

//const getqs= document.querySelector("the-body")
//console.log(getqs);

//const getqsga= document.querySelectorAll("Paragraph-container");


//console.log(getqsga);
//console.dir(document);
document.body.style.backgroundColor="hsl(0,0%,15%)"

///using fetch to bring in the data from the api

fetch("https://pokeapi.co/api/v2/pokemon/pikachu")