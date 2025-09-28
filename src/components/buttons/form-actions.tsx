"use client";

import SaveButton from "./save-button";
import CancelButton from "./cancel-button";

type FormActionsProps = {
  onSave?: () => void;
  onCancel?: () => void;
};

export default function FormActions({ onSave, onCancel }: FormActionsProps) {
  return (
    <div className="flex gap-4">
      <SaveButton onClick={onSave} />
      <CancelButton onClick={onCancel} />
    </div>
  );
}
