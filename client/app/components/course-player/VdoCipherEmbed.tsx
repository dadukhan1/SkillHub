"use client";

import { FC } from "react";

interface VdoCipherEmbedProps {
  src: string;
  title: string;
}

const VdoCipherEmbed: FC<VdoCipherEmbedProps> = ({ src, title }) => (
  <div className="w-full overflow-hidden rounded-[14px] border border-border bg-black">
    <div className="relative w-full pt-[56%]">
      <iframe
        src={src}
        title={title}
        className="absolute left-0 top-0 h-full w-full border-0"
        allowFullScreen
        allow="encrypted-media"
      />
    </div>
  </div>
);

export default VdoCipherEmbed;
