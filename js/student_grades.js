var registeredId;
var table = $("#content")
var updateEvaFrm = $("#frmCalificar");
var updateEvaModal = $("#calificarEvaluacion")
$(document).ready(function() {
    let params = new URLSearchParams(window.location.search)
    registeredId = params.get("id");
    console.log(registeredId);
    getEvaluations();
});

function getEvaluations() {
    $.ajax({
        url: BASE_URL + EVALUATIONS_BYREGISTEREDCOURSE + registeredId + "/grades",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.id);
                var grade = "NPI"
                if (val["grades"][0].state) {
                    grade = val["grades"][0].grade;
                }
                var desc = " ";
                if (val.description != null) {
                    desc = val.description
                }
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
                    "<a id='link' class='modal-trigger' onclick='getEva(" + val.id + ",\"" + desc + "\"," + val["grades"][0].grade + ");'>Calificar</a>" +
                    "</div>" +
                    "<div class='aldiv'>" +
                    "<span>CALIFICADA: <span class='grade'>" + grade + "</span></span>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            });
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las evaluaciones'
            })
        }
    });
}

function getEva(id, description, grade) {
    $("#registeredCourseId").val(registeredId);
    $("#evaluationId").val(id);
    $("#notaEvaluacion").val(grade);
    $("#obsEcaluacion").val(description);
    updateEvaModal.modal("open")
}

function updateEva() {
    console.log(updateEvaFrm.serialize())
    $.ajax({
        url: BASE_URL + GRADES_CREATE,
        type: "PUT",
        data: updateEvaFrm.serialize(),
        success: function(result) {
            console.log(result);
            getEvaluations();
            updateEvaModal.modal('close');
            M.toast({
                html: 'Evaluacion actualizada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

updateEvaFrm.submit(function(e) {
    e.preventDefault();
    updateEva();
});

function showError(error) {
    M.toast({
        html: error
    })
}