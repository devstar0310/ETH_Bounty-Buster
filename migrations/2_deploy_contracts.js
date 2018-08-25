let BountyBuster = artifacts.require('./BountyBuster.sol');

module.exports = (deployer) => {
  deployer.deploy(BountyBuster);
};
