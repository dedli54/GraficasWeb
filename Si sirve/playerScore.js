let player1Score = 0;
let player2Score = 0;

function increasePlayer1Score() {
  player1Score++;
  console.log("¡Jugador 1 anotó un punto!");
}

function increasePlayer2Score() {
  player2Score++;
  console.log("¡Jugador 2 anotó un punto!");
}

function getPlayer1Score() {
  return player1Score;
}

function getPlayer2Score() {
  return player2Score;
}
