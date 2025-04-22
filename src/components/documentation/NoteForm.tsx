
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import ROMSection from "./ROMSection";
import MMTSection from "./MMTSection";
import SpecialTestsSection from "./SpecialTestsSection";
import GoalsSection from "./GoalsSection";
import FileUploadArea from "./FileUploadArea";

export type NoteType = "eval" | "daily" | "edit";

interface NoteFormProps {
  type?: NoteType;
  noteId?: string | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const EditPastNoteWarning: React.FC<{ onAcknowledge: () => void }> = ({ onAcknowledge }) => (
  <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
    <div className="bg-white rounded shadow-lg p-6 max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-500" />
        <h2 className="font-semibold text-lg">Editing Past Note</h2>
      </div>
      <p className="mb-4 text-slate-700">
        Warning: You are editing an older note. By continuing, you acknowledge you are editing a previously signed note rather than a current visit’s note.
      </p>
      <Button onClick={onAcknowledge} className="bg-red-500 text-white w-full">Acknowledge & Continue</Button>
    </div>
  </div>
);

const NoteForm: React.FC<NoteFormProps> = ({ type, noteId, onCancel, onSubmit }) => {
  const [showWarning, setShowWarning] = useState(type === "edit");
  const [form, setForm] = useState({
    subjective: "",
    medicalHistory: "",
    pain: "",
    questionnaire: "",
    observation: "",
    assessment: "",
    customAssessment: "",
    // ... more fields as needed
  });
  // Demo for uploading
  const [uploads, setUploads] = useState<File[]>([]);

  const handleSectionChange = (section: string, value: string) => {
    setForm((prev) => ({ ...prev, [section]: value }));
  };

  const handleFileUpload = (files: File[]) => {
    setUploads(files);
  };

  if (showWarning) {
    return <EditPastNoteWarning onAcknowledge={() => setShowWarning(false)} />;
  }

  return (
    <form
      className="bg-white rounded-lg shadow-md px-6 py-6 mb-8"
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {type === "eval" ? "Evaluation" : type === "daily" ? "Daily Note" : "Edit Note"}
        </h2>
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
      </div>
      {/* --- Subjective Section --- */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Subjective</h3>
        <textarea
          value={form.subjective}
          onChange={e => handleSectionChange("subjective", e.target.value)}
          placeholder="Briefly describe subjective input..."
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {/* --- Medical History and Pain Section --- */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Medical History</h3>
          <textarea
            value={form.medicalHistory}
            onChange={e => handleSectionChange("medicalHistory", e.target.value)}
            placeholder="Prior history, diagnosis, other relevant background..."
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Pain</h3>
          <textarea
            value={form.pain}
            onChange={e => handleSectionChange("pain", e.target.value)}
            placeholder="Pain level, location, characteristics..."
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      {/* --- Questionnaire (pre-fill from signup) --- */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Questionnaire Response</h3>
        <textarea
          value={form.questionnaire}
          onChange={e => handleSectionChange("questionnaire", e.target.value)}
          placeholder="Auto-prepopulated questionnaire answers appear here"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {/* --- Observation & Palpation --- */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Observation & Palpation</h3>
        <textarea
          value={form.observation}
          onChange={e => handleSectionChange("observation", e.target.value)}
          placeholder="Swelling, temperature, deformity, etc."
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {/* --- Tests & Measures (point and click sections) --- */}
      <ROMSection onChange={val => handleSectionChange("rom", val)} />
      <MMTSection onChange={val => handleSectionChange("mmt", val)} />
      <SpecialTestsSection onChange={val => handleSectionChange("specialTests", val)} />
      {/* --- Assessment Section (open or fill-in) --- */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Assessment</h3>
        <textarea
          value={form.assessment}
          onChange={e => handleSectionChange("assessment", e.target.value)}
          placeholder="Clinical impression, eval, progress, barriers..."
          className="w-full border rounded px-3 py-2"
        />
        <div className="mt-2">
          <input
            type="checkbox"
            id="customAssessment"
            checked={!!form.customAssessment}
            onChange={e => handleSectionChange("customAssessment", e.target.checked ? "Custom content" : "")}
          />
          <label htmlFor="customAssessment" className="ml-2 text-sm">
            Free type assessment
          </label>
        </div>
      </div>
      {/* --- Goals Section (point and click with fill-ins) --- */}
      <GoalsSection onChange={val => handleSectionChange("goals", val)} />
      {/* --- File Upload Section --- */}
      <FileUploadArea files={uploads} onFilesChange={handleFileUpload} />
      {/* --- Submit --- */}
      <div className="mt-6 flex justify-end">
        <Button type="submit" className="bg-medical-primary text-white">
          Save Note
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
