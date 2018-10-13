$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.modal').modal();
   // $('select').formSelect();
    $('.datepicker').datepicker();
});

function logoutAdmin() {
    sessionStorage["logedUser"] = null;
    window.location.replace("login.html")
}

function logoutTeacher() {
    sessionStorage["logedUser"] = null;
    window.location.replace("../login.html")
}