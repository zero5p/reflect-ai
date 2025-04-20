"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NewSchedulePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("일정이 저장되었습니다! (실제 저장은 추후 구현)");
      router.push("/schedule");
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Button color="gray" size="sm" onClick={() => router.back()} className="mb-6 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> 돌아가기
      </Button>
      <Card color="white" rounded shadow className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">새 일정 추가</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="일정 제목"
            className="border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-mint-300"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-mint-300"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="상세 설명 (선택)"
            className="border rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-mint-300 min-h-[100px]"
          />
          <Button color="mint" size="md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : "일정 저장하기"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
