let categories=["Wok","Pizza","Soup","Dessert","Drink"];
let vegetarian='';
let sorting='';
let page = 1;
let waitingForResponse = false;
let basketMap=new Map();
let basketAmount=0;

$(document).ready(async function() {
    if (window.location.search != "")
    {
        ParseUrl();
        SetMenuCriteries();
    }
    $("#menu-update").click(GetMenu);
    if (GetCookie("token")){
       await getBasketInfo();
       }
       SetMenuCriteries()
   await UpdateList();
   
})

function SetMenuCriteries(){
    $("#vegeterian-toggle").prop("checked", vegetarian);
    
    $("#Wok-menu-checkbox").prop("checked", categories.includes("Wok"));
    $("#Pizza-menu-checkbox").prop("checked", categories.includes("Pizza"));
    $("#Soup-menu-checkbox").prop("checked", categories.includes("Soup"));
    $("#Dessert-menu-checkbox").prop("checked", categories.includes("Dessert"));
    $("#Drink-menu-checkbox").prop("checked", categories.includes("Drink"));

    if(sorting){
        $("#sorting-input").val(sorting);
    }else{
        $("#sorting-input").val("NameAsc");
    }
    $("#form-category").removeClass("d-none");

}

function ParseUrl(){
  
        categoriesUrl=[];
        tags=window.location.search.slice(1).split("&");
        
        tags.forEach(element => {
            if(element.startsWith("categories=")){
                newCategorie=element.slice(11);
                categoriesUrl.push(newCategorie);
                //if categories in()
            }
            else if(element.startsWith("sorting=")){
                sorting=element.slice(8);
                //if sorting in ()
            }
            else if(element.startsWith("vegetarian=")){
                vegetarian=element.slice(11);
                vegetarian=(vegetarian==='true');
            }
            else if(element.startsWith("page=")){
                page=element.slice(5);
                page = parseInt(page);
                //if page> 0 <max page
            }
        });
        categories=categoriesUrl;
    }


function CreateRequestUrl(curPage)
{
    requestUrl="";
    categories.forEach(element=> {
        requestUrl=requestUrl+"categories="+element+"&";
    });
    requestUrl=requestUrl.slice(0,-1);
    if(curPage>1){
        requestUrl=requestUrl+"&page="+curPage;
    }
    if(vegetarian){
        requestUrl=requestUrl+"&vegetarian=true";
    }
    if(sorting){
        requestUrl=requestUrl+"&sorting="+sorting;
    }
    return requestUrl
}

async function GetMenu(){
    GetCriteries();
    await UpdateList();
    window.location.href="/?"+CreateRequestUrl(page);
}

function GetCriteries(){
    sorting = $("#sorting-input").val();
    
    vegetarian=document.getElementById("vegeterian-toggle").checked;
    
    categoriesNew=[];
    if(document.getElementById("Wok-menu-checkbox").checked){
        categoriesNew.push($("#Wok-menu-checkbox").val());
    }
    if(document.getElementById("Pizza-menu-checkbox").checked){
        categoriesNew.push($("#Pizza-menu-checkbox").val());
    }
    if(document.getElementById("Soup-menu-checkbox").checked){
        categoriesNew.push($("#Soup-menu-checkbox").val());
    }
    if(document.getElementById("Dessert-menu-checkbox").checked){
        categoriesNew.push($("#Dessert-menu-checkbox").val());
    }
    if(document.getElementById("Drink-menu-checkbox").checked){
        categoriesNew.push($("#Drink-menu-checkbox").val());
    }
    categories=categoriesNew;
}

