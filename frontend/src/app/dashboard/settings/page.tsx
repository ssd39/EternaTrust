"use client";

import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSettings, updateSettings } from "@/store/wallet";

export default function Settings() {
  const [rsvpType, setRsvpType] = useState(0);
  const [coolDownType, setCoolDownType] = useState(0);
  const [rsvpProtection, setRsvpProtection] = useState(0);
  const [day, setDay] = useState(0);
  const [hour, setHr] = useState("");
  const [email, setEmail] = useState("");
  const [minuite, setMinuite] = useState("");
  const [hourA, setHrA] = useState("");
  const [minuiteA, setMinuiteA] = useState("");
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const settingsData = useAppSelector((state) => state.wallet.settings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, []);

  useEffect(() => {
    if (settingsData?.rsvpData?.rsvpType) {
      setRsvpType(settingsData?.rsvpData?.rsvpType == "Daily" ? 0 : 1);
      setDay(settingsData.rsvpData.day);
      setHr(settingsData.rsvpData.hour);
      setMinuite(settingsData.rsvpData.minuite);
      setEmail(settingsData.email);
    }
  }, [settingsData]);

  return (
    <div>
      <div>
        <div className="mt-4">
          <span className="text-lg font-semibold">Mode of notification:</span>
          <div className="text-lg ">
            <div>
              <input
                type="checkbox"
                id="mode-email"
                name="mode-email"
                readOnly
                checked
              />
              <label for="mode-email">Email</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="mode-email"
                readOnly
                name="mode-email"
                disabled
                checked={false}
              />
              <label for="mode-email">Discord (Coming Soon)</label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg font-semibold">Email Address:</span>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg font-semibold">RSVP Schedule:</span>
          <div className="my-2">
            <FormControl>
              <Select
                sx={{
                  color: "white",
                  ".MuiSelect-select": {
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  },
                  "&:hover": {
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  ".MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
                value={rsvpType}
                onChange={(e) => setRsvpType(e.target.value)}
              >
                <MenuItem value={0}>Daily</MenuItem>
                <MenuItem value={1}>Weekly</MenuItem>
              </Select>
            </FormControl>
            {rsvpType == 1 && (
              <FormControl sx={{ marginLeft: 1 }}>
                <Select
                  sx={{
                    color: "white",
                    ".MuiSelect-select": {
                      paddingTop: "5px",
                      paddingBottom: "5px",
                    },
                    "&:hover": {
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    ".MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  <MenuItem value={0}>Sunday</MenuItem>
                  <MenuItem value={1}>Monday</MenuItem>
                  <MenuItem value={2}>Tuseday</MenuItem>
                  <MenuItem value={3}>Wednesday</MenuItem>
                  <MenuItem value={4}>Thursday</MenuItem>
                  <MenuItem value={5}>Friday</MenuItem>
                  <MenuItem value={6}>Saturday</MenuItem>
                </Select>
              </FormControl>
            )}
          </div>
          <div>
            <input
              type="number"
              value={hour}
              onChange={(e) => setHr(e.target.value)}
              className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
              placeholder="Hour"
            />
            <span className="text-lg font-semibold mx-2">:</span>
            <input
              type="number"
              value={minuite}
              onChange={(e) => setMinuite(e.target.value)}
              className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
              placeholder="Minute"
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg font-semibold">Execute will if:</span>
          <div className="flex items-center">
            <span className="mr-2">RSVP not answered till - </span>
            <FormControl>
              <Select
                sx={{
                  color: "white",
                  ".MuiSelect-select": {
                    paddingTop: "5px",
                    paddingBottom: "5px",
                  },
                  "&:hover": {
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  ".MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
                value={coolDownType}
                onChange={(e) => setCoolDownType(e.target.value)}
              >
                <MenuItem value={0}>next rsvp</MenuItem>
                <MenuItem value={1}>following timeline</MenuItem>
              </Select>
            </FormControl>
          </div>
          {coolDownType == 1 && (
            <div className="mt-2">
              <input
                type="number"
                value={hourA}
                onChange={(e) => setHrA(e.target.value)}
                className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
                placeholder="Hour"
              />
              <span className="text-lg font-semibold mx-2">:</span>
              <input
                type="number"
                value={minuiteA}
                onChange={(e) => setMinuiteA(e.target.value)}
                className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
                placeholder="Minute"
              />
            </div>
          )}
        </div>
        {false && (
          <div className="mt-4">
            <span className="text-lg font-semibold">
              RSVP protection method:
            </span>
            <div>
              <FormControl>
                <Select
                  sx={{
                    color: "white",
                    ".MuiSelect-select": {
                      paddingTop: "5px",
                      paddingBottom: "5px",
                    },
                    "&:hover": {
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    ".MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  value={rsvpProtection}
                  onChange={(e) => setRsvpProtection(e.target.value)}
                >
                  <MenuItem value={0}>Password protected</MenuItem>
                  <MenuItem value={1}>Wallet base</MenuItem>
                  <MenuItem value={2}>Rotating question</MenuItem>
                </Select>
              </FormControl>
            </div>
            {rsvpProtection == 0 && (
              <div className="mt-2">
                <div>
                  <label for="mode-email">Password</label>
                </div>
                <input
                  type="password"
                  id="mode-rsvp-protection"
                  name="mode-rsvp-protection"
                  className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
                />
              </div>
            )}
            {rsvpProtection != 0 && (
              <span>Currently only password mode supported</span>
            )}
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={async () => {
              if (isLoading) {
                return;
              }
              setLoading(true);
              await dispatch(
                updateSettings({
                  email,
                  rsvpData: {
                    rsvpType: rsvpType == 0 ? "Daily" : "Weekly",
                    day,
                    hour,
                    minuite,
                  },
                })
              );
              setLoading(false);
            }}
            className="gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90"
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
