import { formatTime } from "@/utils/timer";
import React from "react";

interface ProgressBarProps {
  progressBarRef: React.RefObject<HTMLInputElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  duration: number;
  timeProgress: number;
}
const ProgressBar = ({
  progressBarRef,
  audioRef,
  duration,
  timeProgress,
}: ProgressBarProps) => {
  const handleProgressChange = () => {
    if (!!progressBarRef?.current?.value && !!audioRef?.current) {
      console.log("handling Progress Change...");
      audioRef.current.currentTime = +progressBarRef.current.value;
    }
  };

  return (
    <div className="flex flex-row ">
      <div className="z-50 flex w-full flex-col px-5 ">
        <input
          type="range"
          ref={progressBarRef}
          onChange={handleProgressChange}
          id="song-percentage-played"
          defaultValue={0}
          className="amplitude-song-slider mb-3"
          step=".1"
        />
        <div className="flex w-full justify-between">
          <span className="amplitude-current-time font-sans text-xs font-medium tracking-wide text-sky-500 dark:text-sky-300">
            {formatTime(timeProgress)}
          </span>
          <span className="amplitude-duration-time font-sans text-xs font-medium tracking-wide text-gray-500">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
