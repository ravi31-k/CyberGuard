import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import api from "../lib/api.ts";
import { Shield, Lock, Mail, Loader2 } from "lucide-react";
import { motion } from "motion/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#E4E3E0] border-2 border-[#141414] p-8 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#141414] flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-[#E4E3E0]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-[#141414]">CyberGuard</h1>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-1">Enterprise Security Training</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Terminal Identity (Email)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[#141414] p-3 pl-10 focus:outline-none focus:bg-[#141414] focus:text-[#E4E3E0] transition-all font-mono text-sm"
                placeholder="USER@CYBERGUARD.COM"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest mb-2 opacity-60">Access Key (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-[#141414] p-3 pl-10 focus:outline-none focus:bg-[#141414] focus:text-[#E4E3E0] transition-all font-mono text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-500 text-red-700 text-xs font-mono uppercase">
              [ERROR]: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#141414] text-[#E4E3E0] p-4 font-mono uppercase tracking-[0.2em] font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Session"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#141414] border-dashed">
          <p className="text-[10px] font-mono uppercase text-center opacity-40">
            Authorized Access Only. All interactions are logged and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
