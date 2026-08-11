import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AdminDashboard() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // 👈 Updated endpoint to match app.use("/api/results", resultRoutes) in server.js
                const { data } = await API.get("/results");
                setResults(data.results || data || []);
            } catch (err) {
                setError("Failed to fetch student results or unauthorized access.");
            }
        };
        fetchResults();
    }, []);

    return (
        <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h2>Admin Dashboard</h2>
                    <p style={{ margin: 0 }}>Welcome, Administrator. Review student quiz submissions below:</p>
                </div>
                <button 
                    onClick={() => navigate("/create-quiz")}
                    style={{ padding: "10px 15px", background: "#28a745", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px", fontWeight: "600" }}
                >
                    + Create New Quiz
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            
            <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f4f4f4" }}>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Quiz Title</th>
                        <th>Score</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No student results recorded yet.</td>
                        </tr>
                    ) : (
                        results.map((res) => (
                            <tr key={res._id}>
                                <td>{res.student?.name || "N/A"}</td>
                                <td>{res.student?.email || "N/A"}</td>
                                <td>{res.quiz?.title || "N/A"}</td>
                                <td>{res.score} / {res.totalMarks}</td>
                                <td>{res.percentage?.toFixed(1)}%</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}