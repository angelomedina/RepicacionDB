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

if ($_GET['func']=='datosTabla()')
{
    datosTabla($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd'],$_GET['tabla'],$_GET['columnas']);
}

if ($_GET['func']=='insertarDatosTabla()')
{
    insertarDatosTabla($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd'],$_GET['tabla'],$_GET['Values'],$_GET['values']);
}

if ($_GET['func']=='crearGeneraInsertOrigen()')
{
    //crearGeneraInsertOrigen($_GET['contraseñaO'],$_GET['ipO'],$_GET['puertoO'],$_GET['bdO'],$_GET['contraseñaD'],$_GET['ipD'],$_GET['puertoD'],$_GET['bdD']);
    crearGeneraInsertOrigen($_GET['contraseñaO'],$_GET['ipO'],$_GET['puertoO'],$_GET['bdO'],$_GET['bdD']);
}

if ($_GET['func']=='creaTrigger()') {

    creaTrigger($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd'],$_GET['tabla']);
}

if ($_GET['func']=='tablasDBorigen()')
{
    tablasDBorigen($_GET['usuario'],$_GET['contraseña'],$_GET['ip'],$_GET['puerto'],$_GET['bd']);
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

            dblink($usuario, $contraseña, $ip, $puerto, $bd);

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

    $sql = "CREATE EXTENSION IF NOT EXISTS  dblink;";
    $contests = pg_query( $conexion, $sql );

    if($contests ){
        //pg_close($conexion);

    }else{
        //pg_close($conexion);
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

function datosTabla($usuario, $contraseña, $ip, $puerto, $bd,$tabla, $columnas){
    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{
        $sql = "select $columnas from $tabla";
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

function insertarDatosTabla($usuario, $contraseña, $ip, $puerto, $bd,$tabla,$Values,$values){

    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");

    if( !$conexion) {
        echo "error";
    }else{


        $sql = "INSERT INTO $tabla ($Values) VALUES ($values);";

        $contests = pg_query( $conexion, $sql );

        if($contests ){

            echo "exito";
            pg_close($conexion);

        }else{
            echo "error";
        }
    }
}

function crearGeneraInsertOrigen($contraseñaO, $ipO, $puertoO, $bdO,$bdD){
    $dbname          =  $bdO;
    $conexion        =  @pg_connect("host=$ipO port=$puertoO dbname=$dbname user=postgres password=$contraseñaO");

    if( !$conexion) {
        echo "error";
    }else{

        $sql = "
                CREATE or REPLACE FUNCTION genera_insert() RETURNS trigger
                AS $$
                DECLARE
                    json     JSON;
                    key      text;
                    query    text;
                    columns  text;
                    data     text;
                    ref cursor for select * from json_object_keys(row_to_json(new));
                BEGIN
                    columns  = '';
                    data     = '';
                    json     = row_to_json(new);
                    OPEN ref;
                    FETCH NEXT FROM ref into key;
                    WHILE (FOUND) LOOP
                        columns  = columns||key||',';
                        data     = data||''''||(json->>key)||''',';
                        FETCH NEXT FROM ref into key;
                    END LOOP;
                    columns   = substring(columns,0,length(columns));
                    data      = substring(data,0,length(data));
                    query     = format('insert into %s (%s) values (%s);', TG_TABLE_NAME,columns,data);
                    perform dblink('host=$ipO port=$puertoO user=postgres password=$contraseñaO dbname=$bdD',query);
                    
                    raise notice '%',query;
                    RETURN NEW;
                END;
                $$
                LANGUAGE plpgsql;
                ";

        $contests = pg_query( $conexion, $sql );

        if($contests ){
            echo "exito";
            pg_close($conexion);
        }else{
            echo "error";
        }
    }
}

function tablasDBorigen($usuario, $contraseña, $ip, $puerto, $bd){
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

function creaTrigger($usuario, $contraseña, $ip, $puerto, $bd,$tabla){

    $dbname          =  $bd;
    $conexion        =  @pg_connect("host=$ip port=$puerto dbname=$dbname user=$usuario password=$contraseña");


    if( !$conexion) {
        echo "error";
    }else{

        $triger = "trg_genera_insert_".$tabla;

        $sql = "DROP TRIGGER IF EXISTS $triger on $tabla;";

        $contests = pg_query( $conexion, $sql );

        if( $contests ){
            createReplaceTrigger($conexion,$tabla,$triger);
        }else{
            echo "error insertar trigger";
            pg_close($conexion);
        }
    }
}

function createReplaceTrigger($conexion,$tabla,$triger){

    $sql = "CREATE TRIGGER $triger AFTER INSERT or DELETE or UPDATE ON $tabla
                FOR EACH ROW EXECUTE PROCEDURE genera_insert();";

    $contests = pg_query( $conexion, $sql );

    if($contests ){
        echo "exito insertar trigger";
        pg_close($conexion);
    }else{
        echo "error insertar trigger";
        pg_close($conexion);
    }
}
