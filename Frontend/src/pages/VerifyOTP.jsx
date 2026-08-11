import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Automatically extract email if redirected from Register page
    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/verify-otp", {
                email,
                otp
            });

            console.log("Verify OTP Success:", response.data);
            alert("✅ OTP Verified Successfully!");
            navigate("/login");
        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Data:", JSON.stringify(error.response?.data, null, 2));
            alert(error.response?.data?.message || "Invalid or expired OTP");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Verify OTP</h2>

                            <form onSubmit={handleVerifyOTP}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">OTP</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-warning w-100"
                                >
                                    Verify OTP
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;