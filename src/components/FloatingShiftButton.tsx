import { Plus } from "lucide-react";
import { ShiftDialog } from "./ShiftDialog";

export const FloatingShiftButton = () => {
  return (
    <>
      <button
        onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="shift"]')?.click()}
        className="fixed bottom-6 right-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        aria-label="Adicionar turno"
      >
        <Plus className="w-6 h-6" />
      </button>
      <div className="hidden">
        <ShiftDialog currentDate={new Date()} />
      </div>
    </>
  );
};