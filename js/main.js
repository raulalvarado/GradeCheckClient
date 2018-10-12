$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.modal').modal();
   // $('select').formSelect();
    $('.datepicker').datepicker();
});

function logout() {
    sessionStorage["logedUser"] = null;
    window.location.replace("login.html")
}