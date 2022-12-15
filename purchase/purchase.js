let basketAmount=0;

$(document).ready(async function() {
    if (!GetCookie("token"))
    {
        window.location.href = "/login/";
    }
  
   await getBasketInfo();
   $("#basket-amount-nav").text(basketAmount);

})


async function getBasketInfo(){

try{
    const response=await fetch("https://food-delivery.kreosoft.ru/api/basket", {
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    })
    const data = await response.json();
       for(let dish of data){
        basketAmount=basketAmount+dish.amount;
        
       }
    }
catch(e){
    console.error(e);
}
}

