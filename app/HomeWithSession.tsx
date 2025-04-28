"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MobileHomeKorean from "./mobile-home-korean";

export default function HomeWithSession() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/onboarding");
    }
  }, [status, router]);

  if (status === "loading") return <div className="p-8 text-center text-violet-500">로딩 중...</div>;
  if (!session) return null;

  return <MobileHomeKorean />;
}
