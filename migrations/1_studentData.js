const student = artifacts.require("./studentData.sol");

module.exports = function (deployer) {
  deployer.deploy(student);
};
