"use client";

import React, { useEffect } from "react";

export default function logout() {
  useEffect(() => {
    window.location.replace("/")
  }, []);
  return <div></div>;
}
