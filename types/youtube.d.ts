// YouTube IFrame API Type Definitions

declare namespace YT {
  interface PlayerEvent {
    target: Player;
    data: any;
  }

  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1 | 2;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
    iv_load_policy?: 1 | 3;
    playsinline?: 0 | 1;
    fs?: 0 | 1;
    [key: string]: any;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: PlayerEvent) => void;
      [key: string]: ((event: any) => void) | undefined;
    };
  }

  class Player {
    constructor(containerId: string | HTMLElement, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    destroy(): void;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }
}

declare interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}

