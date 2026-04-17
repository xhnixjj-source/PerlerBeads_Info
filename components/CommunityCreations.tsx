import { RemoteCoverImage } from "@/components/RemoteCoverImage";

type Props = {
  imageUrls: string[];
};

export function CommunityCreations({ imageUrls }: Props) {
  if (imageUrls.length === 0) return null;

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {imageUrls.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-sm"
        >
          <div
            className={`relative w-full ${
              i % 5 === 0 ? "aspect-[4/5]" : i % 3 === 0 ? "aspect-square" : "aspect-[3/4]"
            }`}
          >
            <RemoteCoverImage
              variant="fill"
              src={src}
              alt=""
              className="object-cover"
              sizes="(max-width: 640px) 45vw, 25vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
