const ethers = require("ethers");
const { LitContracts } = require("@lit-protocol/contracts-sdk");
const { LitNetwork } = require("@lit-protocol/constants");

const provider = new ethers.providers.JsonRpcProvider(
  "https://chain-rpc.litprotocol.com/http"
);

const wallet = new ethers.Wallet(
  "f21d3fafe29fa10d26092ce4e91cd7108b734b98393f79b3c2cd04de24ca6817",
  provider
);

async function main() {
  const contractClient = new LitContracts({
    signer: wallet,
    network: LitNetwork.Cayenne,
  });
  await contractClient.connect();
  const { capacityTokenIdStr } = await contractClient.mintCapacityCreditsNFT({
    requestsPerKilosecond: 80,
    // requestsPerDay: 14400,
    // requestsPerSecond: 10,
    daysUntilUTCMidnightExpiration: 2,
  });
  console.log(capacityTokenIdStr);
}

main();
