
-- Puede que esto este mal, estoy intentado saber como funciona la base de datos a travez de
--ver nomas el codigo php asi que si truena no me sorprenderia JAJAJAJAJAJAJA
--ya que el proyecto original no venia con un .sql


CREATE TABLE loged (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each user
    usuario VARCHAR(255) NOT NULL, -- Username of the user
    contrasena VARCHAR(255) NOT NULL, -- Password of the user
    correo VARCHAR(255) NOT NULL, -- Email address of the user
    fechaNacimiento DATE NOT NULL, -- Birthdate of the user
    puntuacion INT NOT NULL -- Score of the user
);

SELECT * FROM loged;