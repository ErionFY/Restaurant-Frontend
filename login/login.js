let waitingForResponse = false;

$(document).ready(function() {
    $("#login-submit").click(Login);
})

function Login()
{
    if (waitingForResponse) return;
    const email = $("#email-input").val();
    const password = $("#password-input").val();
    AlertClear(document);
    if (!ValidateInput(email, password)) return;
    waitingForResponse = true;
    AppendSpinner($("#login-submit"), "spinner-border-sm");
    fetch("https://food-delivery.kreosoft.ru/api/account/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    }).then((response) => {
        if (response.status == 200) return response.json();
        else throw Error(response.status.toString());
    }).then((json) => {
        document.cookie = `token=${json.token}; path=/`;
        document.cookie = `email=${email}; path=/`;
        window.location.href = "/";
    }).catch((e) => {
        if (e.message == "400"){
        alert("Ошибка");
        console.log(e.message);
        }
    }).then(() => {
        $(".spinner-border").remove();
        waitingForResponse = false;
    })
}

function ValidateInput(email, password)
{
    let isValid = true;
    if (email == "") {
        AlertBefore("Введите Email", $("#email-input"), "alert-danger");
        isValid = false;
    }
    if (password="") {
        AlertBefore("Введите пароль", $("#password-input"), "alert-danger");
        isValid = false;
    }
    return isValid;
}