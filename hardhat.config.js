require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    supraTestnet: {
      url: process.env.SUPRA_RPC,
      accounts: [process.env.PRIVATE_KEY.replace(/\s/g, "")],
    },
  },
};
