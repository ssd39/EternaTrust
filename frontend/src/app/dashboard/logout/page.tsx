"use client";

import React, { useEffect } from "react";

export default function logout() {
  useEffect(() => {
    localStorage.clear()
    window.location.replace("/")
  }, []);
  return <div></div>;
}
