var studentId;
var table = $("#rCoursesTables");
var newRcFrm = $("#frmRegRC");
var updateRcFrm = $("#frmUpdtRC");
var newModalRc = $("#nuevoCursoAsig");
var updateModalRc = $("#actualizarCursoAsig");
var deleteModal = $("#eliminarCursoAsi")
var studentIdForm = $(".studentId");
var courses = $("#materias");
var teachers = $("#docenteMat");
var title = $("#title");

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

    let params = new URLSearchParams(window.location.search)
    studentId = params.get("id");
    studentIdForm.val(studentId);
    getRegisteredCourses();
    getStudentName();
    $('.datepicker').datepicker({ format: "yyyy-mm-dd" });
});

//Initialize course selects as select2
function coursesSelect2() {
    $("#materias").select2({
        dropdownParent: newModalRc,
        width: "100%"
    });
}

//Initialize courseTeacher selects as select2
function courseTeachersSelect2() {
    $("#docenteMat").select2({
        dropdownParent: newModalRc,
        width: "100%"
    });
}

//ajax request to get student
function getStudentName() {
    $.ajax({
        url: BASE_URL + STUDENTS_CREATE + "/" + studentId + "/users/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Materias registradas por " + result.user.person.name + " " + result.user.person.surname);
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function getRegisteredCourses() {
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_READ + studentId + "/courses",
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
                    "<td>" + val["courseTeacher"]["course"].name + "</td>" +
                    "<td>" + val["courseTeacher"]["course"].courseCode + "</td>" +
                    "<td>" + val.courseState + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourse(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteRC(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newRcFrm.trigger("reset");
            getCourses();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los cursos'
            })
        }
    });
}

function getCourses() {
    $.ajax({
        url: BASE_URL + AVAILABLE_COURSES + studentId + "/available",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result.length);
            courses.empty();
            courses.append("<option value='0'>Seleccione una materia</option>");
            $.each(result, function(i, val) {
                console.log(val.name);
                //filling table
                courses.append("<option value='" + val.id + "'>" + val.name + "</option>");
            });
            coursesSelect2();
            courseTeachersSelect2()
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las materias'
            })
        }
    });
}

courses.on("change", function(e) {
    console.log(courses.val())
    getTeachers(courses.val())
});

function getTeachers(id) {
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_READ_AVAILABLE + id + "/employees/users/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result.length);
            teachers.empty();
            $.each(result, function(i, val) {
                console.log(val.name);
                //filling table
                teachers.append("<option value=" + val.id + ">" + val["employee"]["user"]["person"].name + " " + val["employee"]["user"]["person"].surname + "</option>");
            });
            courseTeachersSelect2()
        },
        error: function(error) {
            console.log(error);
            if (id != null) {
                M.toast({
                    html: 'Error al solicitar todas las materias'
                })
            }
        }
    });
}

function requestCourse(id) {
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_CREATE + "/" + id + "/courses/teachers",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $("#uIdRCourses").val(result.id);
            $('#estadoMat option[value="' + result.courseState + '"]').prop('selected', true)
            $("#estadoMat").formSelect();
            updateModalRc.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function postCourse() {
    console.log(newRcFrm.serialize());
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_CREATE,
        type: "POST",
        data: newRcFrm.serialize(),
        success: function(result) {
            console.log(result);
            getRegisteredCourses();
            newModalRc.modal('close');
            M.toast({
                html: 'Materia agregada con exito'
            })
            teachers.empty();
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save career post
newRcFrm.submit(function(e) {
    e.preventDefault();
    postCourse();
});

function updateCourse() {
    console.log(updateRcFrm.serialize())
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_CREATE,
        type: "PUT",
        data: updateRcFrm.serialize(),
        success: function(result) {
            console.log(result);
            getRegisteredCourses();
            updateModalRc.modal('close');
            M.toast({
                html: 'Curso actualizado'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

updateRcFrm.submit(function(e) {
    e.preventDefault();
    updateCourse();
});

function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteRC(id) {
    $("#dIdRCourses").val(id);
    deleteModal.modal("open");
}

//delete user
function deleteRC() {
    console.log(BASE_URL + REGISTERED_COURSES_CREATE + "/" + $("#dIdRCourses").val())
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_CREATE + "/" + $("#dIdRCourses").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getRegisteredCourses();
            $("#dIdRCourses").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}