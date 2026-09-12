import { Headphones } from "lucide-react";

interface PodcastPlayerProps {
  audioFile: string;
  title: string;
  duration: string;
}

export default function PodcastPlayer({ audioFile, title, duration }: PodcastPlayerProps) {
  if (!audioFile) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 flex items-center gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-neutral-200 flex items-center justify-center">
          <Headphones size={18} className="text-neutral-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-700">
            Audio player — hosting pending
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {title} ({duration}) will embed here once the episode is hosted
            via RSS. Not yet publicly linked.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <audio controls preload="none" className="w-full" aria-label={title}>
        <source src={audioFile} />
        Your browser does not support the audio element.
      </audio>
      <p className="text-2xs text-neutral-400 mt-2">{duration}</p>
    </div>
  );
}
