export function getYouTubeVideoId(url: string): string | null {
  try {
    let targetUrl = url.trim();

    const iframeMatch = targetUrl.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) targetUrl = iframeMatch[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(targetUrl)) return targetUrl;

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const parsed = new URL(targetUrl);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.includes("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("?")[0] || null;
      }
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function getVimeoVideoId(url: string): string | null {
  try {
    let targetUrl = url.trim();

    const iframeMatch = targetUrl.match(/src=["']([^"']+)["']/i);
    if (iframeMatch) targetUrl = iframeMatch[1];

    if (/^[0-9]+$/.test(targetUrl)) return targetUrl;

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const parsed = new URL(targetUrl);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null;
}

export function getVimeoEmbedUrl(url: string): string | null {
  const id = getVimeoVideoId(url);
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

function decodePlaybackInfoVideoId(playbackInfo: string): string | null {
  try {
    const decoded = JSON.parse(atob(playbackInfo)) as { videoId?: string };
    return decoded.videoId?.trim() || null;
  } catch {
    return null;
  }
}

export function extractVdoCipherVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const playbackInfoMatch = trimmed.match(/playbackInfo=([A-Za-z0-9+/=_-]+)/);
  if (playbackInfoMatch?.[1]) {
    const fromPlayback = decodePlaybackInfoVideoId(playbackInfoMatch[1]);
    if (fromPlayback) return fromPlayback;
  }

  const iframeMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  const srcCandidate = iframeMatch?.[1] ?? (trimmed.startsWith("http") ? trimmed : null);

  if (srcCandidate?.includes("player.vdocipher.com")) {
    try {
      const url = new URL(srcCandidate.split(/[\s"']/)[0]);
      const playbackInfo = url.searchParams.get("playbackInfo");
      if (playbackInfo) {
        const fromUrl = decodePlaybackInfoVideoId(playbackInfo);
        if (fromUrl) return fromUrl;
      }
    } catch {
      // fall through to plain id
    }
  }

  if (!trimmed.includes("<") && !trimmed.includes("http")) {
    return trimmed;
  }

  return null;
}

export function getVdoCipherEmbedUrl(otp: string, playbackInfo: string): string {
  const params = new URLSearchParams({
    otp,
    playbackInfo,
  });
  return `https://player.vdocipher.com/v2/?${params.toString()}`;
}

export function getDirectVideoUrl(url: string): string | null {
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return url;
  return null;
}
