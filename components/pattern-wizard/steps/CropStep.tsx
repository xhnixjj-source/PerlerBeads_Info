"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImgBlobUrl } from "@/lib/crop-image";
import { usePatternWizardStore } from "@/stores/pattern-wizard-store";

const ASPECTS: { label: string; value: number }[] = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
];

export function CropStep() {
  const imageSrc = usePatternWizardStore((s) => s.imageSrc);
  const crop = usePatternWizardStore((s) => s.crop);
  const zoom = usePatternWizardStore((s) => s.zoom);
  const aspect = usePatternWizardStore((s) => s.aspect);
  const croppedAreaPixels = usePatternWizardStore((s) => s.croppedAreaPixels);
  const setCropState = usePatternWizardStore((s) => s.setCropState);
  const setCroppedImageUrl = usePatternWizardStore((s) => s.setCroppedImageUrl);
  const croppedImageUrl = usePatternWizardStore((s) => s.croppedImageUrl);
  const setStep = usePatternWizardStore((s) => s.setStep);

  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_a: Area, pixels: Area) => {
    setCropState({ croppedAreaPixels: pixels });
  }, [setCropState]);

  const onNext = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setBusy(true);
    try {
      if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
      const url = await getCroppedImgBlobUrl(imageSrc, croppedAreaPixels);
      setCroppedImageUrl(url);
      setStep(3);
    } finally {
      setBusy(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="rounded-3xl border border-ink-200/90 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">Crop your image</h2>
      <p className="mt-2 text-sm text-brand-text/70">
        Trim away extra borders and crop as close to the edges as possible — tighter crops produce cleaner patterns.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ASPECTS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => setCropState({ aspect: a.value })}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              Math.abs(aspect - a.value) < 0.01
                ? "bg-brand-secondary text-white shadow-sm"
                : "border border-ink-200 bg-white text-brand-text/80 hover:bg-brand-mint/30"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_220px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-900 lg:aspect-auto lg:min-h-[320px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={(c) => setCropState({ crop: c })}
            onZoomChange={(z) => setCropState({ zoom: z })}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="space-y-3 text-sm text-brand-text/80">
          <p className="font-heading font-bold text-brand-text">How to crop</p>
          <ul className="list-inside list-disc space-y-2 text-brand-text/75">
            <li>Drag inside the box to move it.</li>
            <li>Drag corners or edges to resize.</li>
            <li>Use the aspect presets for board-friendly shapes.</li>
          </ul>
          <label className="mt-4 block text-xs font-medium text-brand-text/70">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setCropState({ zoom: Number(e.target.value) })}
              className="mt-1 w-full accent-brand-secondary"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-full border border-ink-200 bg-ink-50 px-6 py-2.5 text-sm font-bold text-brand-text/80 transition hover:bg-ink-100"
        >
          Back
        </button>
        <button
          type="button"
          disabled={busy || !croppedAreaPixels}
          onClick={() => void onNext()}
          className="rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "…" : "Next"}
        </button>
      </div>
    </div>
  );
}
