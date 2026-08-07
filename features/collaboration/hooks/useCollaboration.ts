import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export type CollaborationEvent = 
  | "typing_status" 
  | "task_updated" 
  | "new_comment" 
  | "presence_update"
  | "reaction_added"
  | "reaction_removed"
  | "attachment_uploaded"
  | "watcher_added"
  | "watcher_removed"
  | "mention_created"
  | "notification_created"
  | "notification_read"
  | "pipeline_started"
  | "requirements_parsed"
  | "planning_generated"
  | "tasks_generated"
  | "assignments_completed"
  | "pipeline_finished"
  | "pipeline_failed";

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
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    if (!token || typeof window === "undefined") return;

    let wsBaseUrl = "";
    if (process.env.NEXT_PUBLIC_API_URL) {
      wsBaseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/^http/, "ws");
    } else {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname; // Supports both localhost and LAN IP
      wsBaseUrl = `${protocol}//${host}:8000/api/v1`;
    }
    
    const wsUrl = `${wsBaseUrl}/ws/organization?token=${token}`;
    
    let reconnectTimeout: NodeJS.Timeout;
    
    const connect = () => {
      console.log(`[WS] Attempting connection to: ${wsUrl}`);
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("[WS] Connected successfully");
        setReconnectAttempt(0);
        if (projectId) {
          console.log(`[WS] Joining project room: ${projectId}`);
          socket.send(JSON.stringify({ event: "join_project", project_id: projectId }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);
          console.log("[WS] Message received:", data.event);
          
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
          console.error("[WS] Failed to parse message:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("[WS] Error occurred. Socket readyState:", socket.readyState);
      };

      socket.onclose = (event) => {
        console.log(`[WS] Connection closed. Code: ${event.code}, Reason: ${event.reason || 'None'}, Clean: ${event.wasClean}`);
        
        // Reconnect with exponential backoff (max 30 seconds)
        if (reconnectAttempt < 10) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
          console.log(`[WS] Scheduling reconnect attempt ${reconnectAttempt + 1} in ${delay}ms...`);
          reconnectTimeout = setTimeout(() => {
            setReconnectAttempt(prev => prev + 1);
          }, delay);
        } else {
          console.error("[WS] Max reconnect attempts reached. Giving up.");
        }
      };

      setWs(socket);
      return socket;
    };

    const socket = connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (projectId && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event: "leave_project", project_id: projectId }));
      }
      socket.close();
    };
  }, [token, projectId, user?.id, reconnectAttempt]);

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
