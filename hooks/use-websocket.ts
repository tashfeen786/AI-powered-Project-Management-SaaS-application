"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1/ws";

interface WebSocketMessage {
  event: string;
  project_id?: string;
  organization_id?: string;
  timestamp: string;
  payload: any;
}

export function useWebSocket(projectId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Connect with token
    ws.current = new WebSocket(`${WS_URL}?token=${token}`);

    ws.current.onopen = () => {
      setIsConnected(true);
      if (projectId) {
        ws.current?.send(JSON.stringify({ event: "join_project", project_id: projectId }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.event) {
          case "task_updated":
          case "task_created":
          case "task_deleted":
          case "task_moved":
            // Invalidate React Query task cache
            queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
            break;
            
          case "document_processed":
            queryClient.invalidateQueries({ queryKey: ["documents", data.project_id] });
            break;
            
          case "insight_generated":
            queryClient.invalidateQueries({ queryKey: ["insights", data.project_id] });
            break;
            
          case "project_updated":
            queryClient.invalidateQueries({ queryKey: ["project", data.project_id] });
            // Also invalidate jobs if it's a job update
            if (data.payload?.job_id) {
               queryClient.invalidateQueries({ queryKey: ["jobs"] });
            }
            break;
        }
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.current.onclose = () => setIsConnected(false);

    return () => {
      if (projectId && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ event: "leave_project", project_id: projectId }));
      }
      ws.current?.close();
    };
  }, [projectId, queryClient]);

  const sendTypingStatus = (isTyping: boolean) => {
    if (ws.current?.readyState === WebSocket.OPEN && projectId) {
      ws.current.send(JSON.stringify({
        event: isTyping ? "typing_start" : "typing_stop",
        project_id: projectId
      }));
    }
  };

  return { isConnected, sendTypingStatus };
}
