<?php
session_start();

class ControlLogin {

    public static $conexio;

    public function __construct($conexio) {
        ControlLogin::$conexio = $conexio;
    }

    public function checkUser() {
        if (isset($_POST['username']) && isset($_POST['password'])) {
            $username = $_POST['username'];
            $password = $_POST['password'];
            
            require_once dirname(__DIR__) . '/model/modelUsuaris.php';
            $user = GestioUsuaris::getUsuari($username);

            if ($user) {
                if (ControlLogin::checkUsername($user, $username) && ControlLogin::checkPassword($user, $password)) {
                    if (!ControlLogin::checkAdmin($user)) {
                        $_SESSION['username'] = $username;
                        setcookie("user", $username, time() + 60 * 60 * 24 * 30, "/");
                        header('Location: ../vista/mainLoged.php');
                        exit();
                    } else {
                        $_SESSION['username'] = $username;
                        $_SESSION['admin'] = true;
                        setcookie("user", $username, time() + 60 * 60 * 24 * 30, "/");
                        header('Location: ../vista/vistaAdminHost.php');
                        exit();
                    }
                } else {
                    echo "Usuari o contrasenya incorrectes";
                }
            } else {
                echo "Usuari o contrasenya incorrectes";
            }
        }
    }

    public function checkUsername($user, $username) {
        return $user['username'] == $username;
    }

    public function checkPassword($user, $password) {
        return password_verify($password, $user['password']);
    }

    public function checkAdmin($user) {
        return $user['admin'] == 1;
    }
}

require_once dirname(__DIR__) . '/connection/conexio.php';
global $conexio;
$user = new ControlLogin($conexio);
$user->checkUser();
?>