var registeredId;
var table = $("#content")
var updateEvaFrm = $("#frmCalificar");
var updateEvaModal = $("#calificarEvaluacion")
var title = $("#title");
$(document).ready(function() {
    try {
        $.ajaxSetup({
            headers: {
              token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });
    } catch (error) {
        location.replace("../login.html")
    }

    //Validating permissions
    if (JSON.parse(sessionStorage["logedUser"]).role.teach != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    let params = new URLSearchParams(window.location.search)
    registeredId = params.get("id");
    console.log(registeredId);

    //Setting breadcrumb href
    $("#secondBread").prop("href", "students_courses.html?id=" + params.get("courseTeacherId"))


    getStudentName();
    getEvaluations();
});

//ajax request to get student name
function getStudentName() {
    $.ajax({
        url: BASE_URL + STUDENTS_BYREGISTEREDCOURSE + registeredId + "/users/people ",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Notas de " + result.user.person.name + " " + result.user.person.surname);
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function getEvaluations() {
    $.ajax({
        url: BASE_URL + EVALUATIONS_BYREGISTEREDCOURSE + registeredId + "/grades",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.id);
                var grade = "NPI"
                if (val["grades"][0].state) {
                    grade = val["grades"][0].grade;
                }
                var desc = " ";
                if (val.description != null) {
                    desc = val.description
                }
                var obs = " ";
                if (val["grades"][0].observations != null) {
                    obs = val["grades"][0].observations
                }
                //filling table
                table.append("<div class='row'>" +
                    "<div class='col s12'>" +
                    "<div class='card'>" +
                    "<div class='card-content'>" +
                    "<span id='title' class='card-title'>" + val.name + "</span>" +
                    "<p>" + val.description + "</p>" +
                    "</div>" +
                    "<div class='card-action red white-text'>" +
                    "<div class='col s9 aldiv'>" +
                    "<a id='link' class='modal-trigger' onclick='getEva(" + val.id + ",\"" + obs + "\"," + val["grades"][0].grade + ");'>Calificar</a>" +
                    "</div>" +
                    "<div class='aldiv'>" +
                    "<span>CALIFICADA: <span class='grade'>" + grade + "</span></span>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            });
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las evaluaciones'
            })
        }
    });
}

function getEva(id, observation, grade) {
    $("#registeredCourseId").val(registeredId);
    $("#evaluationId").val(id);
    $("#notaEvaluacion").val(grade);
    $("#obsEcaluacion").val(observation);
    updateEvaModal.modal("open")
}

function updateEva() {
    console.log(updateEvaFrm.serialize())
    $.ajax({
        url: BASE_URL + GRADES_CREATE,
        type: "PUT",
        data: updateEvaFrm.serialize(),
        success: function(result) {
            console.log(result);
            getEvaluations();
            updateEvaModal.modal('close');
            M.toast({
                html: 'Evaluacion actualizada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

updateEvaFrm.submit(function(e) {
    e.preventDefault();
    updateEva();
});

function showError(error) {
    M.toast({
        html: error
    })
}