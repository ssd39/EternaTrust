require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");
const cors = require("cors");
const ethers = require("ethers");
const { gql } = require("@apollo/client");
const crypto = require("crypto");
const { client } = require("./graphql");
const { sendEmail } = require("./azure");
const { downloadJsonFile } = require("./ipfs");
const {
  getSessionSignatures,
  litClient,
  getSettingsAccessControlCondition,
  chain,
  genAuthSig,
  notifyBeneficiaryLitAction,
  getWillDataAccessControlCondition,
} = require("./lit-protocol-helper");
const LitJsSdk = require("@lit-protocol/lit-node-client");
const  fs = require("fs");

globalThis.crypto = crypto;

const app = express();
const port = process.env.PORT || 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const provider = new ethers.providers.JsonRpcProvider(
  "https://chain-rpc.litprotocol.com/http"
);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/rsvp-trigger", async (req, res) => {
  (async () => {
    try {
      const result = await client.query({
        query: gql`
          query Settings {
            settingsUpdateds(orderBy: blockNumber, orderDirection: desc) {
              ipfsHash
              user
            }
          }
        `,
      });
      console.log(result);
      const userMap = {};
      const settings = result.data.settingsUpdateds;
      for (let setting of settings) {
        try {
          if (!userMap.hasOwnProperty(setting.user)) {
            userMap[setting.user] = true;
            const ipfsHash = setting.ipfsHash;
            // TODO:
            // call lit action to decrypt it and send the email in setting (to send rsvp in privacy manner)
            // lit action will also verify that rsvp needed or not otherwise it will rejcet the request

            const data = await downloadJsonFile(ipfsHash);

            const sessionSigs = await getSessionSignatures(wallet);

            const accessControlConditions = getSettingsAccessControlCondition(
              setting.user
            );

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
            const settingsData = JSON.parse(decryptedString);
            const emailPayload = {
              content: {
                subject: "ETERNA TRUST - RSVP pending",
                plainText:
                  "Please use given link to rsvp: https://eternatrust.on-fleek.app/rsvp",
              },
              recipients: {
                to: [{ address: settingsData.email }],
              },
            };

            const result = await sendEmail(emailPayload);
            console.log("sendEmail", result);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }

    //TODO: add logic to fetch the wills and filter wills which needs rsvp and then
    // use above encrypted setting for that user to send email using lit-actions
  })();
  res.json({ ok: true });
});

app.get("/will-beneficiary-trigger", async (req, res) => {
  //
  (async () => {
    try {
      const result = await client.query({
        query: gql`
          query Wills {
            willCreateds(orderBy: blockNumber, orderDirection: desc) {
              blockTimestamp
              willId
              transactionHash
              willData
              schedule
              creator
            }
          }
        `,
      });

      const wills = result.data.willCreateds;
      for (let will of wills) {
        try {
          //TODO:
          // check if will is unlocked or not by using scedule and last rsvp timestamp data
          // if not then only send email
          // for now calling directly without checking the rsvp data
        
         console.log("will", will)
          const data = await downloadJsonFile(will.willData);
          const sessionSigs = await getSessionSignatures(wallet);
          const accessControlConditions =  getWillDataAccessControlCondition(will.creator, data.bAddress)
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
          const willData = JSON.parse(decryptedString)
          const emailPayload = {
            content: {
              subject: "ETERNA TRUST - You received a will!",
              plainText:
                `Please use given link to unlock the will: https://eternatrust.on-fleek.app/will?ownerAddr=${will.creator}&willId=${will.willId}`,
            },
            recipients: {
              to: [{ address: willData.bEmail }],
            },
          };
          const result = await sendEmail(emailPayload);
          console.log("unlockWill:sendEmail", result);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }

    //TODO: add logic to fetch the wills and filter wills which needs rsvp and then
    // use above encrypted setting for that user to send email using lit-actions
  })();
  res.json({ ok: true });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Get the file buffer
    const fileBuffer = req.file.buffer;

    const ipfsRes = await (
      await fetch(process.env.IPFS_SERVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({ code: fileBuffer }),
      })
    ).json();

    res.json(ipfsRes);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.post("/capacityTokenIdStr", async (req, res) => {
  try {
    const address = req.body.address;
    console.log("delegateeAddresses", address);
    const { capacityDelegationAuthSig } =
      await litClient.createCapacityDelegationAuthSig({
        uses: "1",
        dAppOwnerWallet: wallet,
        capacityTokenId: "1924",
        delegateeAddresses: [address],
      });
    res.json({ capacityDelegationAuthSig });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.post("/upload/json", async (req, res) => {
  try {
    const data = req.body;
    const ipfsRes = await (
      await fetch(process.env.IPFS_SERVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({ code: JSON.stringify(data) }),
      })
    ).json();

    res.json(ipfsRes);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

app.listen(port, "0.0.0.0", async () => {
  await litClient.connect();
  console.log(`Example app listening on port ${port}`);
  console.log(wallet.address);
});
