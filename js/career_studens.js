var studentId;
var table = $("#cStudentsTable");
var newCarFrm = $("#frmRegCS");
var updateCarFrm = $("#frmUpdtCS");
var newModalCar = $("#nuevaCarreraAsig");
var updateModalCar = $("#actualizarCarreraAsig");
var deleteModalCar = $("#eliminarCarreraAsig");
var studentIdForm = $(".studentId");
var careerActive = $("#carreraEst");

$(document).ready(function() {
    let params = new URLSearchParams(window.location.search)
    studentId = params.get("id");
    studentIdForm.val(studentId);
    getCareers();
    $('.datepicker').datepicker({ format: "yyyy-mm-dd" });
});

function getCareers() {
    $.ajax({
        url: BASE_URL + CAREER_STUDENTS_READ + studentId + "/full",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val["career"].name);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val["career"].name + "</td>" +
                    "<td>" + val.incomeYear + "</td>" +
                    "<td>" + val.careerState + "</td>" +
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
            getActiveCareers();
            newCarFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

function getActiveCareers() {
    $.ajax({
        url: BASE_URL + CAREERS_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            careerActive.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //filling table
                careerActive.append("<option value=" + val.id + ">" + val.name + "</option>");
            });
            careerActive.formSelect();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

function postCareer() {
    $.ajax({
        url: BASE_URL + CAREER_STUDENTS_CREATE,
        type: "POST",
        data: newCarFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareers();
            newModalCar.modal('close');
            M.toast({
                html: 'Carrera agregada con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

newCarFrm.submit(function(e) {
    e.preventDefault();
    postCareer();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}