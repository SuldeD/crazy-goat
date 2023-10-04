import { ethers } from "ethers";
import HostNftAbi from "../abi/HostNFT.json";
import genAddresses from "./genAddresses.json";
import { getContractEssentials } from "./helpers";
const hostNft = genAddresses.hostNft;

async function getHostNftContract() {
  let { provider, signer } = await getContractEssentials();

  let address = hostNft;

  const hostNftReadContract = new ethers.Contract(
    address,
    HostNftAbi,
    provider
  );

  let hostNftWriteContract = hostNftReadContract.connect(signer);

  return { hostNftReadContract, hostNftWriteContract };
}

export { getHostNftContract };
