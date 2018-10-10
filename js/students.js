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
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCareer(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourses(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestStudent(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteStudent(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            formNuevoEst.trigger("reset");
            getAvailableStudents();
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
            availableUsers.formSelect();
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