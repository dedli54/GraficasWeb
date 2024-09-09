<?php

include("conexionxampp.php");

//var_dump($_POST);
$nombre=$_POST["user"];
$pass=$_POST["password"];

//LOGIN
if(isset($_POST["btnIngresar"]))
{
    $query=mysqli_query($con, "SELECT * FROM loged WHERE usuario ='$nombre' AND contrasena='$pass'");
    $nr=mysqli_num_rows($query);

    if($nr==1){
        echo "<script> alert ('Welcome $nombre'); window.location='MainMenu.html' </script>";
    }else
    {
        echo "<script> alert ('Datos Incorrectos'); window.location='index.html'</script>";
    }

}


// Registrar usuario
if (isset($_POST["btnRegistrar"])) {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST['user'];
        $email = $_POST['mail'];
        $password = $_POST['password'];
        $birthday = $_POST['birthday'];

        if ($username != "" && $password != "") {
            // Consulta para insertar los datos
            $stmt = $con->prepare("INSERT INTO loged (usuario, correo, contrasena, fechaNacimiento) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $username, $email, $password, $birthday);

            if ($stmt->execute()) {
                echo "<script>alert('Usuario registrado con éxito: $username'); window.location='index.html';</script>";
            } else {
                echo "Error: " . $stmt->error;
            }
            $stmt->close();
        } else {
            echo "<script>alert('Error: los campos están vacíos'); window.location='RegistroUsuario.html';</script>";
        }
    }
}



?>