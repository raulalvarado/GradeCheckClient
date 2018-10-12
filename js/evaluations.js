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

function requestEvaluation(id) {
    $.ajax({
        url: BASE_URL + EVALUATIONS_CREATE + "/" + id,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            var startDate = new Date(result.startDate);
            var endDate = new Date(result.endDate);
            $("#uIdEval").val(result.id);
            $("#uNombreEvaluacion").val(result.name);
            $("#uDescEvaluacion").val(result.description);
            $("#uPorcEvaluacion").val(result.percentage);
            $('#uPeriodoEvaluacion option[value="' + result.period + '"]').prop('selected', true)
            $("#uLabEvaluacion").prop("checked", result.laboratory);
            $("#uFechaInicio").val(startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate())
            $("#uFechaFin").val(endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate())
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateModalEva.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
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

function updateEvaluation() {
    var formData = updateEvaFrm.serializeArray();
    formData.push({ name: "laboratory", value: $('#uLabEvaluacion').is(':checked') });
    $.ajax({
        url: BASE_URL + EVALUATIONS_CREATE,
        type: "PUT",
        data: formData,
        success: function(result) {
            console.log(result);
            getEvaluations();
            updateModalEva.modal('close');
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
    updateEvaluation();
});

function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteEvaluation(id) {
    $("#dIdEval").val(id);
    deleteModalEva.modal("open");
}

//delete user
function deleteEvaluation() {
    console.log(BASE_URL + EVALUATIONS_CREATE + "/" + $("#dIdEval").val())
    $.ajax({
        url: BASE_URL + EVALUATIONS_CREATE + "/" + $("#dIdEval").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getEvaluations();
            $("#dIdEval").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}