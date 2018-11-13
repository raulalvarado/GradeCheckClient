//declaring useful variables
var table = $("#studentsTable");
var formNuevoEst = $("#frmRegStudent");
var formUdapteEst = $("#frmUpdtStudent");
var newModal = $("#nuevoEstudiante");
var updateEModal = $("#actualizarEstudiantes");
var deleteEModal = $("#eliminarEstudiante");
var availableUsers = $(".availableStudents");

//trying to get users from digital ocean server
$(document).ready(function() {
    try {
        $.ajaxSetup({
            headers: {
              token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });
    }
    catch (error) {
        window.location.replace("login.html");
    }

    //Validating permissions
    if (JSON.parse(sessionStorage["logedUser"]).role.manageStudents != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    getStudents();
});

//Initialize user selects as select2
function usersSelect2() {
    //Cuando un select2 está dentro de un modal, es necesario especificarlo
    $("#StudentUser").select2({
        dropdownParent: newModal,
        container: 'body',
        width: "100%"
    });
}

//ajax request to get students
function getStudents() {
    $.ajax({
        url: BASE_URL + STUDENTS_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            destDataTable();
            table.empty();
            $.each(result, function(i, val) {
                console.log(val["user"]["person"].email);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val["user"]["person"].name + "</td>" +
                    "<td>" + val["user"]["person"].surname + "</td>" +
                    "<td>" + val["user"].username + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='career_students.html?id=" + val.id + "' class='modal-trigger'><i class='material-icons green-text'>school</i></a></td>" +
                    "<td><a href='registered_courses.html?id=" + val.id + "' class='modal-trigger'><i class='material-icons green-text'>book</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestStudent(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteStudent(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            formNuevoEst.trigger("reset");
            getAvailableStudents();

            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#studentItem").addClass("selectedItem");
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
function getAvailableStudents() {
    $.ajax({
        url: BASE_URL + STUDENTS_READ_AVAILABLE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            availableUsers.empty();
            $.each(result, function(i, val) {
                console.log(val.id);
                //filling table
                availableUsers.append("<option value=" + val.id + ">" + val["person"].name + " " + val["person"].surname + "</option>");
            });
            usersSelect2();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar los estudiantes disponibles'
            })
        }
    });
}

//save faculty
function postStudent() {
    $.ajax({
        url: BASE_URL + STUDENTS_CREATE,
        type: "POST",
        data: formNuevoEst.serialize(),
        success: function(result) {
            console.log(result);
            getStudents();
            newModal.modal('close');
            M.toast({
                html: 'Estudiante agregado con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save faculty post
formNuevoEst.submit(function(e) {
    e.preventDefault();
    postStudent();
});
//request one user
function requestStudent(id) {
    $.ajax({
        url: BASE_URL + STUDENTS_READ_SINGLE + "/" + id + "/users/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $("#uIdStudent").val(result.id);
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

function updateStudent() {
    $.ajax({
        url: BASE_URL + STUDENTS_CREATE,
        type: "PUT",
        data: formUdapteEst.serialize(),
        success: function(result) {
            console.log(result);
            getStudents();
            updateEModal.modal('close');
            M.toast({
                html: 'Estudiante actualizado'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

formUdapteEst.submit(function(e) {
    e.preventDefault();
    updateStudent();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteStudent(id) {
    $("#dIdStudent").val(id);
    deleteEModal.modal("open");
}

//delete user
function deleteUser() {
    console.log(BASE_URL + STUDENTS_CREATE + "/" + $("#dIdStudent").val())
    $.ajax({
        url: BASE_URL + STUDENTS_CREATE + "/" + $("#dIdStudent").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getStudents();
            $("#dIdStudent").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}