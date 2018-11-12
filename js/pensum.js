var careerId;
var plan;
var title = $("#title");
var courses = $(".cCourse");
var newCarCrsFrm = $("#frmCareerCourse");
var newCarCrsModal = $("#nuevoCareerCourse");
var delCarCrsFrm = $("#frmDeleteCareerCourse");
var delCarCrsModal = $("#eliminarCareerCourse");

//trying to get faculties from digital ocean server
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
    if (JSON.parse(sessionStorage["logedUser"]).role.managePensums != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    let params = new URLSearchParams(window.location.search)
    careerId = params.get("id");
    plan = params.get("plan");
    $("#careerId").val(careerId);
    $("#plan").val(plan);
    getCareerName();
    fillTable();
    getCourses();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })

}

//Initialize course selects as select2
function coursesSelect2() {
    $("#course").select2({
        dropdownParent: newCarCrsModal,
        width: "100%"
    });
}

//ajax request to get faculties
function getCareerName() {
    $.ajax({
        url: BASE_URL + CAREERS_CREATE + "/" + careerId + "/full",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html(result.name + " - Plan " + plan);
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//ajax request to get careerCourses
function fillTable() {
    $.ajax({
        url: BASE_URL + CAREER_COURSES_BY_CAREER + careerId + "/byPlan/" + plan,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);

            //Vaciando columnas
            for (year = 1; year <= 5; year++) {
                for (semester = 1; semester <= 2; semester++) {
                    $("#column" + year + "" + semester).html("");
                }
            }

            //Añadiendo resultados obtenidos
            $.each(result, function(i, val) {
                $("#column" + val.pensumYear + "" + val.pensumSemester).append(
                    "<div class='col s12'>" +
                        "<div class='card' style='overflow: hidden'>" +
                            "<div class='row' style='margin-bottom: 0'>" +
                                "<div class='col s12 center-align red darken-2 white-text'>" + val.course.courseCode + "</div>" +
                                "<div class='col s12 center-align'>" +
                                    "<p>" + val.course.name + "</p>" +
                                    (plan > (new Date()).getFullYear() ? "<a href='#eliminarCareerCourse' class='modal-trigger'><i class='material-icons red-text' onclick='setDeleteId(" + val.id + ")'>delete</i></a>" : "") + //Se pueden desvicular materias solo si es un plan futuro
                                "</div>" +
                                "<div class='col s6 center-align indigo accent-2 white-text'>" + val.course.uv + " UV</div>" + 
                                "<div class='col s6 center-align red white-text'>" + (val.course.course != null ? val.course.course.courseCode : "N/A") + "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>"
                );
            });

            //Añadiendo botón de agregar a cada columna, si es aplicable
            for (year = 1; year <= 5; year++) {
                for (semester = 1; semester <= 2; semester++) {
                    //Solo se pueden agregar más materias si el ciclo tiene menos de 7 materias registradas y el plan es de un año futuro
                    if ($("#column" + year + "" + semester).children().length < 7 && plan > (new Date()).getFullYear()) {

                        $("#column" + year + "" + semester).append(
                            "<div class='col s12 center-align'>" +
                                "<div class='card waves-effect' style='overflow: hidden'>" +
                                    "<a href='#nuevoCareerCourse' class='modal-trigger'><i class='large material-icons' onclick='setCourseSemester(" + year + "," + semester + ")'>add</i></a>" +
                                "</div>" +
                            "</div>"
                        );
                    }
                }
            }
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//ajax request to get courses
function getCourses() {
    $.ajax({
        url: BASE_URL + COURSES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            courses.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //filling table
                courses.append("<option value=" + val.id + ">" + val.name + " (" + val.courseCode + ")</option>");
            });
            //courses.formSelect();
            coursesSelect2()

            requestCourse();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las materias'
            })
        }
    });
}

//ajax request to get a course
function requestCourse() {
    $.ajax({
        url: BASE_URL + COURSE_SINGLE + "/" + courses.val() + "/faculties/prerrequisite",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            //Showing course info
            $("#frmCourse").html("<b>Código:</b> " + result.courseCode);
            $("#frmFaculty").html("<b>Facultad:</b> " + result.faculty.name);
            $("#frmUV").html("<b>UV:</b> " + result.uv);
            if (result.course != null) {
                $("#frmPrerrequisite").html("<b>Prerrequisito:</b> " + result.course.name + " (" + result.course.courseCode + ")");
            }
            else {
                $("#frmPrerrequisite").html("<b>Prerrequisito:</b> N/A");
            }
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar la materia'
            })
        }
    });
}


//Al abrir el modal de nueva materia, debe sincronizar el año y ciclo con los de la columna seleccionada
function setCourseSemester(year, semester) {
    $("#pensumYear").val(year)
    $("#pensumSemester").val(semester)
}

//save careerCourse
function postCareerCourse() {
    $.ajax({
        url: BASE_URL + CAREER_COURSES_CREATE,
        type: "POST",
        data: newCarCrsFrm.serialize(),
        success: function(result) {
            console.log(result);
            fillTable();
            newCarCrsModal.modal('close');
            M.toast({
                html: 'Materia registrada con éxito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save careerCourse post
newCarCrsFrm.submit(function(e) {
    e.preventDefault();
    postCareerCourse();
});


//Al abrir el modal de eliminar materia, debe sincronizar el id
function setDeleteId(id) {
    $("#careerCourseId").val(id)
}

//delete careerCourse
function deleteCareerCourse() {
    $.ajax({
        url: BASE_URL + CAREER_COURSES_CREATE + "/" + $("#careerCourseId").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            fillTable();
            M.toast({
                html: 'Materia desvinculada con éxito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//Al seleccionar algo del select
courses.change(function(){
    requestCourse();
});
