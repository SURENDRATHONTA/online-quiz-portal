import { useState } from "react";
import api from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

function CreateQuiz() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    
    // State for dynamic questions array
    const [questions, setQuestions] = useState([
        { questionText: "", options: ["", "", "", ""], answer: "", marks: 1 }
    ]);

    const handleQuestionTextChange = (index, value) => {
        const updated = [...questions];
        updated[index].questionText = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleAnswerChange = (index, value) => {
        const updated = [...questions];
        updated[index].answer = value;
        setQuestions(updated);
    };

    const handleMarksChange = (index, value) => {
        const updated = [...questions];
        updated[index].marks = value;
        setQuestions(updated);
    };

    const addQuestionField = () => {
        setQuestions([...questions, { questionText: "", options: ["", "", "", ""], answer: "", marks: 1 }]);
    };

    const handleCreateQuiz = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/quizzes",
                {
                    title,
                    description,
                    timeLimit,
                    questions // Send questions to backend
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                `${response.data.message}\n` +
                `Quiz ID: ${response.data.quiz?._id || "created"}\n` +
                `Total questions: ${questions.length}\n` +
                `Total marks: ${questions.reduce((total, question) => total + Number(question.marks || 1), 0)}`
            );
            setTitle("");
            setDescription("");
            setTimeLimit("");
            setQuestions([{ questionText: "", options: ["", "", "", ""], answer: "", marks: 1 }]);

        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="admin-create-page">
            <AdminNavbar />
            <main className="admin-create-container">
                <div className="admin-create-card">
                    <div className="admin-create-heading">
                        <span className="eyebrow">Assessment studio</span>
                        <h1>Create Quiz &amp; Add Questions</h1>
                        <p>Build a clear, engaging assessment for your students.</p>
                    </div>

                <input
                    className="form-control mb-3"
                    placeholder="Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Time Limit (Minutes)"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                />

                    <hr className="my-4" />
                    <h2 className="admin-question-heading">Questions Section</h2>
                    <p className="text-muted">Set the marks for each question. The quiz total is calculated automatically.</p>

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="admin-question-card">
                        <label className="fw-bold mb-2">Question {qIndex + 1}</label>
                        <input
                            className="form-control mb-2"
                            placeholder="Enter question text"
                            value={q.questionText}
                            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        />

                        <div className="row g-2 mb-2">
                            {q.options.map((opt, oIndex) => (
                                <div className="col-6" key={oIndex}>
                                    <input
                                        className="form-control"
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <input
                            className="form-control"
                            placeholder="Correct Answer (must match one option exactly)"
                            value={q.answer}
                            onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                        />
                        <input
                            type="number"
                            min="1"
                            step="1"
                            className="form-control mt-2"
                            placeholder="Marks for this question"
                            value={q.marks}
                            onChange={(e) => handleMarksChange(qIndex, e.target.value)}
                        />
                    </div>
                ))}

                    <button
                    className="admin-add-question-btn"
                    type="button" 
                    onClick={addQuestionField}
                >
                    + Add Another Question
                </button>

                    <button
                    className="admin-publish-btn"
                    onClick={handleCreateQuiz}
                >
                    Publish Quiz with Questions
                </button>
                </div>
            </main>
        </div>
    );
}

export default CreateQuiz;