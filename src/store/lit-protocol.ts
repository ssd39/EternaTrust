import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { api } from "./constants";

const chain = "ethereum";

const litClient = new LitJsSdk.LitNodeClient({
  litNetwork: LitNetwork.Cayenne,
});

async function getSessionSignatures() {
  // Connect to the wallet
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();
  console.log("Connected account:", walletAddress);

  // Get the latest blockhash
  const latestBlockhash = await litClient.getLatestBlockhash();

  // Define the authNeededCallback function
  const authNeededCallback = async (params: any) => {
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
      walletAddress: walletAddress,
      nonce: latestBlockhash,
      litNodeClient: litClient,
    });

    // Generate the authSig
    const authSig = await generateAuthSig({
      signer: signer,
      toSign,
    });

    return authSig;
  };

  /*const delegationAuthSig = await getCapacityDelegationAuthSig(
    walletAddress
  );*/

  // Define the Lit resource
  const litResource = new LitAccessControlConditionResource('*');

  // Get the session signatures
  const sessionSigs = await litClient.getSessionSigs({
      chain,
      resourceAbilityRequests: [
          {
              resource: litResource,
              ability: LitAbility.AccessControlConditionDecryption,
          },
      ],
      //switchChain: true,
      authNeededCallback,
      //capabilityAuthSigs: [delegationAuthSig],
  });
  return sessionSigs;
}

async function getCapacityDelegationAuthSig(walletAddress: string) {
  const capacityDelegationAuthSig = await (await fetch(
    `${api}/capacityTokenIdStr`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: walletAddress })
    }
  )).json();
  return capacityDelegationAuthSig;
}

export { litClient, chain, getSessionSignatures };
