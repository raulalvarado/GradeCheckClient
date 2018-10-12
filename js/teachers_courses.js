var table = $("#mycoursesTable");
var id;
var updateModalCourse = $("#visualizarMateria");
$(document).ready(function() {
    try {
        id = JSON.parse(sessionStorage["logedUser"]).id
        console.log(id + "goli")
    } catch (error) {
        location.replace("../login.html")
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
                    "</tr>");
            });
            //newFacFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
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
            $("#uCoursePrerequisite").formSelect();
            $('#uCourseFaculty').formSelect();
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateModalCourse.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}