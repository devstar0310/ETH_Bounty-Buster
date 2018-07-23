let BountyBuster = artifacts.require("./BountyBuster.sol");

module.exports = function(deployer) {
  deployer.deploy(BountyBuster);
};
