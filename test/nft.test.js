const { expect } = require("chai");
const hre = require("hardhat");
const { BN } = require('@openzeppelin/test-helpers');

const SimpleToken = artifacts.require('SimpleToken');

contract('Carbon', function ([ creator, purchaser ]) {

  // Initialize SimpleToken
  const NAME = 'SimpleToken';
  const SYMBOL = 'SIM';
  const TOTAL_SUPPLY = new BN('10000000000000000000000');
  let simpleToken;


  // Initialize Carbonize contract
  const maxSupply = process.env.MAX_SUPPLY;
  const mintingFee = process.env.MINTING_FEE;
  const name = process.env.ERC_NAME;
  const symbol = process.env.ERC_SYMBOL;
  const baseURI = "http://api.carbonized.xyz/metadata/metadata.json";
  const maxPerMinter = 4;

  beforeEach(async function () {
    simpleToken = await SimpleToken.new(NAME, SYMBOL, TOTAL_SUPPLY, { from: creator });
    await simpleToken.transfer(purchaser, 1000);
    await simpleToken.increaseAllowance(purchaser, 10000000);

    // Create a new contract to test before each test case
    const NFT = await hre.ethers.getContractFactory("Carbon");
    this.token = await hre.upgrades.deployProxy(NFT, [maxSupply, mintingFee, simpleToken.address, name, symbol], {initializer: 'initialize'});
    await this.token.deployed();
    await simpleToken.increaseAllowance(this.token.address, 10000000);
  });

  // Sanity check test for simpleToken
  it('retrieve returns a value previously stored', async function () {
    // Use large integer comparisons
    expect(await simpleToken.totalSupply()).to.be.bignumber.equal(TOTAL_SUPPLY);
  });

  // check that token has correct name
  it('token has correct name', async function () {
    expect(await this.token.name()).to.equal(name);
  });

  // check that token has correct symbol
  it('token has correct symbol', async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  describe('minting', function () {
    it('purchaser can mint 1 token', async function () {
      const tokenId = 0;
      await this.token.safeMint(purchaser);
      expect(await this.token.balanceOf(purchaser)).to.equal(1);
      expect(await this.token.ownerOf(tokenId)).to.equal(purchaser);
      expect(await this.token.tokenURI(tokenId)).to.equal(baseURI);
    });
    it('purchaser can mint no more than 4 tokens', async function () {
      for (let i = 0; i < maxPerMinter + 1; i++) {
        await this.token.safeMint(purchaser);
      };
      // BUG: for some reason, this test is failing - even though the purchaser address stays fixed
      // When logging `this.token.balanceOf(purchaser)`, it is incrementing in real time, but when logging in the contract, 
      // it doesn't seem to be working.
      expect(await this.token.balanceOf(purchaser)).to.equal(maxPerMinter);
    });
  });
});

// TODO:
// 1. Test max 4 mint per account
// 2. Test max 100 mint total
/**
 * Helpful Links:
 * https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/1abdc9e2243c25cd98b5bd6df789a5c686400b7b/test/token/ERC20/ERC20.test.js
 * https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/1abdc9e2243c25cd98b5bd6df789a5c686400b7b/test/token/ERC721/presets/ERC721PresetMinterPauserAutoId.test.js
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
 * https://gist.github.com/mbvissers/86e17e28ce41ab8d23242075cfe72421
 * https://docs.openzeppelin.com/upgrades-plugins/1.x/truffle-upgrades#test-usage
 * https://hardhat.org/tutorial/testing-contracts.html
 */

