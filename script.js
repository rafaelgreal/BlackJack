// JavaScript code
let playerHand = [];
let dealerHand = [];
let deck = [];

// Function to create a deck of cards
function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'Jack',
    'Queen',
    'King',
    'Ace',
  ];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

// Function to shuffle the deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Function to deal a card from the deck
function dealCard() {
  return deck.pop();
}

// Function to calculate the score of a hand
function calculateHandScore(hand) {
  let score = 0;
  let hasAce = false;

  for (const card of hand) {
    const cardValue = card.value;
    if (cardValue === 'Ace') {
      hasAce = true;
      score += 11; // Ace can be 11 or 1, start as 11
    } else if (
      cardValue === 'King' ||
      cardValue === 'Queen' ||
      cardValue === 'Jack'
    ) {
      score += 10;
    } else {
      score += parseInt(cardValue);
    }
  }

  // If the hand has an Ace and the score is over 21, change the value of Ace to 1
  if (hasAce && score > 21) {
    score -= 10;
  }

  return score;
}

// Function to create a card element
function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.textContent = `${card.value} of ${card.suit}`;
  return cardElement;
}

// Function to update the UI with cards and scores
function updateUI() {
  const playerCardsContainer = document.getElementById('player-cards');
  const dealerCardsContainer = document.getElementById('dealer-cards');
  const playerScoreElement = document.getElementById('player-score');
  const dealerScoreElement = document.getElementById('dealer-score');

  // Clear previous cards
  playerCardsContainer.innerHTML = '';
  dealerCardsContainer.innerHTML = '';

  // Update Player's Hand
  playerHand.forEach(card => {
    const cardElement = createCardElement(card);
    playerCardsContainer.appendChild(cardElement);
  });

  // Update Dealer's Hand (only show one card initially)
  const hiddenCard = document.createElement('div');
  hiddenCard.classList.add('card', 'hidden');
  dealerCardsContainer.appendChild(hiddenCard);
  const secondCardElement = createCardElement(dealerHand[1]);
  dealerCardsContainer.appendChild(secondCardElement);

  // Calculate and display scores
  playerScoreElement.textContent = `Player Score: ${calculateHandScore(
    playerHand
  )}`;
  dealerScoreElement.textContent = `Dealer Score: ${calculateHandScore(
    dealerHand
  )}`;
}

// Function for the dealer's turn
function dealerTurn() {
  // Reveal the hidden card
  const hiddenCard = document.querySelector('#dealer-cards .hidden');
  hiddenCard.classList.remove('hidden');

  // Continue drawing cards until the dealer's score is 17 or higher
  while (calculateHandScore(dealerHand) < 17) {
    dealerHand.push(dealCard());
    const newCardElement = createCardElement(dealerHand[dealerHand.length - 1]);
    document.getElementById('dealer-cards').appendChild(newCardElement);
  }

  // Determine the winner
  determineWinner();
}

// Function to determine the winner
function determineWinner() {
  const playerScore = calculateHandScore(playerHand);
  const dealerScore = calculateHandScore(dealerHand);

  if (playerScore > 21) {
    displayMessage('You busted! Dealer wins.');
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    displayMessage('You win!');
  } else if (dealerScore > playerScore) {
    displayMessage('Dealer wins.');
  } else {
    displayMessage("It's a tie!");
  }
}

// Function to display a message in the message area
function displayMessage(message) {
  document.getElementById('message').textContent = message;
}

// Function to start the game
function startGame() {
  createDeck();
  shuffleDeck();

  // Clear hands
  playerHand = [];
  dealerHand = [];

  // Deal initial cards
  playerHand.push(dealCard(), dealCard());
  dealerHand.push(dealCard(), dealCard());

  updateUI();
}

// Event listeners for buttons
document.getElementById('deal-button').addEventListener('click', startGame);
document.getElementById('hit-button').addEventListener('click', () => {
  if (calculateHandScore(playerHand) <= 21) {
    playerHand.push(dealCard());
    updateUI();

    if (calculateHandScore(playerHand) > 21) {
      dealerTurn();
    }
  }
});
document.getElementById('stand-button').addEventListener('click', () => {
  dealerTurn();
});

// Initialize the game
startGame();
