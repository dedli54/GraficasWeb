let userLogged = null;


function validaciones(event) {
    event.preventDefault();

    var usuario = document.getElementById('user').value;
    var correo = document.getElementById('mail').value;
    var contraseña = document.getElementById('password').value;
    var fechaNacimiento = document.getElementById('birthday').value;
    var sexo = document.querySelector('input[name="sex"]:checked');

    if (!usuario || !correo || !contraseña || !fechaNacimiento || !sexo) {
        alert('Completa todos los campos del formulario antes de enviarlo.');
        return;
    }

    var usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

  
    var nuevoUsuario = {
        usuario: usuario,
        correo: correo,
        contraseña: contraseña,
        fechaNacimiento: fechaNacimiento,
        sexo: sexo.value
    };

    usuariosGuardados.push(nuevoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

   
}




function ingresar(event) {
    event.preventDefault();

    var user = document.getElementById('user').value;
    var pass = document.getElementById('password').value;

    if (!user || !pass) {
        alert('Completa el usuario y la contraseña antes de iniciar sesión.');
        return;
    }

    var usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    var usuarioEncontrado = usuariosGuardados.find(function(usuario) {
        return usuario.usuario === user && usuario.contraseña === pass;
    });

    if (usuarioEncontrado) {
        // Almacenar información en el localStorage
        localStorage.setItem('userLogged', user);
        
        alert('Inicio de sesión exitoso.');
  
        window.location.href = 'MainMenu.html';
    } else {
        alert('Correo o contraseña incorrectos. Inténtalo nuevamente.');
    }
}


function suceso(event) {
    event.preventDefault();
    alert('Comenzando la partida...');
    window.location.href='PantallaJuego.html';


}

function suceso2(event) {
    event.preventDefault();
    alert('Comenzando la partida...');
    window.location.href='PantallaJuego2.html';

}

function suceso3(event) {
    event.preventDefault();
    alert('Comenzando la partida...');
    window.location.href='PantallaJuego3.html';


}

function cambiotecontrol(event){
    event.preventDefault();
    var botonPresionado = event.target.value;

    if (botonPresionado === 'W') {

        alert('Ingrese la tecla nueva para caminar hacia el frente.');
    } else if (botonPresionado === 'A') {
 
        alert('Ingrese la tecla nueva para caminar a la izquierda.');
    } else if (botonPresionado === 'D') {
  
        alert('Ingrese la tecla nueva para caminar a la derecha.');
    } else if (botonPresionado === 'S') {
  
        alert('Ingrese la tecla nueva para caminar hacia atras.');
    } else if (botonPresionado === 'Mouse1') {
  
        alert('Ingrese la tecla nueva para disparar.');
    } else if (botonPresionado === 'SPACE') {
  
        alert('Ingrese la tecla nueva para saltar.');
    } else if (botonPresionado === 'R') {
          
        alert('Ingrese la tecla nueva para recargar.');
    }

}