//declaring useful variables
var table = $("#studentsTable");
var formNuevoEst = $("#frmRegStudent");
var formUdapteEst = $("#frmUpdtStudent");
var newModal = $("#nuevoEstudiante");
var updateEModal = $("#actualizarEstudiantes");
var deleteEModal = $("#eliminarEstudiante");

//trying to get users from digital ocean server
$(document).ready(function() {
    getStudents();
});

//ajax request to get students
function getStudents() {
    $.ajax({
        url: BASE_URL + STUDENTS_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val["user"]["person"].email);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val["user"]["person"].name + "</td>" +
                    "<td>" + val["user"]["person"].surname + "</td>" +
                    "<td>" + val["user"].username + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCareer(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCourses(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestStudent(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteStudent(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            formNuevoEst.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los usuarios'
            })
        }
    });
}