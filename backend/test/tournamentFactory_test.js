const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("TournamentFactory", function () {
  let tournamentFactory;
  let hostFactory;
  let hostNft;
  let owner;
  let user1;
  let user2;
  let tournamentContract;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the HostNFT contract
    const HostNFT = await ethers.getContractFactory("HostNFT");
    hostNft = await HostNFT.deploy(owner.address);
    await hostNft.deployed();

    // Deploy the HostFactory contract
    const HostFactory = await ethers.getContractFactory("HostFactory");
    hostFactory = await HostFactory.deploy(100); // Set an initial NFT price of 100 wei
    await hostFactory.deployed();

    // Deploy the TournamentFactory contract
    const TournamentFactory = await ethers.getContractFactory(
      "TournamentFactory"
    );
    tournamentFactory = await TournamentFactory.deploy(hostNft.address);
    await tournamentFactory.deployed();
  });

  it("should create a new tournament", async function () {
    // Mint a host NFT to the user1
    await hostFactory
      .connect(user1)
      .createHost("user1", "user1@example.com", "1234567890");

    // Get the host's NFT ID
    const hostNftId = await hostFactory.addressToHostId(user1.address);

    // Create a tournament
    const tournamentDetails = {
      name: "Tournament 1",
      description: "Description of Tournament 1",
    };

    await tournamentFactory.connect(user1).createTournament(
      user1.address,
      Math.floor(Date.now() / 1000) + 3600, // Set end time 1 hour from now
      10, // 10% winner prize
      tournamentDetails,
      hostNftId
    );

    // Check if the tournament was created
    const hostTournaments = await tournamentFactory.getHostAllTournaments();
    const tournamentAddress = await tournamentFactory.getTournamentAddress(
      hostTournaments[0]
    );

    tournamentContract = await ethers.getContractAt(
      "Tournament",
      tournamentAddress
    );

    const tournamentOwner = await tournamentContract.owner();
    const tournamentEndTime = await tournamentContract.endTime();
    const tournamentPercentageOfWinner =
      await tournamentContract.percentageOfWinner();
    const tournamentDetailsFromContract =
      await tournamentContract.getTournamentDetails();

    expect(tournamentOwner).to.equal(user1.address);
    expect(tournamentEndTime).to.be.gt(Math.floor(Date.now() / 1000));
    expect(tournamentPercentageOfWinner).to.equal(10);
    expect(tournamentDetailsFromContract.name).to.equal(tournamentDetails.name);
    expect(tournamentDetailsFromContract.description).to.equal(
      tournamentDetails.description
    );
  });

  it("should not allow non-host to create a tournament", async function () {
    // Attempt to create a tournament from a user who is not a host
    const tournamentDetails = {
      name: "Invalid Tournament",
      description: "Description of Invalid Tournament",
    };

    await expect(
      tournamentFactory.connect(user2).createTournament(
        user2.address,
        Math.floor(Date.now() / 1000) + 3600,
        20,
        tournamentDetails,
        1 // Assuming 1 is a host NFT ID
      )
    ).to.be.revertedWith("USER ISN'T HOST");
  });
});
