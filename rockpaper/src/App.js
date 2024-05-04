import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const RockPaperScissors = () => {
    const [web3, setWeb3] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [playerChoice, setPlayerChoice] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    // Get user's address
                    const accounts = await web3Instance.eth.getAccounts();
                    setUserAddress(accounts[0]);
                    // Get user's balance
                    const balance = await web3Instance.eth.getBalance(accounts[0]);
                    setBalance(web3Instance.utils.fromWei(balance, 'ether'));
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error('MetaMask not detected!');
            }
        };

        loadWeb3();
    }, []);

    const play = async (choice) => {
        if (!web3) return;

        // Deployed contract ABI and address
        const contractAbi = [
            {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "gameId",
                    "type": "bytes32"
                  },
                  {
                    "indexed": false,
                    "internalType": "enum Rock.Result",
                    "name": "result",
                    "type": "uint8"
                  }
                ],
                "name": "GameResult",
                "type": "event"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                  }
                ],
                "name": "games",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "player",
                    "type": "address"
                  },
                  {
                    "internalType": "enum Rock.Move",
                    "name": "playerChoice",
                    "type": "uint8"
                  },
                  {
                    "internalType": "bool",
                    "name": "played",
                    "type": "bool"
                  },
                  {
                    "internalType": "enum Rock.Result",
                    "name": "result",
                    "type": "uint8"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "gameId",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "uint8",
                    "name": "choice",
                    "type": "uint8"
                  }
                ],
                "name": "playGame",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
              }
        ];
        const contractAddress = '0x40a1fa5729a842c88c79568c2b6d0ccc593c1a39'; // Your contract address

        // Deployed contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        try {
            // Play the game with the chosen move
            const tx = await contract.methods.playGame(web3.utils.fromAscii(choice.toString())).send({ from: userAddress, value: web3.utils.toWei('1', 'ether') });
            setResult(tx.events.GameResult.returnValues.result);
            setPlayerChoice(choice);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Rock Paper Scissors</h1>
            <p>User Address: {userAddress}</p>
            <p>Balance: {balance} ETH</p>
            <div>
                <button onClick={() => play(1)}>Rock</button>
                <button onClick={() => play(2)}>Paper</button>
                <button onClick={() => play(3)}>Scissors</button>
            </div>
            {result && (
                <div>
                    <p>Player Choice: {playerChoice}</p>
                    <p>Result: {result}</p>
                </div>
            )}
        </div>
    );
};

export default RockPaperScissors;
