"use client";
// Next.js dynamic export: 빌드타임 프리렌더 방지
export const dynamic = "force-dynamic";

import HomeWithSession from "./HomeWithSession";
import MobileHomeKorean from "./mobile-home-korean";
import { useEffect, useState } from "react";

function isMobile() {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function Page() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (mobile) {
    return <MobileHomeKorean />;
  }
  return <HomeWithSession />;
}
