"use client";

import { File, X, Play, Pause, Volume2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { formatFileSize } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

interface AudioDisplayProps {
  file: File;
  onDelete?: () => void;
  editable?: boolean;
}

export default function AudioDisplay({
  file,
  onDelete,
  editable = true,
}: AudioDisplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useClickOutside(volumeSliderRef, () => {
    if (showVolumeSlider) {
      setShowVolumeSlider(false);
    }
  });

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

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
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="border border-gray-200 rounded-[10px] overflow-visible">
      <audio ref={audioRef} src={audioUrl || undefined} />

      <div className="bg-white flex items-center justify-between px-[10px] py-[5px]">
        <div className="flex gap-[17px] items-center w-[245px]">
          <File className="text-type-400 size-[24px]" />
          <div className="flex flex-col w-[218px]">
            <span className="font-semibold text-type-400 text-[18px] leading-[25px] truncate">
              {file.name}
            </span>
            <span className="font-normal text-gray-300 text-[18px] leading-[25px]">
              {formatFileSize(file.size)} MB
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
          <div
            className="flex-1 h-[6px] bg-gray-200 rounded-[100px] cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div
              className="absolute left-0 top-0 h-full bg-jila-400 rounded-[100px]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="relative size-[24px] shrink-0 flex items-center justify-center">
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="cursor-pointer"
          >
            <Volume2 className="size-[20px] text-jila-400" />
          </button>
          {showVolumeSlider && (
            <div
              ref={volumeSliderRef}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-[10px] p-3 shadow-lg z-10"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
