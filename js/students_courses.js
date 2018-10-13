var courseId;
var table = $("#studentsTable")
$(document).ready(function() {
    try {
        id = JSON.parse(sessionStorage["logedUser"]).id
        console.log(id + "goli")
    } catch (error) {
        location.replace("../login.html")
    }
    let params = new URLSearchParams(window.location.search)
    courseId = params.get("id");
    console.log(courseId);

    getStudents();
});

function getStudents() {
    $.ajax({
        url: BASE_URL + REGISTERED_COURSES_BYTEACHER + courseId + "/students/users/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.id);
                //filling table
                table.append("<tr>" +
                    "<td>" + val["student"]["user"]["person"].name + "</td>" +
                    "<td>" + val["student"]["user"]["person"].surname + "</td>" +
                    "<td><a href='student_grades.html?id=" + val.id + "' class='modal-trigger'><i class='material-icons'>person</i></a></td>" +
                    "</tr>");
            });
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}