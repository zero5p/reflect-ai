'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookText, ChevronLeft, Clock, AlertCircle } from 'lucide-react';
import EmotionSelector from '../../components/EmotionSelector';

export default function NewReflectionPage() {
  const [formData, setFormData] = useState({
    content: '',
    emotion: '',
  });
  
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFormData({ ...formData, content: text });
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };
  
  const handleEmotionChange = (emotion: string) => {
    setFormData({ ...formData, emotion });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.content.trim() === '') {
      alert('성찰 내용을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    // 모의 저장 시뮬레이션
    setTimeout(() => {
      console.log('저장된 성찰:', formData);
      
      // 폼 초기화
      setFormData({ content: '', emotion: '' });
      setIsSubmitting(false);
      
      alert('성찰이 저장되었습니다!');
    }, 1000);
  };
  
  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/reflection" 
          className="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          성찰 목록으로
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-indigo-100 w-10 h-10 flex items-center justify-center mr-3">
            <BookText className="h-5 w-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold">새로운 성찰 기록하기</h1>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 font-medium">지금은 성찰하기 좋은 시간이에요.</p>
              <p className="text-xs text-gray-600">하루를 돌아보며 느낀 감정과 생각을 자유롭게 기록해보세요.</p>
            </div>
          </div>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 mb-1">
              오늘의 성찰
            </label>
            <textarea
              id="reflection"
              name="reflection"
              rows={6}
              value={formData.content}
              onChange={handleContentChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none"
              placeholder="오늘 어떤 일이 있었나요? 어떤 감정을 느꼈나요? 어떤 생각이 들었나요?"
              required
            ></textarea>
            <div className="mt-1 text-xs text-gray-500 flex justify-between items-center">
              <span>{wordCount} 단어</span>
              <span className={wordCount < 10 ? 'text-amber-600' : 'text-green-600'}>
                {wordCount < 10 ? (
                  <span className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    더 자세히 적을수록 좋아요
                  </span>
                ) : (
                  '좋은 분량이에요!'
                )}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지금 기분은 어떤가요?
            </label>
            <EmotionSelector onChange={handleEmotionChange} />
          </div>

          <div className="border-t pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-white font-medium ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  저장 중...
                </>
              ) : (
                '성찰 저장하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}