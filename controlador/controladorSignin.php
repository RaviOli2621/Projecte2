
<?php

class ControlSignin {

    public $conexio;

    public function __construct($conexio) {

        $this->conexio = $conexio;
        
    }


    public function checkPasswordSecurity($password) {

        $regex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/';

        if (preg_match($regex, $password)) {
            return true;
        } else {
            return false;
        }


    }

    public function checkPasswordMatch($password, $password2) {

        if (isset($_POST['password']) && isset($_POST['password2'])) {

            $password = $_POST['password'];
            $password2 = $_POST['password2'];

        }

        if ($password == $password2) {
            return true;
        } else {
            return false;
        }

    }


    public function checkUsernameAvailability($username) {

        $user = GestioUsuaris::getUsuari($username);

        if($user) {
            return false;
        } else {
            return true;
        }

    }

    public function  signIn() {

        if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['password2'])) {

            $username = $_POST['username'];
            $password = $_POST['password'];
            $password2 = $_POST['password2'];

            if (ControlSignin::checkPasswordSecurity($password) && ControlSignin::checkPasswordMatch($password, $password2) && ControlSignin::checkUsernameAvailability($username)) {

                $admin = 0;

                $gestioUsuaris = new GestioUsuaris(ControlSignin::$conexio);
                $user = $gestioUsuaris->insertUsuari($username, $password, $admin);

                if ($user) {
                    echo "Usuari creat correctament";
                } else {
                    echo "Error al crear l'usuari";
                }

            } else {
                echo "Error al crear l'usuari";
            }

        }
    }
}


?>