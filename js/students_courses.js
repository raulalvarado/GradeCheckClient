var courseId;
var table = $("#studentsTable")
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
    courseId = params.get("id");
    console.log(courseId);

    getCourseName();
    getStudents();
    
});

//ajax request to get course name
function getCourseName() {
    $.ajax({
        url: BASE_URL + COURSE_TEACHERS_CREATE + "/" + courseId + "/courses ",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Estudiantes de " + result.course.name);
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function getStudents() {
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_BYTEACHER + courseId + "/students/users/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            destDataTable();
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.id);
                //filling table
                table.append("<tr>" +
                    "<td>" + val["student"]["user"]["person"].name + "</td>" +
                    "<td>" + val["student"]["user"]["person"].surname + "</td>" +
                    "<td><a href='student_grades.html?id=" + val.id + "&courseTeacherId=" + courseId + "' class='modal-trigger'><i class='material-icons'>person</i></a></td>" +
                    "<td><a href='absences.html?id=" + val.id + "&courseTeacherId=" + courseId + "'><i class='material-icons red-text'>event_busy</i></a></td>" +
                    "</tr>");
            });

            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#teachCourseItem").addClass("selectedItem");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}