"use client";

import { useState } from "react";
import { uploadDocument } from "../lib/api";

export default function UploadBox({ onUpload }: { onUpload: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file) return;

    setLoading(true);
    await uploadDocument(file);
    setLoading(false);

    onUpload(); // refresh list
  };

  return (
    <div className="border p-4 rounded-lg">
      <input type="file" onChange={handleUpload} />
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}