const username="";
const welcome_msg=document.getElementById("msg")
welcome_msg.textContent+= username ===""?" guest":username;
const body =document.body;
const div = document.createElement("div");
body.append(div);
div.textContent="heyyyy?"

const name="husain"
const name_tell=document.querySelector("#para1");
name_tell.innerHTML=`<h2>${name}</h2>`;

const all_p=document.querySelectorAll('p')
console.log(all_p.textContent);
name_tell.remove();

///query selector slelct will only select the elements that are available in the same class name, id or tag
//meanwhile queryselector will only slelct the the single ekement that is aadded to it
//const elementById = document.querySelector('#myId'); for id
//
//selecting class===const elementsByClass = document.querySelectorAll('.myClass');
//for element const elementById = document.querySelector('p'); will select the paragraph element

//const nextSibling = document.querySelector('p + ul'); // Selects the <ul> element that follows the first <p> element

//const allSiblings = document.querySelector('p ~ ul'); // Selects all <ul> elements that follow the first <p> 
//sibling have the same parent classs

//set attribute
welcome_msg.setAttribute('class', 'fixer');

//changing the property of the style object will change its styling atttributez

welcome_msg.style.color="red";
welcome_msg.style.fontSize="64px";

//event listners help to generate an event on an action lke on click, and display interactive webpage like blurring etc.
// events like mouseover, mouseout
function changecolor(event)
{

event.target.style.backgroundColor="pink"
event.target.textContent="Ouch"
}

welcome_msg.addEventListener("click",changecolor)

document.addEventListener("keydown",(event) =>{
    switch(event.key){
        case "ArrowUp":
            welcome_msg.textContent="you have pressed the arrow key up please release to erase the message"
        break;
        case "ArrowDown":
            welcome_msg.textContent=""
            break


}});



async function poki_data()
{

    const poki_name = document.getElementById("pokemon-name").value.toLowerCase();
try{
    const response=await fetch(`https://pokeapi.co/api/v2/pokemon/${poki_name}`)

    if(!response.ok){ //means the pokemon is not available or not avaible

throw  new Error("could not fetch resource");

    }



    const data =await response.json();
    const dis_image= data.sprites.front_default;
    const imageelement= document.getElementById("poki-img");
        imageelement.src=dis_image;
        imageelement.style.display="block";
    

}
    catch(error){

        console.log("error");
    }

}

//xmlhttp request  object will have a response object as part of it

function show_countries(){
   const xhr= new XMLHttpRequest();
const p_req=document.getElementById("pk-btn");
xhr.open('GET','https://restcountries.com/v3.1/all',true);
xhr.onload= function(){
if(xhr.status==200)
{
        let countries= JSON.parse(this.response)

countries.forEach(country=>{
   
    const country_card=document.createElement('div')
    country_card.innerHTML=country.name.common;
    document.getElementById("feed").appendChild(country_card);
}

)
}

}
xhr.send();
}


function closure()
{
count=0;
let display_count=  document.getElementById("closure-counter")

function increase_count()

{

    count++;
    display_count.textContent=(`increased count is ${count}`);
}

function decrease_count()

{

    count--;
    display_count.textContent=(`decreased count is${count}`);
}

function curr_count()
{
    display_count.textContent=(`  current count is${count}`);
}

function reset_count()
{
count=0;
    display_count.textContent=(` reset count is${count}`);
}


    return{increase_count:increase_count, decrease_count:decrease_count,curr_count:curr_count, reset_count:reset_count}
}

const counter= closure();

const closure_counter_increase=document.getElementById("btn-increase")

function counter_increase()
{

    counter.increase_count();
}

closure_counter_increase.addEventListener("click",counter_increase)

const closure_counter_decrease=document.getElementById("btn-decrese")

function counter_deccrease()
{

    counter.decrease_count();
}

closure_counter_decrease.addEventListener("click",counter_deccrease)



const closure_counter_reset=document.getElementById("btn-reset")


 function counter_reset()
 {

    counter.reset_count();
 }

 closure_counter_reset.addEventListener("click",counter_reset)

function post_req(){
    const newuser ={name:"Husain",job:"software Engineeer"}

    const req= new XMLHttpRequest();
    req.open('POST','https://reqres.in/api/users');

    req.setRequestHeader('Content-Type', 'application/json') ;  
    
    req.onload=(function (){
  if(req.status===201 && req.readyState===4)
  {
    const dis_put = document.getElementById("ajax-i")
    const res=JSON.parse(req.responseText)
    dis_put.textContent=JSON.stringify(res);
  }

  else{ throw new Error ("Bad request");}

    });
    req.send(JSON.stringify(newuser))
}


  const post_req_btn=document.getElementById("post");
  post_req_btn.addEventListener("click",post_req)


  //put request

  function put_req(){
    const newuser ={name:"tom",job:"data engineer"}

    const req= new XMLHttpRequest();
    req.open('PUT','https://reqres.in/api/users/2');

    req.setRequestHeader('Content-Type', 'application/json') ;  
    
    req.onload=(function (){
  if(req.status===200 && req.readyState===4)
  {
    const dis_put = document.getElementById("ajax-i")
    const res=JSON.parse(req.responseText)
    dis_put.textContent=JSON.stringify(res);
  }

  else{ throw new Error ("Bad request");}

    });
    req.send(JSON.stringify(newuser))
}


  const put_req_btn=document.getElementById("put");
  put_req_btn.addEventListener("click",put_req)
//delete request

function delete_req(){
    

    const req= new XMLHttpRequest();
    req.open('DELETE','https://reqres.in/api/users/2');

    
    req.onload=(function (){
  if(req.status===204 && req.readyState===4)
  {
    const dis_put = document.getElementById("ajax-i")
    const res=JSON.parse(req.responseText)
    dis_put.textContent=JSON.stringify(res);
  }

  else{ throw new Error ("Bad request");}

    });
    req.send();
}


  const delete_req_btn=document.getElementById("delete");
  delete_req_btn.addEventListener("click",delete_req);

