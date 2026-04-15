"use client";

import { useParams } from "next/navigation";
import ChatBox from "../../../components/ChatBox";

export default function ChatPage() {
  const params = useParams();
  const documentId = params.id as string;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Chat</h1>
      <ChatBox documentId={documentId} />
    </div>
  );
}