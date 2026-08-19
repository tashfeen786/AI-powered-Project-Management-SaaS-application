"use client";

import { useState } from "react";
import { TaskResponse, AssignmentRecommendationResponse } from "@/types/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";
import { AssigneeAvatar } from "./AssigneeAvatar";
import { Sparkles, Loader2, AlertCircle, Check, X, UserCog } from "lucide-react";
import { useMembers } from "@/features/team/hooks/useMembers";

interface TaskAssigneeSectionProps {
  task: TaskResponse;
}

export function TaskAssigneeSection({ task }: TaskAssigneeSectionProps) {
  const queryClient = useQueryClient();
  const { data: members } = useMembers();
  
  const [recommendation, setRecommendation] = useState<AssignmentRecommendationResponse | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [localError, setLocalError] = useState("");

  const recommendMutation = useMutation({
    mutationFn: () => TaskService.recommendDeveloper(task.id),
    onSuccess: (data) => {
      setRecommendation(data);
      setLocalError("");
    },
    onError: (error: any) => {
      setLocalError(error?.response?.data?.detail || "Failed to generate recommendation");
    }
  });

  const assignMutation = useMutation({
    mutationFn: (assigneeId: string | null) => TaskService.assignTask(task.id, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", task.id] });
      setRecommendation(null);
      setIsChanging(false);
    }
  });

  const handleRecommend = () => {
    recommendMutation.mutate();
  };

  const handleAccept = () => {
    if (recommendation) {
      assignMutation.mutate(recommendation.recommended_developer_id);
    }
  };

  const handleDismiss = () => {
    setRecommendation(null);
  };

  const handleManualAssign = (userId: string) => {
    assignMutation.mutate(userId);
  };

  const currentAssigneeName = task.assignee?.full_name || "Unassigned";
  const currentInitials = task.assignee?.full_name ? task.assignee.full_name.substring(0, 2).toUpperCase() : "UN";

  return (
    <div className="flex flex-col gap-3">
      {/* Current Assignee Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AssigneeAvatar initials={currentInitials} name={currentAssigneeName} />
          <span className="text-sm font-medium text-text-primary">{currentAssigneeName}</span>
        </div>
        
        {!recommendation && !isChanging && (
          <button 
            onClick={handleRecommend}
            disabled={recommendMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
          >
            {recommendMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Recommend Developer
          </button>
        )}
      </div>

      {localError && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-md flex items-start gap-2 mt-2">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <div className="text-xs text-error">
            <p>{localError}</p>
            <button onClick={handleRecommend} className="mt-1 font-semibold underline hover:no-underline">Try Again</button>
          </div>
        </div>
      )}

      {/* Recommendation UI */}
      {recommendation && !isChanging && (
        <div className="mt-2 p-4 bg-surface border border-primary/30 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
            <div className="h-full bg-primary" style={{ width: `${recommendation.confidence}%` }}></div>
          </div>
          
          <div className="flex justify-between items-start mb-3 mt-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Sparkles className="w-4 h-4" /> AI Recommendation
            </div>
            <span className="text-xs font-bold text-text-secondary bg-background px-2 py-1 rounded-full border border-border">
              {recommendation.confidence}% Match
            </span>
          </div>

          <div className="mb-4">
            <div className="text-sm font-bold text-text-primary mb-1">{recommendation.developer_name}</div>
            <div className="text-xs text-text-secondary mb-2">{recommendation.job_role || "Team Member"}</div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-background rounded p-2 border border-border">
                <div className="text-[10px] uppercase text-text-secondary font-semibold">Workload</div>
                <div className="text-xs font-medium">{recommendation.current_workload}h active</div>
              </div>
              <div className="bg-background rounded p-2 border border-border">
                <div className="text-[10px] uppercase text-text-secondary font-semibold">Task Est.</div>
                <div className="text-xs font-medium">{recommendation.estimated_task_hours}h</div>
              </div>
            </div>

            {recommendation.matching_skills && recommendation.matching_skills.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] uppercase text-text-secondary font-semibold mb-1">Matching Skills</div>
                <div className="flex flex-wrap gap-1">
                  {recommendation.matching_skills.map((skill, idx) => (
                    <span key={idx} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-text-secondary italic bg-background p-2 rounded border border-border">
              "{recommendation.reason}"
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAccept}
              disabled={assignMutation.isPending}
              className="flex-1 bg-primary text-surface py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
            >
              {assignMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Accept
            </button>
            <button 
              onClick={() => setIsChanging(true)}
              disabled={assignMutation.isPending}
              className="px-3 bg-surface border border-border text-text-primary py-2 rounded-md text-xs font-semibold hover:bg-background transition-colors"
            >
              Change
            </button>
            <button 
              onClick={handleDismiss}
              disabled={assignMutation.isPending}
              className="px-3 bg-surface border border-border text-text-secondary hover:text-danger py-2 rounded-md text-xs font-semibold hover:bg-danger/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Change UI */}
      {isChanging && (
        <div className="mt-2 p-4 bg-surface border border-border rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold flex items-center gap-2">
              <UserCog className="w-4 h-4" /> Select Developer
            </div>
            <button onClick={() => setIsChanging(false)} className="text-text-secondary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {members?.map((member) => (
              <button
                key={member.user_id}
                onClick={() => handleManualAssign(member.user_id)}
                disabled={assignMutation.isPending}
                className="w-full text-left px-3 py-2 bg-background hover:bg-primary/5 border border-border rounded-md text-sm flex justify-between items-center transition-colors"
              >
                <span>{member.full_name || member.email}</span>
                <span className="text-xs text-text-secondary">{member.job_role || "Member"}</span>
              </button>
            ))}
            
            <button
              onClick={() => handleManualAssign("")}
              disabled={assignMutation.isPending}
              className="w-full text-left px-3 py-2 bg-background hover:bg-danger/5 border border-border rounded-md text-sm flex justify-between items-center transition-colors text-danger"
            >
              <span>Unassign Task</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
