
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";


// 🔐 Signup
export const signup = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    return res.json();
  };
  
  // 🔐 Login
  export const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    return res.json();
  };

// Upload document
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  //console.log("UPLOAD TOKEN:", token);
  const res = await fetch(`${BASE_URL}/api/documents/upload`, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`,
      },
    body: formData,

  });

  return res.json();
};

// Get all documents
export const getDocuments = async () => {
    const token = localStorage.getItem("token");
    //console.log("GET DOC TOKEN:", token);
    const res = await fetch(`${BASE_URL}/api/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();
  };
  export const deleteDocument = async (id: string) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${BASE_URL}/api/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return res.json();
  };
// Ask question (per document)
export const askQuestion = async (question: string, documentId: string) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question, documentId }),
  });
  console.log("TOKEN:", localStorage.getItem("token"));
  return res.json();
};

export const getChatHistory = async (documentId: string) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(
      `${BASE_URL}/api/query/history?documentId=${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return res.json();
  };
