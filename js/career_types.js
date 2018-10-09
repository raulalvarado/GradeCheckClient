var table = $("#careerTypeTable");
var newCarTypeFrm = $("#frmRegCarTyp");
var updateCarFrm = $("#frmUpdtCarTyp");
var updateModalCareerType = $("#actualizarTipoCarrera");
var newModalCareerType = $("#nuevoTipoCarrera");
var deleteModalFaculty = $("#eliminarTipoCarrera");
//trying to get faculties from digital ocean server
$(document).ready(function() {
    getCareerTypes();
});

//ajax request to get faculties
function getCareerTypes() {
    $.ajax({
        url: BASE_URL + CAREER_TYPES_READ,
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

                //filling table
                table.append("<tr>" +
                    "<td>" + val.name + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCareerType(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='confirmDeleteCareerType(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newCarTypeFrm.trigger("reset");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//save user
function postCareerType() {
    $.ajax({
        url: BASE_URL + CAREER_TYPES_CREATE,
        type: "POST",
        data: newCarTypeFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareerTypes();
            newModalCareerType.modal('close');
            M.toast({
                html: 'Tipo de carrera agregado con exito'
            })
        },
        error: function(error) {
            console.log(error);
            //showError(error.responseText);
        }
    });
}

//save user post
newCarTypeFrm.submit(function(e) {
    e.preventDefault();
    postCareerType();
});