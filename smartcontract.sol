pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Choice { Rock, Paper, Scissors }
    enum Result { Tie, Player1Wins, Player2Wins }

    struct Game {
        address player1;
        address player2;
        Choice choice1;
        Choice choice2;
        uint256 prize;
        bool played;
    }

    mapping(address => uint256) public balances;
    mapping(uint256 => Game) public games;
    uint256 public gameIndex = 0;

    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2, uint256 prize);
    event GamePlayed(uint256 indexed gameId, address indexed winner, Choice choice1, Choice choice2);

    function createGame(address player2) external payable {
        require(msg.value > 0, "Prize must be greater than zero");
        require(player2 != address(0) && player2 != msg.sender, "Invalid player address");

        gameIndex++;
        games[gameIndex] = Game({
            player1: msg.sender,
            player2: player2,
            choice1: Choice.Rock,
            choice2: Choice.Rock,
            prize: msg.value,
            played: false
        });

        emit GameCreated(gameIndex, msg.sender, player2, msg.value);
    }

    function playGame(uint256 gameId, Choice choice) external {
        Game storage game = games[gameId];
        require(!game.played, "Game already played");
        require(msg.sender == game.player1 || msg.sender == game.player2, "Unauthorized player");
        require(choice >= Choice.Rock && choice <= Choice.Scissors, "Invalid choice");

        if (msg.sender == game.player1) {
            game.choice1 = choice;
        } else {
            game.choice2 = choice;
        }

        if (game.choice1 != Choice.Rock && game.choice2 != Choice.Paper && game.choice1 != Choice.Scissors) {
            // Handle case where game hasn't been fully played yet
            return;
        }

        Result result = getResult(game.choice1, game.choice2);
        address winner;
        if (result == Result.Player1Wins) {
            winner = game.player1;
        } else if (result == Result.Player2Wins) {
            winner = game.player2;
        } else {
            // In case of a tie, refund the prize to both players
            balances[game.player1] += game.prize / 2;
            balances[game.player2] += game.prize / 2;
        }

        if (winner != address(0)) {
            balances[winner] += game.prize;
        }

        game.played = true;

        emit GamePlayed(gameId, winner, game.choice1, game.choice2);
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getResult(Choice choice1, Choice choice2) internal pure returns (Result) {
        if (choice1 == choice2) {
            return Result.Tie;
        } else if (
            (choice1 == Choice.Rock && choice2 == Choice.Scissors) ||
            (choice1 == Choice.Paper && choice2 == Choice.Rock) ||
            (choice1 == Choice.Scissors && choice2 == Choice.Paper)
        ) {
            return Result.Player1Wins;
        } else {
            return Result.Player2Wins;
        }
    }
}
