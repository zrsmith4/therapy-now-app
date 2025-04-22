
import React, { useState } from "react";
import NoteDashboard from "@/components/documentation/NoteDashboard";
import NoteForm, { NoteType } from "@/components/documentation/NoteForm";

const TherapistDocumentation = () => {
  const [mode, setMode] = useState<null | NoteType>(null);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);

  const handleStartNote = (type: NoteType) => {
    setEditNoteId(null);
    setMode(type);
  };

  const handleEditNote = (noteId: string) => {
    setEditNoteId(noteId);
    setMode("edit");
  };

  const handleDone = () => {
    setMode(null);
    setEditNoteId(null);
  };

  if (mode) {
    return (
      <NoteForm
        type={mode === "edit" ? undefined : mode}
        noteId={editNoteId}
        onCancel={handleDone}
        onSubmit={handleDone}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Documentation & Patient Notes
        </h1>
        <NoteDashboard
          onStartEval={() => handleStartNote("eval")}
          onStartDailyNote={() => handleStartNote("daily")}
          onEditNote={handleEditNote}
        />
      </div>
    </div>
  );
};

export default TherapistDocumentation;
