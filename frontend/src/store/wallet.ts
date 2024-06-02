import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import { client } from "./graphql";
import { toast } from "react-toastify";
import {
  litClient,
  getSessionSignatures,
  chain,
  getSettingsAccessControlCondition,
  getWillDataAccessControlCondition,
  getAssetDataAccessControlCondition,
  getWillAssetAccessControlCondition,
} from "./lit-protocol";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";
import abi from "./abi";
import { api, notifyBeneficiaryLitAction } from "./constants";

const contractAddress = "0xc2ae523aef1f3cc3e7fbc1d4625c5894e991a8f1";

export const fetchWills = createAsyncThunk(
  "wallet/fetchWills",
  async (arg, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;
    const result = await client.query({
      query: gql`
      query Wills {
        willCreateds(
          where: { creator: "${address}" },
          orderBy: blockNumber, orderDirection: desc
        ) {
          blockTimestamp,
          willId,
          transactionHash,
          willData,
          schedule
        }
      }
      `,
    });
    return { wills: result.data.willCreateds };
  }
);

export const addWill = createAsyncThunk(
  "wallet/addWill",
  async (arg: any, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;
    const rsvpData = state.wallet.settings.rsvpData;
    const { bEmail, bAddress, message } = arg;
    const wills = state.wills;

    const willPayload = arg.willData;
    let i = 0;
    for (let will of willPayload) {
      if (will.assetType == 0) {
        const assetData = will.assetData;
        const data = JSON.parse(
          await (
            await fetch(`https://lit.mypinata.cloud/ipfs/${assetData}`)
          ).text()
        );
        const sessionSigs = await getSessionSignatures();

        const accessControlConditions =
          getAssetDataAccessControlCondition(address);

        const decryptedString = await LitJsSdk.decryptToString(
          {
            accessControlConditions,
            chain,
            ciphertext: data.ciphertext,
            dataToEncryptHash: data.dataToEncryptHash,
            sessionSigs,
          },
          litClient
        );
        const newAccessControlConditions = getWillAssetAccessControlCondition(
          address,
          bAddress,
          "2"
        );
        const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
          {
            accessControlConditions: newAccessControlConditions,
            chain,
            sessionSigs: {},
            dataToEncrypt: decryptedString,
          },
          litClient
        );

        const fileData = { ciphertext, dataToEncryptHash, type: "file" };
        const ipfsData = await (
          await fetch(`${api}/upload/json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fileData),
          })
        ).json();
        const IpfsHash = ipfsData.IpfsHash;

        willPayload[i].assetData = IpfsHash;
      }
      i++;
    }

    const accessControlConditions = getWillDataAccessControlCondition(
      address,
      bAddress
    );
    console.log("accessControlConditions", accessControlConditions);
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        chain,
        sessionSigs: {},
        dataToEncrypt: JSON.stringify({
          willData: willPayload,
          bEmail,
          message,
          bAddress,
        }),
      },
      litClient
    );

    const willData = { ciphertext, dataToEncryptHash, bAddress };
    const ipfsData = await (
      await fetch(`${api}/upload/json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(willData),
      })
    ).json();
    const IpfsHash = ipfsData.IpfsHash;
    console.log("addWill-IPFS-hash", IpfsHash);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.createWill(IpfsHash, JSON.stringify(rsvpData));
    const receipt = await tx.wait();
    console.log("addWill:TX:", receipt);
    setTimeout(() => {
      thunkAPI.dispatch(fetchWills());
    }, 1000);
  }
);

export const fetchWill = createAsyncThunk(
  "wallet/fetchWill",
  async (arg: any, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;
    const { ownerAddr, willId } = arg;
    const result = await client.query({
      query: gql`
    query Wills {
      willCreateds(
        where: { creator: "${ownerAddr}", willId: "${willId}" },
        orderBy: blockNumber, orderDirection: desc
      ) {
        blockTimestamp,
        willId,
        transactionHash,
        willData,
        schedule
      }
    }
    `,
    });
    const will = result.data.willCreateds[0];

    const data = JSON.parse(
      await (
        await fetch(`https://lit.mypinata.cloud/ipfs/${will.willData}`)
      ).text()
    );
    const accessControlConditions = getWillDataAccessControlCondition(
      address,
      data.bAddress
    );
    const sessionSigs = await getSessionSignatures();

    const decryptedString = await LitJsSdk.decryptToString(
      {
        accessControlConditions,
        chain,
        ciphertext: data.ciphertext,
        dataToEncryptHash: data.dataToEncryptHash,
        sessionSigs,
      },
      litClient
    );
    console.log("decryptedString", decryptedString);
    return { willData: JSON.parse(decryptedString) };
   
  }
);

export const fetchAssets = createAsyncThunk(
  "wallet/fetchAssets",
  async (arg, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;
    const result = await client.query({
      query: gql`
      query Assets {
        assetAddeds(
          where: { owner: "${address}" },
          orderBy: blockNumber, orderDirection: desc
        ) {
          blockTimestamp,
          assetData,
          transactionHash
        }
      }
      `,
    });
    return { assets: result.data.assetAddeds };
  }
);

