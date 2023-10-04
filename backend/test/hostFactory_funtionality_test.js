const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("HostFactory", function () {
  let hostFactory;
  let owner;
  let user1;
  // eslint-disable-next-line no-unused-vars
  let user2;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const HostFactory = await ethers.getContractFactory("HostFactory");
    hostFactory = await HostFactory.deploy(100); // Set an initial NFT price of 100 wei
  });

  it("should allow the owner to create a host", async function () {
    await hostFactory
      .connect(owner)
      .createHost("user1", "user1@example.com", "1234567890");

    const hostId = await hostFactory.addressToHostId(owner.address);
    expect(hostId).to.equal(1);
  });

  it("should not allow creating a host with the same address", async function () {
    await expect(
      hostFactory
        .connect(owner)
        .createHost("user2", "user2@example.com", "9876543210")
    ).to.be.revertedWith("This address has already hostNFT.");
  });

  it("should allow changing the NFT price by the owner", async function () {
    await hostFactory.connect(owner).setThePriceOfNFT(200); // Change NFT price to 200 wei
    const newPrice = await hostFactory.hostNFTPrice();
    expect(newPrice).to.equal(200);
  });

  it("should not allow changing the NFT price by a non-owner", async function () {
    await expect(
      hostFactory.connect(user1).setThePriceOfNFT(300)
    ).to.be.revertedWith("Only the creator set the price of HOST");
  });
});
