var dataTable;

$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.modal').modal();
   // $('select').formSelect();
    $('.datepicker').datepicker();

    try {
        $.ajaxSetup({
            headers: {
              token: JSON.parse(sessionStorage["logedUser"]).token
            }
        });

        //Verifying that token hasn't expired yet
        $.ajax({
            url: BASE_URL + VERIFY_TOKEN,
            type: "GET",
            error: function(error) {
                window.location.replace("/GradeCheckClient/login.html");
            }
        });
            
    }
    catch (error) {
        window.location.replace("/GradeCheckClient/login.html");
    }

    $('.sidebar').load('/GradeCheckClient/includes/sidebarAdmin.html');

    
});

function logout() {
    sessionStorage["logedUser"] = null;
    window.location.replace("/GradeCheckClient/login.html")
}

function initDataTable() {
    dataTable = $('table').DataTable( {
        "language": {
            "lengthMenu": "Registros por página: _MENU_",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "zeroRecords": "No se encontraron registros",
            "info": "Mostrando resultados de _START_ a _END_ de _TOTAL_",
            "infoEmpty": "No hay registros que mostrar",
            "infoFiltered": "(filtrado de _MAX_ registros)"
        }
    });
    $('.tabla').find('select').formSelect();
}

function destDataTable() {
    if (dataTable != undefined) {
        dataTable.destroy();
    }
}
