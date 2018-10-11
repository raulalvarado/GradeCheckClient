//declaring useful variables
var table = $("#employeesTable");
var formNuevoE = $("#frmRegEmployee");
var formUdapteE = $("#frmUpdtEmployee");
var newEModal = $("#nuevoEmpleado");
var updateEModal = $("#actualizarEmpleado");
var deleteUModal = $("#eliminarEmpleado");
var roles = $(".roles");
var users = $(".users");

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
            formNuevoE.trigger("reset");
            getRoles();
            getUsers();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los usuarios'
            })
        }
    });
}

//ajax request to get faculties
function getRoles() {
    $.ajax({
        url: BASE_URL + ROLES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            roles.empty();
            $.each(result, function(i, val) {
                console.log(val.role);

                //filling table
                roles.append("<option value=" + val.id + ">" + val.role + "</option>");
            });
            roles.formSelect();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los roles'
            })
        }
    });
}

//ajax request to get faculties
function getUsers() {
    $.ajax({
        url: BASE_URL + EMPLOYEES_READ_AVAILABLE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            users.empty();
            $.each(result, function(i, val) {
                console.log(val["person"].name);

                //filling table
                users.append("<option value=" + val.id + ">" + val["person"].name + "</option>");
            });
            users.formSelect();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los usuarios'
            })
        }
    });
}

//save faculty
function postEmployee() {
    $.ajax({
        url: BASE_URL + EMPLOYEES_CREATE,
        type: "POST",
        data: formNuevoE.serialize(),
        success: function(result) {
            console.log(result);
            getEmployees();
            newEModal.modal('close');
            M.toast({
                html: 'Empleado agregado con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save faculty post
formNuevoE.submit(function(e) {
    e.preventDefault();
    postEmployee();
});

function requestEmployee(id) {
    $.ajax({
        url: BASE_URL + EMPLOYEES_CREATE + "/" + id + "/users/people/roles",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $("#uIdEmployee").val(result.id);
            $('#EmployeeRoleU option[value="' + result["role"].id + '"]').prop('selected', true)
            $("#EmployeeRoleU").formSelect();
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateEModal.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function updateEmployee() {
    $.ajax({
        url: BASE_URL + EMPLOYEES_CREATE,
        type: "PUT",
        data: formUdapteE.serialize(),
        success: function(result) {

            console.log(result);
            getEmployees();
            updateEModal.modal('close');
            M.toast({
                html: 'Empleado actualizado'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

formUdapteE.submit(function(e) {
    e.preventDefault();
    updateEmployee();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}