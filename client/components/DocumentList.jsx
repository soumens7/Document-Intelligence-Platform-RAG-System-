"use client";

import Link from "next/link";

export default function DocumentList({ docs, onDelete }) {
  if (!docs.length) {
    return <p className="text-gray-500">No documents uploaded</p>;
  }
  const handleDelete = async (id) => {
    onDelete(id);
  };
  return (
    <div className="space-y-3">
      {docs.map((doc) => (
        <div
          key={doc._id}
          className="border p-3 rounded-lg flex justify-between"
        >
          <div>
            <p className="font-medium">{doc.filename}</p>
            <p className="text-sm text-gray-500">
              Status: {doc.status || "processed"}
            </p>
          </div>

          <Link href={`/chat/${doc._id}`} className="text-blue-500">
            Open Chat →
          </Link>
          <button
            onClick={() => handleDelete(doc._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
