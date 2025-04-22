
import React, { useState } from "react";

const defaultROMs = [
  { region: "Shoulder", range: "Flexion", normal: "180", value: "" },
  { region: "Shoulder", range: "Abduction", normal: "180", value: "" },
  { region: "Knee", range: "Flexion", normal: "135", value: "" },
  { region: "Hip", range: "Flexion", normal: "120", value: "" },
];

type ROMEntry = typeof defaultROMs[number];

const ROMSection: React.FC<{ onChange: (val: string) => void }> = ({ onChange }) => {
  const [roms, setROMs] = useState(defaultROMs);

  const handleChange = (i: number, value: string) => {
    const updated = [...roms];
    updated[i].value = value;
    setROMs(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Range of Motion (ROM)</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {roms.map((row, i) => (
          <div className="flex items-center gap-1" key={i}>
            <div className="w-28">{row.region} {row.range}</div>
            <input
              className="w-16 border rounded px-1 py-1"
              placeholder={`Ex: ${row.normal}`}
              value={row.value}
              onChange={e => handleChange(i, e.target.value)}
            />
            <span className="text-slate-400">/ {row.normal}° norm</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ROMSection;
