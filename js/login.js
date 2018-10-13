var loginForm = $("#loginForm");

function login() {
    $.ajax({
        url: BASE_URL + EMPLOYEES_LOGIN,
        type: "POST",
        dataType: "json",
        data: loginForm.serialize(),
        success: function(result) {
            console.log(result)
            sessionStorage["logedUser"] = JSON.stringify(result);

            if (result.role.teach == true) {
                window.location.replace("Docente/courses.html")
            }
            else {
                window.location.replace("Index.html")
            }

                //JSON.parse(sessionStorage["logedUser"]);
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: error.responseText
            })
        }
    });
}

loginForm.submit(function(e) {
    e.preventDefault();
    login();
});