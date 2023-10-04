import { ethers } from "ethers";
import { getContractEssentials } from "./helpers";
import genAddresses from "./genAddresses.json";
import tournamentFactoryAbi from "../abi/TournamentFactory.json";

const tournamentFactory = genAddresses.tournamentFactory;

async function getTournamentFactoryContract() {
  let { provider, signer } = await getContractEssentials();

  const tournamentFactoryReadContract = new ethers.Contract(
    tournamentFactory,
    tournamentFactoryAbi,
    provider
  );

  let tournamentFactoryWriteContract =
    tournamentFactoryReadContract.connect(signer);

  return { tournamentFactoryReadContract, tournamentFactoryWriteContract };
}

export { getTournamentFactoryContract };
