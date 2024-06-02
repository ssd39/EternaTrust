import React from "react";

export default function page() {
  return (
    <div className="flex items-center w-full flex-col p-4">
      <span className="text-2xl font-bold">Welcome back!</span>
      <span className="text-xl mt-2">Good to see you back.I hope you come again to rsvp here forever!</span>
      <button className="mt-2 gradient-bg p-2 px-4 rounded-md font-semibold active:scale-90">
        RSVP
      </button>
    </div>
  );
}
