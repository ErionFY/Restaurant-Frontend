let basketAmount=0;

$(document).ready(async function() {
    if (!GetCookie("token"))
    {
        window.location.href = "/login/";
    }
  
   await getBasketInfo();
   $("#basket-amount-nav").text(basketAmount);

})


async function getBasketInfo(){//KEY-id Value-amount 


    await fetch("https://food-delivery.kreosoft.ru/api/basket", {
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    }).then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error(response.status.toString());
    }).then((json) => {
       for(let dishB of json){
        basketAmount=basketAmount+dishB.amount;
       }
    }).catch((e) => {
        console.log(e);
    })
}
