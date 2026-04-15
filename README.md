# Document Intelligence Platform (RAG System)

🚀 Project Overview

This project is a Document Intelligence Platform that allows users to upload documents (PDF, DOCX) and interact with them through a conversational AI interface.

The system processes uploaded documents, extracts meaningful information, and enables users to ask questions with grounded, context-aware responses.

It is designed as a multi-user system with strict data isolation, ensuring users can only access their own documents and chat history.

---

Check out the live version of the project [here](https://document-intelligence-platform-rag-system-25iw5yso4.vercel.app/)

---

## Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Frontend        | Next.js 14 (App Router) + Tailwind CSS   |
| Backend         | Node.js + Express + TypeScript           |
| Database        | MongoDB + Mongoose                       |
| AI              | Google Gemini 2.5 Flash                  |
| Auth            | JWT (jsonwebtoken)                       |
| File Processing | pdfjs-dist (PDF parsing), mammoth (DOCX) |
| File Upload     | Multer                                   |

---

## Project Structure

```
Doc Intelligence System/
├── client/
│   ├── app/
│   │   ├── chat/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ChatBox.tsx
│   │   ├── DocumentList.jsx
│   │   └── UploadBox.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   └── tsconfig.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── documentController.ts
│   │   │   └── queryController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── Chat.ts
│   │   │   ├── Chunk.ts
│   │   │   ├── Document.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── documents.ts
│   │   │   └── query.ts
│   │   ├── services/
│   │   │   ├── aiService.ts
│   │   │   ├── embeddingService.ts
│   │   │   ├── fileParser.ts
│   │   │   ├── processingService.ts
│   │   │   └── retrievelService.ts
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   └── pptx-parser.d.ts
│   │   ├── uploads/
│   │   ├── utils/
│   │   │   └── similarity.ts
│   │   └── index.ts
│   ├── uploads/
│   │   └── .DS_Store
│   ├── .DS_Store
│   ├── .env
│   ├── .gitignore
│   ├── package-lock 2.json
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
└── .DS_Store

```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone & Install

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Environment Variables

**backend/.env**

```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
GOOGLE_API_KEY=your_api_key
```

**frontend/.env.local**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

---

## 🧠 Architecture Diagram

```
                ┌────────────────────┐
                │     Frontend       │
                │  (Next.js UI)      │
                └────────┬───────────┘
                         │
                         ▼
                ┌────────────────────┐
                │     Backend API     │
                │   (Node + Express)  │
                └────────┬───────────┘
                         │
     ┌───────────────────┼───────────────────┐
     ▼                   ▼                   ▼

┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Auth Service │   │ Doc Service  │   │ Query Service│
└──────────────┘   └──────────────┘   └──────────────┘

                         │
                         ▼
                ┌────────────────────┐
                │ Processing Pipeline│
                └────────┬───────────┘
                         ▼
                ┌────────────────────┐
                │ Text Extraction     │
                │ (PDF / DOCX)        │
                └────────┬───────────┘
                         ▼
                ┌────────────────────┐
                │ Chunking            │
                └────────┬───────────┘
                         ▼
                ┌────────────────────┐
                │ Embedding           │
                └────────┬───────────┘
                         ▼
                ┌────────────────────┐
                │ MongoDB            │
                │ (Docs + Chunks +   │
                │  Chats)            │
                └────────┬───────────┘
                         ▼
                ┌────────────────────┐
                │ Retrieval Engine    │
                └────────┬───────────┘
                         ▼
                ┌────────────────────┐
                │ LLM (Gemini API)   │
                └────────────────────┘
```

---

## 🧩 System Design Overview

The system follows a modular architecture with clear separation of concerns:
• Controllers → Handle request/response
• Services → Business logic (processing, retrieval, AI)
• Models → MongoDB schemas
• Middleware → Authentication (JWT)

Key flows: 1. Document Upload → Processing Pipeline 2. Query → Retrieval → AI Generation 3. Chat History → Stored & Retrieved per user

## 📄 Document Processing Pipeline

When a document is uploaded: 1. File is stored using Multer 2. Background processing is triggered (non-blocking) 3. Text is extracted:
• PDF → pdfjs-dist
• DOCX → mammoth 4. Text is split into chunks (~500 chars) 5. Each chunk is embedded (lightweight embedding) 6. Stored in MongoDB with:
• userId
• documentId
• text
• embedding

Processing status:
uploaded → processing → ready / error

## 🔍 Retrieval System (RAG Pipeline)

When a user asks a question: 1. Query is received with:
• question
• documentId
• userId 2. System:
• Retrieves relevant chunks using similarity logic
• Ranks and selects top chunks 3. Context is built:
Top N chunks → combined into context 4. AI generates answer using:
Context + Question → Answer 5. If no relevant chunks:
"I don't have enough information."

## 💬 Chat System

• Each interaction is stored:
userId, documentId, question, answer, sources

• Chat history is:
✔ Persistent
✔ Document-specific
✔ User-isolated

## ✨ Advanced Feature

🔹 Highlighting Answers in Sources

The system highlights query-related keywords in retrieved source chunks, improving:
• Explainability
• Transparency
• User trust in AI responses

## 🧠 Design Decisions & Trade-offs

1. Custom Embeddings (Simplified)
   • Used lightweight embedding instead of heavy vector DB
   • Trade-off: lower semantic accuracy
   • Benefit: faster development, simpler system

2. MongoDB over Vector DB
   • All chunks stored in MongoDB
   • Trade-off: not optimized for large-scale vector search
   • Benefit: simplicity and easy integration

3. Background Processing
   • Document processing runs asynchronously
   • Prevents blocking API requests

4. PDF Parsing via pdfjs-dist
   • Chosen for stability with ESM
   • Avoided pdf-parse due to compatibility issues

5. Strict User Isolation
   • All queries filtered by userId
   • Prevents cross-user data leakage

## ⚠️ Known Limitations

    •	No PPT/PPTX support (can be added later)
    •	Embedding logic is simplified (not production-grade)
    •	No vector database (e.g., Pinecone, FAISS)
    •	No advanced semantic ranking
    •	Basic UI (not fully polished)
    •	No streaming responses

## API Reference

### Auth

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/api/auth/signup` | Register new user  |
| POST   | `/api/auth/login`  | Login, returns JWT |

### Documents

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/documents/upload` | Upload document(s)     |
| GET    | `/api/documents`        | List user's documents  |
| DELETE | `/api/documents/:id`    | Delete document(chats) |

### Chat

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/query`         | Ask a question about a document      |
| GET    | `/api/query/history` | chat history for a specific document |

## 📌 Future Improvements

    •	Add vector database (Pinecone / Weaviate)
    •	Improve embeddings (OpenAI / Gemini embeddings)
    •	Multi-document querying
    •	Better UI/UX (chat styling, auto-scroll)
    •	File preview with highlighted sections

## 🎯 Conclusion

This project demonstrates:
• End-to-end RAG system design
• Multi-step AI pipeline
• Backend architecture and modularity
• Real-world engineering trade-offs
