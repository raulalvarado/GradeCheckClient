var id;

var table = $("#correctionsTable");
var updateCorFrm = $("#frmCorrecion");
var updateModalCorrection = $("#actualizarCorreccion");
var updateEvaFrm = $("#frmCorrectCalificar");
var updateEvaModal = $("#CorrectCalificarEvaluacion");
var updLabels = $(".updLabels");

$(document).ready(function() {
    $('.modal').modal();
    $('select').formSelect();

    try {
        $.ajaxSetup({
            headers: {
            token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });
    }
    catch (error) {
        window.location.replace("../login.html");
    }
    
    //Validating permissions
    if (JSON.parse(sessionStorage["logedUser"]).role.teach != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    id = JSON.parse(sessionStorage["logedUser"]).id;

    getCorrections();

});

//ajax request to get corrections
function getCorrections() {
    $.ajax({
        url: BASE_URL + CORRECTIONS_BYEMPLOYEE + id + "/course/owner",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            destDataTable();
            table.empty();
            $.each(result, function(i, val) {

                var filename;

                //Obteniendo el nombre del archivo a descargar, si existe
                if (val.filePath != null) {
                    var filenameParts = val.filePath.split("\\")
                    filename = filenameParts[filenameParts.length - 1]
                }

                var observation = "";
                if (val.grade.observations != null) {
                    observation = val.grade.observations;
                }
                
                //filling table
                table.append("<tr>" +
                    "<td>" + val.owner + "</td>" +
                    "<td>" + val.grade.evaluation.course.name + "</td>" +
                    "<td>" + val.correctionState + "</td>" +
                    (val.filePath == null ? "<td></td>" :
                    "<td><a href='#'><i class='material-icons green-text' onclick='downloadFile(\"" + BASE_URL + CORRECTIONS_DOWNLOAD + val.id + "\", \"" + filename + "\")'>file_download</i></a></td>"
                    ) +
                    "<td><a href='#actualizarCorreccion' class='modal-trigger'><i class='material-icons blue-text' onclick='requestCorrection(" + val.grade.id + ")'>dvr</i></a></td>" +
                    "<td><a href='#CorrectCalificarEvaluacion' class='modal-trigger' onclick='getEva(" + val.grade.evaluation.id + "," + val.registeredCourseId + ",\"" + observation + "\"," + val.grade.grade + ");'><i class='material-icons yellow-text' onclick=''>grade</i></a></td>" +
                    "</tr>");
            });

            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#correctionItem").addClass("selectedItem");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar las solicitudes de corrección'
            })
        }
    });
}

function getEva(evaluationId, registeredCourseId, observation, grade) {
    $("#registeredCourseId").val(registeredCourseId);
    $("#evaluationId").val(evaluationId);
    $("#cNotaEvaluacion").val(grade);
    $("#cObsEcaluacion").val(observation);
    updLabels.addClass("active");
}

function requestCorrection(gradeId) {
    $.ajax({
        url: BASE_URL + CORRECTIONS_BYGRADE + gradeId + "/course/studentName",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            var period = (result.grade.evaluation.period == "1" ? "I" : (result.grade.evaluation.period == "2" ? "II" : "III"))
            var startDate = new Date(result.grade.evaluation.startDate);
            var endDate = new Date(result.grade.evaluation.endDate);
            $("#cIdEval").val(result.grade.evaluation.id);
            $("#cNombreEvaluacion").html(result.grade.evaluation.name);
            $("#cDesEcaluacion").html(result.grade.evaluation.description);
            //$("#cPorcEvaluacion").val(result.grade.evaluation.percentage);
            $('#cPeriodoEvaluacion').html(period)
            $("#cLabEvaluacion").prop("checked", result.grade.evaluation.laboratory);
            $("#cFechaInicio").val(startDate.getDate() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getFullYear())
            $("#cFechaFin").val(endDate.getDate() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getFullYear())
            
            $('#estadoPeticion option[value="' + result.correctionState + '"]').prop('selected', true)
            $('#correctionDescription').html(result.description)
            $("select").formSelect();
            $("#correctionId").val(result.id);

            updateModalCorrection.modal("open");
        },
        error: function(error) {
            showError("Ocurrió un error al obtener la corrección");
        }
    });
}

//update correction post
updateCorFrm.submit(function(e) {
    e.preventDefault();
    updateCorrection();
});

//update correction 
function updateCorrection() {
    $.ajax({
        url: BASE_URL + CORRECTIONS,
        type: "PUT",
        data: updateCorFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCorrections();
            updateModalCorrection.modal('close');
            M.toast({
                html: 'Solicitud procesada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

function updateEva() {
    $.ajax({
        url: BASE_URL + GRADES_CREATE,
        type: "PUT",
        data: updateEvaFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCorrections();
            updateEvaModal.modal('close');
            M.toast({
                html: 'Nota actualizada'
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


function downloadFile(url, filename) {
    $.ajax({
        url: url,
        type: "GET",
        xhrFields:{
            responseType: 'blob'
        },
        success: function(result) {
            //Creando un archivo a partir del result
            var blob = new Blob([result], { type: 'application/zip' });

            //Creando un <a> para descargar el archivo, triggereando la descarga y eliminando el <a>
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        },
        error: function(error, xhr, exc) {
            console.log(exc);
            M.toast({
                html: 'Error al solicitar el archivo'
            })
        }
    });
}

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}