var table = $("#careerTypeTable");
var newCarTypeFrm = $("#frmRegCarTyp");
var updateCarTypeFrm = $("#frmUpdtCarTyp");
var updateModalCareerType = $("#actualizarTipoCarrera");
var newModalCareerType = $("#nuevoTipoCarrera");
var deleteModalCareerType = $("#eliminarTipoCarrera");
//trying to get faculties from digital ocean server
$(document).ready(function() {
    try {
        $.ajaxSetup({
            headers: {
              token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });
    }
    catch (error) {
        window.location.replace("login.html");
    }

    //Validating permissions
    if (JSON.parse(sessionStorage["logedUser"]).role.manageCareers != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

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
            destDataTable();
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
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteCareerType(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newCarTypeFrm.trigger("reset");
            
            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#careerTypeItem").addClass("selectedItem");
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
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//request one user
function requestCareerType(id) {
    $.ajax({
        url: BASE_URL + CAREER_TYPES_READ + "/" + id,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $("#uIdCareerType").val(result.id);
            $("#uNombreTipoCarrera").val(result.name);
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateModalCareerType.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function updateCareerType() {
    $.ajax({
        url: BASE_URL + CAREER_TYPES_CREATE,
        type: "PUT",
        data: updateCarTypeFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareerTypes();
            updateModalCareerType.modal('close');
            M.toast({
                html: 'Tipo de carrera actualizada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

updateCarTypeFrm.submit(function(e) {
    e.preventDefault();
    updateCareerType();
});

newCarTypeFrm.submit(function(e) {
    e.preventDefault();
    postCareerType();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteCareerType(id) {
    $("#dIdCareerType").val(id);
    deleteModalCareerType.modal("open");
}

//delete user
function deleteCareerType() {
    console.log(BASE_URL + CAREER_TYPES_CREATE + "/" + $("#dIdCareerType").val())
    $.ajax({
        url: BASE_URL + CAREER_TYPES_CREATE + "/" + $("#dIdCareerType").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getCareerTypes();
            $("#dIdCareerType").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}