var table = $("#careersTable");
var newCarFrm = $("#frmRegCareer");
var updateCarFrm = $("#frmUpdtCarrers");
var updateModalCareer = $("#actualizarCarreras");
var newModalCareer = $("#nuevaCarrera");
var deleteModalCareer = $("#eliminarCarrera");
var faculties = $(".cCarrerFaculty");
var career_type = $(".cCareerType");
var updLabels = $(".updLabel");


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
    getCareers();
});

//Initialize faculty selects as select2
function facultiesSelect2() {
    $("#CareerFaculty").select2({
        dropdownParent: newModalCareer,
        width: "100%"
    });
    
    $("#uCareerFaculty").select2({
        dropdownParent: updateModalCareer,
        width: "100%"
    });
}

//Initialize careerType selects as select2
function careerTypesSelect2() {
    $("#CareerTypeFaculty").select2({
        dropdownParent: newModalCareer,
        width: "100%"
    });
    
    $("#uCareerTypeFaculty").select2({
        dropdownParent: updateModalCareer,
        width: "100%"
    });
}

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
                if (val.state === false) {
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
                    "<td><a href='" + 'career_courses.html?id=' + val.id + "' class='modal-trigger'><i class='material-icons green-text'>ballot</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestCareer(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteCareer(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newCarFrm.trigger("reset");
            updateCarFrm.trigger("reset");
            getFaculties();
            getCareerTypes();
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//ajax request to get faculties
function getFaculties() {
    $.ajax({
        url: BASE_URL + FACULTIES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            faculties.empty();
            $.each(result, function(i, val) {
                console.log(val.name);

                //filling table
                faculties.append("<option value=" + val.id + ">" + val.name + "</option>");
            });
            //faculties.formSelect();
            facultiesSelect2();
            
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//ajax request to get faculties
function getCareerTypes() {
    $.ajax({
        url: BASE_URL + CAREER_TYPES_READ_ACTIVE,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            career_type.empty();
            $.each(result, function(i, val) {
                console.log(val.name);
                //filling table
                career_type.append("<option value=" + val.id + ">" + val.name + "</option>");
            });
            //career_type.formSelect();
            careerTypesSelect2()
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todas las facultades'
            })
        }
    });
}

//request one user
function requestCareer(id) {
    $.ajax({
        url: BASE_URL + CAREERS_CREATE + "/" + id + "/full",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $("#uIdCareer").val(result.id);
            $("#uNombreCarrera").val(result.name);
            $('#uCareerFaculty option[value="' + result["faculty"].id + '"]').prop('selected', true)
            $('#uCareerTypeFaculty option[value="' + result["careerType"].id + '"]').prop('selected', true)
            
            facultiesSelect2();
            careerTypesSelect2()
            
            if (result.state === true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateModalCareer.modal("open");
            updLabels.addClass("active");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//save career
function postCareer() {
    $.ajax({
        url: BASE_URL + CAREERS_CREATE,
        type: "POST",
        data: newCarFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareers();
            newModalCareer.modal('close');
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

//save career post
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

function updateCareer() {
    $.ajax({
        url: BASE_URL + CAREERS_CREATE,
        type: "PUT",
        data: updateCarFrm.serialize(),
        success: function(result) {

            console.log(result);
            getCareers();
            updateModalCareer.modal('close');
            M.toast({
                html: 'Carrera actualizada'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

updateCarFrm.submit(function(e) {
    e.preventDefault();
    updateCareer();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteCareer(id) {
    $("#dIdCareer").val(id);
    deleteModalCareer.modal("open");
}

//delete user
function deleteCareer() {
    console.log(BASE_URL + CAREERS_CREATE + "/" + $("#dIdCareer").val())
    $.ajax({
        url: BASE_URL + CAREERS_CREATE + "/" + $("#dIdCareer").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getCareers();
            $("#dIdCareer").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}