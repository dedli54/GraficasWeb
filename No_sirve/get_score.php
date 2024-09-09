<?php

$servername = "localhost"; // o el nombre del servidor donde está tu base de datos
$username = "root"; // tu usuario de MySQL
$password = ""; // tu contraseña de MySQL
$dbname = "grafica"; // el nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Consultar los datos de la tabla de puntuaciones
$sql = "SELECT usuario, correo, puntuacion FROM loged ";
$result = $conn->query($sql);

$scores = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
} else {
    echo "0 results";
}

header('Content-Type: application/json');
echo json_encode($scores);
?>