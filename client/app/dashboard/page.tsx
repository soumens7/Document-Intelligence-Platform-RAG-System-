"use client";

import { useEffect, useState } from "react";
import UploadBox from "../../components/UploadBox";
import DocumentList from "../../components/DocumentList";
import { getDocuments, deleteDocument } from "../../lib/api";

export default function Dashboard() {
  const [docs, setDocs] = useState<{ _id: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await getDocuments();
      setDocs(res.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Documents</h1>

      <UploadBox onUpload={fetchDocs} />

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading documents...</p>
        ) : (
          <DocumentList
  docs={docs}
  onDelete={async (id: string) => {
    try {
      await deleteDocument(id); // backend delete
      setDocs(prev => prev.filter(d => d._id !== id)); // UI update
    } catch (err) {
      console.error("Delete failed", err);
    }
  }}
/>
        )}
      </div>
    </div>
  );
}