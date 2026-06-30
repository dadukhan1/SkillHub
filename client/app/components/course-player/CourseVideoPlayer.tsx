/** @format */

import React, { FC, useEffect, useState } from "react";
import { useGenerateVideoUrlMutation } from "@/redux/features/courseApiSlice";

type Props = {
  videoId: string;
  title: string;
};

const CourseVideoPlayer: FC<Props> = ({ videoId, title }) => {
  const [videoData, setVideoData] = useState<any>({
    otp: "",
    playbackInfo: "",
  });
  const [generateVideoUrl, { isLoading, error }] =
    useGenerateVideoUrlMutation();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await generateVideoUrl(videoId).unwrap();
        // The backend returns { success: true, videoUrl: { otp: "...", playbackInfo: "..." } }
        if (response?.videoUrl) {
          setVideoData(response.videoUrl);
        } else if (response?.otp) {
          setVideoData(response); // In case backend returns it directly
        }
      } catch (err) {
        console.error("Failed to generate video URL:", err);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId, generateVideoUrl]);

  return (
    <div className='w-full'>
      <div style={{ paddingTop: "56%", position: "relative" }}>
        {isLoading ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Loading video...
          </div>
        ) : videoData.otp && videoData.playbackInfo ? (
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
            style={{
              border: "0",
              maxWidth: "100%",
              position: "absolute",
              top: "0",
              left: "0",
              height: "100%",
              width: "100%",
            }}
            allowFullScreen={true}
            allow='encrypted-media'
            title={title}
          />
        ) : error ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "red",
            }}
          >
            Failed to load video
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
