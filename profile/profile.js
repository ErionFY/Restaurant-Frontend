let userId;
let waitingForResponse = false;
let Gender
let basketAmount=0;
$(document).ready(async function() {
    if (!GetCookie("token"))
    {
        window.location.href = "/login/";
    }
   $("#submit-changes").click(SubmitChanges);
   await FillInAccountDetails();
   await getBasketInfo();
   $("#basket-amount-nav").text(basketAmount);
})

async function FillInAccountDetails()
{
    waitingForResponse = true;
    SpinnerAfter($("#profile"), "text-warning");
    await fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
        headers: {
            Authorization: "Bearer " + GetCookie("token")
        }
    }).then((response) => {
        if (response.status == 200) return response.json();
        else throw new Error(response.status.toString());
    }).then((json) => {
       
        $("#name-profile").val(json.fullName);
        $("#email-profile").val(json.email);
        $("#birthdate-profile").val(json.birthDate.split("T")[0]);
        $("#address-profile").val(json.address);
        $("#phone-profile").val(json.phoneNumber);
        Gender=json.gender;
        if(json.gender=="Male"){$("#gender-profile").val("Мужской");}else{$("#gender-profile").val("Женский")}
        $(".spinner-border").remove();
        waitingForResponse = false;
        userId = json.id;

    }).catch((e) => {
        if (e.message == "401") {
            document.cookie = "email= ; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = "/login/";
        } else console.log(e.message);
    })
}

async function SubmitChanges()
{
    if (waitingForResponse) return;
    const name = $("#name-profile").val();
    const birthdate = $("#birthdate-profile").val();
    const gender = Gender;
    const address = $("#address-profile").val();
    const phone = $("#phone-profile").val();
    
    AlertClear(document);
    if (!ValidateInput(name, birthdate,phone,address)) return;
    waitingForResponse = true;
    AppendSpinner($("#submit-changes"), "spinner-border-sm");
   await fetch("https://food-delivery.kreosoft.ru/api/account/profile", {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + GetCookie("token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fullName": name,
            "birthDate": birthdate + "T00:00:00Z",
            "gender": gender,
            "address":address,
            "phoneNumber": phone
        })
    }).then((response) => {

    }).catch((e) => {
        if (e.status == 401) {
            document.cookie = "email= ; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = "/login/";
            return;
        }
        e.json().then((json) => {
            if (json.message == "not empty") {
        } else {
                alert("Ошибка");
                console.log(json);
            }
        });
    }).then(() => {
        $(".spinner-border").remove();
        waitingForResponse = false;
    });
}



function ValidateInput(name, birthdate,phonenumber,address)
{
    let isValid = true;
    if (phonenumber == "") {
        AlertBefore("Введите номер телефона", $("#phone-profile"), "alert-danger");
        isValid = false;
    }
    if (name == "") {
        AlertBefore("Введите ФИО", $("#name-profile"), "alert-danger");
        isValid = false;
    }
    /*
    if (birthdate == "") {
        AlertBefore("Введите дату рождения", $("#birthdate-profile"), "alert-danger");
        isValid = false;
    }
    if (address == "") {
        AlertBefore("Введите адрес", $("#address-profile"), "alert-danger");
        isValid = false;
    }*/
    return isValid;
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
        basketAmount=basketAmount+dishB.amount;
       }
    }).catch((e) => {
        console.log(e);
    })
}