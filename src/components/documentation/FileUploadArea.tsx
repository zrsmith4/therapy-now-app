
import React, { useRef } from "react";
import { FilePen } from "lucide-react";

interface FileUploadAreaProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ files, onFilesChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onFilesChange([...files, ...Array.from(e.target.files)]);
  };

  const handleRemove = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Upload Images/PDFs (optional)</h3>
      <div className="flex flex-col gap-2">
        <div
          onClick={() => inputRef.current?.click()}
          className="p-4 border-2 border-dashed border-slate-300 rounded cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-100"
        >
          <FilePen className="text-medical-primary" />
          <span className="text-slate-600">Click to select images or PDFs</span>
        </div>
        <input
          type="file"
          accept=".pdf,image/*"
          multiple
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleSelect}
        />
        <div className="flex gap-2 flex-wrap">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded"
            >
              <span className="text-xs">{file.name}</span>
              <button
                className="text-red-500 ml-2 text-xs"
                type="button"
                onClick={() => handleRemove(idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;
