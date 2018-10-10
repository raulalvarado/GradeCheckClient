//declaring useful variables
var table = $("#usersTable");
var formNuevoU = $("#frmRegUser");
var formUdapteU = $("#frmUpdtUser");
var updateUModal = $("#actualizarUsuario");
var deleteUModal = $("#eliminarUsuario");

//trying to get users from digital ocean server
$(document).ready(function() {
    getUsers();
});

//ajax request to get students
function getUsers() {
    $.ajax({
        url: BASE_URL + USERS_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val["person"].email);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val["person"].name + "</td>" +
                    "<td>" + val["person"].surname + "</td>" +
                    "<td>" + val.username + "</td>" +
                    "<td>" + val["person"].phone + "</td>" +
                    "<td>" + val["person"].email + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestUser(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteUser(" + val.id + ")'>delete</i></a></td>" +
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


//request one user
function requestUser(id) {
    $.ajax({
        url: BASE_URL + STUDENTS_GET + id,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            var tempUser = result["user"];
            $("#uIdUser").val(tempUser.id);
            $("#uNombreUsuario").val(tempUser.name);
            $("#uApellidoUsuario").val(tempUser.surname);
            $("#uEmailUsuario").val(tempUser.email);
            $("#uTelUsuario").val(tempUser.phone);
            if (tempUser.state === "true") {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateUModal.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//confirm delete user
function confirmDeleteUser(id) {
    $("#dIdUser").val(id);
    deleteUModal.modal("open");
}

//delete user
function deleteUser() {
    $.ajax({
        url: BASE_URL + STUDENTS_DELETE + $("#dIdUser").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getStudents();
            $("#dIdUser").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save user
function postUser() {
    $.ajax({
        url: BASE_URL + STUDENTS_CREATE,
        type: "POST",
        data: formNuevoU.serialize(),
        success: function(result) {
            console.log(result);
            getStudents();
            $("#nuevoUsuario").modal('close');
            M.toast({
                html: 'Usuario agregado con exito'
            })
        },
        error: function(error) {
            console.log(error);
            showError(error.responseText);
        }
    });
}

//save user post
formNuevoU.submit(function(e) {
    e.preventDefault();
    postUser();
});

//update user 
function updateUser() {
    $.ajax({
        url: BASE_URL + STUDENTS_UPDATE,
        type: "PUT",
        data: formUdapteU.serialize(),
        success: function(result) {
            console.log(result);
            getStudents();
            updateUModal.modal('close');
            M.toast({
                html: 'Usuario actualizado'
            })
            $("#uContraUsuario").val("");
            $("#uConfimUsuario").val("");
        },
        error: function(error) {
            console.log(error);
            showError(error.responseText);
        }
    });
}

//update user post
formUdapteU.submit(function(e) {
    e.preventDefault();
    updateUser();
});

//display server errors
function showError(error) {
    if (error.includes("Must specify following parameters:")) {
        M.toast({
            html: 'Por favor ingrese todos los datos solicitados'
        })
    } else {
        switch (error) {
            case "Given passwords do not match.":
                M.toast({
                    html: 'Las claves no coinciden'
                })
                break;
            case "Duplicated value. Could not complete operation":
                M.toast({
                    html: 'Uno de los datos ingresados ya está siendo usado'
                })
                break;
            case "Must specify both pass and passConfirm, or not specify any of them.":
                M.toast({
                    html: 'Deben especificarse ambas contraseñas o ninguna de ellas'
                })
                break;
            case "Cannot delete record, parent row conflict":
                M.toast({
                    html: 'El usuario que se desea eliminar ya tiene registros asociados'
                })
                break;
            default:
                M.toast({
                    html: 'Ocurrio un error al procesar su peticion, contacte con el administrador'
                })
                break;
        }
    }
}