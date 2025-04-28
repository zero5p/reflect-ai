"use client";
// Next.js dynamic export: 빌드타임 프리렌더 방지
export const dynamic = "force-dynamic";

import HomeEntryPoint from "./HomeEntryPoint";

export default function Page() {
  return <HomeEntryPoint />;
}
