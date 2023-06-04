let basketAmount=0;
let TotalSumPrice=0;

$(document).ready(async function() {
    if (!GetCookie("token"))
    {
        window.location.href = "/login/";
    }
    await getBasketInfo();
   $("#basket-amount-nav").text(basketAmount);
    orderId=window.location.search.slice(1).split("&").find((query) => query.startsWith("id="))?.slice(3);
    await GetOrder(orderId)
   
    
})




async function GetOrder(orderId){
    try{
        const response=await fetch("https://food-delivery.kreosoft.ru/api/order/" +orderId, {
            headers: {
                Authorization: "Bearer " + GetCookie("token")
            }
        })
        const data= await response.json();

        orderTimeAndDate=data.orderTime.split("T");
        orderDate=orderTimeAndDate[0].split("-");
        orderTime=orderTimeAndDate[1].split(":");
        orderTimeAndDate=" "+ orderDate[2]+"."+orderDate[1]+"."+orderDate[0]+" "+orderTime[0]+":"+orderTime[1];
        $("#order-date").append(orderTimeAndDate);
        $("#order-time").append(" "+orderDate[2]+"."+orderDate[1]+"."+orderDate[0]);
        deliveryTimeAndDate=data.deliveryTime.split("T");
        deliveryDate=deliveryTimeAndDate[0].split("-");
        deliveryTime=deliveryTimeAndDate[1].split(":");
        deliveryTimeAndDate=" "+ deliveryDate[2]+"."+deliveryDate[1]+"."+deliveryDate[0]+" "+deliveryTime[0]+":"+deliveryTime[1];
        $("#deliver-date").append(deliveryTimeAndDate);
        $("#order-address").append(" "+data.address);
        if(data.status=="InProcess"){
            $("#order-status").append(" В обработке");
            $("#confirm-delivery").removeClass("d-none");
            $("#confirm-delivery").click(async function(){
                await ConfirmOrderDelivery(orderId);
                $("#order-status").text(" Статус заказа - Доставлен");
                $("#confirm-delivery").addClass("d-none");
            })
        }
        else {$("#order-status").append(" Доставлен");}
        

       let orderDataTemplate=$("#order-data")
       for(let order of data.dishes){
        let orderData=orderDataTemplate.clone()
        orderData.removeAttr("id");
        orderData.attr("id",order.id);
        orderData.find(".order-item-image").attr("src",order.image);
        orderData.find(".order-item-price").append(order.price+"руб.");
        orderData.find(".order-item-name").append(order.name);
        orderData.find(".order-item-amount").append(order.amount +" шт.");
        orderData.find(".order-total-price").append(order.totalPrice);
        TotalSumPrice=TotalSumPrice+order.totalPrice;

        orderData.find(".order-item-name").click(() => window.location.href = "/item/?id=" + order.id);
        orderData.find(".order-item-name").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );
            orderData.find(".order-item-image").click(() => window.location.href = "/item/?id=" + order.id);
            orderData.find(".order-item-image").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );



        orderData.removeClass("d-none");
        $("#ordered-page").append(orderData);
       }
       $("#order-total-sum-price").append(TotalSumPrice);
       $("#ordered-panel").removeClass("d-none");
    }
    catch(e){
console.error(e);
    }
}





async function ConfirmOrderDelivery(orderid){

    try{
        const response=await fetch("https://food-delivery.kreosoft.ru/api/order/"+orderid+"/status", {
            method: "POST",
        headers: {
            Authorization: "Bearer " + GetCookie("token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
        })
    }
    catch(e){
        console.error(e);
    }

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