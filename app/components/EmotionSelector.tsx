"use client";

import { useState } from "react";

type Emotion = {
  name: string;
  emoji: string;
  color: string;
};

type EmotionSelectorProps = {
  onChange: (emotion: string) => void;
};

export default function EmotionSelector({ onChange }: EmotionSelectorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const emotions: Emotion[] = [
    { name: "기쁨", emoji: "😄", color: "bg-yellow-100" },
    { name: "슬픔", emoji: "😢", color: "bg-blue-100" },
    { name: "화남", emoji: "😠", color: "bg-red-100" },
    { name: "평온", emoji: "😌", color: "bg-green-100" },
    { name: "불안", emoji: "😰", color: "bg-purple-100" },
    { name: "지루함", emoji: "😑", color: "bg-gray-100" },
  ];

  const handleSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName);
    onChange(emotionName);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {emotions.map((emotion) => (
        <button
          key={emotion.name}
          type="button"
          className={`p-3 rounded-lg ${emotion.color} flex flex-col items-center justify-center ${
            selectedEmotion === emotion.name ? "ring-2 ring-indigo-500" : ""
          }`}
          onClick={() => handleSelect(emotion.name)}
        >
          <span className="text-2xl">{emotion.emoji}</span>
          <span className="text-sm mt-1">{emotion.name}</span>
        </button>
      ))}
    </div>
  );
}
