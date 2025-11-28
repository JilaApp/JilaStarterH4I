"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import JilaQuote from "@/assets/logos/jila_quote.png";

export default function JobRequestSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#a73d24] to-cream-300">
      {/* Left side - Logo */}
      <div className="hidden lg:flex lg:w-[628px] items-center justify-center rounded-br-[60px] bg-gradient-to-b from-[#a73d24] to-cream-300">
        <div className="relative w-[530px] h-[530px]">
          <Image
            src={JilaQuote}
            alt="Jila Logo"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right side - Success message */}
      <div className="flex-1 flex flex-col items-center justify-end bg-cream-300 lg:rounded-tl-[60px] px-6 lg:px-24 py-12">
        <h1 className="body1-desktop-semi-text text-type-400 text-center mb-5">
          Submit Job Posting
        </h1>

        <div className="bg-white rounded-[10px] shadow-[0px_4px_80px_0px_rgba(109,15,0,0.1)] w-full max-w-[699px] h-[882px] mb-12 flex flex-col items-center justify-center gap-[10px]">
          <div className="flex items-center gap-[10px]">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="body1-desktop-text text-type-400">
              Thank you for your submission
            </p>
          </div>

          <Link
            href="/job-request"
            className="body2-desktop-text text-jila-400 underline hover:opacity-80 transition-opacity"
          >
            Submit another job
          </Link>
        </div>
      </div>
    </div>
  );
}
