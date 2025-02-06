
<?php

class GestioUsuaris {

    public static $connexio;


    public function __construct($connexio) {

        GestioUsuaris::$connexio = $connexio;

    }
    

    public function getUsuaris() {

        $sql = "SELECT * FROM players";
        $result = GestioUsuaris::$connexio->query($sql);
        return $result;
    }


    public static function getUsuari($username) {

        $sql = "SELECT * FROM players WHERE username = :username";
        GestioUsuaris::$connexio->prepare($sql);
        GestioUsuaris::$connexio->bindParam(':username', $username);
        $result = GestioUsuaris::$connexio->execute($sql);
        return $result;

    }


    public function insertUsuari($username, $password, $admin) {

        $sql = "INSERT INTO  players (username, password, admin) VALUES (:username, :password, :admin)";
        $stmt = GestioUsuaris::$connexio->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':admin', $admin);
        $stmt->execute();

        return $stmt;

    }


    public function getUsuariStars() {

        $sql = "SELECT username, currentStars FROM players";
        $result = GestioUsuaris::$connexio->query($sql);
        return $result;

    }



    public function updateStarsUsuari($username, $currentStars, $starsCollected) {

        $sql = "UPDATE players SET currentStars = :currentStars, starsCollected = :starsCollected WHERE username = :username";
        $stmt = GestioUsuaris::$connexio->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':currentStars', $currentStars);
        $stmt->bindParam(':starsCollected', $starsCollected);
        $stmt->execute();

        return $stmt;

    }

}


?>