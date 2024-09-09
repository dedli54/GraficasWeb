function startGame() {
    document.querySelector('.menu').classList.add('hide');
    document.getElementById('levelSelection').classList.remove('hide');
}

function showLevelSelection() {
    document.getElementById('menuPage').classList.add('hide');
    document.getElementById('levelSelection').classList.remove('hide');
}

function startLevel(level) {
    if (level === 'level1') {
        window.location.href = "level1.html";
    } else if (level === 'level2') {
        window.location.href = "level2.html";
    } else if (level === 'level3') {
        window.location.href = "level3.html";
    }else if (level === 'level1h') {
        window.location.href = "level1hard.html";
    }else if (level === 'level2h') {
        window.location.href = "level2hard.html";
    }else if (level === 'level3h') {
        window.location.href = "level3hard.html";
    }
}

// Resto de tu código...


function openSettings() {
   
    document.querySelector('.menu').classList.add('hide');
    
    document.getElementById('settingsPage').classList.remove('hide');
}

function openScores() {
  
    document.querySelector('.menu').classList.add('hide');
    
    window.location.href = "scores.html";
}

function pauseGame() {
   
    document.getElementById('pauseMenu').classList.remove('hide');
}

function resumeGame() {
   
    document.getElementById('pauseMenu').classList.add('hide');
}

function gamemode(){
    document.getElementById('gamemode').classList.add('hide');
}

function resumeGame2() {
   
    document.getElementById('loginmenu').classList.add('hide');
}

/*function showfacebook() {
    const facebookTable = document.getElementById('facebooktable');
    if (facebookTable.classList.contains('hide')) {
        // Si está oculto, mostrarlo
        facebookTable.classList.remove('hide');
    } else {
        // Si está visible, ocultarlo
        facebookTable.classList.add('hide');
    }
}*/



function backToMenu() {
   
    document.getElementById('settingsPage').classList.add('hide');
    
    document.querySelector('.menu').classList.remove('hide');
}

function backToMenuScore() {
    window.location.href = "index.html";
}

function quitGame(){
    window.location.href = "index.html";
}

let soundMuted = false;

function isSoundMuted() {
    const muteCheckbox = document.getElementById('muteCheckbox');
    const isMuted = muteCheckbox.checked;
    console.log("LO DESACTIVE");
    localStorage.setItem('soundMuted', isMuted);

}

function LoginUsers() {
    document.getElementById('loginmenu').classList.remove('hide');
}

function updateScoresTable(data) {
    const table = document.getElementById('tablaNombres');
    // Resto del código para actualizar la tabla...
  
    // Dispara un evento personalizado cuando la tabla se actualiza
    const event = new CustomEvent('scoresUpdated', { detail: data });
    document.dispatchEvent(event);
  }
  