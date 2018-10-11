var careerId;
var table = $("#evaluationsTable");
var newEvaFrm = $("#frmRegEval");
var updateEvaFrm = $("#frmUpdtEval");
var newModalEva = $("#nuevaEvaluacion");
var updateModalEva = $("#actualizarEvaluacion");
var deleteModalEva = $("#eliminarEvaluacion");
var courseId = $(".courseId");

$(document).ready(function() {
    let params = new URLSearchParams(window.location.search)
    careerId = params.get("id");
    courseId.val(careerId);
    getEvaluations();
    $('.datepicker').datepicker({ format: "yyyy-mm-dd" });
});


function getEvaluations() {
    $.ajax({
        url: BASE_URL + EVALUATIONS_READ + careerId,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //validating if it's an active user
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                var lab = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.laboratory === false) {
                    lab = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                var startDate = new Date(val.startDate);
                var endDate = new Date(val.endDate);

                //filling table
                table.append("<tr>" +
                    "<td>" + val.name + "</td>" +
                    "<td>" + val.percentage + "</td>" +
                    "<td>" + val.period + "</td>" +
                    "<td>" +
                    "<label>" +
                    lab +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td>" + startDate.getDate() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getFullYear() + "</td>" +
                    "<td>" + endDate.getDate() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getFullYear() + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestEvaluation(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteEvaluation(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newEvaFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

function postEvaluation() {
    var formData = newEvaFrm.serializeArray();
    console.log(formData);
    formData.push({ name: "laboratory", value: $('#labEvaluacion').is(':checked') });
    $.ajax({
        url: BASE_URL + EVALUATIONS_CREATE,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getEvaluations();
            newModalEva.modal('close');
            M.toast({
                html: 'Evaluacion agregada con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save career post
newEvaFrm.submit(function(e) {
    e.preventDefault();
    postEvaluation();
});

function showError(error) {
    M.toast({
        html: error
    })
}