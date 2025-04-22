
import React, { useState } from "react";

const rows = [
  { muscle: "Quadriceps", side: "Right", value: "" },
  { muscle: "Quadriceps", side: "Left", value: "" },
  { muscle: "Hamstrings", side: "Right", value: "" },
  { muscle: "Hamstrings", side: "Left", value: "" },
];

const grades = ["0", "1", "2", "3", "4", "5"];

const MMTSection: React.FC<{ onChange: (val: string) => void }> = ({ onChange }) => {
  const [mmt, setMMT] = useState(rows);

  const handleChange = (i: number, val: string) => {
    const updated = [...mmt];
    updated[i].value = val;
    setMMT(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Manual Muscle Testing (MMT)</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {mmt.map((row, i) => (
          <div className="flex items-center gap-1" key={i}>
            <div className="w-28">
              {row.muscle} ({row.side})
            </div>
            <select
              className="border rounded px-2 py-1"
              value={row.value}
              onChange={e => handleChange(i, e.target.value)}
            >
              <option value="">Grade</option>
              {grades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MMTSection;
