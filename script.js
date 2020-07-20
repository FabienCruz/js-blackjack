var packOfCards, gameOn, bank, player;

var Gamer = function(name, hand, cardValues, score, winner){
  this.name = name;
  this.hand = hand;
  this.cardValues = cardValues;
  this.score = score;
  this.winner = winner;
};

function init () {
  //      reset screen and datas
  packOfCards = createPackOfCards ();
  bank = new Gamer ('bank', [], [], [0], false);
  player = new Gamer ('player', [], [], [0], false);
  gameOn = true;
  deal();
};

function createPackOfCards () {
  packOfCards = [];
  for (suit = 1; suit < 5; suit++) {
    for (numeral = 1; numeral < 14; numeral++) {
      packOfCards.push ([numeral, suit]);
    }
  };
  return packOfCards;
};

function pickRandomCard () {
  return Math.floor(Math.random () * (packOfCards.length));
};

function calcCardValue (card) {
  if (card[0] === 1) {
    return [1,11];
  } else if (card[0] >= 1 && card[0] < 10) {
    return [card[0]];
  } else {
    return [10];
  }
};

function giveAcard (currentPlayer){
  card = packOfCards[pickRandomCard()];
  currentPlayer.hand.push (card);
  currentPlayer.cardValues.push (calcCardValue(card));
  updateScore (currentPlayer);
  packOfCards.splice(card, 1);
}

function updateScore (currentPlayer) {
  var j;
  var lastIndex = currentPlayer.cardValues.length - 1;
  for (j = 0; j < currentPlayer.score.length; j++) {
    currentPlayer.score[j] += currentPlayer.cardValues[lastIndex][0];
  }
  if (currentPlayer.cardValues[lastIndex].length > 1) {
    currentPlayer.score.push (currentPlayer.score[currentPlayer.score.length - 1] + 10);
  }
};

// ---
// the deal
// ---
function deal () {
  giveAcard (player);
  giveAcard (player);
  giveAcard (bank);
  console.log(player);
  console.log(bank);
  gameStatus ();
  (player.winner === true) ? bankRound () : playerRound ();
};

// ---
// Player's round
// ---
function playerRound () {
  console.log('player is playing');
  document.getElementById('hit').addEventListener('click', function (){
      giveAcard(player);
      console.log(player);
      gameStatus();
    });
  document.getElementById('stand').addEventListener('click', bankRound);
}
// ---
// Bank's round
// ---
function bankRound (){
  console.log('bank is playing');
  giveAcard(bank);
  console.log(bank);
  gameStatus();
  (gameOn === true) ? bankRound() : endGame();
}


// ---
// check gameOn status
// ---
function gameStatus () {
// -- = 21 'blackjack' ?
  if (player.score.some(blackjack)) {
    gameOn = false;
    player.winner = true;
    bankRound();
  };
  if (bank.score.some(blackjack)) {
    gameOn = false;
    bank.winner = true;
    endGame();
  };
// -- > 21 'lose' ?
  if (player.score.every(lose)) {
    gameOn = false;
    bank.winner = true;
    endGame();
  }
  if (bank.score.every(lose)) {
    gameOn = false;
    player.winner = true;
    endGame();
  }
// -- bank stops at 17
  if (bank.score[0] >= 17) {
    gameOn = false;
    endGame();
  }
};

function blackjack (value) {
  return value === 21;
};

function lose (value) {
  return value > 21;
};


function whoWin () {
  /* if (player.winner != bank.winner && player.winner === true || bank.winner === true) {
    if player.winner === true) console.log("player is the winner") : console.log("bank is the winner"); */
  if (player.winner === bank.winner) {
    if (player.score.filter(under22) > bank.score.filter(under22)) {
      console.log("player is the winner");
    } else if (player.score.filter(under22) < bank.score.filter(under22)) {
      console.log("bank is the winner");
    } else {
      console.log("it is a tie");
    }
  }
};


function under22 (value) {
  return value < 22;
 }
// ---
// end game
// ---
function endGame() {
  console.log('end of the game');
  whoWin();
};


document.getElementById('new-game').addEventListener('click', init);



