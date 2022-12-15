let waitingForResponse = false;

$(document).ready(function() {
    $("#signup-submit").click(Signup); //привязка к кнопке
})

function Signup() {
    if (waitingForResponse) return;
    const name = $("#name-input").val();
    const gender = $("#gender-input").val();
    const phone = $("#phone-input").val();
    const birthdate = $("#birthdate-input").val();
    const address = $("#address-input").val()
    const email = $("#email-input").val();
    const password = $("#password-input").val();

    AlertClear(document);
    if (!ValidateInput(
            name,
            gender,
            phone,
            birthdate,
            address,
            email,
            password
        )) return;
    waitingForResponse = true;

    AppendSpinner($("#signup-submit"), "spinner-border-sm");
    fetch("https://food-delivery.kreosoft.ru/api/account/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "fullName": name, 
            "password": password,
            "email": email,
            "address": address,
            "birthdate": birthdate + "T00:00:00Z",
            "gender": gender,
            "phoneNumber": phone
        })
    }).then((response) => {
        if (response.status == 200) return response.json();
        else throw response;
    }).then((json) => {
        document.cookie = `token=${json.token}; path=/`;
        document.cookie = `email=${email}; path=/`;
        window.location.href = "/";
    }).catch((e) => {
        e.json().then((json) => {
        
        });
    }).then(() => {
        $(".spinner-border").remove();
        waitingForResponse = false;
    });
}

function ValidateInput(name, phone, birthdate, address, email, password) {
    let isValid = true;
    
    if (name == "") {
        AlertBefore("Введите ФИО", $("#name-input"), "alert-danger");
        isValid = false;
    }
    if (email == "") {
        AlertBefore("Введите адрес электронной почты", $("#email-input"), "alert-danger");
        isValid = false;
    }
    if (password=="") {
        AlertBefore("Введите пароль", $("#password-input"), "alert-danger");
        isValid = false;
    }
    
    /*
    if (phone == "") {
        AlertBefore("Введите номер телефона", $("#phone-input"), "alert-danger");
        isValid = false;
    }
    if (birthdate == "") {
        AlertBefore("Введите дату рождения", $("#birthdate-input"), "alert-danger");
        isValid = false;
    }
    
    if (address == "") {
        AlertBefore("Введите адрес", $("#address-input"), "alert-danger");
        isValid = false;
    }
    */
    return isValid;
}