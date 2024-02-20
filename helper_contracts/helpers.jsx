import { ethers } from "ethers";

async function getContractEssentials() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  await ethereum.request({ method: "eth_requestAccounts" });

  return { provider, signer };
}

function toInteger18(amount) {
  return parseInt(parse18(amount));
}

function toFloat18(amount) {
  return parseFloat(parse18(amount));
}

function parse(amount, decimal) {
  return ethers.utils.parseUnits(amount.toString(), decimal);
}

function parse18(amount) {
  return ethers.utils.parseUnits(amount.toString(), 18);
}

function format(amount, decimal) {
  return ethers.utils.formatUnits(amount.toString(), decimal);
}

function format18(amount) {
  return ethers.utils.formatUnits(amount.toString(), 18);
}

function convertPercentagesToWeiArray(percentages) {
  const totalPercentage = percentages.reduce(
    (acc, percent) => acc + percent,
    0
  );

  if (totalPercentage > 100) {
    throw new Error("Total percentage must be equal to or less than 100");
  }

  const multiplier = 1e18 / totalPercentage; // Adjusted multiplier

  return percentages.map((percent) => percent * multiplier);
}
export {
  toInteger18,
  toFloat18,
  parse,
  parse18,
  format,
  format18,
  getContractEssentials,
  convertPercentagesToWeiArray,
};
