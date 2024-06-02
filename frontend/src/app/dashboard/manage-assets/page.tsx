"use client";

import React, { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

import { useAppDispatch, useAppSelector } from "@/store";
import { CircularProgress } from "@mui/material";
import { addAsset, fetchAssets } from "@/store/wallet";
export default function ManageAssets() {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);
  const assets = useAppSelector((state) => state.wallet.assets);
  useEffect(() => {
    setDataLoading(true);
    dispatch(fetchAssets()).finally(() => {
      setDataLoading(false);
    });
  }, []);
  return (
    <div className="flex flex-col">
      <div>
        <button
          onClick={async () => {
            if (isLoading) {
              return;
            }
            setLoading(true);
            await dispatch(addAsset());
            setLoading(false);
          }}
          className="gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
        >
          {!isLoading ? (
            <div>
              <AddIcon /> Add Asset
            </div>
          ) : (
            <CircularProgress sx={{ color: "white" }} />
          )}
        </button>
      </div>
      {isDataLoading && (
        <div className="my-5 w-full flex items-center justify-center">
          <CircularProgress sx={{ color: "white" }} />
        </div>
      )}
      <div className="w-full mt-4 flex flex-wrap">
        {assets.map((val, i) => {
          return (
            <div className="p-4 bg-white rounded-lg flex flex-col m-2">
              <div>
                <span className="text-white font-bold italic text-lg p-2 bg-black rounded-full">
                  #{assets.length - i}
                </span>
              </div>
              <span className="font-bold text-black mt-2">
                <span className="italic text-[#0093E9] mr-2">IPFS Hash:</span>{" "}
                {val.assetData}
              </span>
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
                <button className="mt-2 gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90">
                  <DownloadIcon /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
