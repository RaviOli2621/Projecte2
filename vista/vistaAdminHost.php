<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('Location: ../vista/viewLogin.php');
    exit();
} else if (!isset($_SESSION['admin']) || $_SESSION['admin'] === false) {
    header('Location: ../vista/mainLoged.php');
    exit();
}
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/estilos.css">
    <script src="../server/Public/adminScript.js" defer></script>
    <title>Host Game</title>
</head>
<body>
    <div>
        <h1>ADMIN PANEL</h1>
        <button id="start" class="start">START GAME</button>
        <button id="stop" class="stop">STOP GAME</button>
        Amplada<input type="number" id="amplada" value="500">
        Alçada<input type="number" id="alcada" value="500">
        <form action="../controlador/logout.php" method="POST">
            <button type="submit" class="smallBt">LOGOUT</button>
        </form>
    </div>
</body>
</html>