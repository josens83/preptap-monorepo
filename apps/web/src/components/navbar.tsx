"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@preptap/ui";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 인증 페이지에서는 네비게이션 숨기기
  const hideNavbar = pathname?.startsWith("/auth") || pathname === "/onboarding";

  if (hideNavbar) return null;

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const navLinks = session
    ? [
        { href: "/dashboard", label: "대시보드", icon: "📊" },
        { href: "/practice", label: "연습하기", icon: "✏️" },
        { href: "/notebook", label: "오답노트", icon: "📖" },
        { href: "/reports", label: "리포트", icon: "📈" },
      ]
    : [
        { href: "/pricing", label: "요금제", icon: "💎" },
      ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">PrepTap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : session ? (
              <>
                <div className="text-sm text-gray-600">
                  {session.user?.email}
                </div>
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    ⚙️ 설정
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    시작하기
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="border-t border-gray-200 my-2"></div>

              {session ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    {session.user?.email}
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    ⚙️ 설정
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center"
                  >
                    시작하기
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
