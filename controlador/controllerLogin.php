<?php

if(isset($_GET))
{
    $username = $_GET["username"];
    $server = $_GET["password"];
    header(header: 'Location: :8080/Joc?username='+$username);
}

echo"as";
?>