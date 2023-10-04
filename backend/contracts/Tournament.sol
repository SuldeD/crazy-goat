// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./structs/TournamentDetails.sol";
import "./interfaces/IBase721.sol";

contract Tournament {
    using SafeMath for uint256;
    uint256 public winnerRewardPercentage;
    uint256 public endTime;
    
    address public host;
    address public winner;

    bool public sentPrizeToTheWinner;
    bool public grantPrizeCalled;
    bool public winnerCalled;

    TournamentDetails public tournamentDetails;
    IBase721 public nft;
    
    event TournamendEnded(address, uint256);
    event Deposited(address, address, uint256);

    constructor(
        address _tournamentOwner,
        uint256 _tournamentEndTime,
        uint256 _winnerRewardPercentage,
        TournamentDetails memory _tournamentDetails,
        address _nftAddr
    ) {
        require(_winnerRewardPercentage <= 100, "Percentage should be between 0-100");
        host = _tournamentOwner;
        endTime = _tournamentEndTime + block.timestamp;
        winnerRewardPercentage = _winnerRewardPercentage;
        tournamentDetails = _tournamentDetails;
        nft = IBase721(_nftAddr);
    }

    receive() external payable {}

    function deposit() public payable onlyHasNFT {
        require(block.timestamp < endTime, "Tournament ended");
        require(msg.value > 0, "Your value should be greater than 0");
        (bool success, ) = address(this).call{ value: msg.value }("");
		require(success);
        emit Deposited(msg.sender, address(this), msg.value);
    }

    function grantPrize() external payable onlyHost {
        require(block.timestamp >= endTime, "Tournament hasn't ended yet");
        require(!grantPrizeCalled, "Already sent prize to the winner");
        uint256 prizePool = address(this).balance;
        emit TournamendEnded(winner, prizePool);
        (bool success, ) = winner.call{ value: prizePool.mul(winnerRewardPercentage).div(100) }("");
		require(success);
        sentPrizeToTheWinner = true;
        grantPrizeCalled = true;
    }

    // Only for test
    function setWinner(address _winner) public onlyHost {
        require(block.timestamp >= endTime, "Tournament hasn't ended yet");
        winner = _winner;
    }

    // Only for test
    function setPercentage(uint256 _percent) public onlyHost {
        winnerRewardPercentage = _percent;
    }

    function withdraw() public onlyHost {
        require(sentPrizeToTheWinner, "Firstly should call grantPrize function");
        (bool success, ) = host.call{ value: address(this).balance }("");
		require(success);
    }

    modifier onlyHost() {
        require(
            msg.sender == host, 
            "Only the host can grant the prize and transfer it to the winner of the tournament");
        _;
    }

    modifier onlyHasNFT() {
        require(
            nft.balanceOf(msg.sender) > 0, "Only the user who has nft can access this function");
        _;
    }
}