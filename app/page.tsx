// Next.js dynamic export: 빌드타임 프리렌더 방지
export const dynamic = "force-dynamic";

import HomeWithSession from "./HomeWithSession";

export default function Page() {
  "use client";
  return <HomeWithSession />;
}
