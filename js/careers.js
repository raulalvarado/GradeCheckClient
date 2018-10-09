var table = $("#careersTable");
var newCarFrm = $("#frmRegCareer");
var updateCarFrm = $("#frmUpdtCarrers");
var updateModalCareer = $("#actualizarFacultad");
var newModalCareer = $("#nuevaCarrera");
var deleteModalFaculty = $("#eliminarCarrera");
//trying to get faculties from digital ocean server
$(document).ready(function() {
    getCareers();
});

//ajax request to get faculties
function getCareers() {
    $.ajax({
        url: BASE_URL + CAREERS_READ,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === "false") {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val.name + "</td>" +
                    "<td>" + val['faculty'].name + "</td>" +
                    "<td>" + val['careerType'].name + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCareer(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteCareer(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newFacFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}