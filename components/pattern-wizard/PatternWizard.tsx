"use client";

import { usePatternWizardStore } from "@/stores/pattern-wizard-store";
import { WizardStepper } from "@/components/pattern-wizard/WizardStepper";
import { UploadStep } from "@/components/pattern-wizard/steps/UploadStep";
import { CropStep } from "@/components/pattern-wizard/steps/CropStep";
import { SizeStep } from "@/components/pattern-wizard/steps/SizeStep";
import { PatternStep } from "@/components/pattern-wizard/steps/PatternStep";
import { DownloadStep } from "@/components/pattern-wizard/steps/DownloadStep";
import { EditStep } from "@/components/pattern-wizard/steps/EditStep";

export function PatternWizard() {
  const step = usePatternWizardStore((s) => s.step);

  return (
    <div>
      <WizardStepper step={step} />
      {step === 1 && <UploadStep />}
      {step === 2 && <CropStep />}
      {step === 3 && <SizeStep />}
      {step === 4 && <PatternStep />}
      {step === 5 && <DownloadStep />}
      {step === 6 && <EditStep />}
    </div>
  );
}
