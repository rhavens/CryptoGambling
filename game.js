import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const RockPaperScissors = () => {
    const [web3, setWeb3] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [playerChoice, setPlayerChoice] = useState('');
    const [computerChoice, setComputerChoice] = useState('');
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
        const contractAbi = []; // Your contract ABI
        const contractAddress = ''; // Your contract address

        // Deployed contract instance
        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        try {
            // Play the game
            await contract.methods.play(choice).send({ from: userAddress, value: web3.utils.toWei('1', 'ether') });
            // Fetch game result from contract
            const gameResult = await contract.methods.getGameResult().call({ from: userAddress });
            // Update state with game result
            setPlayerChoice(choice);
            setComputerChoice(gameResult.computerChoice);
            setResult(gameResult.result);
            // Update user's balance
            const balance = await web3.eth.getBalance(userAddress);
            setBalance(web3.utils.fromWei(balance, 'ether'));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Rock Paper Scissors</h1>
            <p>User Address: {userAddress}</p>
            <p>Balance: {balance} ETH</p>
            <button onClick={() => play('rock')}>Rock</button>
            <button onClick={() => play('paper')}>Paper</button>
            <button onClick={() => play('scissors')}>Scissors</button>
            {result && (
                <div>
                    <p>Player Choice: {playerChoice}</p>
                    <p>Computer Choice: {computerChoice}</p>
                    <p>Result: {result}</p>
                </div>
            )}
        </div>
    );
};

export default RockPaperScissors;
