//declaring useful variables
var table = $("#usersTable");
var formNuevoU = $("#frmRegUser");
var formUdapteU = $("#frmUpdtUser");
var updateUModal = $("#actualizarUsuario");
var deleteUModal = $("#eliminarUsuario");
var updLabels = $(".updLabel");

//trying to get users from digital ocean server
(document).ready(function() {
    try {
        JSON.parse(sessionStorage["logedUser"]).id
    }
    catch (error) {
        window.location.replace("login.html");
    }

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
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteUser(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            formNuevoU.trigger("reset");
            formUdapteU.trigger("reset");
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
        url: BASE_URL + USERS_GET + id + "/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result.id);
            var tempUser = result["person"];
            $("#uIdUser").val(result.id);
            $("#uNombreUsuario").val(tempUser.name);
            $("#uApellidoUsuario").val(tempUser.surname);
            $("#uEmailUsuario").val(tempUser.email);
            $("#uTelUsuario").val(tempUser.phone);
            $("#uDireccionUsuario").val(tempUser.address);
            $("#uDuiUsuario").val(tempUser.dui);
            if (result.state == true) {
                $("#updateStateA").prop("checked", true);
            } else {
                $("#updateStateI").prop("checked", true);
            }
            $('#uFotoPreview').attr('src', "data:image/png;base64," + result.imagePath);
            updateUModal.modal("open");
            updLabels.addClass("active");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });

    /*$.ajax({
        url: BASE_URL + USERS_GET + "pdf",
        type: "GET",
        dataType: "html",
        success: function(result) {
            console.log(result)
            $('#uFotoPreview').attr('src', "data:image/png;base64," + result);
        },
        error: function(error) {
            console.log(error);
            showError(error.responseText);
        }
    });*/
}

//confirm delete user
function confirmDeleteUser(id) {
    $("#dIdUser").val(id);
    deleteUModal.modal("open");
}

//delete user
function deleteUser() {
    console.log(BASE_URL + USERS_CREATE + "/" + $("#dIdUser").val())
    $.ajax({
        url: BASE_URL + USERS_CREATE + "/" + $("#dIdUser").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getUsers();
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
        url: BASE_URL + USERS_CREATE,
        type: "POST",
        data: new FormData(formNuevoU[0]),
        contentType: false,
        processData: false,
        success: function(result) {
            console.log(result);
            getUsers();
            $("#nuevoUsuario").modal('close');
            $('#fotoPreview').attr('src', "img/default-user.png");
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
        url: BASE_URL + USERS_CREATE,
        type: "PUT",
        data: new FormData(formUdapteU[0]),
        contentType: false,
        processData: false,
        success: function(result) {
            console.log(result);
            getUsers();
            updateUModal.modal('close');
            $('#uFotoPreview').attr('src', "img/default-user.png");
            M.toast({
                html: 'Usuario actualizado'
            })
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
    M.toast({
        html: error
    })
}


//Actualizando preview de imagen en agregar usuario
$("#fotoPerfil").change(function(){
    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#fotoPreview').attr('src', e.target.result);
        }

        reader.readAsDataURL(this.files[0]);
    }
});

//Actualizando preview de imagen en modificar usuario
$("#uFotoPerfil").change(function(){
    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#uFotoPreview').attr('src', e.target.result);
        }

        reader.readAsDataURL(this.files[0]);
    }
});