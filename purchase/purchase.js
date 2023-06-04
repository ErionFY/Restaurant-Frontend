let basketAmount=0;
let TotalSumPrice=0;

$(document).ready(async function() {
    if (!GetCookie("token"))
    {
        window.location.href = "/login/";
    }
  
   await getBasketInfo();
   $("#basket-amount-nav").text(basketAmount);
   await FillInAccountDetails();
   $("#order-submit").click(async function(){
    await OrderCreate();
   })
})

async function FillInAccountDetails()
{
    try{
    
   const response= await fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    })
    const data= await response.json();
    $("#floatingInputPhone").val(data.phoneNumber);
    $("#floatingInputEmail").val(data.email);
}
    catch(e) {
        console.error(e);
    }
}


async function getBasketInfo(){

try{
    const response=await fetch("https://food-delivery.kreosoft.ru/api/basket", {
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    })
    const data = await response.json();
    let orderDataTemplate=$("#order-data");
       for(let order of data){
        basketAmount=basketAmount+order.amount;
        let orderData=orderDataTemplate.clone();
        orderData.removeAttr("id");
        orderData.attr("id",order.id);
        orderData.find(".order-item-image").attr("src",order.image);
        orderData.find(".order-item-price").append(order.price+"руб.");
        orderData.find(".order-item-name").append(order.name);
        orderData.removeClass("d-none");
        orderData.find(".order-item-amount").append(order.amount +" шт.");
        orderData.find(".order-total-price").append(order.totalPrice);

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


        TotalSumPrice=TotalSumPrice+order.totalPrice;
        $("#ordered-page").append(orderData);
       }
       $("#order-total-sum-price").append(TotalSumPrice);
       $("#ordered-panel").removeClass("d-none");
    }
catch(e){
    console.error(e);
}
}

async function OrderCreate(){
    try{
        const address=$("#address-submit").val();
        const deliveryTime=$("#time-submit").val();
        if (!ValidateInput(address, deliveryTime)) return;
        const response= await fetch("https://food-delivery.kreosoft.ru/api/order", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + GetCookie("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "deliveryTime": deliveryTime+"T00:00:00Z",
                    "address":address
                })
            })
            window.location.href = "/orders/";
            
        }
        catch(e)  {
            console.error(e);
            }
}

function ValidateInput(address, deliveryTime){
    let isValid = true;
    if (address == "") {
        AlertAfter("Введите Адрес ", $("#address-submit"), "alert-danger");
        isValid = false;
    }
    if (deliveryTime="") {
        AlertAfter("Введите время доставки", $("#time-submit"), "alert-danger");
        isValid = false;
    }
    return isValid;
}