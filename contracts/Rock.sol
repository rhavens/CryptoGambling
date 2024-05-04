// SPDX-License-Identifier: MIT
//Comment
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    enum Result { None, Win, Loss, Draw }

    struct Game {
        address player;
        Move playerChoice;
        bool played;
        Result result;
    }

    mapping(bytes32 => Game) public games;

    event GameResult(bytes32 indexed gameId, Result result);

    function playGame(bytes32 gameId, uint8 choice) external payable {
        require(choice >= 1 && choice <= 3, "Invalid choice");
        require(msg.value == 1 ether, "Insufficient funds");

        Move playerChoice = Move(choice);
        Game storage game = games[gameId];
        require(game.player == msg.sender, "You are not authorized to play this game");
        require(!game.played, "Game has already been played");

        game.playerChoice = playerChoice;
        game.played = true;

        // Generate random choice for the contract
        uint8 contractChoice = uint8(block.timestamp % 3) + 1;
        Move contractMove = Move(contractChoice);

        // Determine the game result
        if (playerChoice == contractMove) {
            game.result = Result.Draw;
            payable(msg.sender).transfer(1 ether); // refund
        } else if ((playerChoice == Move.Rock && contractMove == Move.Scissors) ||
                   (playerChoice == Move.Paper && contractMove == Move.Rock) ||
                   (playerChoice == Move.Scissors && contractMove == Move.Paper)) {
            game.result = Result.Win;
            payable(msg.sender).transfer(2 ether); // player wins and gets rewarded 1 ether
        } else {
            game.result = Result.Loss;
            // Player loses, no reward
        }

        emit GameResult(gameId, game.result);
    }
}
