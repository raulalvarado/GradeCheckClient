var table = $("#facultiesTable");
var newFacFrm = $("#frmRegFac");
var updateFacFrm = $("#frmUpdtFac");
var updateModalFaculty = $("#actualizarFacultad");
var deleteModalFaculty = $("#eliminarFacultad");
//trying to get faculties from digital ocean server
$(document).ready(function() {
    getFaculties();
});

//ajax request to get faculties
function getFaculties() {
    $.ajax({
        url: BASE_URL + FACULTIES_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val.name + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestFaculty(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteFaculty(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newFacFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//save faculty
function postFaculty() {
    $.ajax({
        url: BASE_URL + FACULTIES_CREATE,
        type: "POST",
        data: newFacFrm.serialize(),
        success: function(result) {
            console.log(result);
            getFaculties();
            $("#nuevaFacultad").modal('close');
            M.toast({
                html: 'Facultad agregada con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save faculty post
newFacFrm.submit(function(e) {
    e.preventDefault();
    postFaculty();
});

//request one user
function requestFaculty(id) {
    $.ajax({
        url: BASE_URL + FACULTIES_READ + "/" + id,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $("#uId").val(result.id);
            $("#uNombreFacultad").val(result.name);
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateModalFaculty.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//update faculty 
function updateFaculty() {
    $.ajax({
        url: BASE_URL + FACULTIES_CREATE,
        type: "PUT",
        data: updateFacFrm.serialize(),
        success: function(result) {
            console.log(result);
            getFaculties();
            updateModalFaculty.modal('close');
            M.toast({
                html: 'Facultad actualizada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//confirm delete faculty
function confirmDeleteFaculty(id) {
    $("#dId").val(id);
    deleteModalFaculty.modal("open");
}

//delete user
function deleteFaculty(id) {
    $.ajax({
        url: BASE_URL + FACULTIES_DELETE + $("#dId").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getFaculties();
            $("#dId").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//update user post
updateFacFrm.submit(function(e) {
    e.preventDefault();
    updateFaculty();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}