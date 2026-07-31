import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export type CollaborationEvent = "typing_status" | "task_updated" | "new_comment" | "presence_update";

interface WsMessage {
  event: CollaborationEvent;
  project_id?: string;
  organization_id?: string;
  payload?: any;
}

export function useCollaboration(projectId?: string, onMessage?: (event: CollaborationEvent, payload: any) => void) {
  const { token, user } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!token || typeof window === "undefined") return;

    // Use organization scope WS connection as established by the backend
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/v1/ws/organization?token=${token}`;
    
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected for collaboration");
      if (projectId) {
        socket.send(JSON.stringify({ event: "join_project", project_id: projectId }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data: WsMessage = JSON.parse(event.data);
        
        if (data.event === "typing_status") {
          const { user_id, is_typing } = data.payload;
          if (user_id !== user?.id) {
            setTypingUsers(prev => ({ ...prev, [user_id]: is_typing }));
          }
        } else if (data.event === "presence_update") {
          setOnlineUsers(data.payload.online_users || []);
        }
        
        // Pass to custom handler
        if (onMessage) {
          onMessage(data.event, data.payload);
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error", err);
    };

    setWs(socket);

    return () => {
      if (projectId && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event: "leave_project", project_id: projectId }));
      }
      socket.close();
    };
  }, [token, projectId, user?.id]);

  const emitTyping = useCallback((isTyping: boolean) => {
    if (ws && ws.readyState === WebSocket.OPEN && projectId) {
      ws.send(JSON.stringify({
        event: isTyping ? "typing_start" : "typing_stop",
        project_id: projectId
      }));
    }
  }, [ws, projectId]);

  const emitEvent = useCallback((event: string, payload: any) => {
    if (ws && ws.readyState === WebSocket.OPEN && projectId) {
      ws.send(JSON.stringify({
        event,
        project_id: projectId,
        payload
      }));
    }
  }, [ws, projectId]);

  return {
    onlineUsers,
    typingUsers,
    emitTyping,
    emitEvent
  };
}
