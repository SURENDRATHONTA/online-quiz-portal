import { useLocation, useNavigate } from "react-router-dom";

function Result() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="container mt-5">
                <h3>No Result Found</h3>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/student-dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const { result } = state;

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-success mb-4">Quiz Result</h2>
                    <h4>Score : {result.score} / {result.totalMarks}</h4>
                    <h4>Percentage : {result.percentage}%</h4>
                </div>
            </div>
        </div>
    );
}

export default Result;