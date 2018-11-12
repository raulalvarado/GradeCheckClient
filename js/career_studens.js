var studentId;
var table = $("#cStudentsTable");
var newCarFrm = $("#frmRegCS");
var updateCarFrm = $("#frmUpdtCS");
var newModalCar = $("#nuevaCarreraAsig");
var updateModalCar = $("#actualizarCarreraAsig");
var deleteModalCar = $("#eliminarCarreraAsig");
var studentIdForm = $(".studentId");
var careerActive = $("#carreraEst");
var title = $("#title");

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
    if (JSON.parse(sessionStorage["logedUser"]).role.manageStudents != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    let params = new URLSearchParams(window.location.search)
    studentId = params.get("id");
    studentIdForm.val(studentId);
    getCareers();
    getStudentName();
    $('.datepicker').datepicker({ format: "yyyy-mm-dd" });

    //Inicializando select de modificar carrera
    $("#uEstadoCarrera").formSelect();
});

//Initialize career selects as select2
function careersSelect2() {
    //Cuando un select2 está dentro de un modal, es necesario especificarlo
    $("#carreraEst").select2({
        dropdownParent: newModalCar,
        width: "100%"
    });
}

//ajax request to get student
function getStudentName() {
    $.ajax({
        url: BASE_URL + STUDENTS_CREATE + "/" + studentId + "/users/people",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Carreras de " + result.user.person.name + " " + result.user.person.surname);
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

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
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteCareer(" + val.id + ")'>delete</i></a></td>" +
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
            careersSelect2();
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

function requestCareer(id) {
    $.ajax({
        url: BASE_URL + CAREER_STUDENTS_CREATE + "/" + id + "/careers",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result.careerState);
            $("#uIdCStudents").val(result.id);
            $('#uEstadoCarrera option[value="' + result.careerState + '"]').prop('selected', true)
            updateModalCar.modal("open");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

function updateCareer() {
    $.ajax({
        url: BASE_URL + CAREER_STUDENTS_CREATE,
        type: "PUT",
        data: updateCarFrm.serialize(),
        success: function(result) {
            console.log(result);
            getCareers();
            updateModalCar.modal('close');
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


function showError(error) {
    M.toast({
        html: error
    })
}

//confirm delete user
function confirmDeleteCareer(id) {
    $("#dIdCStudents").val(id);
    deleteModalCar.modal("open");
}

//delete user
function deleteCStudent() {
    console.log(BASE_URL + CAREER_STUDENTS_CREATE + "/" + $("#dIdCStudents").val())
    $.ajax({
        url: BASE_URL + CAREER_STUDENTS_CREATE + "/" + $("#dIdCStudents").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Eliminado con exito'
            })
            getCareers();
            $("#dIdCStudents").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}