// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await hre.ethers.getSigners();
  
  //test vars
  let max_supply = process.env.MAX_SUPPLY;
  let mintingFee = process.env.MINTING_FEE;
  let bct_address = process.env.BCT_ADDRESS; //actually usdc in mumbai
  let ercName = process.env.ERC_NAME;
  let ercSymbol = process.env.ERC_SYMBOL

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const NFT = await hre.ethers.getContractFactory("Carbon");
  const nft = await hre.upgrades.deployProxy(NFT, [max_supply, mintingFee, bct_address, ercName, ercSymbol], {initializer: 'initialize'});

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
