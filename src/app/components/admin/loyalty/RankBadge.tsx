"use client";

import Image from "next/image";

interface RankBadgeProps {
  rankName: string;
  rankImageUrl?: string;
  size?: "sm" | "md";
}

const RANK_COLORS: Record<string, string> = {
  Rookie: "bg-slate-100 text-slate-700",
  Regular: "bg-blue-100 text-blue-700",
  Pro: "bg-emerald-100 text-emerald-700",
  Elite: "bg-purple-100 text-purple-700",
  Legend: "bg-amber-100 text-amber-800",
};

export default function RankBadge({ rankName, rankImageUrl, size = "sm" }: RankBadgeProps) {
  const colorClass = RANK_COLORS[rankName] ?? "bg-gray-100 text-gray-700";
  const imgSize = size === "sm" ? 16 : 20;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {rankImageUrl && (
        <Image
          src={rankImageUrl}
          alt={rankName}
          width={imgSize}
          height={imgSize}
          className="rounded-full object-cover"
        />
      )}
      {rankName}
    </span>
  );
}
