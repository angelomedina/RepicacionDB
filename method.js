var tablas = [];

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
    var bd          = document.getElementById('select-bd-postgres').value;
    var replicacion = document.getElementById('select-replicar').value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    swal({
                        title: "Conexion exitosa!",
                        text:  bd,
                        icon: "success",
                        button: "OK",
                    }).then((value) => {

                        $("#baseD").val(bd.toString());

                        var json = this.response;
                        var arr = JSON.parse(json);

                        for (var i = 0; i < arr.length; i++){

                            var obj = arr[i];
                            for (var key in obj){

                                var value = obj[key];

                                tablas.push(value.toString());
                            }
                        }
                        Gdb  = bd.toString();
                        tipo = replicacion.toString();
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
    xhttp.open("GET", "conn.php?func=conexionDBorigen()&usuario="+Gusuario+"&contraseña="+Gcontraseña+"&ip="+GIP+"&puerto="+Gpuerto+"&bd="+bd, true);
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

                        columnasTablas();

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

                        var json = this.response;
                        var arr = JSON.parse(json);

                        for (var i = 0; i < arr.length; i++){

                            var obj = arr[i];

                            for (var key in obj){

                                var value = obj[key];
                                columnas = columnas + " " + value;
                            }
                            columnas = columnas + ",";
                        }
                        columnas = columnas.substring(0,columnas.length-1);

                        crearTabla(tabla, columnas);
                    }
                    else{console.log(this.statusText, this.status)}
                }
            };
            xhttp.open("GET", "conn.php?func=columnasTablas()&usuario="+Gusuario+"&contraseña="+Gcontraseña+"&ip="+GIP+"&puerto="+Gpuerto+"&bd="+Gdb+"&tabla="+tabla.toString(), true);
            xhttp.send();

        });

    });
}

function crearTabla(tabla, columnas) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            if(this.statusText== "OK" && this.status == 200) {

                if(this.response.toString() != "error") {

                    swal({
                        title: "Cracion de tablas!",
                        text:  "Tabla: "+tabla,
                    });

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

