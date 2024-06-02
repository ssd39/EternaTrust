"use client";

import { HeroHighlight } from "@/components/ui/hero-highlight";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { ethers } from "ethers";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { fetchSettings, login } from "@/store/wallet";

const people = [
  {
    id: 1,
    name: "Lit Protocol",
    designation: "",
    image: "/LIT.png",
  },
  {
    id: 2,
    name: "IPFS",
    designation: "",
    image: "/IPFS.png",
  },
  {
    id: 3,
    name: "Fleek",
    designation: "",
    image: "/fleek.ico",
  },
  {
    id: 4,
    name: "BlockChain",
    designation: "",
    image: "/blockchain.png",
  },
];

const words = [
  "Tokens",
  "NFTs",
  "Digital Documents",
  "Digital Assets",
  "Secrets",
  "Private Keys",
];

export default function Home() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <main className="flex min-h-screen select-none">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[50%]">
          <div>
            <div className="text-4xl font-bold">
              Willify <FlipWords words={words} />
            </div>
            <div className="mt-4">
              <span className="text-lg">
                Automate Asset Transfers, Secure Document Delivery, and On-Chain
                Transactions with Our Digital "Will" Platform in Most Secure
                Manner by Utilising Decentralised TEE.
              </span>
            </div>
          </div>
          <div className="mt-4">
            <span className="font-bold text-xl">Powered With The Best</span>
            <div className="flex mt-2">
              <AnimatedTooltip items={people} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex ">
        <HeroHighlight className="p-2">
          <div className="flex flex-col">
            <span className="text-5xl font-bold font-[IdentifyDemoRegular]">
              EternaTrust
            </span>
            <div className="mt-6">
              {isLoading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
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
                      await dispatch(fetchSettings());
                      router.push("/dashboard");
                    } else {
                      toast.error("install metamask extension!!", {
                        position: "top-right",
                        autoClose: 5000,

                        theme: "dark",
                      });
                    }
                    setLoading(false);
                  }}
                  className="gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
                >
                  Launch dApp
                </button>
              )}
            </div>
          </div>
        </HeroHighlight>
      </div>
    </main>
  );
}
