"use client";

import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { addWill, fetchAssets, fetchWill, fetchWills } from "@/store/wallet";
import { useRouter } from "next/navigation";

const dropdownSx = {
  color: "black",
  ".MuiSelect-select": {
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  "&:hover": {
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
  },
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
  ".MuiSvgIcon-root": {
    color: "black",
  },
};

const weeks = [
  "sunday",
  "monday",
  "tuseday",
  "wednesday",
  "thursday",
  "friday",
];
const RenderSchedule = ({ schedule }: { schedule: string }) => {
  const sObj: any = JSON.parse(schedule);
  return (
    <>
      {sObj.rsvpType == "Daily"
        ? "Daily at " + sObj.hour + "h " + sObj.minuite + "m"
        : "Weekly on" +
          weeks[sObj.day] +
          " at " +
          sObj.hour +
          "h " +
          sObj.minuite +
          "m"}
    </>
  );
};

export default function ManageWills() {
  const [showDialog, setShowDialog] = useState(false);
  const [nItemTyp, setNitemTyp] = useState(0);
  const [message, setMessage] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bAddress, setBAddress] = useState("");
  const [addWillData, setAddWillData] = useState<Array<any>>([]);
  const [isAdding, setAdding] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const assets = useAppSelector((state) => state.wallet.assets).map(
    (val) => val.assetData
  );
  const address = useAppSelector((state) => state.wallet.address);
  const wills = useAppSelector((state) => state.wallet.wills);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAssets());

    setLoading(true);
    dispatch(fetchWills()).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Dialog
        sx={{ ".MuiPaper-root": { width: "40%" } }}
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setMessage("");
          setAddWillData([]);
          setNitemTyp(0);
          setBAddress("");
          setBEmail("");
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>New will {">"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="font-bold">Message:</span>
              <textarea
                value={message}
                className="mt-2 p-2 border  border-black rounded-md"
                placeholder="your message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex mt-1">
                <div className="flex-1 flex flex-col mr-1">
                  <span className="font-bold">Beneficiary Email</span>
                  <input
                    value={bEmail}
                    className="mt-2 p-2 border border-black rounded-md"
                    placeholder="xyz@gmail.com"
                    onChange={(e) => setBEmail(e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col ml-1">
                  <span className="font-bold">Beneficiary Wallet Address</span>
                  <input
                    value={bAddress}
                    className="mt-2 p-2 border border-black rounded-md"
                    placeholder="0x0000...0000"
                    onChange={(e) => setBAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <span className="font-bold">Assets:</span>
              <div className="mt-2">
                <FormControl>
                  <Select
                    sx={dropdownSx}
                    value={nItemTyp}
                    onChange={(e: any) => setNitemTyp(e.target.value)}
                  >
                    <MenuItem value={0}>Stored Assets</MenuItem>
                    <MenuItem value={1}>Token Send</MenuItem>
                    <MenuItem value={2}>
                      SmartContract Call (Coming soon)
                    </MenuItem>
                  </Select>
                </FormControl>
                <button
                  onClick={() => {
                    if (nItemTyp == 0) {
                      setAddWillData([
                        ...addWillData,
                        {
                          assetType: 0,
                          assetData: "",
                        },
                      ]);
                    } else if (nItemTyp == 1) {
                      setAddWillData([
                        ...addWillData,
                        {
                          assetType: 1,
                          walletKey: "",
                          walletAddress: "",
                          amount: "",
                          ttype: 0,
                          token: "",
                        },
                      ]);
                    } else {
                    }
                  }}
                  className="text-white rounded-full p-1 text-sm ml-2 bg-black active:scale-90"
                >
                  <AddIcon />
                </button>
              </div>
              <div>
                {addWillData.map((val, i) => {
                  return (
                    <div
                      key={i + "_will_assets"}
                      className="p-2 border rounded-md mt-1"
                    >
                      <div className="flex justify-between">
                        <span>#{i + 1}</span>
                        <button
                          onClick={() => {
                            setAddWillData([
                              ...addWillData.slice(0, i),
                              ...addWillData.slice(i + 1, addWillData.length),
                            ]);
                          }}
                          className="active:scale-90"
                        >
                          <DeleteIcon />
                        </button>
                      </div>

                      {val.assetType == 0 && (
                        <div className="flex flex-col">
                          <span>Stored Asset:</span>
                          <FormControl>
                            <Select
                              sx={dropdownSx}
                              value={val.assetData}
                              onChange={(e: any) => {
                                setAddWillData([
                                  ...addWillData.slice(0, i),
                                  {
                                    ...val,
                                    assetData: e.target.value,
                                  },
                                  ...addWillData.slice(
                                    i + 1,
                                    addWillData.length
                                  ),
                                ]);
                              }}
                            >
                              {assets.map((v, i) => (
                                <MenuItem key={v} value={v}>
                                  {v}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      )}
                      {val.assetType == 1 && (
                        <div className="flex flex-col">
                          <span>Token Send:</span>
                          <FormControl>
                            <Select
                              sx={dropdownSx}
                              value={val.ttype}
                              onChange={(e: any) => {
                                setAddWillData([
                                  ...addWillData.slice(0, i),
                                  {
                                    ...val,
                                    ttype: e.target.value,
                                  },
                                  ...addWillData.slice(
                                    i + 1,
                                    addWillData.length
                                  ),
                                ]);
                              }}
                            >
                              <MenuItem value={0}>Native</MenuItem>
                              <MenuItem value={1}>ERC20</MenuItem>
                              <MenuItem value={2}>NFT</MenuItem>
                            </Select>
                          </FormControl>
                          {(val.ttype == 1 || val.ttype == 2) && (
                            <>
                              <input
                                value={val.token}
                                className="mt-2 p-2 border border-black rounded-md"
                                placeholder={
                                  val.ttype == 1
                                    ? "ERC20 Address"
                                    : "NFT Address"
                                }
                                onChange={(e) =>
                                  setAddWillData([
                                    ...addWillData.slice(0, i),
                                    {
                                      ...val,
                                      token: e.target.value,
                                    },
                                    ...addWillData.slice(
                                      i + 1,
                                      addWillData.length
                                    ),
                                  ])
                                }
                              />
                            </>
                          )}
                          <span>Wallet:</span>
                          <FormControl>
                            <Select
                              sx={dropdownSx}
                              onChange={(e: any) => {}}
                            ></Select>
                          </FormControl>
                          <input
                            value={val.token}
                            className="mt-2 p-2 border border-black rounded-md"
                            placeholder="Amount"
                            onChange={(e) =>
                              setAddWillData([
                                ...addWillData.slice(0, i),
                                {
                                  ...val,
                                  amount: e.target.value,
                                },
                                ...addWillData.slice(i + 1, addWillData.length),
                              ])
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={async () => {
                  if (isAdding) {
                    return;
                  }
                  setAdding(true);

                  await dispatch(
                    addWill(
                      //@ts-ignore
                      {
                        bEmail,
                        bAddress,
                        message,
                        willData: addWillData,
                      }
                    )
                  );
                  setAdding(false);
                  setShowDialog(false);
                }}
                className="text-white gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
              >
                {isAdding ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : (
                  <>
                    <AddIcon /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <button
        onClick={() => setShowDialog(true)}
        className="gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
      >
        <AddIcon /> Add Will
      </button>
      {isLoading && (
        <div className="my-5 w-full flex items-center justify-center">
          <CircularProgress sx={{ color: "white" }} />
        </div>
      )}
      <div className="w-full mt-4 flex flex-wrap">
        {wills.map((val, i) => {
          return (
            <div className="p-4 bg-white rounded-lg flex flex-col m-2">
              <div>
                <span className="text-white font-bold italic text-lg p-2 bg-black rounded-full">
                  #Will {parseInt(val.willId) + 1}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-bold text-black mt-2">
                  <span className="italic text-[#0093E9] mr-2">
                    RSVP schedule:
                  </span>
                  <RenderSchedule schedule={val.schedule} />
                </span>
              </div>
              <span className="font-bold text-black mt-1">
                <span className="italic text-[#0093E9] mr-2">Tx Hash:</span>{" "}
                <a
                  className="underline "
                  href={`https://sepolia.etherscan.io/tx/${val.transactionHash}`}
                >
                  {val.transactionHash.slice(0, 44)}...
                </a>
              </span>
              <div className="flex justify-between mt-1">
                <span className=" text-black font-semibold">
                  <span className="italic font-bold text-[#0093E9] mr-2">
                    Added At:
                  </span>
                  {new Date(parseInt(val.blockTimestamp) * 1000).toDateString()}
                </span>
                <button
                  onClick={() => {
                    router.push(`/will/${address}/${val.willId}`);
                  }}
                  className="mt-2 gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
