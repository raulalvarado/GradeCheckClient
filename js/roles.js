//declaring useful variables
var table = $("#rolesTable");
var formNuevoR = $("#frmRegRole");
var formUpdateR = $("#frmUpdtRol");
var nuevoRModal = $("#nuevoRol");
var updateRModal = $("#actualizarRol");
var deleteRModal = $("#eliminarRol");
var updLabels = $(".updLabel");

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
    if (JSON.parse(sessionStorage["logedUser"]).role.manageRoles != true) {
        window.location.replace("/GradeCheckClient/Index.html");
    }

    getRoles();
});

//ajax request to get students
function getRoles() {
    //Id del rol del empleado logeado
    var roleId = JSON.parse(sessionStorage["logedUser"]).role.id

    $.ajax({
        url: BASE_URL + ROLES,
        type: "GET",
        dataType: "json",
        success: function(result) {
            destDataTable();
            table.empty();
            $.each(result, function(i, val) {

                //validating if it's an active role
                var checked = "<input type='checkbox' class='filled-in' disabled='disabled' checked='checked' />";
                if (val.state === false) {
                    checked = "<input type='checkbox' class='filled-in' disabled='disabled'/>";
                }

                //filling table
                table.append("<tr>" +
                    "<td>" + val.role + "</td>" +
                    "<td>" +
                    "<label>" +
                    checked +
                    "<span></span>" +
                    "</label>" +
                    "</td>" +
                    (val.id == 1 || val.id == 2 || val.id == roleId ? "<td></td><td></td>" :
                    "<td><a href='#' class='modal-trigger'><i class='material-icons' onclick='requestRole(" + val.id + ")'>mode_edit</i></a></td>" +
                    "<td><a href='#' class='modal-trigger'><i class='material-icons red-text' onclick='confirmDeleteRole(" + val.id + ")'>delete</i></a></td>"
                     ) +
                    "</tr>");
            });
            formNuevoR.trigger("reset");
            formUpdateR.trigger("reset");

            initDataTable();
    
            //Está aquí y no en el doc ready porque sino no funciona esto
            $("#roleItem").addClass("selectedItem");
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar todos los roles'
            })
        }
    });
}

//request one role
function requestRole(id) {
    $.ajax({
        url: BASE_URL + ROLES + id,
        type: "GET",
        dataType: "json",
        success: function(result) {
            $("#uIdRoles").val(result.id);
            $("#uNombreRol").val(result.role);
            $("#uTeach").prop("checked", result.teach);
            $("#uMng_users").prop("checked", result.manageUsers);
            $("#uMng_students").prop("checked", result.manageStudents);
            $("#uMng_employees").prop("checked", result.manageEmployees);
            $("#uMng_faculties").prop("checked", result.manageFaculties);
            $("#uMngCareers").prop("checked", result.manageCareers);
            $("#uMng_Roles").prop("checked", result.manageRoles);
            $("#uMng_Courses").prop("checked", result.manageCourses);
            $("#uMng_Pensum").prop("checked", result.managePensums);
            $("#uMng_Evaluations").prop("checked", result.manageEvaluations);
            if (result.state == true) {
                $("#uStateA").prop("checked", true);
            } else {
                $("#uStateI").prop("checked", true);
            }
            updateRModal.modal("open");
            updLabels.addClass("active");
        },
        error: function(error) {
            showError(error.responseText);
        }
    });
}

//delete role
function deleteRole() {
    $.ajax({
        url: BASE_URL + ROLES + $("#dIdRoles").val(),
        type: "DELETE",
        success: function(result) {
            console.log(result);
            M.toast({
                html: 'Rol eliminado con exito'
            })
            getRoles();
            $("#dIdRoles").val("");
        },
        error: function(error) {
            console.log(error.responseText);
            showError(error.responseText);
        }
    });
}

//confirm delete role
function confirmDeleteRole(id) {
    $("#dIdRoles").val(id);
    deleteRModal.modal("open");
}

//save role
function postRole() {
    //Construyendo formData a pata porque los checkbox no los agarra
    var formData = "role=" + $("#nombreRol").val();

    $('.newCheckBox').each(function() { 
        if (this.checked) {
            formData += '&'+this.name+'=true';
        }    
        else {
            formData += '&'+this.name+'=false';
        }
    });

    $.ajax({
        url: BASE_URL + ROLES,
        type: "POST",
        data: formData,
        success: function(result) {
            console.log(result);
            getRoles();
            $("#nuevoRol").modal('close');
            M.toast({
                html: 'Rol agregado con exito'
            })
        },
        error: function(error) {
            console.log(error);
            showError(error.responseText);
        }
    });
}

//save role post
formNuevoR.submit(function(e) {
    e.preventDefault();
    postRole();
});

//update user 
function updateRole() {
    //Construyendo formData a pata porque los checkbox no los agarra
    var formData = "role=" + $("#uNombreRol").val();
    formData += "&id=" + $("#uIdRoles").val();
    formData += "&state=" + $("#uStateA").prop("checked");

    $('.updateCheckBox').each(function() { 
        if (this.checked) {
            formData += '&'+this.name+'=true';
        }    
        else {
            formData += '&'+this.name+'=false';
        }
    });

    $.ajax({
        url: BASE_URL + ROLES,
        type: "PUT",
        data: formData,
        success: function(result) {
            console.log(result);
            getRoles();
            updateRModal.modal('close');
            M.toast({
                html: 'Rol actualizado.'
            })
        },
        error: function(error) {
            console.log(error);
            showError(error.responseText);
        }
    });
}

//update user post
formUpdateR.submit(function(e) {
    e.preventDefault();
    updateRole();
});

//display server errors
function showError(error) {
    M.toast({
        html: error
    })
}