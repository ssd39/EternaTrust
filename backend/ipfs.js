const fetch = require("node-fetch");

const downloadJsonFile = async (ipfsHash) => {
  const res = await (
    await fetch(`https://lit.mypinata.cloud/ipfs/${ipfsHash}`)
  ).json();
  return res
};

module.exports = { downloadJsonFile };
