<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <div>
            <h1>STAR HUNTERS</h1>
        </div>
        <div>
            <form method="post" action=<?php dirname(__DIR__) . "/../controlador/controllerLogin.php" ?>>
                <input type="text" id="username" name="username" placeholder="Username">
                <input type="password" id="password" name="password" placeholder="Password">
                <input type="submit" value="Login">
            </form>
        </div>
    </div>
</body>
</html>