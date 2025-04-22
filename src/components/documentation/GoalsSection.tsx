
import React, { useState } from "react";

const templates = [
  "Patient will improve {FUNCTION} to {LEVEL} within {TIMEFRAME}.",
  "Patient will demonstrate {FUNCTION} independently with {ASSIST} within {TIMEFRAME}.",
];

const functionalOptions = [
  "ambulation distance",
  "stairs",
  "transfers",
  "ADLs",
  "pain levels",
];

const assistanceLevels = [
  "no assistance",
  "minimal assist",
  "moderate assist",
  "maximal assist",
];

const timeframes = [
  "2 weeks",
  "4 weeks",
  "8 weeks",
  "12 weeks",
];

const GoalsSection: React.FC<{ onChange: (val: string) => void }> = ({ onChange }) => {
  const [chosen, setChosen] = useState(0);
  const [functionType, setFunctionType] = useState(functionalOptions[0]);
  const [level, setLevel] = useState("100ft");
  const [assistLevel, setAssistLevel] = useState(assistanceLevels[0]);
  const [timeframe, setTimeframe] = useState(timeframes[1]);

  React.useEffect(() => {
    let filled = templates[chosen]
      .replace("{FUNCTION}", functionType)
      .replace("{LEVEL}", level)
      .replace("{ASSIST}", assistLevel)
      .replace("{TIMEFRAME}", timeframe);
    onChange(filled);
  }, [chosen, functionType, level, assistLevel, timeframe, onChange]);

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Goals</h3>
      <div className="mb-2">
        <select className="border rounded px-2 py-1" value={chosen} onChange={e => setChosen(Number(e.target.value))}>
          {templates.map((tpl, idx) => (
            <option key={idx} value={idx}>Template {idx + 1}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-4 mb-2 text-sm">
        <div>
          <label className="block mb-1">Function:</label>
          <select className="border rounded" value={functionType} onChange={e => setFunctionType(e.target.value)}>
            {functionalOptions.map(f => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Level:</label>
          <input
            className="border rounded px-1"
            value={level}
            onChange={e => setLevel(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Assistance:</label>
          <select className="border rounded" value={assistLevel} onChange={e => setAssistLevel(e.target.value)}>
            {assistanceLevels.map(a => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Timeframe:</label>
          <select className="border rounded" value={timeframe} onChange={e => setTimeframe(e.target.value)}>
            {timeframes.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-2 bg-slate-100 rounded text-sm">
        <span className="font-medium">Preview: </span>
        {templates[chosen]
          .replace("{FUNCTION}", functionType)
          .replace("{LEVEL}", level)
          .replace("{ASSIST}", assistLevel)
          .replace("{TIMEFRAME}", timeframe)}
      </div>
    </div>
  );
};

export default GoalsSection;
