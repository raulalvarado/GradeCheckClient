var courseId;
var courseTeacherId;
var table = $("#content");
var title = $("#title");

$(document).ready(function() {
    $('.modal').modal();
   // $('select').formSelect();

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
    courseId = params.get("courseId");
    courseTeacherId = params.get("courseTeacherId");

    getCourseName();
    getEvaluations();
});

//ajax request to get course name
function getCourseName() {
    $.ajax({
        url: BASE_URL + COURSES_CREATE + "/" + courseId + "/faculties/prerrequisite ",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Evaluaciones de " + result.name + " (" + result.courseCode + ")");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function getEvaluations() {
    $.ajax({
        url: BASE_URL + EVALUATIONS_BYCOURSE + courseId + "/active",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
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
                    "<a id='link' href='evaluation_students.html?courseTeacherId=" + courseTeacherId  + "&evaluationId=" + val.id + "&courseId=" + courseId + "' class='modal-trigger'>Calificar estudiantes</a>" +
                    "</div>" +
                    "<div class='aldiv'>" +
                    "<span><span class='grade'></span></span>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            });

            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#teachCourseItem").addClass("selectedItem");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las evaluaciones'
            })
        }
    });
}