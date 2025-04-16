'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { ArrowLeft, X } from 'lucide-react';

// 감정 옵션
const moodOptions = [
  { value: '만족', color: 'bg-green-100 text-green-800' },
  { value: '활기찬', color: 'bg-yellow-100 text-yellow-800' },
  { value: '평온', color: 'bg-blue-100 text-blue-800' },
  { value: '불안', color: 'bg-red-100 text-red-800' },
  { value: '슬픔', color: 'bg-purple-100 text-purple-800' },
  { value: '혼란', color: 'bg-orange-100 text-orange-800' },
];

export default function NewReflectionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [mood, setMood] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 날짜 선택 핸들러 수정
  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !mood) {
      alert('제목, 내용, 감정 상태를 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    // 여기에 데이터베이스 저장 로직 추가 예정
    
    // 임시: 폼 제출 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/reflection');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">새 성찰 기록</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="성찰의 제목을 입력하세요"
              required
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              날짜
            </label>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              locale={ko}
              dateFormat="yyyy년 MM월 dd일"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
              감정 상태
            </label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    mood === option.value 
                      ? `${option.color} ring-2 ring-offset-1 ring-gray-500` 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              태그
            </label>
            <div className="flex">
              <input
                id="tags"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="태그를 입력하고 Enter 키를 누르세요"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-500 text-white px-3 py-2 rounded-r-md"
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t) => (
                  <div
                    key={t}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-40"
              placeholder="오늘의 생각과 감정을 자유롭게 기록해보세요..."
              required
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? '저장 중...' : '성찰 저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}