
import React, { useState } from "react";

const rows = [
  { test: "Lachman", result: "" },
  { test: "Anterior Drawer", result: "" },
  { test: "Empty Can", result: "" },
];

const options = [
  { label: "Positive", value: "positive" },
  { label: "Negative", value: "negative" },
  { label: "Not performed", value: "not_performed" },
];

const SpecialTestsSection: React.FC<{ onChange: (val: string) => void }> = ({ onChange }) => {
  const [tests, setTests] = useState(rows);

  const handleChange = (i: number, result: string) => {
    const updated = [...tests];
    updated[i].result = result;
    setTests(updated);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Special Tests</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {tests.map((test, i) => (
          <div className="flex items-center gap-1" key={i}>
            <div className="w-32">{test.test}</div>
            <select
              className="border rounded px-2 py-1"
              value={test.result}
              onChange={e => handleChange(i, e.target.value)}
            >
              <option value="">Select</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialTestsSection;
