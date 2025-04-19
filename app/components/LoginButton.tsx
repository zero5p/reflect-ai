"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const sessionHook = useSession();
  const data = sessionHook?.data;
  const status = sessionHook?.status;

  if (status === "loading") {
    return <button disabled>로딩 중...</button>;
  }

  if (data) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{data.user?.email} 님 환영합니다!</span>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn("google")}>구글로 로그인</button>
  );
}
