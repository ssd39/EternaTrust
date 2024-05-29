"use client";

import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function OnBoard() {
  const [rsvpType, setRsvpType] = useState(0);
  const [coolDownType, setCoolDownType] = useState(0);
  const [day, setDay] = useState(0);
  const [date, setDate] = useState(0);
  const [hour, setHr] = useState(0);
  const [minuite, setMinuite] = useState(0);
  const [hourA, setHrA] = useState(0);
  const [minuiteA, setMinuiteA] = useState(0);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 select-none">
      <span className="text-xl font-semibold mb-2">Welcome to</span>
      <span className="text-2xl font-bold font-[IdentifyDemoRegular]">
        EternaTrust
      </span>
      <div className="border rounded-md w-[50%] p-6 mt-14">
        <span className="text-xl font-semibold">
          ⚙️ Let's configure your prefrences
        </span>
        <div className="mt-4">
          <span className="text-lg">Mode of notification:</span>
          <div className="text-lg ">
            <div>
              <input
                type="checkbox"
                id="mode-email"
                name="mode-email"
                checked
              />
              <label for="mode-email">Email</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="mode-email"
                name="mode-email"
                disabled
                checked={false}
              />
              <label for="mode-email">Discord (Comming Soon)</label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg">Email Address:</span>
          <div>
            <input
              type="email"
              className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg">RSVP Schedule:</span>
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
                  value={rsvpType}
                  onChange={(e) => setRsvpType(e.target.value)}
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
              type="email"
              className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
              placeholder="Hour"
            />
            <span className="text-lg font-semibold mx-2">:</span>
            <input
              type="email"
              className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
              placeholder="Minute"
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-lg">Execute will if:</span>
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
                type="email"
                className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
                placeholder="Hour"
              />
              <span className="text-lg font-semibold mx-2">:</span>
              <input
                type="email"
                className="bg-black border px-2 p-1 rounded-lg outline-none focus:border-[#0093E9]"
                placeholder="Minute"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
