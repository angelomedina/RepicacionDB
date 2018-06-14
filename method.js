var tablas  = [];
var schemas = [];

//conexiones de origen
var Gusuario     ="";
var Gcontraseña  ="";
var GIP          ="";
var Gpuerto      ="";
var Gdb          ="";

//conexiones de destino
var Dusuario     ="";
var Dcontraseña  ="";
var DIP          ="";
var Dpuerto      ="";
var Ddb          ="";


//configuracion
var tipo          ="";


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Descripcion: metodos origen

function inputsIniciales() {
    $("#usuario").val("postgres");
    $("#constrasena").val("deathnote");
    $("#direccionip").val("localhost");
    $("#puertoServidor").val("5432");

    $("#usuarioD").val("postgres");
    $("#constrasenaD").val("deathnote");
    $("#direccionipD").val("localhost");
    $("#puertoServidorD").val("5432");
}

function conexionOrigen() {

    var usuario    = document.getElementById('usuario').value;
    var contraseña = document.getElementById('constrasena').value;
    var IP         = document.getElementById("direccionip").value;
    var puerto     = document.getElementById("puertoServidor").value;

    Gusuario     = usuario.toString();
    Gcontraseña  = contraseña.toString();
    GIP          = IP.toString();
    Gpuerto      = puerto.toString();


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {
                    swal({
                        title: "Conexion exitosa!",
                        icon: "success",
                        button: "OK",
                    }).then((value) => {

                        var json = this.response;
                        var arr = JSON.parse(json);

                        for (var i = 0; i < arr.length; i++){

                            var obj = arr[i];
                            for (var key in obj){

                                var value = obj[key];

                                agregarOpcionSelect("select-bd-postgres", value.toString());
                            }
                        }
                    });

                }else{
                    swal({
                        title: "Error de conexionOrigen!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=conectarOrigen()&usuario="+usuario.toString()+"&contraseña="+contraseña.toString() +"&ip="+IP.toString() +"&puerto="+puerto.toString(), true);
    xhttp.send();
}

function conexionDBorigen(){

    tablas          = [];
    schemas         = [];
    
    var bd          = document.getElementById('select-bd-postgres').value;
    var replicacion = document.getElementById('select-replicar').value;

    Gdb  = bd.toString();
    tipo = replicacion.toString();

    esquemasDBOrigen();

    swal({
        title: "Conexion exitosa!",
        icon: "success",
        button: "OK",
    });

    document.getElementById('baseD').value = Gdb;


}

function tablasSchemaDBOrigen(schema) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != 'false'){

                    var json = this.response;
                    var arr = JSON.parse(json);

                    for (var i = 0; i < arr.length; i++){

                        var obj = arr[i];
                        for (var key in obj){

                            var value = obj[key];

                            console.log("Schema: "+schema+" tabla "+value.toString());
                            tablas.push(value.toString());

                        }
                    }

                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=conexionDBorigen()&usuario=" + Gusuario + "&contraseña=" + Gcontraseña + "&ip=" + GIP + "&puerto=" + Gpuerto + "&bd=" + Gdb + "&schema=" + schema, true);
    xhttp.send();

}

function agregarOpcionSelect(domElement, array) {

    var select = document.getElementsByName(domElement)[0];
    var option = document.createElement("option");
    option.text = array;
    select.add(option);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




function conexionDestino() {

    var usuario    = document.getElementById('usuarioD').value;
    var contraseña = document.getElementById('constrasenaD').value;
    var IP         = document.getElementById("direccionipD").value;
    var puerto     = document.getElementById("puertoServidorD").value;
    var db         = document.getElementById("baseD").value;


    Dusuario     = usuario.toString();
    Dcontraseña  = contraseña.toString();
    DIP          = IP.toString();
    Dpuerto      = puerto.toString();
    Ddb          = db.toString();


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {
                    swal({
                        title: "Conexion exitosa!",
                        text:  "Se creo: "+db+"!",
                        icon:  "success",
                        button: "OK",
                    }).then((value) => {

                        agregarOpcionSelect("select-bd-postgres", db.toString());

                        replicacion();

                    });
                }else{
                    swal({
                        title:  "Error de conexion destino!",
                        text:   "Verifique los datos ingresados!",
                        icon:   "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=conexionDBdestino()&usuario="+Dusuario+"&contraseña="+Dcontraseña+"&ip="+DIP+"&puerto="+Dpuerto+"&bd="+Ddb, true);
    xhttp.send();

}

function columnasTablas(){

    swal({
        title:  "Replicacion de tablas!",
        text:   "Se replicaran "+tablas.length+" tablas",
        icon:   "success",
        button: "OK",

    }).then((value) => {

        tablas.forEach(function (tabla) {

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {
                    if(this.statusText== "OK" && this.status == 200) {

                        var columnas = "";
                        var values = "";

                        var json = this.response;
                        var arr = JSON.parse(json);

                        for (var i = 0; i < arr.length; i++){

                            var obj = arr[i];

                            for (var key in obj){

                                var value = obj[key];
                                columnas = columnas + " " + value;

                                if(key.toString() == "column_name"){

                                    values   = values   + " " + value;
                                }
                            }
                            columnas = columnas + ",";
                            values = values + ",";
                        }
                        columnas = columnas.substring(0,columnas.length-1);
                        values = values.substring(0,values.length-1);

                        crearTabla(tabla, columnas,values);

                        console.log("estructura tabla");
                    }
                    else{console.log(this.statusText, this.status)}
                }
            };
            xhttp.open("GET", "conn.php?func=columnasTablas()&usuario="+Gusuario+"&contraseña="+Gcontraseña+"&ip="+GIP+"&puerto="+Gpuerto+"&bd="+Gdb+"&tabla="+tabla.toString(), true);
            xhttp.send();

        });

    });
}

function crearTabla(tabla, columnas, values) {

    console.log("creacion de tabla");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    swal({
                        title: "Cracion de tablas!",
                        text:  "Tabla: "+tabla,
                    });

                    //proc almacenado asociado al triger para insertar
                    crearGeneraInsertOrigen();

                    //trigger ahace proc y tabla
                    tablasDBorigen();

                    //replica tablas
                    datosTabla(tabla, values);

                }else{
                    swal({
                        title: "Error de replicacion de tablas!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=crearTablas()&usuario="+Dusuario+"&contraseña="+Dcontraseña+"&ip="+GIP+"&puerto="+Dpuerto+"&bd="+Ddb+"&tabla="+tabla+"&columnas="+columnas, true);
    xhttp.send();
}

function datosTabla(tabla, Values) {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    if(this.response.toString() != "false"){

                        var values = "";

                        var json = this.response;
                        var arr = JSON.parse(json);

                        for (var i = 0; i < arr.length; i++){

                            var obj = arr[i];

                            for (var key in obj){

                                var value = obj[key];

                                if(value != null) {
                                    values = values + "" + "'" + value + "'" + ",";
                                }

                            }
                            values = values.substring(0,values.length-1);

                            insertarDatosTabla(tabla,Values ,values);

                            console.log("replicacion de tablas");

                            values = "";
                        }
                    }

                }else{
                    swal({
                        title: "Error de replicacion de tablas!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=datosTabla()&usuario="+Gusuario+"&contraseña="+Gcontraseña+"&ip="+GIP+"&puerto="+Gpuerto+"&bd="+Gdb+"&tabla="+tabla.toString()+"&columnas="+Values.toString(), true);
    xhttp.send();
}

function insertarDatosTabla(tabla, Values,values) {


    console.log("insertar datos");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    console.log(this.response);

                }else{
                    swal({
                        title: "Error de replicacion de tablas!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=insertarDatosTabla()&usuario="+Dusuario+"&contraseña="+Dcontraseña+"&ip="+DIP+"&puerto="+Dpuerto+"&bd="+Ddb+"&tabla="+tabla.toString()+"&Values="+Values.toString()+"&values="+values.toString(), true);
    xhttp.send();
}

function crearGeneraInsertOrigen() {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {
                if(this.statusText== "OK" && this.status == 200) {

                    console.log(this.response);
                }
                else{console.log(this.statusText, this.status)}
            }
        };
        xhttp.open("GET", "conn.php?func=crearGeneraInsertOrigen()&contraseñaO="+Gcontraseña+"&ipO="+GIP+"&puertoO="+Gpuerto+"&bdO="+Gdb+"&bdD="+Ddb, true);
        xhttp.send();
}

function tablasDBorigen(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                        var json = this.response;
                        var arr = JSON.parse(json);

                        for (var i = 0; i < arr.length; i++){

                            var obj = arr[i];
                            for (var key in obj){

                                var value = obj[key];

                                creaTrigger(value.toString());
                            }
                        }

                }else{
                    swal({
                        title: "Error de conexionOrigen!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=tablasDBorigen()&usuario="+Gusuario+"&contraseña="+Gcontraseña+"&ip="+GIP+"&puerto="+Gpuerto+"&bd="+Gdb, true);
    xhttp.send();
}

function creaTrigger(tabla){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    console.log(this.response);

                }else{
                    swal({
                        title: "Error de conexionOrigen!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=creaTrigger()&usuario=" + Gusuario + "&contraseña=" + Gcontraseña + "&ip=" + GIP + "&puerto=" + Gpuerto + "&bd=" + Gdb + "&tabla=" + tabla, true);
    xhttp.send();
}

function esquemasDBOrigen() {

    schemas = [];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    var json = this.response;
                    var arr = JSON.parse(json);

                    for (var i = 0; i < arr.length; i++){

                        var obj = arr[i];
                        for (var key in obj){

                            var value = obj[key];

                            schemas.push(value.toString());

                            tablasSchemaDBOrigen(  "'" + value.toString() + "'" );

                        }
                    }

                }else{
                    swal({
                        title: "Error de conexion Origen!",
                        text:  "Verifique los datos ingresados!",
                        icon:  "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=esquemasDB()&usuario=" + Gusuario + "&contraseña=" + Gcontraseña + "&ip=" + GIP + "&puerto=" + Gpuerto + "&bd=" + Gdb, true);
    xhttp.send();

}

function creaSchema() {

        schemas.forEach(function (elemento) {

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {
                        if(this.statusText== "OK" && this.status == 200) {

                            console.log(this.response);
                        }
                        else{console.log(this.statusText, this.status)}
                    }
                };
                xhttp.open("GET", "conn.php?func=crearSchema()&usuario=" + Dusuario + "&contraseña=" + Dcontraseña + "&ip=" + DIP + "&puerto=" + Dpuerto + "&bd=" + Ddb + "&schema=" + elemento, true);
                xhttp.send();

            });
}


function replicacion() {

    creaSchema();

     swal({
     title:  "Replicacion de schemas!",
     text:   "Se replicaran "+schemas.length+" schemas",
     icon:   "success",
     button: "OK",

     }).then((value) => {

         columnasTablas();

    });

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



