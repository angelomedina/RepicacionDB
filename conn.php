<?php

if ($_GET['func']=='conectarOrigen()')
{
    conectarOrigen($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto']);
}

if ($_GET['func']=='conexionDBorigen()')
{
    conexionDBorigen($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd']);
}

if ($_GET['func']=='conexionDBdestino()')
{
    conexionDBdestino($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd']);
}

if ($_GET['func']=='columnasTablas()')
{
    columnasTablas($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd'],$_GET['tabla']);
}

if ($_GET['func']=='crearTablas()')
{
    crearTablas($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd'],$_GET['tabla'],$_GET['columnas']);
}


function conectarOrigen($usuario, $contraseña, $ip, $puerto){
    $dbname          = "postgres";
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        seleccionDBorigen($conexion);
    }
}

function seleccionDBorigen($conexion){

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

function conexionDBorigen($usuario, $contraseña, $ip, $puerto, $bd){
    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        $sql = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';";
        $contests = pg_query( $conexion, $sql );

        if($contests ){

            $resultArray = pg_fetch_all($contests);
            echo json_encode($resultArray);
            pg_close($conexion);

        }else{
            echo "error";
        }
    }
}

function conexionDBdestino($usuario, $contraseña, $ip, $puerto, $bd){
    $dbname          =  "postgres";
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        $sql = "CREATE DATABASE $bd;";
        $contests = pg_query( $conexion, $sql );

        if($contests ){

            dblink($usuario, $contraseña, $ip, $puerto, $bd);

        }else{
            echo "error";
        }
    }
}

function dblink($usuario, $contraseña, $ip, $puerto, $bd){

    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    $sql = "create extension dblink;";
    $contests = pg_query( $conexion, $sql );

    if($contests ){
        echo "exito";

    }else{
        echo "error";
    }
};

function columnasTablas($usuario, $contraseña, $ip, $puerto, $bd,$tabla){
    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        $sql = "SELECT column_name,data_type from information_schema.columns where table_name= '$tabla'";
        $contests = pg_query( $conexion, $sql );

        if($contests ){

            $resultArray = pg_fetch_all($contests);
            echo json_encode($resultArray);
            pg_close($conexion);

        }else{
            echo "error";
        }
    }
}

function crearTablas($usuario, $contraseña, $ip, $puerto, $bd,$tabla,$columnas){

    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        $sql = "CREATE TABLE $tabla ($columnas);";
        $contests = pg_query( $conexion, $sql );

        if($contests ){

            echo "exito";
            pg_close($conexion);

        }else{
            echo "error";
        }
    }
}