async function UpdateList()
{ 
    AppendSpinner($("#spinner-placeholder"), "text-secondary");
    if(waitingForResponse) return;
    waitingForResponse=true;
    await fetch("https://food-delivery.kreosoft.ru/api/dish" + "?"+CreateRequestUrl(page))
    .then((response) => {
        return response.json();
    }).then((json) => {
        let dishDataTemplate = $("#data-dish");
        for(let dish of json.dishes)
        {
            let dishData = dishDataTemplate.clone();
            dishData.removeAttr("id");
            dishData.attr("id", dish.id);
            dishData.find(".image-dish").attr("src", dish.image);
            dishData.find(".name-dish").append(dish.name);

            
            if(dish.vegetarian){
                dishData.find(".vegetarian-dish").removeClass("d-none");
            }
            if(dish.category=="Wok"){
                dishData.find(".category-dish").append(" WOK");
            }
            else if(dish.category=="Pizza"){
                dishData.find(".category-dish").append(" Пицца");
            }
            else if(dish.category=="Soup"){
                dishData.find(".category-dish").append(" Суп");
            }
            else if(dish.category=="Dessert"){
                dishData.find(".category-dish").append(" Десерт");
            }
            else if(dish.category=="Drink"){
                dishData.find(".category-dish").append(" Напиток");
            }

            dishData.find(".rating-dish").append(dish.rating);
            dishData.find(".description-dish").append(dish.description);
            dishData.find(".price-dish").append(dish.price+"р");

            dishData.removeClass("d-none");
            $("#page-dish").append(dishData);
            
            dishData.find(".name-dish").click(() => window.location.href = "/item/?id=" + dish.id);
            dishData.find(".name-dish").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );

            dishData.find(".image-dish").click(() => window.location.href = "/item/?id=" + dish.id);
            dishData.find(".image-dish").hover(
                () => $("html").css("cursor", "pointer"),
                () => $("html").css("cursor", "default")
            );

            dishData.find(".decrease-dish").click( async function(){
               
               dishAmount=parseInt(dishData.find(".amount-dish").text());
               if(dishAmount==1){
                await RemoveDish(dish.id,false);
                dishData.find(".add-basket-dish").removeClass("d-none");
                dishData.find(".btns-change-basket").addClass("d-none");
               }
               else{
                await RemoveDish(dish.id,true);
                dishData.find(".amount-dish").text(dishAmount-1);
               }
               basketAmount--;
               $("#basket-amount-nav").text(basketAmount);
            });
            dishData.find(".increase-dish").click( async function(){
               await AddDish(dish.id);
               dishAmount=parseInt(dishData.find(".amount-dish").text());
               dishData.find(".amount-dish").text(dishAmount+1);
               basketAmount++;
               $("#basket-amount-nav").text(basketAmount);
            });
            dishData.find(".add-basket-dish").click( async function(){
              await  AddDish(dish.id);
              dishData.find(".add-basket-dish").addClass("d-none");
                dishData.find(".btns-change-basket").removeClass("d-none");
                dishData.find(".amount-dish").text(1);
                basketAmount++;
                $("#basket-amount-nav").text(basketAmount);
            });


             if(basketMap.has(dish.id)){
                dishData.find(".add-basket-dish").addClass("d-none");
                dishData.find(".btns-change-basket").removeClass("d-none");
                dishData.find(".amount-dish").text(basketMap.get(dish.id));
                $("#basket-amount-nav").text(basketAmount);
             }

        }
        $("#panel-dish").removeClass("d-none");
        $(".spinner-border").remove();
        UpdatePaginator(json.pagination.count);
        waitingForResponse=false;
        elem=document.getElementById("basket-amount-nav");
        $("#basket-amount-nav").text(basketAmount);
        

    }).catch((e) => {
        console.log(e);
    })
    
}

function UpdatePaginator(count)
{

    let pageBtnTemplate = $(".page-number");
    let previousBtn = $("#previous-btn");
    let nextBtn = $("#next-btn");
    for(let p = 1; p <= count; p++)
    {
        let pageBtn = pageBtnTemplate.clone();
        if (p == page) {
            pageBtn.addClass("active");
            pageBtn.attr("aria-current", "page")
        }
        pageBtn.find(".page-link").text(p.toString());
        pageBtn.find(".page-link").attr("href", `/?`+CreateRequestUrl(p));
        pageBtn.insertBefore(nextBtn);
        pageBtn.removeClass("d-none");
    }
    previousBtn.find(".page-link").attr("href", `/?`+CreateRequestUrl(page-1));
    nextBtn.find(".page-link").attr("href", `/?`+CreateRequestUrl(page+1));
    if (page == 1) previousBtn.addClass("disabled");
    if (page == count) nextBtn.addClass("disabled");

    $("#paginator").removeClass("d-none");
}

async function AddDish(dishId){
if(!GetCookie("token")){window.location.href = "/login/";}

    await fetch("https://food-delivery.kreosoft.ru/api/basket/dish/"+dishId, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + GetCookie("token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        })
    }).then((response) => {

    }).then((json) => {
      
    }).catch((e) => {
        console.log(e);
        });
        
    }

async function RemoveDish(dishId,increase){

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

async function getBasketInfo(){

    await fetch("https://food-delivery.kreosoft.ru/api/basket", {
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    }).then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error(response.status.toString());
    }).then((json) => {
       for(let dishB of json){
        basketMap.set(dishB.id,dishB.amount);
        basketAmount=basketAmount+dishB.amount;
       }
    }).catch((e) => {
        console.log(e);
    })
}

