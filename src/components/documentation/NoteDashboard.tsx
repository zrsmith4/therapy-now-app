
import React from "react";
import { Button } from "@/components/ui/button";

export interface NoteSummary {
  id: string;
  date: string;
  type: "eval" | "daily";
  edited: boolean;
}

interface NoteDashboardProps {
  onStartEval: () => void;
  onStartDailyNote: () => void;
  onEditNote: (id: string) => void;
}

const demoNotes: NoteSummary[] = [
  {
    id: "1",
    date: "2024-04-20",
    type: "eval",
    edited: false,
  },
  {
    id: "2",
    date: "2024-04-21",
    type: "daily",
    edited: true,
  },
];

const NoteDashboard: React.FC<NoteDashboardProps> = ({
  onStartEval,
  onStartDailyNote,
  onEditNote,
}) => {
  return (
    <div>
      <div className="flex gap-4 mb-6">
        <Button className="bg-medical-primary text-white" onClick={onStartEval}>
          Start Eval
        </Button>
        <Button className="bg-medical-secondary text-white" onClick={onStartDailyNote}>
          Start New Daily Note
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="font-semibold mb-2">Past Notes</h2>
        <ul className="divide-y">
          {demoNotes.map((note) => (
            <li key={note.id} className="py-2 flex justify-between items-center">
              <span>
                {note.type === "eval" ? "Evaluation" : "Daily Note"} — {note.date}
                {note.edited && (
                  <span className="ml-2 text-xs text-red-500">(edited)</span>
                )}
              </span>
              <Button size="sm" variant="outline" onClick={() => onEditNote(note.id)}>
                Edit
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoteDashboard;
