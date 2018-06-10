<?php

if ($_GET['func']=='conectar()')
{
    conectar($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto']);
}

if ($_GET['func']=='newConection()')
{
    newConection($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd']);
}

function conectar($usuario,$contraseña,$ip,$puerto){
    $dbname          = "postgres";
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        seleccionDB($conexion);
    }
}

function newConection($usuario,$contraseña,$ip,$puerto,$bd){
    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        echo "exito";
    }
}

function seleccionDB($conexion){

    $sql = "SELECT datname FROM pg_database WHERE datistemplate = false;";
    $contests = pg_query( $conexion, $sql );

    if($contests ){

        $resultArray = pg_fetch_all($contests);
        echo json_encode($resultArray);
        pg_close($conexion);

    }else{
        echo "error";
    }
}