export const addAsset = createAsyncThunk(
  "wallet/addAsset",
  async (arg, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;

    let input = document.createElement("input");
    input.type = "file";
    const file = await new Promise(async (res, rej) => {
      input.onchange = (e) => {
        const file = e.target.files[0];
        res(file);
      };
      document.body.onfocus = () => {
        res();
        document.body.onfocus = null;
      };
      input.click();
    });
    if (file) {
      const accessControlConditions =
        getAssetDataAccessControlCondition(address);

      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptFile(
        {
          accessControlConditions,
          chain,
          sessionSigs: {},
          file,
        },
        litClient
      );

      const fileData = { ciphertext, dataToEncryptHash, type: "file" };
      console.log("FileData:", fileData);
      const ipfsData = await (
        await fetch(`${api}/upload/json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fileData),
        })
      ).json();
      const IpfsHash = ipfsData.IpfsHash;
      console.log("IpfsHash:", IpfsHash);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.addAsset(IpfsHash);
      const receipt = await tx.wait();
      console.log("AddAsset:TX:", receipt);
      setTimeout(() => {
        thunkAPI.dispatch(fetchAssets());
      }, 1000);
      return true;
    }
    return false;
  }
);

export const fetchSettings = createAsyncThunk(
  "wallet/fetchSettings",
  async (arg, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;

    const result = await client.query({
      query: gql`
        query GetSettings {
          settingsUpdateds(
            where: { user: "${address}" },
            orderBy: blockNumber, orderDirection: desc
          ) {
            ipfsHash
          }
        }
      `,
    });
    if (result.data.settingsUpdateds.length <= 0) {
      return { settings: {}, isInit: false };
    }

    const ipfsHash = result.data.settingsUpdateds[0].ipfsHash;
    const data = JSON.parse(
      await (await fetch(`https://lit.mypinata.cloud/ipfs/${ipfsHash}`)).text()
    );
    const sessionSigs = await getSessionSignatures();
    console.log("SessionSigs:", sessionSigs);

    const accessControlConditions = getSettingsAccessControlCondition(address);

    const decryptedString = await LitJsSdk.decryptToString(
      {
        accessControlConditions,
        chain,
        ciphertext: data.ciphertext,
        dataToEncryptHash: data.dataToEncryptHash,
        sessionSigs,
      },
      litClient
    );
    console.log("decryptedString", decryptedString);
    return { settings: JSON.parse(decryptedString), isInit: true };
  }
);

export const login: any = createAsyncThunk(
  "wallet/login",
  async (arg, thunkAPI: any) => {
    await litClient.connect();
    return { address: arg };
  }
);

export const updateSettings = createAsyncThunk(
  "wallet/updateSettings",
  async (arg: { email: string; rsvpData: Object }, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const address = state.wallet.address;

    const email = arg.email;
    const rsvpData = arg.rsvpData;

    const accessControlConditions = getSettingsAccessControlCondition(address);

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        chain,
        sessionSigs: {},
        dataToEncrypt: JSON.stringify({ email, rsvpData }),
      },
      litClient
    );

    const settingsData = { ciphertext, dataToEncryptHash };
    const ipfsData = await (
      await fetch(`${api}/upload/json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      })
    ).json();
    const IpfsHash = ipfsData.IpfsHash;
    console.log("settings-IPFS-hash", IpfsHash);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.updateSettings(IpfsHash);
    const receipt = await tx.wait();
    console.log("UpdateSettings:TX:", receipt);
    setTimeout(() => {
      thunkAPI.dispatch(fetchSettings());
    }, 1000);
  }
);

export interface IState {
  address: string;
  isInit: boolean;
  settings: Object;
  assets: Array<{
    blockTimestamp: string;
    assetData: string;
    transactionHash: string;
  }>;
  wills: Array<{
    blockTimestamp: string;
    willId: string;
    transactionHash: string;
    willData: string;
    schedule: string;
  }>;
  willData: Object;
}

const initialState: IState = {
  address: "",
  isInit: false,
  settings: {},
  assets: [],
  wills: [],
  willData: {},
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchWill.fulfilled, (state, action) => {
      state.willData = action.payload.willData;

    });

    builder.addCase(fetchWill.rejected, (state, action) => {
      console.error("Error while fetching will!", action.error);
    });

    builder.addCase(fetchWills.fulfilled, (state, action) => {
      state.wills = action.payload.wills;
    });

    builder.addCase(fetchWills.rejected, (state, action) => {
      console.error("Error while fetching wills!", action.error);
    });

    builder.addCase(addWill.fulfilled, (state, action) => {
      toast.success("Will created sucessfully!");
    });

    builder.addCase(addWill.rejected, (state, action) => {
      console.error("Error while executing addwWill!", action.error);
      toast.error("Error occured while creating new will!");
    });

    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      state.assets = action.payload.assets;
    });

    builder.addCase(fetchAssets.rejected, (state, action) => {
      console.error("Error while fetching assets!", action.error);
    });

    builder.addCase(addAsset.fulfilled, (state, action) => {
      if (action.payload) {
        toast.success("Asset added sucessfully!");
      }
    });

    builder.addCase(addAsset.rejected, (state, action) => {
      toast.error("Failed to add asset!");
      console.error("addAsset", action.error);
    });

    builder.addCase(login.fulfilled, (state, action: { payload: any }) => {
      state.address = action.payload.address;
    });

    builder.addCase(login.rejected, (state, action) => {
      console.error("LIT protocol connect error!", action.error);
      toast.error("Error while connecting to LIT protocol!");
    });

    builder.addCase(updateSettings.fulfilled, (state, action) => {
      toast.success("Settings updated!");
    });

    builder.addCase(updateSettings.rejected, (state, action) => {
      console.error("Error occured while updating settings!", action.error);
      toast.error("Error while updating settings!");
    });

    builder.addCase(
      fetchSettings.fulfilled,
      (state, action: { payload: any }) => {
        // Add user to the state array
        state.settings = action.payload.settings;
        state.isInit = action.payload.isInit;
      }
    );

    builder.addCase(fetchSettings.rejected, (state, action) => {
      console.error("Error while fetching settings!", action.error);
      toast.error("Error occured while fetching settings!");
    });
  },
});

export const walletReducer = walletSlice.reducer;
