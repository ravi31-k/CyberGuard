import React, { useEffect, useState } from "react";
import api from "../lib/api.ts";
import { MailWarning, Send, Target, AlertCircle, Plus, ChevronRight, Eye } from "lucide-react";
import { motion } from "motion/react";

const Phishing = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get("/phishing");
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <div className="font-mono uppercase">Synchronizing Campaign Data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414] pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic serif">Simulation Engine</h1>
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-2">
            Design and deploy simulated attack vectors to test organizational resilience.
          </p>
        </div>
        <button className="bg-[#141414] text-[#E4E3E0] px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[#141414] p-4 flex items-center gap-4">
          <div className="p-3 bg-[#141414] text-[#E4E3E0]">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase opacity-60">Total Sent</p>
            <p className="text-2xl font-bold tracking-tighter">1,240</p>
          </div>
        </div>
        <div className="border border-[#141414] p-4 flex items-center gap-4">
          <div className="p-3 bg-yellow-500 text-[#141414]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase opacity-60">Open Rate</p>
            <p className="text-2xl font-bold tracking-tighter">42%</p>
          </div>
        </div>
        <div className="border border-[#141414] p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500 text-[#E4E3E0]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase opacity-60">Compromise Rate</p>
            <p className="text-2xl font-bold tracking-tighter">12%</p>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="border-2 border-[#141414] bg-[#E4E3E0]">
        <div className="grid grid-cols-5 bg-[#141414] text-[#E4E3E0] p-3 font-mono text-[10px] uppercase tracking-widest">
          <div className="col-span-2">Campaign Name</div>
          <div>Status</div>
          <div>Targets</div>
          <div className="text-right">Activity</div>
        </div>
        <div className="divide-y divide-[#141414]">
          {campaigns.length > 0 ? campaigns.map((campaign) => (
            <CampaignRow key={campaign._id} campaign={campaign} />
          )) : (
            <>
              <CampaignRow campaign={{ name: "Q2_FINANCE_URGENT", status: "ACTIVE", targets: new Array(150), startDate: "2024-04-01" }} />
              <CampaignRow campaign={{ name: "IT_PASSWORD_RESET", status: "COMPLETED", targets: new Array(500), startDate: "2024-03-15" }} />
              <CampaignRow campaign={{ name: "HR_BENEFITS_UPDATE", status: "DRAFT", targets: new Array(0), startDate: "2024-04-10" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CampaignRow = ({ campaign }: { campaign: any, key?: any }) => (
  <div className="grid grid-cols-5 p-4 items-center hover:bg-[#141414] hover:text-[#E4E3E0] transition-all group cursor-pointer">
    <div className="col-span-2 flex items-center gap-3">
      <MailWarning className="w-4 h-4 opacity-40" />
      <div>
        <p className="font-bold tracking-tight uppercase">{campaign.name}</p>
        <p className="font-mono text-[9px] opacity-60 uppercase">Started: {campaign.startDate}</p>
      </div>
    </div>
    <div>
      <span className={`font-mono text-[9px] px-2 py-1 border border-current uppercase ${
        campaign.status === 'ACTIVE' ? 'text-green-600' : 'opacity-40'
      }`}>
        {campaign.status}
      </span>
    </div>
    <div className="font-mono text-xs">
      {campaign.targets?.length || 0} NODES
    </div>
    <div className="flex justify-end">
      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
    </div>
  </div>
);

export default Phishing;
