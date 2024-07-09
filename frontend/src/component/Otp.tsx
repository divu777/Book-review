import axios from "axios";
import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Otp: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = element.value;
      return newOtp;
    });

    // Focus next input
    if (element.value !== "") {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify-otp`,
          {
            otp: otpValue,
            email,
          }
        );
        if (response.data.success) {
          alert("OTP verified successfully. User registered.");
          const { token } = response.data;
          localStorage.setItem("token", token);
          navigate("/dashboard"); // Redirect on successful verification
        } else {
          alert("Invalid OTP. User registration cancelled.");
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/resend-otp`,
        { email }
      );
      if (response.status === 200) {
        alert("OTP has been resent to your email.");
      } else {
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to your email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target, index)
                  }
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              ))}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify OTP
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              className="mt-2 text-indigo-600 hover:text-indigo-500"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
