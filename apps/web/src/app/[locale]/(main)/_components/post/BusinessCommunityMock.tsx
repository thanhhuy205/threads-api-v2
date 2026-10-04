"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Pin } from "lucide-react";

const mockPosts = [
  {
    initials: "MH",
    avatarClass: "bg-[#eff0fd] text-[#6369ec]",
    name: "Minh Hoàng",
    role: "Founder · Northstar Labs",
    time: "12 phút trước",
    type: "Pinned",
    pinned: true,
    content:
      "Tuần này team mình mở một buổi private roundtable về cách xây sales pipeline cho B2B SaaS giai đoạn đầu. Mình muốn giới hạn khoảng 12 anh em để cuộc trao đổi đủ sâu. Ai đang có cùng bài toán có thể để lại một lời nhắn nhé.",
    likes: 24,
    comments: 8,
  },
  {
    initials: "AN",
    avatarClass: "bg-[#eaf8f5] text-[#167d68]",
    name: "An Nguyễn",
    role: "COO · Formo",
    time: "1 giờ trước",
    type: "Announcement",
    pinned: false,
    content:
      "Chia sẻ nhanh cho cộng đồng: bộ tài liệu onboarding leadership team quý này đã được cập nhật. Phần đáng chú ý nhất là framework 30-60-90 ngày dành cho quản lý mới và checklist bàn giao mục tiêu giữa các phòng ban.",
    likes: 17,
    comments: 5,
  },
];

type BusinessCommunityMockProps = {
  filter?: "LATEST" | "ANNOUNCEMENT" | "PINNED";
};

export default function BusinessCommunityMock({
  filter = "LATEST",
}: BusinessCommunityMockProps) {
  const visiblePosts = mockPosts.filter((post) => {
    if (filter === "ANNOUNCEMENT") return post.type === "Announcement";
    if (filter === "PINNED") return post.pinned;
    return true;
  });

  return (
    <div className="space-y-3">
      {visiblePosts.map((post) => (
        <article
          key={`${post.name}-${post.type}`}
          className="rounded-2xl border border-[#f3f4f6] bg-white p-5"
        >
          <header className="flex items-start gap-3">
            <Avatar className="size-10">
              <AvatarFallback className={post.avatarClass}>
                {post.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#0d121c]">{post.name}</p>
                <Badge
                  variant="secondary"
                  className={`rounded-md border-0 px-2 py-0.5 text-[11px] ${
                    post.pinned
                      ? "bg-[#eff0fd] text-[#6369ec]"
                      : "bg-[#f0f9ff] text-[#026aa2]"
                  }`}
                >
                  {post.pinned ? <Pin className="mr-1 size-3" /> : null}
                  {post.type}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-[#6c737f]">
                {post.role} · {post.time}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full text-[#6c737f]"
              aria-label="More post actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </header>

          <p className="mt-4 text-[14.5px] leading-6 text-[#1f2a37]">
            {post.content}
          </p>

          <footer className="mt-4 flex items-center gap-1 border-t border-[#f3f4f6] pt-3">
            <Button variant="ghost" size="sm" className="rounded-lg text-[#6c737f]">
              <Heart className="size-4" /> {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg text-[#6c737f]">
              <MessageCircle className="size-4" /> {post.comments}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-auto rounded-lg text-[#6c737f]"
              aria-label="Save post"
            >
              <Bookmark className="size-4" />
            </Button>
          </footer>
        </article>
      ))}
    </div>
  );
}
