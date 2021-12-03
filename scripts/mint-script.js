const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.getContractFactory("Carbon");
  const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
  const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
  
  const contract = NFT.attach(CONTRACT_ADDRESS);

  await contract.safeMint(WALLET_ADDRESS);
  console.log("NFT minted:", contract);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});