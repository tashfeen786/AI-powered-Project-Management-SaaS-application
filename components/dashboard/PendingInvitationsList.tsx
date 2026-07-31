"use client";

import { Check, X, Users } from "lucide-react";
import { useState } from "react";

export function PendingInvitationsList() {
  const [invitations, setInvitations] = useState([
    { id: "1", orgName: "Acme Corp", role: "Developer", inviterName: "Alice" }
  ]);

  const handleAccept = async (id: string) => {
    // In a real app this would hit the /api/v1/team/{member_id}/accept endpoint
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleReject = async (id: string) => {
    // In a real app this would hit the /api/v1/team/{member_id}/reject endpoint
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  if (invitations.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">Pending Invitations</h3>
      </div>
      <div className="space-y-3">
        {invitations.map(inv => (
          <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background border border-border rounded-md gap-4">
            <div>
              <p className="text-sm text-text-primary font-medium">
                <span className="font-semibold text-primary">{inv.inviterName}</span> invited you to join <span className="font-semibold">{inv.orgName}</span>
              </p>
              <p className="text-xs text-text-secondary mt-1">Role: {inv.role}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => handleReject(inv.id)}
                className="h-8 px-3 rounded-md text-xs font-medium bg-surface border border-border text-text-primary hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors focus:outline-none"
              >
                Reject
              </button>
              <button 
                onClick={() => handleAccept(inv.id)}
                className="h-8 px-3 rounded-md text-xs font-medium bg-primary text-surface hover:opacity-90 transition-opacity focus:outline-none flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
