$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.modal').modal();
   // $('select').formSelect();
    $('.datepicker').datepicker();

    try {
        $.ajaxSetup({
            headers: {
              token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });
    }
    catch (error) {
        window.location.replace("/GradeCheckClient/login.html");
    }

    $('.sidebar').load('/GradeCheckClient/includes/sidebarAdmin.html');

    
});

function logout() {
    sessionStorage["logedUser"] = null;
    window.location.replace("/GradeCheckClient/login.html")
}
