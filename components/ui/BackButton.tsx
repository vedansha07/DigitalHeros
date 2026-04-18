"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors group mb-6"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors group mb-6"
    >
      <ArrowLeft
        size={16}
        className="group-hover:-translate-x-1 transition-transform"
      />
      {label}
    </button>
  );
}
