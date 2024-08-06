<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "grafica"; 

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (isset($data->calificacion) && isset($data->userName) ) {
    $calificacion = $data->calificacion;
    $userName = $data->userName;

    // Consulta para actualizar la calificación del usuario
    $stmt = $con->prepare("UPDATE loged SET puntuacion = ? WHERE usuario = ?");
    $stmt->bind_param("ss", $calificacion, $userName);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Datos no válidos']);
}


$con->close();
?>
