pragma solidity ^0.8.0;

contract ATM {
    enum AccountType { CHECKING, SAVINGS }

    struct Transaction {
        uint256 amount;
        uint256 timestamp;
        bool processed;
        AccountType account;
    }

    mapping(address => bool) public authorizedAccounts;
    mapping(address => uint256) public balances;
    mapping(address => Transaction) public pendingTransactions;

    event Deposit(address indexed account, uint256 amount, AccountType indexed accountType);

    modifier onlyAuthorized() {
        require(authorizedAccounts[msg.sender], "Unauthorized access");
        _;
    }

    function login(uint256 _pin) external {
        // Implement PIN verification logic here
        authorizedAccounts[msg.sender] = true;
    }

    function specifyAccount(AccountType _account) external onlyAuthorized {
        // Implement account specification logic here
    }

    function performDeposit(uint256 _amount, AccountType _account) external onlyAuthorized {
        require(_amount > 0, "Deposit amount must be greater than zero");
        if (_account == AccountType.CHECKING) {
            require(_amount <= 5000, "Cash deposit cannot exceed $5000");
        }
        pendingTransactions[msg.sender] = Transaction(_amount, block.timestamp, false, _account);
    }

    function processDeposit() external onlyAuthorized {
        Transaction memory transaction = pendingTransactions[msg.sender];
        require(transaction.amount > 0, "No pending deposit");

        balances[msg.sender] += transaction.amount;
        emit Deposit(msg.sender, transaction.amount, transaction.account);
        delete pendingTransactions[msg.sender];
    }
}
