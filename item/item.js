let waitingForResponse = false;
let itemId;
let basketAmount=0;
$(document).ready(async function() {
    itemId=page = window.location.search.slice(1).split("&").find((query) => query.startsWith("id="))?.slice(3);
    await LoadItemData();
    await getBasketInfo();
    $("#basket-amount-nav").text(basketAmount);
})

async function LoadItemData(){
    AppendSpinner($("#spinner-placeholder"), "text-secondary");
    if(waitingForResponse) return;
    waitingForResponse=true;
    await fetch("https://food-delivery.kreosoft.ru/api/dish/" +itemId)
    .then((response) => {
        return response.json();
    }).then((json) => {
        $("#name-item").append(json.name);
        $("#image-item").attr("src",json.image);

        if(json.category=="Wok"){
            $("#category-item").append("WOK");
        }
        else if(json.category=="Pizza"){
            $("#category-item").append("Пицца");
        }
        else if(json.category=="Soup"){
            $("#category-item").append("Суп");
        }
        else if(json.category=="Dessert"){
            $("#category-item").append("Десерт");
        }
        else if(json.category=="Drink"){
            $("#category-item").append("Напиток");
        }

        if(json.vegetarian){
            $("#vegetarian-item").append("Вегетерианское");
        }else{
            $("#vegetarian-item").append(" Не вегетерианское");
        }
        $("#description-item").append(json.description);
        $("#rating-item").append(json.rating);
        $("#price-item").append(json.price+"руб./шт");

        waitingForResponse=false;
    }).catch((e) => {
        console.log(e);
    })
}

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