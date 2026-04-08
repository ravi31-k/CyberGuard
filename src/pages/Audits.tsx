import React, { useEffect, useState } from "react";
import api from "../lib/api.ts";
import { ShieldCheck, FileText, Download, Filter, Search, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

const Audits = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audits");
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="font-mono uppercase">Accessing Compliance Vault...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414] pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic serif">Compliance & Audits</h1>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">
            Immutable log of security events and policy compliance status.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border-2 border-[#141414] px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="bg-[#141414] text-[#E4E3E0] px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
            <FileText className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border-2 border-[#141414] bg-[#E4E3E0]">
          <div className="bg-[#141414] text-[#E4E3E0] p-3 font-mono text-[10px] uppercase tracking-widest flex justify-between items-center">
            <span>Audit Log Terminal</span>
            <div className="flex gap-4 opacity-60">
              <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> Filter</span>
              <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Search</span>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto font-mono text-[11px] divide-y divide-[#141414]">
            {logs.length > 0 ? logs.map((log, i) => (
              <LogRow key={log._id || i} log={log} />
            )) : (
              <>
                <LogRow log={{ timestamp: "2024-04-08T04:30:00Z", severity: "CRITICAL", action: "AUTH_FAILURE", resource: "USER_LOGIN", details: { ip: "103.45.2.1", user: "admin@cyberguard.com" } }} />
                <LogRow log={{ timestamp: "2024-04-08T04:15:00Z", severity: "INFO", action: "CAMPAIGN_DEPLOY", resource: "PHISHING_ENGINE", details: { id: "Q2_FINANCE", targets: 150 } }} />
                <LogRow log={{ timestamp: "2024-04-08T03:45:00Z", severity: "WARNING", action: "POLICY_VIOLATION", resource: "ENDPOINT_PROTECTION", details: { device: "USB_STORAGE_DETECTED", user: "j.doe" } }} />
                <LogRow log={{ timestamp: "2024-04-08T03:00:00Z", severity: "INFO", action: "COURSE_COMPLETE", resource: "TRAINING_MODULE", details: { course: "Phishing 101", user: "r.smith" } }} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-[#141414] p-6 bg-[#E4E3E0] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <h3 className="font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Compliance Status
            </h3>
            <div className="space-y-4">
              <ComplianceItem label="ISO 27001" status="92%" />
              <ComplianceItem label="SOC 2 TYPE II" status="85%" />
              <ComplianceItem label="GDPR" status="100%" />
              <ComplianceItem label="HIPAA" status="N/A" />
            </div>
          </div>

          <div className="border-2 border-[#141414] p-6 bg-[#141414] text-[#E4E3E0] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <h3 className="font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" /> Security Advisory
            </h3>
            <p className="text-xs opacity-80 leading-relaxed italic">
              "System audit reveals 12% of employees have not completed the mandatory Q1 Security Refresh. High risk of credential harvesting detected in Finance department."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogRow = ({ log }: { log: any, key?: any }) => {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL": return "text-red-600 font-bold";
      case "WARNING": return "text-yellow-600";
      default: return "opacity-40";
    }
  };

  const Icon = log.severity === "CRITICAL" ? ShieldAlert : log.severity === "WARNING" ? AlertTriangle : Info;

  return (
    <div className="p-4 flex gap-4 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group">
      <div className="flex flex-col items-center w-16 opacity-40">
        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-3 h-3 ${getSeverityColor(log.severity)}`} />
          <span className={`uppercase tracking-tighter ${getSeverityColor(log.severity)}`}>[{log.severity}]</span>
          <span className="font-bold uppercase tracking-tight">{log.action}</span>
        </div>
        <p className="opacity-60 text-[10px] uppercase">Resource: {log.resource} | Details: {JSON.stringify(log.details)}</p>
      </div>
    </div>
  );
};

const ComplianceItem = ({ label, status }: { label: string, status: string }) => (
  <div className="flex justify-between items-center border-b border-[#141414] border-dashed pb-2">
    <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
    <span className="font-bold text-sm">{status}</span>
  </div>
);

export default Audits;
