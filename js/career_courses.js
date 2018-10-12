var careerId;
var title = $("#title");
var table = $("#cCoursesTable");
var newPlanFrm = $("#nuevoPlan");

//trying to get faculties from digital ocean server
$(document).ready(function() {
    let params = new URLSearchParams(window.location.search)
    careerId = params.get("id");
    getCareerName();
    getPlans();
});

//ajax request to get faculties
function getCareerName() {
    $.ajax({
        url: BASE_URL + CAREERS_CREATE + "/" + careerId + "/full",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            title.html("Planes de la carrera: <br>" + result.name);
        },
        error: function(error) {
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

//ajax request to get faculties
function getPlans() {
    $.ajax({
        url: BASE_URL + CAREER_COURSES_PLAN + careerId,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            table.empty();
            $.each(result, function(i, val) {

                //filling table
                table.append("<tr>" +
                    "<td>" + val.year + "</td>" +
                    "<td><a href='" + "pensum.html?id=" + careerId + "&plan=" + val.year + "' class='modal-trigger'><i class='material-icons'>visibility</i></a></td>" +
                    "</tr>");
            });
        },
        error: function(error) {
            console.log(error);
            M.toast({
                html: 'Error al solicitar los planes de la carrera'
            })
        }
    });
}

//save career post
newPlanFrm.submit(function(e) {
    e.preventDefault();
    if ($("#anoPlan").val() <= (new Date()).getFullYear()) {
        M.toast({
            html: 'Solo pueden ingresarse planes futuros.'
        })
    }
    else {
        window.location.replace("pensum.html?id=" + careerId + "&plan=" + $("#anoPlan").val());
    }

});