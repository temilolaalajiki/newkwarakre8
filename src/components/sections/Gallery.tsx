import { useState, lazy, Suspense, useMemo } from "react";

// Build-time generated optimized thumbnails (small webp) for the grid
const THUMBS = import.meta.glob<string>("/src/assets/gallery/*.jpg", {
  query: { w: 800, format: "webp", quality: 70 },
  import: "default",
  eager: true,
}) as Record<string, string>;

// Larger variants loaded only when the lightbox opens (lazy)
const FULLS = import.meta.glob<string>("/src/assets/gallery/*.jpg", {
  query: { w: 1600, format: "webp", quality: 82 },
  import: "default",
}) as Record<string, () => Promise<string>>;

// Order to display, with optional row span for the masonry rhythm
const ORDER: { file: string; span?: string }[] = [
  { file: "DOS_0463.jpg", span: "row-span-2" },
  { file: "DOS_0470.jpg" },
  { file: "DOS_0473.jpg" },
  { file: "DOS_0498.jpg", span: "row-span-2" },
  { file: "DOS_0848.jpg", span: "row-span-2" },
  { file: "DOS_0512.jpg" },
  { file: "DOS_0538.jpg" },
  { file: "DOS_0011.jpg" },
  { file: "DOS_0680.jpg" },
  { file: "DOS_0013.jpg", span: "row-span-2" },
  { file: "DOS_0692.jpg", span: "row-span-2" },
  { file: "DOS_0727.jpg" },
  { file: "DOS_0021.jpg", span: "row-span-2" },
  { file: "DOS_0734.jpg" },
  { file: "DOS_0779.jpg", span: "row-span-2" },
  { file: "DOS_0799.jpg" },
  { file: "DOS_0005.jpg", span: "row-span-2" },
  { file: "DOS_0023.jpg" },
  { file: "DOS_0549.jpg" },
  { file: "DOS_0598.jpg", span: "row-span-2" },
  { file: "DOS_0028.jpg" },
  { file: "DOS_0805.jpg" },
  { file: "DOS_0828.jpg" },
  { file: "DOS_0031.jpg" },
  { file: "DOS_1082.jpg" },
  { file: "DOS_0041.jpg" },
  { file: "DOS_0832.jpg", span: "row-span-2" },
  { file: "DOS_0397.jpg" },
  { file: "DOS_0278.jpg" },
  { file: "DOS_9990.jpg" },
];

const Lightbox = lazy(() =>
  import("./GalleryLightbox").then((m) => ({ default: m.GalleryLightbox })),
);

export function Gallery() {
  const [active, setActive] = useState<string | null>(null);

  const items = useMemo(
    () =>
      ORDER.map(({ file, span }) => {
        const key = Object.keys(THUMBS).find((k) => k.endsWith("/" + file));
        const fullKey = Object.keys(FULLS).find((k) => k.endsWith("/" + file));
        return {
          file,
          span,
          thumb: key ? THUMBS[key] : undefined,
          loadFull: fullKey ? FULLS[fullKey] : undefined,
        };
      }).filter((i) => i.thumb),
    [],
  );

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Gallery</p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Moments from the <span className="text-gradient-gold">first edition</span>
          </h2>
        </div>
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.file}
              onClick={() => setActive(item.file)}
              onMouseEnter={() => item.loadFull?.()}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-muted ${item.span ?? ""}`}
            >
              <img
                src={item.thumb}
                alt="Kwara Kre8ives gallery"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/10" />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <Suspense fallback={null}>
          <Lightbox
            loader={items.find((i) => i.file === active)?.loadFull}
            fallback={items.find((i) => i.file === active)?.thumb}
            onClose={() => setActive(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
