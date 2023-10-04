import { ethers } from "ethers";
import { getContractEssentials } from "./helpers";
import tournamentAbi from "../abi/Tournament.json";

async function getTournamentContract(address) {
  let { provider, signer } = await getContractEssentials();

  const tournamentReadContract = new ethers.Contract(
    address,
    tournamentAbi,
    provider
  );

  let tournamentWriteContract = tournamentReadContract.connect(signer);

  return { tournamentReadContract, tournamentWriteContract };
}

export { getTournamentContract };
