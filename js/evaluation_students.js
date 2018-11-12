var table = $("#evalStudentsTable");
var courseTeacherId;
var evaluationId;

$(document).ready(function() {
    try {
        $.ajaxSetup({
            headers: {
              token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });
        id = JSON.parse(sessionStorage["logedUser"]).id
    } catch (error) {
        location.replace("../login.html")
    }

    //Validating permissions
    if (JSON.parse(sessionStorage["logedUser"]).role.teach != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    let params = new URLSearchParams(window.location.search)
    courseTeacherId = params.get("courseTeacherId");
    evaluationId = params.get("evaluationId");

    getStudents();
});

function getStudents() {
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_BYTEACHER + courseTeacherId + "/byEvaluation/" + evaluationId + "/gradeTable",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                var observations = "";
                if (val.grades[0].observations != null) {
                    observations = val.grades[0].observations
                }

                //filling table
                table.append('<tr>' +
                    '<td>' + val.student.user.person.name + '</td>' +
                    '<td>' + val.student.user.person.surname + '</td>' +
                    '<td style="max-width:100px"><input type="hidden" class="registeredCourseId" value="' + val.id + '"/>' +
                    '<input value=' + val.grades[0].grade + ' step="0.01" class="evalNota" name="grade" type="number" min="0" max="10" pattern="^[0-9]{1}[.]{1}[0-9]{1,2}$" title="Solo se permiten números y dos decimales" required/></td>' +
                    '<td><textarea type="text" name="observations" class="materialize-textarea evalObservacion">' + observations + '</textarea></td>' +
                    '</tr>');
            });
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar los estudiantes'
            })
        }
    });
}

//sends the grades for every student
function sendGrades() {
    var gradeArray = "[";

    //Generating JSON with input values for each student
    $.each($(".registeredCourseId"), function(i, val) {
        gradeArray += 
            "{" +
                "\"grade\":" + $(".evalNota:eq(" + i + ")").val() + "," +
                "\"observations\":\"" + $(".evalObservacion:eq(" + i + ")").val() + "\"," +
                "\"registeredCourseId\":" + $(".registeredCourseId:eq(" + i + ")").val() + "," +
                "\"evaluationId\":" + evaluationId +
            "},";
    });

    //Removing last comma
    gradeArray = gradeArray.substr(0, gradeArray.length - 1);

    gradeArray += "]";

    //update faculty 
    $.ajax({
        url: BASE_URL + GRADES_CREATE_BYEVALUATION,
        type: "PUT",
        data: "array=" + gradeArray,
        success: function(result) {
            getStudents();
            M.toast({
                html: 'Calificaciones guardadas'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });

}

//update user post
$("#sendGradesFrm").submit(function(e) {
    e.preventDefault();
    sendGrades();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}