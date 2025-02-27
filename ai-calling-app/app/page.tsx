"use client";

import { useState } from "react";

export default function Home() {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [context, setContext] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const handleCall = async () => {
        setStatus("Calling...");

        const response = await fetch("/api/makeCall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, context }),
        });

        const data = await response.json();
        if (response.ok) {
            setStatus(`Call initiated! Call SID: ${data.callSid}`);
        } else {
            setStatus(`Error: ${data.error}`);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>AI Calling Assistant</h1>
            <input 
                type="text" 
                placeholder="Enter phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
            />
            <br />
            <textarea 
                placeholder="Enter call context" 
                value={context} 
                onChange={(e) => setContext(e.target.value)}
                style={{ padding: "10px", marginBottom: "10px", width: "300px", height: "100px" }}
            />
            <br />
            <button onClick={handleCall} style={{ padding: "10px 20px", cursor: "pointer" }}>
                Make Call
            </button>
            <p>{status}</p>
        </div>
    );
}
