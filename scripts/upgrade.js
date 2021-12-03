// scripts/upgrade_box.js

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers, upgrades } = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await hre.ethers.getSigners();
  
  //test vars
  const NFT = await hre.ethers.getContractFactory('Carbon');
  console.log('Upgrading NFT Contract at:', process.env.NFT_CONTRACT_ADDRESS);
  await upgrades.upgradeProxy(process.env.NFT_CONTRACT_ADDRESS, NFT);
  console.log('NFT Contract Upgraded:', process.env.NFT_CONTRACT_ADDRESS);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
