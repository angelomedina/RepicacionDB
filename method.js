var Gusuario     ="";
var Gcontraseña  ="";
var GIP          ="";
var Gpuerto      ="";

function setDatos() {
    $("#usuario").val("postgres");
    $("#constrasena").val("deathnote");
    $("#direccionip").val("localhost");
    $("#puertoServidor").val("5432");

    $("#usuarioD").val("postgres");
    $("#constrasenaD").val("deathnote");
    $("#direccionipD").val("localhost");
    $("#puertoServidorD").val("5432");
}

function conexion() {

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

                                addOptions("select-bd-postgres", value.toString());
                            }
                        }
                    });

                }else{
                    swal({
                        title: "Error de conexion!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=conectar()&usuario="+usuario.toString()+"&contraseña="+contraseña.toString() +"&ip="+IP.toString() +"&puerto="+puerto.toString(), true);
    xhttp.send();
}

function setDB(){

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

                        replicar(replicacion.toString(),bd.toString());
                    });

                }else{
                    swal({
                        title: "Error de conexion!",
                        text:  "Verifique los datos ingresados!",
                        icon: "warning",
                        button: "OK!",
                    });
                }
            }
            else{console.log(this.statusText, this.status)}
        }
    };
    xhttp.open("GET", "conn.php?func=newConection()&usuario="+Gusuario+"&contraseña="+Gcontraseña+"&ip="+GIP+"&puerto="+Gpuerto+"&bd="+bd, true);
    xhttp.send();



}

function addOptions(domElement, array) {

    var select = document.getElementsByName(domElement)[0];
    var option = document.createElement("option");
    option.text = array;
    select.add(option);

}

function replicar(tipo,db) {
    console.log("Replicacion: "+tipo+"db "+db);

}
