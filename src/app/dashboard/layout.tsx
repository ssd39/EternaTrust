"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LogoutIcon from "@mui/icons-material/Logout";
import WalletIcon from "@mui/icons-material/Wallet";
import SettingsIcon from "@mui/icons-material/Settings";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const menuItems = [
    {
      name: "My Wills",
      path: "/dashboard/manage-wills",
      icon: <HistoryEduIcon />,
    },
    {
      name: "Manage Assets",
      path: "/dashboard/manage-assets",
      icon: <AttachFileIcon />,
    },
    {
      name: "Manage Wallets",
      path: "/dashboard/manage-wallets",
      icon: <WalletIcon />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <SettingsIcon />,
    },
    {
      name: "Logout",
      path: "/dashboard/logout",
      icon: <LogoutIcon />,
    },
  ];
  const [activeMenu, setActiveMenu] = useState("");
  useEffect(() => {
    setActiveMenu(menuItems[0].name);
    router.push(menuItems[0].path);
  }, []);
  return (
    <div className="flex flex-col p-4 min-h-screen select-none">
      <div className="mb-4 px-4 w-full min-h-[64px] elevated-shadow rounded-lg flex items-center justify-between">
        <span className="text-2xl font-bold font-[IdentifyDemoRegular]">
          EternaTrust
        </span>
        <div>
          <span className="text-lg font-bold"><span className="text-[#0093E9]">Hi,</span> 0x2123...09388</span>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="w-[220px] mr-4 p-2 py-4 elevated-shadow rounded-lg">
          {menuItems.map((val, i) => {
            return activeMenu == val.name ? (
              <div className="text-white rounded-md p-2 mb-4 gradient-bg text-lg font-bold cursor-pointer">
                {val.icon}
                <span className="ml-5">{val.name}</span>
              </div>
            ) : (
              <div
                onClick={() => {
                  setActiveMenu(val.name);
                  router.push(val.path);
                }}
                className="text-white rounded-md p-2 mb-4 hover:border border-[rgba(255,255,255,0.3)] active:scale-90 text-lg font-semibold cursor-pointer"
              >
                <span>{val.icon}</span>
                <span className="ml-5">{val.name}</span>
              </div>
            );
          })}
        </div>
        <div className="flex-1 flex flex-col p-2">{children}</div>
      </div>
    </div>
  );
}
