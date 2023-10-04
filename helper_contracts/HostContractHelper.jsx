import { ethers } from "ethers";
import { getContractEssentials } from "./helpers";
import genAddresses from "./genAddresses.json";
import hostFactoryAbi from "../abi/HostFactory.json";

const hostFactoryContract = genAddresses.hostFactoryContract;

async function getHostFactoryContract() {
  let { provider, signer } = await getContractEssentials();

  const hostReadContract = new ethers.Contract(
    hostFactoryContract,
    hostFactoryAbi,
    provider
  );

  let hostWriteContract = hostReadContract.connect(signer);

  return { hostReadContract, hostWriteContract, provider, signer };
}

export { getHostFactoryContract };
