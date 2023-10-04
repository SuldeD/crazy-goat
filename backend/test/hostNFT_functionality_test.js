const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HostNft - Functionality Test", function () {
  beforeEach(async function () {
    let accounts = await ethers.getSigners();
    this.chingun = accounts[0];
    this.suldee = accounts[1];
    this.HostFactory = await ethers.getContractFactory("HostFactory");
    this.hostFactoryContract = await this.HostFactory.deploy(100);
    // await this.hostFactoryContract.deployed();
    await this.hostFactoryContract
      .connect(this.chingun)
      .createHost("chingun", "chingun.dev@gmail.com", "99310720");
  });

  it("checks nft's details", async function () {
    let nftId = await this.hostFactoryContract.addressToHostId(
      this.chingun.address
    );
    let nftAddress = await this.hostFactoryContract.nft();
    const nft = await ethers.getContractAt("HostNFT", nftAddress);
    const nftDetail = await nft.getHostDetail(nftId);

    expect(nftDetail.username).to.equal("chingun");
    expect(nftDetail.email).to.equal("chingun.dev@gmail.com");
    expect(nftDetail.phone_number).to.equal("99310720");
    expect(nftDetail.tournamentIds.length).to.equal(0);

    expect(await this.hostFactoryContract.idToHostAddress(nftId)).to.equal(
      this.chingun.address
    );
    expect(
      await this.hostFactoryContract.hostHasNft(this.chingun.address)
    ).to.equal(true);
    expect(
      await this.hostFactoryContract.addressToHostId(this.chingun.address)
    ).to.equal(0);
  });
});
