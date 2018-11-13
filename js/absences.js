var regCourseId;

var table = $("#absencesTable");
var newFacFrm = $("#frmRegAbs");
var newModalAbsence = $("#nuevaInasistencia");
var deleteModalAbsence = $("#eliminarInasistencia");
var title = $("#title");

$(document).ready(function() {
    $('.modal').modal();
   // $('select').formSelect();
    $('.datepicker').datepicker(
        {
            container:'body',
            format: "yyyy-mm-dd"
        }
    );

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

    let params = new URLSearchParams(window.location.search)
    regCourseId = params.get("id");

    //Setting breadcrumb href
    $("#secondBread").prop("href", "students_courses.html?id=" + params.get("courseTeacherId"))


    getStudentName();
    getUnattendances();
});

//ajax request to get student name
function getStudentName() {
    $.ajax({
        url: BASE_URL + STUDENTS_BYREGISTEREDCOURSE + regCourseId + "/users/people ",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Inasistencias de " + result.user.person.name + " " + result.user.person.surname);
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//ajax request to get unattendances
function getUnattendances() {
    $.ajax({
        url: BASE_URL + UNATTENDANCES_BYREGISTEREDCOURSE + regCourseId,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            destDataTable();
            table.empty();
            $.each(result, function(i, val) {
                var date = new Date(val.unattendanceDate);

                //filling table
                table.append("<tr>" +
                    "<td>"  + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()  + "</td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteUnattendance(" + val.id + ")'>delete</i></a></td>" +
                    "</tr>");
            });
            newFacFrm.trigger("reset");

            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#teachCourseItem").addClass("selectedItem");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar las inasistencias'
            })
        }
    });
}

//save Unattendance
function postUnattendance() {
    var formData = newFacFrm.serialize();
    formData += "&registeredCourseId=" + regCourseId;

    $.ajax({
        url: BASE_URL + UNATTENDANCES,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getUnattendances();
            $("#nuevaInasistencia").modal('close');
            M.toast({
                html: 'Inasistencia agregada con exito'
            })
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//save Unattendance post
newFacFrm.submit(function(e) {
    e.preventDefault();
    postUnattendance();
});

//confirm delete unattendance
function confirmDeleteUnattendance(id) {
    $("#dId").val(id);
    deleteModalAbsence.modal("open");
}

//delete user
function deleteUnattendance(id) {
    $.ajax({
        url: BASE_URL + UNATTENDANCES + $("#dId").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Inasistencia eliminada con éxito'
            })
            getUnattendances();
            $("#dId").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}