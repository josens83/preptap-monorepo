"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge } from "@preptap/ui";

// Sample blog posts - in production, this would come from a CMS
const BLOG_POSTS = [
  {
    id: "1",
    title: "AI 적응형 학습이란? PrepTap의 핵심 기술 소개",
    slug: "ai-adaptive-learning-explained",
    excerpt: "PrepTap이 어떻게 AI를 활용하여 개인 맞춤형 학습을 제공하는지 알아보세요. 협업 필터링, 난이도 조절, 약점 분석까지 상세히 설명합니다.",
    category: "기술",
    author: "PrepTap 팀",
    date: "2024-11-15",
    readTime: "5분",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  },
  {
    id: "2",
    title: "간격 반복 학습(Spaced Repetition)으로 장기 기억 만들기",
    slug: "spaced-repetition-guide",
    excerpt: "과학적으로 입증된 SM-2 알고리즘이 어떻게 당신의 기억력을 향상시키는지, 그리고 PrepTap이 이를 어떻게 자동화했는지 알아보세요.",
    category: "학습 팁",
    author: "김학습",
    date: "2024-11-10",
    readTime: "7분",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  },
  {
    id: "3",
    title: "2024 TOEIC 최신 출제 경향 분석",
    slug: "toeic-2024-trends",
    excerpt: "2024년 TOEIC 시험의 새로운 출제 경향과 대비 전략을 상세히 분석합니다. RC, LC 파트별 변화와 효과적인 준비 방법을 확인하세요.",
    category: "시험 정보",
    author: "이영어",
    date: "2024-11-05",
    readTime: "10분",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
  },
  {
    id: "4",
    title: "PrepTap 11월 업데이트: 오답노트 기능 대폭 개선",
    slug: "november-2024-update",
    excerpt: "이번 달 업데이트에서는 오답노트 UI를 전면 개선하고, 태그 기반 필터링 기능을 추가했습니다. 더욱 효율적인 복습이 가능해집니다.",
    category: "업데이트",
    author: "PrepTap 팀",
    date: "2024-11-01",
    readTime: "3분",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: "5",
    title: "3개월 만에 TEPS 200점 올린 김준호 님의 학습 후기",
    slug: "teps-success-story-junho",
    excerpt: "PrepTap의 AI 적응형 학습으로 TEPS 500점대에서 700점대로 도약한 김준호 님의 생생한 학습 경험과 꿀팁을 공유합니다.",
    category: "성공 사례",
    author: "김준호",
    date: "2024-10-28",
    readTime: "6분",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  },
  {
    id: "6",
    title: "효율적인 오답노트 활용법: 틀린 문제를 나의 무기로",
    slug: "how-to-use-wrong-answer-notebook",
    excerpt: "단순히 틀린 문제를 모으는 것을 넘어, 오답노트를 진짜 실력 향상의 도구로 만드는 5가지 전략을 소개합니다.",
    category: "학습 팁",
    author: "박효율",
    date: "2024-10-20",
    readTime: "8분",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  },
  {
    id: "7",
    title: "수능 영어 1등급을 위한 전략적 학습 로드맵",
    slug: "suneung-english-roadmap",
    excerpt: "수능 영어 1등급 달성을 위한 단계별 학습 계획과 PrepTap 활용 전략을 공유합니다. 남은 기간 효율적으로 준비하세요.",
    category: "시험 정보",
    author: "이수능",
    date: "2024-10-15",
    readTime: "12분",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  },
  {
    id: "8",
    title: "PrepTap 베타 출시! 여러분의 피드백을 기다립니다",
    slug: "beta-launch-announcement",
    excerpt: "드디어 PrepTap 베타 버전을 공개합니다. 초기 사용자 분들께 특별한 혜택을 드리며, 여러분의 소중한 피드백을 기다립니다.",
    category: "업데이트",
    author: "PrepTap 팀",
    date: "2024-10-01",
    readTime: "4분",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  },
];

const CATEGORIES = ["전체", "학습 팁", "시험 정보", "업데이트", "성공 사례", "기술"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredPosts =
    selectedCategory === "전체"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PrepTap 블로그</h1>
          <p className="text-xl opacity-90">
            학습 팁, 시험 정보, 제품 업데이트를 확인하세요
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card
                variant="bordered"
                className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-gray-500">{post.readTime} 읽기</span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              "{selectedCategory}" 카테고리에 게시물이 없습니다
            </p>
            <button
              onClick={() => setSelectedCategory("전체")}
              className="text-primary-600 hover:underline"
            >
              전체 게시물 보기
            </button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <Card variant="bordered" className="mt-16 p-8 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              최신 소식을 받아보세요
            </h3>
            <p className="text-gray-600 mb-6">
              새로운 블로그 포스트와 학습 팁을 이메일로 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                구독하기
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              언제든 구독을 취소할 수 있습니다
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
