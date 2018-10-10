//declaring useful variables
var table = $("#employeesTable");
var formNuevoE = $("#frmRegEmployee");
var formUdapteU = $("#frmUpdtEmployee");
var newEModal = $("#nuevoEmpleado");
var updateEModal = $("#actualizarEmpleado");
var deleteUModal = $("#eliminarEmpleado");

//trying to get users from digital ocean server
$(document).ready(function() {
    getEmployees();
});

//ajax request to get students
function getEmployees() {
    $.ajax({
        url: BASE_URL + EMPLOYEES_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val["user"]["person"].email);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                var courses = "<a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourses(" + val.id + ")'>mode_edit</i></a>";
                if (val["role"].teach === false) {
                    courses = "";
                }
                //filling table
                table.append("<tr>" +
                    "<td>" + val["user"]["person"].name + "</td>" +
                    "<td>" + val["user"]["person"].surname + "</td>" +
                    "<td>" + val["user"].username + "</td>" +
                    "<td>" + val["role"].role + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td>" + courses + "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestEmployee(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteEmployee(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            formNuevoU.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los usuarios'
            })
        }
    });
}