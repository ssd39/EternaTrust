const {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitActionResource,
} = require("@lit-protocol/auth-helpers");

const { LitNetwork } = require("@lit-protocol/constants");
const LitJsSdk = require("@lit-protocol/lit-node-client");

const chain = "ethereum";
const notifyBeneficiaryLitAction =
  "QmTgq2yc6zZ5arXxjpU7pw4Fj1wLNGXmvwYUxJLAkkJkFt";
const litClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: LitNetwork.Cayenne,
  debug: true,
});

async function getSessionSignatures(ethWallet) {
  // Get the latest blockhash
  const latestBlockhash = await litClient.getLatestBlockhash();

  // Define the authNeededCallback function
  const authNeededCallback = async (params) => {
    if (!params.uri) {
      throw new Error("uri is required");
    }
    if (!params.expiration) {
      throw new Error("expiration is required");
    }

    if (!params.resourceAbilityRequests) {
      throw new Error("resourceAbilityRequests is required");
    }

    // Create the SIWE message
    const toSign = await createSiweMessageWithRecaps({
      uri: params.uri,
      expiration: params.expiration,
      resources: params.resourceAbilityRequests,
      walletAddress: ethWallet.address,
      nonce: latestBlockhash,
      litNodeClient: litClient,
    });

    // Generate the authSig
    const authSig = await generateAuthSig({
      signer: ethWallet,
      toSign,
    });

    return authSig;
  };

  /*const delegationAuthSig = await getCapacityDelegationAuthSig(
      walletAddress
    );*/

  // Define the Lit resource
  const litResource = new LitAccessControlConditionResource("*");

  // Get the session signatures
  const sessionSigs = await litClient.getSessionSigs({
    chain,
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LitAbility.AccessControlConditionDecryption,
      },
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    //switchChain: true,
    authNeededCallback,
    //capabilityAuthSigs: [delegationAuthSig],
  });
  return sessionSigs;
}

const getSettingsAccessControlCondition = (address) => {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address,
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37",
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":currentActionId"],
      returnValueTest: {
        comparator: "=",
        value: "<your ipfs id>",
      },
    },
  ];
};

async function genAuthSig(ethersSigner) {
  const toSign = await createSiweMessageWithRecaps({
    uri: "http://localhost",
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
    walletAddress: await ethersSigner.getAddress(),
    nonce: await litClient.getLatestBlockhash(),
    litNodeClient: litClient,
  });

  return await generateAuthSig({
    signer: ethersSigner,
    toSign,
  });
}

const getWillDataAccessControlCondition = (address, benificiery) => {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address,
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: benificiery,
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37",
      },
    },
  ];
};

module.exports = {
  getSessionSignatures,
  litClient,
  getSettingsAccessControlCondition,
  chain,
  genAuthSig,
  getWillDataAccessControlCondition,
  notifyBeneficiaryLitAction,
};
