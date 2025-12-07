"use client";

import { File, X, Play, Pause } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { formatFileSize } from "@/lib/utils";

interface AudioDisplayProps {
  file?: File;
  audioUrl?: string;
  fileName?: string;
  fileSize?: number;
  onDelete?: () => void;
  editable?: boolean;
}

export const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function AudioDisplay({
  file,
  audioUrl: audioUrlProp,
  fileName,
  fileSize,
  onDelete,
  editable = true,
}: AudioDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioUrl("");
    }
  }, [file]);

  const effectiveAudioUrl = audioUrl || audioUrlProp || "";
  const displayName = file?.name || fileName || "";
  const displaySize = file?.size || fileSize || 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [effectiveAudioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border border-gray-200 rounded-[10px] overflow-visible">
      <audio ref={audioRef} src={effectiveAudioUrl || undefined} />
      <div className="bg-white flex items-center justify-between px-[10px] py-[5px]">
        <div className="flex gap-[17px] items-center w-[245px]">
          <File className="text-type-400 size-[24px]" />
          <div className="flex flex-col w-[218px]">
            <span className="font-semibold text-type-400 text-[18px] leading-[25px] truncate">
              {displayName}
            </span>
            <span className="font-normal text-gray-300 text-[18px] leading-[25px]">
              {formatFileSize(displaySize)} MB
            </span>
          </div>
        </div>
        {editable && onDelete && (
          <X
            className="size-[24px] cursor-pointer text-type-400"
            onClick={onDelete}
          />
        )}
      </div>
      <div className="bg-white flex gap-[13px] items-center px-[15px] py-[10px]">
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center size-[20px] shrink-0 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="size-[12px] text-jila-400" fill="currentColor" />
          ) : (
            <Play
              className="size-[12px] text-jila-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          )}
        </button>
        <div className="flex flex-1 gap-[3px] items-center min-w-0">
          <span className="font-normal text-[12px] leading-[15px] text-black shrink-0 w-[64px]">
            {formatTime(currentTime)}/ {formatTime(duration)}
          </span>
          <div className="flex-1 h-[6px] bg-gray-200 rounded-[100px] relative">
            <div
              className="absolute left-0 top-0 h-full bg-jila-400 rounded-[100px]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
