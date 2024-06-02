"use client";

import { client } from "@/store/graphql";
import {
  getSessionSignatures,
  getWillDataAccessControlCondition,
  litClient,
  chain,
} from "@/store/lit-protocol";
import { gql } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchWill, login } from "@/store/wallet";

export default function page({ params }: any) {
  const [isLoading, setLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const willId = params.willId;
  const ownerAddr = params.address;
  const willData = useAppSelector((state) => state.wallet.willData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isConnected) {
      setLoading(true);
      (async () => {
        try {
          await dispatch(
            fetchWill({
              willId,
              ownerAddr,
            })
          );
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      })();
    }
  }, [isConnected]);

  useEffect(() => {
    console.log(willData);
  }, [isLoading]);

  return (
    <div className="p-4 w-full">
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center mt-4">
          <span className="text-xl">
            Please connect wallet to unlock the will details!
          </span>
          <button
            onClick={async () => {
              if (isLoading) {
                return;
              }
              setLoading(true);
              if (window.ethereum) {
                // res[0] for fetching a first wallet
                const accounts = await window.ethereum.request({
                  method: "eth_requestAccounts",
                });
                await dispatch(login(accounts[0]));
                setAccount(accounts[0]);
                setConnected(true);
              } else {
                toast.error("install metamask extension!!", {
                  position: "top-right",
                  autoClose: 5000,

                  theme: "dark",
                });
              }
              setLoading(false);
            }}
            className="gradient-bg p-2 px-4 mt-4 rounded-md font-semibold active:scale-90"
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              <span>Connect wallet</span>
            )}
          </button>
        </div>
      ) : (
        <>
          <span className="text-xl font-bold">
            You received Will from {ownerAddr}
          </span>
          <div className="mt-2">
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <div className="mt-2 flex flex-col p-2 border rounded-md">
                  <span className="text-lg font-bold">Message:</span>
                  <span className="text-lg">{willData.message || ""}</span>
                </div>
                <span className="text-lg font-bold mt-4">
                  Assets attached in will:{" "}
                </span>
                {willData?.willData?.map((val, i) => {
                  return (
                    <div key={i}>
                      <div className="mt-2 flex flex-col p-2 border rounded-md">
                        <span className="text-lg font-bold">
                          #{i + 1} Document:
                        </span>
                        <span className="text-lg">
                          <span className="italic">IPFS Hash:</span>
                          {val.assetData || ""}
                        </span>
                        <div>
                        <button
                          onClick={() => {}}
                          className="gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
                        >
                          Download
                        </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
