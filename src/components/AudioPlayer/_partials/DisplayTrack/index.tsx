import React, { Dispatch, SetStateAction } from "react";
interface DisplayTrackProps<T> {
  post: T;
  audioRef: React.RefObject<HTMLAudioElement>;
  progressBarRef: React.RefObject<HTMLInputElement>;
  setDuration: Dispatch<SetStateAction<number>>;
}
const DisplayTrack = <T extends { url: string }>({
  post,
  audioRef,
  progressBarRef,
  setDuration,
}: DisplayTrackProps<T>) => {
  const onLoadedMetaData = () => {
    if (!!audioRef?.current?.duration && !!progressBarRef?.current) {
      const seconds = audioRef.current.duration;
      setDuration(seconds);
      progressBarRef.current.max = seconds.toString();
    }
  };
  return (
    <div className="pb-4">
      <audio
        src={post.url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetaData}
      />
    </div>
  );
};

export default DisplayTrack;
