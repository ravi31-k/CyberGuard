import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import api from "../lib/api.ts";
import { 
  ShieldAlert, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Target,
  AlertTriangle,
  ChevronRight,
  BrainCircuit
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="font-mono uppercase">Loading System Metrics...</div>;

  const isAdmin = user?.role === "ADMIN" || user?.role === "ANALYST";

  const chartData = [
    { name: "JAN", risk: 65, phishing: 12 },
    { name: "FEB", risk: 58, phishing: 8 },
    { name: "MAR", risk: 52, phishing: 15 },
    { name: "APR", risk: 45, phishing: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414] pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic serif">Mission Control</h1>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">
            Security Posture: <span className="text-green-600 font-bold">STABLE</span> | Last Audit: 24H AGO
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#141414] text-[#E4E3E0] px-4 py-2 font-mono text-xs uppercase tracking-widest">
            Risk Level: {isAdmin ? (stats?.avgRiskScore || 45) : stats?.riskScore}%
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard icon={Users} label="Total Personnel" value={stats?.totalUsers || 0} trend="-2%" />
            <StatCard icon={BookOpen} label="Training Compliance" value="88%" trend="+5%" />
            <StatCard icon={Target} label="Phishing Clicks" value={stats?.totalClicks || 0} trend="-12%" />
            <StatCard icon={ShieldAlert} label="Compromised" value={stats?.totalCompromised || 0} trend="-100%" color="text-red-600" />
          </>
        ) : (
          <>
            <StatCard icon={ShieldAlert} label="Personal Risk" value={`${stats?.riskScore}%`} trend="-5%" />
            <StatCard icon={BookOpen} label="Courses Completed" value={stats?.completedCourses || 0} trend="+1" />
            <StatCard icon={Target} label="Simulations Passed" value="4/5" trend="80%" />
            <StatCard icon={TrendingDown} label="Improvement" value="Top 15%" trend="+2%" />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-2 border-[#141414] p-6 bg-[#E4E3E0] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <h2 className="font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Risk Trend Analysis
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#141414" opacity={0.1} />
                <XAxis dataKey="name" stroke="#141414" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#141414" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141414", border: "none", color: "#E4E3E0", fontFamily: "monospace", fontSize: "10px" }}
                  itemStyle={{ color: "#E4E3E0" }}
                />
                <Line type="monotone" dataKey="risk" stroke="#141414" strokeWidth={2} dot={{ r: 4, fill: "#141414" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-2 border-[#141414] p-6 bg-[#E4E3E0] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <h2 className="font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" /> AI Risk Prediction
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-[#141414] border-dashed">
              <p className="text-xs font-mono mb-2 uppercase opacity-60">AI Analysis Summary</p>
              <p className="text-sm italic">"Employee shows high susceptibility to social engineering based on recent simulation interactions. Recommendation: Assign Advanced Social Engineering Module."</p>
            </div>
            <button className="w-full bg-[#141414] text-[#E4E3E0] p-3 font-mono text-[10px] uppercase tracking-widest hover:bg-opacity-90 transition-all">
              Run New Prediction
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity (Visible Grid) */}
      <div className="border-2 border-[#141414] overflow-hidden">
        <div className="bg-[#141414] text-[#E4E3E0] p-3 font-mono text-[10px] uppercase tracking-widest">
          Recent Security Events
        </div>
        <div className="divide-y divide-[#141414]">
          <ActivityRow type="ALERT" msg="Unauthorized login attempt detected from IP 192.168.1.45" time="2M AGO" />
          <ActivityRow type="INFO" msg="Phishing Campaign 'Q2_FINANCE' successfully deployed" time="1H AGO" />
          <ActivityRow type="SUCCESS" msg="Employee 'John Doe' completed 'Password Security' course" time="3H AGO" />
          <ActivityRow type="WARNING" msg="Policy violation: External storage device detected" time="5H AGO" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color = "text-[#141414]" }) => (
  <div className="border-2 border-[#141414] p-6 bg-[#E4E3E0] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[#141414] text-[#E4E3E0]">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-mono text-[10px] text-green-600 font-bold">{trend}</span>
    </div>
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className={`text-3xl font-bold tracking-tighter ${color}`}>{value}</p>
    </div>
  </div>
);

const ActivityRow = ({ type, msg, time }) => (
  <div className="flex items-center gap-4 p-4 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group cursor-pointer">
    <div className={`w-2 h-2 rounded-full ${type === 'ALERT' ? 'bg-red-500' : type === 'WARNING' ? 'bg-yellow-500' : 'bg-green-500'}`} />
    <span className="font-mono text-[10px] opacity-40 w-16">{time}</span>
    <span className="text-sm font-medium flex-1">{msg}</span>
    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
  </div>
);

export default Dashboard;
