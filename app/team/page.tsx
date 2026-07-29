"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamToolbar } from "@/components/team/TeamToolbar";
import { TeamTable } from "@/components/team/TeamTable";
import { TeamMobileCard } from "@/components/team/TeamMobileCard";
import { TeamSkeleton } from "@/components/team/TeamSkeleton";
import { EmptyTeam } from "@/components/team/EmptyTeam";
import { InviteMemberDialog } from "@/components/team/InviteMemberDialog";
import { RemoveMemberDialog } from "@/components/team/RemoveMemberDialog";

import { useMembers } from "@/features/team/hooks/useMembers";
import { useInviteMember } from "@/features/team/hooks/useInviteMember";
import { useUpdateRole } from "@/features/team/hooks/useUpdateRole";
import { useDeleteMember } from "@/features/team/hooks/useDeleteMember";
import { TeamMemberResponse, TeamRole } from "@/types/api";

export default function TeamManagementPage() {
  const { data: members, isLoading } = useMembers();
  const { mutate: inviteMember, isPending: isInviting } = useInviteMember();
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: deleteMember, isPending: isRemoving } = useDeleteMember();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMemberResponse | null>(null);

  const handleInvite = (email: string, role: TeamRole) => {
    inviteMember({ email, role }, {
      onSuccess: () => setIsInviteOpen(false)
    });
  };

  const handleRemoveConfirm = () => {
    if (!memberToRemove) return;
    deleteMember(memberToRemove.id, {
      onSuccess: () => setMemberToRemove(null)
    });
  };

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8">
        <TeamHeader onInviteClick={() => setIsInviteOpen(true)} />
        <TeamToolbar />
        
        <div className="mt-4">
          {isLoading ? (
            <TeamSkeleton />
          ) : !members || members.length === 0 ? (
            <EmptyTeam onInviteClick={() => setIsInviteOpen(true)} />
          ) : (
            <>
              {/* Desktop View */}
              <TeamTable 
                members={members} 
                onUpdateRole={(id, role) => updateRole({ id, role })}
                onRemoveMember={setMemberToRemove} 
              />
              
              {/* Mobile View */}
              <div className="md:hidden">
                {members.map(member => (
                  <TeamMobileCard 
                    key={member.id}
                    member={member}
                    onUpdateRole={(id, role) => updateRole({ id, role })}
                    onRemoveMember={setMemberToRemove}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <InviteMemberDialog 
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
        isInviting={isInviting}
      />

      <RemoveMemberDialog
        member={memberToRemove}
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveConfirm}
        isRemoving={isRemoving}
      />
    </AppLayout>
  );
}
