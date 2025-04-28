"use client";
import HomeWithSession from "./HomeWithSession";
import MobileHomeKorean from "./mobile-home-korean";
import { useEffect, useState } from "react";

function isMobile() {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function HomeEntryPoint() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (mobile) {
    return <MobileHomeKorean />;
  }
  return <HomeWithSession />;
}
