// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./structs/TournamentDetails.sol";
import "./interfaces/IBase721.sol";
import "./HostFactory.sol";
import "./Tournament.sol";

contract TournamentFactory {
  mapping(address => uint[]) public addressToHostTournamentIds;
  mapping(uint => address) public tournamentIdToAddress;

  uint[] public tournaments;
  uint public tournamentId;

  HostFactory public hostFactory;
  IBase721 public hostNft;
  TournamentDetails public tournamentDetails;

  event TournamentCreated (
    uint indexed tournamentId,
    address indexed hostAddress
  );

  constructor(address _hostNft) {
    hostNft = IBase721(_hostNft);
    tournamentId = 1;
  }

  function createTournament(
    address _tournamentOwner,
    uint256 _tournamentEndTime,
    uint256 _percentageOfWinner,
    TournamentDetails memory _tournamentDetails,
    address _nftAddr
  ) external {
    require(hostNft.balanceOf(msg.sender) > 0, "USER ISN'T HOST");
    Tournament _tournament = new Tournament(
      _tournamentOwner,
      _tournamentEndTime,
      _percentageOfWinner,
      _tournamentDetails,
      _nftAddr
    );

    addressToHostTournamentIds[msg.sender].push(tournamentId);
    tournamentIdToAddress[tournamentId] = address(_tournament);

    tournaments.push(tournamentId);
    emit TournamentCreated(tournamentId, msg.sender);
    tournamentId += 1;
  }

  function getHostAllTournaments() external view returns(uint[] memory){
    return addressToHostTournamentIds[msg.sender];
  }

  function getHostTournament(address _host) external view returns(uint[] memory){
    return addressToHostTournamentIds[_host];
  }

  function getTournamentAddress(uint _id) external view returns(address) {
    return tournamentIdToAddress[_id];
  }

  function getAllTournaments() external view returns(uint[] memory) {
    return tournaments;
  }

  function getTournamentLength() external view returns(uint) {
    return tournaments.length;
  }
}