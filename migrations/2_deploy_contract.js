const rock = artifacts.require("Rock"); // Use "rock" instead of "rock.sol"

module.exports = function (deployer) {
    deployer.deploy(rock);
};
