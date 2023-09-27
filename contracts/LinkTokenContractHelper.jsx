// import { ethers } from "ethers";
// import { link } from "../genAddresses.json";
// import { getContractEssentials } from "./helpers";
// import linkABI from "../contracts/ChainlinkToken.json";

// async function getLinkTokenContract() {
//   let { provider, signer } = await getContractEssentials();
//   let address = link;

//   const linkReadContract = new ethers.Contract(address, linkABI, provider);

//   let linkWriteContract = linkReadContract.connect(signer);

//   return { linkReadContract, linkWriteContract };
// }

// export { getLinkTokenContract };
