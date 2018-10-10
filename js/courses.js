var table = $("#coursesTable");
var newCourseFrm = $("#frmRegCourse");
var updateCarFrm = $("#frmUpdtCourse");
var updateModalCareer = $("#actualizarMateria");
var newModalCourse = $("#nuevaMateria");
var deleteModalFaculty = $("#eliminarMateria");
var faculties = $(".cCourseFaculty");
var prerequisite = $(".cCoursePrerequisite");
//trying to get faculties from digital ocean server
$(document).ready(function() {
    getCourses();
});

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
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestEvaluations(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourses(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteCourse(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            getFaculties();
            getActiveCarreers();
            newCourseFrm.trigger("reset");
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
            faculties.formSelect();
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
            prerequisite.formSelect();
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

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}