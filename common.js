$(document).ready(function() {
    $("#nav-logout").click(Logout);
    CheckAuth();
})

function CheckAuth() {
    email = GetCookie("email");
    if (email) {
        $(` #nav-orders,
            #nav-basket,
            #nav-profile,
            #nav-logout,
            #nav-login,
            #nav-signup
        `).toggleClass("d-none");
        $("#nav-profile").append(email);
    }
}


function GetCookie(name) {
    return document.cookie
         .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1];
}



function SpinnerAfter(afterElement, classes) {
    spinner = document.createElement("div");
    $(spinner).attr("class", "spinner-border " + classes);
    $(afterElement).after(spinner);
}

function SpinnerBefore(beforeElement, classes) {
    spinner = document.createElement("div");
    $(spinner).attr("class", "spinner-border " + classes);
    $(beforeElement).before(spinner);
}

function AppendSpinner(parent, classes) {
    spinner = document.createElement("div");
    $(spinner).attr("class", "spinner-border " + classes);
    $(parent).append(spinner);
}

function AlertBefore(message, beforeElement, alertClass) {
    alertBlock = document.createElement("div");
    $(alertBlock).addClass("alert " + alertClass);
    $(alertBlock).append(message);
    $(beforeElement).before(alertBlock);
}

function AlertAfter(message, afterElement, alertClass) {
    alertBlock = document.createElement("div");
    $(alertBlock).addClass("alert " + alertClass);
    $(alertBlock).append(message);
    $(afterElement).after(alertBlock);
}

function AlertClear(alertParent) {
    $(alertParent).find(".alert").remove();
}



function Logout() {
    fetch("https://food-delivery.kreosoft.ru/api/account/logout", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    }) 
    
    document.cookie ="email= ; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "token= ; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload();
    window.location.href = "/";
}