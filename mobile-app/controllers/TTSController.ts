import { AVPlaybackSource } from "expo-av";
import { AudioButtonHandle } from "@/components/AudioButton";

export type TTSItem = {
  id: string;
  text: string;
  audioSource: AVPlaybackSource;
};

export class TTSController {
  private audioButtonRef: React.RefObject<AudioButtonHandle | null> | null =
    null;

  private onHighlight: (id: string | null) => void;
  public isPlaying: boolean = false;

  constructor(
    onHighlight: (id: string | null) => void,
    audioButtonRef?: React.RefObject<AudioButtonHandle | null>,
  ) {
    this.onHighlight = onHighlight;
    this.audioButtonRef = audioButtonRef || null;
  }

  async playSequence(items: TTSItem[]) {
    this.isPlaying = true;

    for (const item of items) {
      try {
        this.onHighlight(item.id);

        if (this.audioButtonRef && this.audioButtonRef.current) {
          await this.audioButtonRef.current.playSound(item.audioSource);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      } catch (error) {
        console.error("TTS error:", error);
      }
    }

    this.onHighlight(null);
    this.isPlaying = false;
  }

  async stop() {
    if (this.audioButtonRef && this.audioButtonRef.current) {
      await this.audioButtonRef.current?.stop();
    }
    this.onHighlight(null);
    this.isPlaying = false;
  }
}
