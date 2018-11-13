var table = $("#mycoursesTable");
var id;
var updateModalCourse = $("#visualizarMateria");
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

    getCourses();
});

//ajax request to get faculties
function getCourses() {
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_BYEMPLOYEE + id + "/courses/active",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            destDataTable();
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.id);

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
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourse(" + val["course"].id + ")'>remove_red_eye</i></a></td>" +
                    "<td><a href='students_courses.html?id=" + val.id + "' class='modal-trigger'><i class='material-icons'>person</i></a></td>" +
                    "<td><a href='course_evaluations.html?courseTeacherId=" + val.id + "&courseId=" + val.course.id + "'><i class='material-icons'>assignment</i></a></td>" +
                    "</tr>");
            });
            //newFacFrm.trigger("reset");

            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#teachCourseItem").addClass("selectedItem");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las materias impartidas'
            })
        }
    });
}
//request one user
function requestCourse(id) {
    $.ajax({
        url: BASE_URL + COURSE_SINGLE + "/" + id + "/faculties/prerrequisite",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            var prerrequisite = "Sin prerrequisito"
            if (result["course"] != null) {
                prerrequisite = result["course"].name;
            }
            var semester = (result.semester == "1" ? "I" : (result.semester == "2" ? "II" : "Ambos"))
            $("#uNombreMateria").val(result.name);
            $("#uSemestreMateria").val(semester);
            $("#uInterMateria").prop('checked', result.inter);
            $("#uLabMateria").prop('checked', result.laboratory);
            $("#uUvMateria").val(result.uv);
            $('#uCoursePrerequisite').val(prerrequisite);
            $('#uCourseFaculty').val(result["faculty"].name);
            updateModalCourse.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}