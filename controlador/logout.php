<?php
session_start();
session_unset();
session_destroy();
setcookie("user","",time(),"/");
header('Location: ../vista/viewLogin.php');
?>


