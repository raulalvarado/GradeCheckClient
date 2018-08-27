//declaring useful variables
var table = $("#usersTable");
var formNuevoU = $("#frmRegUser");
var formUdapteU = $("#frmUpdtUser");
var updateUModal = $("#actualizarUsuario");

//trying to get users from digital ocean server
$(document).ready(function() {
    getStudents();
});

//ajax request to get students
function getStudents() {
    $.ajax({
        url: BASE_URL + STUDENTS_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result["student"], function(i, val) {
                console.log(val["user"].email);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val["user"].state === "false") {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val["user"].name + "</td>" +
                    "<td>" + val["user"].surname + "</td>" +
                    "<td>" + val["user"].username + "</td>" +
                    "<td>" + val["user"].phone + "</td>" +
                    "<td>" + val["user"].email + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestUser(" + val["user"].id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='deleteUser(" + val["user"].id + ")'>delete</i></a></td>" +
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


//delete user
function deleteUser(id) {
    $.ajax({
        url: BASE_URL + STUDENTS_DELETE + id,
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getStudents();
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
        },
        error: function(error) {
            console.log(e);
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
    switch (error) {
        case "Given passwords do not match.":
            M.toast({
                html: 'Las claves no coinciden'
            })
            break;
        case "Cannot delete a parent row":
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