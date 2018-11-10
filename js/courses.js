var table = $("#coursesTable");
var newCourseFrm = $("#frmRegCourse");
var updateCourseFrm = $("#frmUpdtCourse");
var updateModalCourse = $("#actualizarMateria");
var newModalCourse = $("#nuevaMateria");
var deleteModalCourse = $("#eliminarMateria");
var faculties = $(".cCourseFaculty");
var prerequisite = $(".cCoursePrerequisite");
var updLabels = $(".updLabel");
//trying to get faculties from digital ocean server
$(document).ready(function() {
   try {
        JSON.parse(sessionStorage["logedUser"]).id
    }
    catch (error) {
        window.location.replace("login.html");
    }

    getCourses();
});

//Initialize prerrequisite selects as select2
function prerrequisitesSelect2() {
    $("#CoursePrerequisite").select2({
        dropdownParent: newModalCourse,
        width: "100%"
    });
    
    $("#uCoursePrerequisite").select2({
        dropdownParent: updateModalCourse,
        width: "100%"
    });
}

//Initialize faculty selects as select2
function facultiesSelect2() {
    $("#CourseFaculty").select2({
        dropdownParent: newModalCourse,
        width: "100%"
    });
    
    $("#uCourseFaculty").select2({
        dropdownParent: updateModalCourse,
        width: "100%"
    });
}

//ajax request to get faculties
function getCourses() {
    $.ajax({
        url: BASE_URL + COURSES_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.laboratory);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                var inter = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.inter === false) {
                    inter = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                var lab = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.laboratory === false) {
                    lab = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                var key = ""
                if (val["course"] != null) {
                    key = val["course"].name;
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val.name + "</td>" +
                    "<td>" + val.courseCode + "</td>" +
                    "<td>" + val.semester + "</td>" +
                    "<td>" +
                    "<label>" +
                    inter +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td>" +
                    "<label>" +
                    lab +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td>" + val.uv + "</td>" +
                    "<td>" + key + "</td>" +
                    "<td>" + val["faculty"].name + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='" + 'evaluations.html?id=' + val.id + "' class='modal-trigger'><i class='material-icons green-text'>ballot</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourse(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteCourse(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            getFaculties();
            getActiveCarreers();
            newCourseFrm.trigger("reset");
            updateCourseFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//ajax request to get faculties
function getFaculties() {
    $.ajax({
        url: BASE_URL + FACULTIES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            faculties.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //filling table
                faculties.append("<option value=" + val.id + ">" + val.name + "</option>");
            });
            facultiesSelect2()
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//ajax request to get faculties
function getActiveCarreers() {
    $.ajax({
        url: BASE_URL + COURSES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            prerequisite.empty();
            prerequisite.append("<option value='0'>Sin prerrequisito</option>");
            $.each(result, function(i, val) {
                console.log(val.name);

                //filling table
                prerequisite.append("<option value=" + val.id + ">" + val.name + "</option>");
            });
            prerrequisitesSelect2()
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}


function postCourse() {
    console.log(newCourseFrm.serialize());
    var formData = newCourseFrm.serializeArray();
    formData.push({ name: "inter", value: $('#interMateria').is(':checked') });
    formData.push({ name: "laboratory", value: $('#labMateria').is(':checked') });
    console.log(formData);
    $.ajax({
        url: BASE_URL + COURSES_CREATE,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getCourses();
            newModalCourse.modal('close');
            M.toast({
                html: 'Materia agregada con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save career post
newCourseFrm.submit(function(e) {
    e.preventDefault();
    postCourse();
});

//request one user
function requestCourse(id) {
    $.ajax({
        url: BASE_URL + COURSE_SINGLE + "/" + id + "/faculties/prerrequisite",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            var idPre = "0"
            if (result["course"] != null) {
                idPre = result["course"].id;
            }
            $("#uIdCourse").val(result.id);
            $("#uNombreMateria").val(result.name);
            $("#uSemestreMateria").val(result.semester);
            $("#uInterMateria").prop('checked', result.inter);
            $("#uLabMateria").prop('checked', result.laboratory);
            $("#uUvMateria").val(result.uv);
            $('#uCoursePrerequisite option[value="' + idPre + '"]').prop('selected', true)
            $('#uCourseFaculty option[value="' + result["faculty"].id + '"]').prop('selected', true)
            prerrequisitesSelect2()
            facultiesSelect2()
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateModalCourse.modal("open");
            updLabels.addClass("active");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function updateCourse() {
    var formData = updateCourseFrm.serializeArray();
    formData.push({ name: "inter", value: $('#uInterMateria').is(':checked') });
    formData.push({ name: "laboratory", value: $('#uLabMateria').is(':checked') });
    $.ajax({
        url: BASE_URL + COURSES_CREATE,
        type: "PUT",
        data: formData,
        success: function(result) {
            console.log(result);
            getCourses();
            updateModalCourse.modal('close');
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

updateCourseFrm.submit(function(e) {
    e.preventDefault();
    updateCourse();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteCourse(id) {
    $("#dIdCourse").val(id);
    deleteModalCourse.modal("open");
}

//delete user
function deleteCourse() {
    console.log(BASE_URL + COURSES_CREATE + "/" + $("#dIdCourse").val())
    $.ajax({
        url: BASE_URL + COURSES_CREATE + "/" + $("#dIdCourse").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getCourses();
            $("#dIdCourse").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}