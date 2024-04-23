let balance = 0; // Initial balance

// Function to update balance in UI
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(4);
}

// Function to play Rock Paper Scissors
function play(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    // Determine the winner
    let result;
    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        balance += 1; // Player wins, add 1 BTC
        result = "You win!";
    } else {
        balance -= 1; // Computer wins, subtract 1 BTC
        result = "Computer wins!";
    }

    // Update balance in UI and display result
    updateBalance();
    document.getElementById('result').textContent = result + ` Computer chose ${computerChoice}.`;
}

