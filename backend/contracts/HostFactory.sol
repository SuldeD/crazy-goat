// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/IBase721.sol";
import "./HostNFT.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract HostFactory is AccessControl {
  uint256 public hostNFTPrice;
  uint public hostLength = 0;

  address public creator;
  HostNFT public nft;

  mapping(address => uint) public addressToHostId;
  mapping(address => bool) public hostHasNft;
  mapping(uint => address) public idToHostAddress;

  event hostNFTMinted (address, uint, uint256);

  event hostNFTBurned (
    address hostAddress,
    uint hostId
  );

  constructor(uint256 _hostNFTPrice) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    nft = new HostNFT(address(this));
    hostNFTPrice = _hostNFTPrice;
    creator = msg.sender;
  }
  
  receive() external payable {}

  function createHost(
    string memory _username,
    string memory _email,
    string memory _phone_number
  ) external payable {
    require(!hostHasNft[msg.sender], "This address has already hostNFT.");
    require(msg.value >= hostNFTPrice, "Insufficient funds to create hostNFT."); // Add this to check if there are sufficient funds sent.

    bool success = payable(creator).send(hostNFTPrice); // Send the NFT price to the creator.
    require(success, "Failed to send funds to creator."); // Check if the fund transfer is successful.

    uint id = nft.hostMint(
      msg.sender,
      _username,
      _email,
      _phone_number
    );
    
    addressToHostId[msg.sender] = id;
    idToHostAddress[id] = msg.sender;
    hostHasNft[msg.sender] = true;

    hostLength++;
    emit hostNFTMinted(msg.sender, id, msg.value);
  }


  function setThePriceOfNFT(uint256 _hostNFTPrice) external {
    require(creator == msg.sender, "Only the creator set the price of HOST");
    hostNFTPrice = _hostNFTPrice;
  }
}