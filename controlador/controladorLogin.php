<?php

class ControlLogin {

    public static $connexio;


    public function __construct($connexio) {

        ControlLogin::$connexio = $connexio;

    }
    

    public function checkUser() {

        if (isset($_POST['username']) && isset($_POST['password'])) {

            $username = $_POST['username'];
            $password = $_POST['password'];
            
            $user = GestioUsuaris::getUsuari($username);

            if ($user) {
                if (ControlLogin::checkUsername($user, $username) && ControlLogin::checkPassword($user, $password)) {
                    if(ControlLogin::checkAdmin($user)) {

                        $_SESSION['username'] = $username;
                        $_SESSION['admin'] = true;

                    } else {

                        $_SESSION['username'] = $username;

                    }
                    
                }
                
                header('Location: index.php');
            } else {
                echo "Usuari o contrasenya incorrectes";
            }

        }
    }



    public function checkUsername($user, $username) {

        if ($user['username'] == $username) {
            return true;
        } else {
            return false;
        }

    }


    public function checkPassword($user, $password) {

        if ($user['password'] == $password) {
            return true;
        } else {
            return false;
        }

    }


    public function checkAdmin($user) {

        if ($user['admin'] == 1) {
            return true;
        } else {
            return false;
        }
    }
}


?>