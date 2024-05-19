const Basic = artifacts.require("Basic.sol");

module.exports = function (depolyer) {
    depolyer.deploy(Basic);
};
