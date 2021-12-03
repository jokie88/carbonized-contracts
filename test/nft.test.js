const { expect } = require("chai");

//test vars
let max_supply = process.env.MAX_SUPPLY;
let mintingFee = process.env.MINTING_FEE;
let bct_address = process.env.BCT_ADDRESS; //actually usdc in mumbai
let ercName = process.env.ERC_NAME;
let ercSymbol = process.env.ERC_SYMBOL


describe("NFT", function() {
  it("It should deploy the contract, mint a token, and resolve to the right URI", async function() {
    const NFT = await ethers.getContractFactory("Carbon");
    const nft = await upgrades.deployProxy(NFT, [max_supply, mintingFee, bct_address, ercName, ercSymbol], {initializer: 'initialize'});

    const URI = "http://api.carbonized.xyz/metadata/metadata.json";
    await nft.deployed();
    await nft.safeMint("")
    expect(await nft.tokenURI(1)).to.equal(URI)
  });
});
