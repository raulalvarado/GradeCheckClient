var employeeId;
var table = $("#CTeacherTable");
var newCtFrm = $("#frmRegCT");
var updateCtFrm = $("#frmUpdtCT");
var newModalCt = $("#nuevaMateriaAsig");
var updateModalCt = $("#actualizarMateriaAsig");
var deleteModalCt = $("#eliminarMateriaAsig");
var employeeIdForm = $(".employeeId");
var courseActive = $("#materiaProf");
var updLabels = $(".updLabel");

$(document).ready(function() {
    try {
        JSON.parse(sessionStorage["logedUser"]).id
    }
    catch (error) {
        window.location.replace("login.html");
    }

    let params = new URLSearchParams(window.location.search)
    employeeId = params.get("id");
    employeeIdForm.val(employeeId);
    getCareers();
    $("#CicloMateria").formSelect();
    $("#uCicloMateria").formSelect();
    $('.datepicker').datepicker({ format: "yyyy-mm-dd" });
});


//Initialize course selects as select2
function coursesSelect2() {
    $("#materiaProf").select2({
        dropdownParent: newModalCt,
        width: "100%"
    });
}

function getCareers() {
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_BYEMPLOYEE + employeeId + "/courses",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val["course"].name);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val["course"].name + "</td>" +
                    "<td>" + val.courseYear + "</td>" +
                    "<td>" + val.semester + "</td>" +
                    "<td>" + val.classCount + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourse(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteCareer(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            getActiveCourses();
            newCtFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

function getActiveCourses() {
    $.ajax({
        url: BASE_URL + COURSES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            courseActive.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //filling table
                courseActive.append("<option value=" + val.id + ">" + val.name + "</option>");
            });
            coursesSelect2();
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
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_CREATE,
        type: "POST",
        data: newCtFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareers();
            newModalCt.modal('close');
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

newCtFrm.submit(function(e) {
    e.preventDefault();
    postCourse();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}

function requestCourse(id) {
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_CREATE + "/" + id + "/courses",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result.semester);
            $("#uIdCTeachers").val(result.id);
            $("#uAñoMateria").val(result.courseYear);
            $("#uCupoMateria").val(result.classCount);
            $('#uCicloMateria option[value="' + result.semester + '"]').prop('selected', true)
            $('#uCicloMateria').formSelect();
            updateModalCt.modal("open");
            updLabels.addClass("active");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function updateCourse() {
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_CREATE,
        type: "PUT",
        data: updateCtFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareers();
            updateModalCt.modal('close');
            M.toast({
                html: 'Materia actualizada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

updateCtFrm.submit(function(e) {
    e.preventDefault();
    updateCourse();
});


function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteCareer(id) {
    $("#dIdCTeachers").val(id);
    deleteModalCt.modal("open");
}

//delete user
function deleteCareer() {
    console.log(BASE_URL + COURSE_TEACHERS_CREATE + "/" + $("#dIdCTeachers").val())
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_CREATE + "/" + $("#dIdCTeachers").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getCareers();
            $("#dIdCTeachers").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}