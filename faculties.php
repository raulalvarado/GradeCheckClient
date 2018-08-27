<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="css/materialize.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/main.css" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
</head>
<body>
<div class="navbar-fixed">
<nav>
    <div id="navprin" class="nav-wrapper">
      <a href="#" data-activates="slide-out" class="brand-logo center">GradeCheck</a>
      <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
  </nav>
</div>

<div class="sidebar">
<ul id="slide-out" class="sidenav sidenav-fixed">
<div class="separator">

</div>
<li><a class="waves-effect waves-light" href="Index.php"><i class="material-icons">person</i>Usuarios</a></li>
<li><a class="waves-effect waves-light" href=""><i class="material-icons">dashboard</i>Facultades</a></li>
</ul>
</div>

<div class="tabla">
 <table class="striped centered responsive-table">
        <thead>
          <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Editar</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Alvin</td>
            <td><label>
        <input type="checkbox" class="filled-in" disabled="disabled" checked="checked" />
        <span></span>
      </label></td>
      <td><a href="#actualizarFacultad" class="modal-trigger"><i class="material-icons">mode_edit</i></a></td>
            
          </tr>
          <tr>
            <td>Alan</td>
            <td><label>
        <input type="checkbox" class="filled-in" disabled="disabled" checked="checked" />
        <span></span>
      </label></td>
      <td><a href="#actualizarFacultad" class="modal-trigger"><i class="material-icons">mode_edit</i></a></td>
          </tr>
          <tr>
            <td>Jonathan</td>
            <td><label>
        <input type="checkbox" class="filled-in" disabled="disabled" checked="checked" />
        <span></span>
      </label></td>
      <td><a href="#actualizarFacultad" class="modal-trigger"><i class="material-icons">mode_edit</i></a></td>
          </tr>
        </tbody>
      </table>
      </div>
      
      <div class="fixed-action-btn horizontal click-to-toggle">
        <a href="#nuevaFacultad" class="btn-floating btn-large blue darken-3 waves-effect waves-light modal-trigger" data-position="left" data-delay="50">
            <i class="material-icons">add</i>
        </a>
    </div>

<!--Modal de agregacion de usuarios-->
<div id="nuevaFacultad" class="modal">
    <div class="modal-content">
        <div class="modal-header row blue darken-3 white-text">
            <div class="col m10 s9">
                <h3 class="">Nueva facultad</h3>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m8 offset-m2 center-align">
                <form id="frmRegFac" autocomplete="off">
                    <div class="input-field">
                        <input id="nombreFacultad" name="name" type="text" minlength="1" maxlength="50" pattern="^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\.]{1,50}$" title="Solo se permiten números y letras" required>
                        <label for="nombreFacultad">Nombre:</label>
                    </div>
                    <div class="row">
                        <h6 class="center">Seleccione el estado de la facultad:</h6>
                        <div class="input-field col s6 push-s1">
                            <div class="col s12 m6 push-m5">
                                <p>
                                    <label>
                                <input name="state" value="1" type="radio" checked />
                                <span>Activo</span>
                            </label>
                                </p>
                            </div>
                            <div class="col s12 m6 push-m4">
                                <p>
                                    <label>
                                <input name="state" value="0" type="radio" />
                                <span>Inactivo</span>
                            </label>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <button type="submit" class="modal-submit btn blue darken-3 waves-effect right">Ingresar</button>
                        <button type="reset" class="btn waves-effect blue darken-3 right modal-close">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!--Modal de modificacion de usuarios-->
<div id="actualizarFacultad" class="modal">
    <div class="modal-content">
        <div class="modal-header row blue darken-3 white-text">
            <div class="col m10 s9">
                <h3 class="">Actualizar facultad</h3>
            </div>
        </div>
        <div class="row">
            <div class="col s12 m8 offset-m2 center-align">
                <form id="frmUpdtFac" autocomplete="off">
                    <div class="input-field">
                        <input id="UnombreFacultad" name="name" type="text" minlength="1" maxlength="50" pattern="^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\.]{1,50}$" title="Solo se permiten números y letras" required>
                        <label for="UnombreFacultad">Nombre:</label>
                    </div>
                    <div class="row">
                        <h6 class="center">Seleccione el estado de la facultad:</h6>
                        <div class="input-field col s6 push-s1">
                            <div class="col s12 m6 push-m5">
                                <p>
                                    <label>
                                <input name="Ustate" value="1" type="radio" checked />
                                <span>Activo</span>
                            </label>
                                </p>
                            </div>
                            <div class="col s12 m6 push-m4">
                                <p>
                                    <label>
                                <input name="Ustate" value="0" type="radio" />
                                <span>Inactivo</span>
                            </label>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <button type="submit" class="modal-submit btn blue darken-3 waves-effect right">Ingresar</button>
                        <button type="reset" class="btn waves-effect blue darken-3 right modal-close">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
      
      

      

       



<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="js/materialize.js"></script>

</body>
</html>