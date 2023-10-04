// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./structs/HostDetails.sol";

contract HostNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    address public creator;

    HostDetails[] public hostDetails;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor(address _hostFactory) ERC721("HostNFT", "HOST") {
        _grantRole(DEFAULT_ADMIN_ROLE, _hostFactory);
        _grantRole(BURNER_ROLE, _hostFactory);
        
        _grantRole(MINTER_ROLE, _hostFactory);
        creator = msg.sender;
    }

    function hostMint(
      address to,
      string memory _username,
      string memory _email,
      string memory _phone_number
    ) external onlyRole(MINTER_ROLE) returns (uint) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        HostDetails memory detail;
        detail.username = _username;
        detail.email = _email;
        detail.phone_number = _phone_number;

        hostDetails.push(detail);
        return tokenId;
    }

    function hostBurn (uint256 tokenId) external onlyRole(BURNER_ROLE) {
        _burn(tokenId);
    }

    function getHostDetail(uint id) external view returns(HostDetails memory){
      return hostDetails[id];
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}