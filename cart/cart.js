let basketAmount=0;
$(document).ready(async function () {
	if (!GetCookie("token")) {
		window.location.href = "/login/";
	}
    await GetCart();
});

async function GetCart() {
	try {
		const response = await fetch(
			"https://food-delivery.kreosoft.ru/api/basket",
			{
				headers: {
					Authorization: "Bearer " + GetCookie("token"),
				},
			}
		);
		const data = await response.json();
        let basketItemDataTemplate=$("#basket-item-data");
        let BasItemCount=0;
        if(data.length==0 ){ $("#basket-tittle").text("Корзина пустая"); $("#basket-amount-nav").text(basketAmount);return;}
        for(let basItem of data){
            let basItemData=basketItemDataTemplate.clone();
            basItemData.removeAttr("id");
            basItemData.attr("id",basItem.id);
            BasItemCount++;
            basItemData.find(".basket-item-number").append(BasItemCount+".");
            basItemData.find(".basket-item-image").attr("src",basItem.image);
            basItemData.find(".basket-item-price").append(basItem.price+"руб.");
            basItemData.find(".basket-item-amount").append(basItem.amount);
            basItemData.find(".basket-item-name").append(basItem.name);

            basItemData.find(".basket-item-decrease-amount").click(async function(){
                basketItemAmount=parseInt(basItemData.find(".basket-item-amount").text());
                if(basketItemAmount==1){
                    await RemovingDish(basItem.id,false);
                    basItemData.addClass("d-none");
                }
                else{
                    await RemovingDish(basItem.id,true);
                    basItemData.find(".basket-item-amount").text(basketItemAmount-1);
                }
                basketAmount--;
                $("#basket-amount-nav").text(basketAmount);
            });

            basItemData.find(".basket-item-increase-amount").click(async function(){
                await AddingDish(basItem.id);
                basketItemAmount=parseInt(basItemData.find(".basket-item-amount").text());
                basItemData.find(".basket-item-amount").text(basketItemAmount+1);
                basketAmount++;
                $("#basket-amount-nav").text(basketAmount);
            });

            basItemData.find(".basket-item-delete").click(async function(){
                await RemovingDish(basItem.id,false);
                basketItemAmount=parseInt(basItemData.find(".basket-item-amount").text());
                basketAmount=basketAmount-basketItemAmount;
                basItemData.find(".basket-item-amount").text(0);
                basItemData.addClass("d-none");
                $("#basket-amount-nav").text(basketAmount);
            });
            basItemData.find(".basket-item-name").click(() => window.location.href = "/item/?id=" + basItem.id);
            basItemData.find(".basket-item-name").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );
            basItemData.find(".basket-item-image").click(() => window.location.href = "/item/?id=" + basItem.id);
            basItemData.find(".basket-item-image").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );
            basketAmount=basketAmount+basItem.amount;
            basItemData.removeClass("d-none");
            $("#basket-items-page").append(basItemData);
        }
        $("#basket-amount-nav").text(basketAmount);
        $("#basket-items-panel").removeClass("d-none");
	} catch (e) {
		console.log(e);
	}
}


async function RemovingDish(dishId,increase){

    try{
        const response=await fetch("https://food-delivery.kreosoft.ru/api/basket/dish/"+dishId+"?increase="+increase, {
            method: "DELETE",
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


async function AddingDish(dishId){
    try{
    const response= await fetch("https://food-delivery.kreosoft.ru/api/basket/dish/"+dishId, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + GetCookie("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            })
        })
        
    }
    catch(e)  {
        console.error(e);
        }
    }