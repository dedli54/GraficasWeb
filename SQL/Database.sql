
-- Puede que esto este mal, estoy intentado saber como funciona la base de datos a travez de
--ver nomas el codigo php asi que si truena no me sorprenderia JAJAJAJAJAJAJA
--ya que el proyecto original no venia con un .sql


CREATE TABLE loged (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    fechaNacimiento DATE NOT NULL
);