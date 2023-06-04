let basketAmount=0;

$(document).ready(async function() {
    if (!GetCookie("token"))
    {
        window.location.href = "/login/";
    }
   
await GetOrders();
   await getBasketInfo();
   $("#basket-amount-nav").text(basketAmount);
   $("#create-order").click(() => window.location.href = "/purchase" );
   if(basketAmount>0)
   {
    $("#new-order").removeClass("d-none");
   }
})

async function GetOrders(){
    try{
        const response = await fetch(
			"https://food-delivery.kreosoft.ru/api/order",
			{
				headers: {
					Authorization: "Bearer " + GetCookie("token"),
				},
			}
		);
		const data = await response.json();
        let orderDataTemplate=$("#order-data");
        if(data.length==0){console.log("empty");}
        for(let order of data){
            let orderData=orderDataTemplate.clone();
            orderData.removeAttr("id");
            orderData.attr("id",order.id);
            orderTimeAndDate=order.orderTime.split("T")[0]
            orderTimeAndDate=orderTimeAndDate.split("-");
            ordertime=orderTimeAndDate[2]+"."+orderTimeAndDate[1]+"."+orderTimeAndDate[0]
            orderData.find(".time-order").append(ordertime);
            if(order.status=="InProcess"){
                orderData.find(".status-order").append("В обработке");
                orderData.find(".confirm-delivery").removeClass("d-none");
                orderData.find(".confirm-delivery").click(async function(){
                    await ConfirmOrderDelivery(order.id);
                    orderData.find(".status-order").text("Статус заказа - Доставлен");
                    orderData.find(".delivery-time-order").text("Доставлен:")
                    orderDelivery=order.deliveryTime.split("T");
            orderDeliveryDate=orderDelivery[0].split("-");
            orderDeliveryTime=orderDelivery[1].split(":");
            orderDDateTime=" "+orderDeliveryDate[2]+"."+orderDeliveryDate[1]+"."+orderDeliveryDate[0]+" "+orderDeliveryTime[0]+":"+orderDeliveryTime[1];
            orderData.find(".delivery-time-order").append(orderDDateTime);
                })
                orderData.find(".delivery-time-order").text("Доставка ожидается:")
        }
            else if(order.status=="Delivered"){orderData.find(".status-order").append("Доставлен");}

            orderData.find(".confirm-delivery").click(async function(){
                await ConfirmOrderDelivery(order.id);
                orderData.find(".confirm-delivery").addClass("d-none");
            })

        orderData.find(".time-order").click(() => window.location.href = "/order/?id=" + order.id);
        orderData.find(".time-order").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );

            orderDelivery=order.deliveryTime.split("T");
            orderDeliveryDate=orderDelivery[0].split("-");
            orderDeliveryTime=orderDelivery[1].split(":");
            orderDDateTime=" "+orderDeliveryDate[2]+"."+orderDeliveryDate[1]+"."+orderDeliveryDate[0]+" "+orderDeliveryTime[0]+":"+orderDeliveryTime[1];
            orderData.find(".delivery-time-order").append(orderDDateTime);
            orderData.find(".price-order").append(" "+ order.price);
            orderData.removeClass("d-none");

            $("#orders-page").append(orderData);

    }
    $("#orders-panel").removeClass("d-none");
}catch (e) {
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