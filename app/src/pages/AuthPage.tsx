import React, { useState } from "react";
import SignIn from "../pages/LoginPage";
import SignUp from "../pages/SignupPage";
import StarBackground from "../components/StarBackground";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <StarBackground />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back!" : "Begin Your Adventure!"}
          </h1>
          <p className="text-purple-300">
            {isLogin
              ? "Track the northern lights and share your experiences"
              : "Join our community of aurora enthusiasts"}
          </p>
        </div>

        {isLogin ? <SignIn /> : <SignUp />}

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-300 hover:text-white transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
