var table = $("#coursesTable");
var newCourseFrm = $("#frmRegCourse");
var updateCarFrm = $("#frmUpdtCourse");
var updateModalCareer = $("#actualizarMateria");
var newModalCourse = $("#nuevaMateria");
var deleteModalFaculty = $("#eliminarMateria");
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