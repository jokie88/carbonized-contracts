// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;


import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

import "./ContextMixin.sol";


/// @custom:security-contact security@carbonized.xyz
contract Carbon is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, PausableUpgradeable, ContextMixin, OwnableUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;


//    CountersUpgradeable.Counter private _tokenIdCounter;
    uint256 private _max_supply;
    uint256 private _mintingFee; 
    
    ERC20 private _bct; //usdt for testing. replace w/ actual address


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    //initialize function only gets run once
    function initialize(uint256 max_supply, uint256 mintingFee, address bctAddress, string memory ercName, string memory ercSymbol) initializer public {
        _max_supply = max_supply;
        _mintingFee = mintingFee;
        _bct = ERC20(bctAddress);
        __ERC721_init(ercName, ercSymbol);
        __ERC721Enumerable_init();
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init(); 
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // function safeMint(address to) public payable {
    //     require(msg.value == _mintingFee, 'Please pay correct amount');
    //     require(_tokenIdCounter.current() < _max_supply, "No more NFTs available to mint");

    //     uint256 tokenId = _tokenIdCounter.current();
    //     _tokenIdCounter.increment();
    //     _safeMint(to, tokenId);
    // }

    function safeMint(address to) public whenNotPaused {
        //require(msg.value == _mintingFee, 'Please pay correct amount');
        require(totalSupply() < _max_supply, "No more NFTs available to mint");
        require(balanceOf(msg.sender) < 4, 'Each address may only mint four');
        
        address from = msg.sender;
        _bct.transferFrom(from, address(this), _mintingFee);
        uint256 tokenId = totalSupply();
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal whenNotPaused override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        //string memory _tokenURI = _tokenURIs[tokenId];
        //directly set it for now, since one img. at some point if there are more imgs randomly assign using chainlink VRF
        string memory _tokenURI = "http://api.carbonized.xyz/metadata/metadata.json";
        return _tokenURI;
    }

    function contractURI() public view returns (string memory) {
        return "http://api.carbonized.xyz/metadata/collection-metadata.json";
    }

    function withdraw(IERC20 token, address recipient, uint256 amount) public onlyOwner {
        token.transfer(recipient, amount);
    }
    /**
   * Override isApprovedForAll to auto-approve OS's proxy contract
   */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
      // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }
        
        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721Upgradeable.isApprovedForAll(_owner, _operator);
    }

    /**
     * This is used instead of msg.sender as transactions won't be sent by the original token owner, but by OpenSea.
     */
    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    // for UUPS upgradability
    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {} 

    // The following functions are overrides required by Solidity.
    // From https://wizard.openzeppelin.com/#erc721
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}