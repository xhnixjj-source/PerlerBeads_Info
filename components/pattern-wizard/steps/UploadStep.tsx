"use client";

import { useCallback } from "react";
import { usePatternWizardStore, validateImageFile, MAX_FILE_MB } from "@/stores/pattern-wizard-store";

export function UploadStep() {
  const setFile = usePatternWizardStore((s) => s.setFile);
  const setImageSrc = usePatternWizardStore((s) => s.setImageSrc);
  const imageSrc = usePatternWizardStore((s) => s.imageSrc);
  const setStep = usePatternWizardStore((s) => s.setStep);

  const onFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const err = validateImageFile(file);
      if (err) {
        alert(err);
        return;
      }
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      const url = URL.createObjectURL(file);
      setFile(file);
      setImageSrc(url);
      setStep(2);
    },
    [imageSrc, setFile, setImageSrc, setStep]
  );

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="rounded-3xl border border-ink-200/90 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">Upload your pixel image</h2>
      <p className="mt-2 text-sm text-brand-text/70">
        We&apos;ll turn your art into a fuse bead pattern. PNG or JPG is recommended.
      </p>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mt-6 rounded-2xl border-2 border-dashed border-brand-lavender/50 bg-brand-mint/10 px-6 py-14 text-center transition hover:border-brand-secondary/60"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lavender/30 text-2xl" aria-hidden>
          🖼
        </div>
        <p className="font-medium text-brand-text">Drop a pixel image here or click to upload from your device.</p>
        <p className="mt-2 text-xs text-brand-text/55">
          PNG, JPG, or WEBP, up to {MAX_FILE_MB} MB.
        </p>
        <label className="mt-6 inline-flex cursor-pointer rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105">
          Choose file
          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onInput} />
        </label>
      </div>
    </div>
  );
}
