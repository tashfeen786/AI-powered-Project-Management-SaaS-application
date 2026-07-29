"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1/ws";

const RECONNECT_INTERVAL_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

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
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    // Close existing connection
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      ws.current.close();
    }

    ws.current = new WebSocket(`${WS_URL}?token=${token}`);

    ws.current.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;

      // Join project room if projectId is provided
      if (projectId) {
        ws.current?.send(JSON.stringify({ event: "join_project", project_id: projectId }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketEvent(data);
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);

      // Auto-reconnect
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectTimer.current = setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, RECONNECT_INTERVAL_MS);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error", error);
    };
  }, [projectId]);

  const handleWebSocketEvent = useCallback((data: WebSocketMessage) => {
    switch (data.event) {
      // Task events
      case "task_created":
      case "task_updated":
      case "task_deleted":
      case "task_moved":
        queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
        break;

      // Document events
      case "document_processed":
        queryClient.invalidateQueries({ queryKey: ["documents", data.project_id] });
        break;

      // AI generation events
      case "requirement_generated":
        queryClient.invalidateQueries({ queryKey: ["requirements", data.project_id] });
        queryClient.invalidateQueries({ queryKey: ["conversation", data.project_id] });
        queryClient.invalidateQueries({ queryKey: ["draft", data.project_id] });
        break;

      case "planning_generated":
        queryClient.invalidateQueries({ queryKey: ["planningConversation", data.project_id] });
        queryClient.invalidateQueries({ queryKey: ["planningDraft", data.project_id] });
        break;

      case "tasks_generated":
        queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
        queryClient.invalidateQueries({ queryKey: ["taskGenerations", data.project_id] });
        break;

      // Insight events
      case "insight_generated":
        queryClient.invalidateQueries({ queryKey: ["insights", data.project_id] });
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
        break;

      // Project events
      case "project_updated":
        queryClient.invalidateQueries({ queryKey: ["project", data.project_id] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        break;

      // Notification events
      case "notification":
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        break;

      // Background job events
      case "job_progress":
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        if (data.payload?.job_id) {
          queryClient.invalidateQueries({ queryKey: ["job", data.payload.job_id] });
        }
        break;

      case "job_completed":
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        if (data.payload?.job_id) {
          queryClient.invalidateQueries({ queryKey: ["job", data.payload.job_id] });
        }
        // Also refresh project data since job completion may have changed state
        if (data.project_id) {
          queryClient.invalidateQueries({ queryKey: ["project", data.project_id] });
        }
        break;

      // Typing events (no cache invalidation needed, could dispatch to UI state)
      case "typing_start":
      case "typing_stop":
        // These could be handled via a separate state manager if needed
        break;

      default:
        console.log("Unhandled WS event:", data.event);
    }
  }, [queryClient]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      if (projectId && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ event: "leave_project", project_id: projectId }));
      }
      ws.current?.close();
    };
  }, [connect]);

  const sendTypingStatus = (isTyping: boolean) => {
    if (ws.current?.readyState === WebSocket.OPEN && projectId) {
      ws.current.send(JSON.stringify({
        event: isTyping ? "typing_start" : "typing_stop",
        project_id: projectId,
      }));
    }
  };

  return { isConnected, sendTypingStatus };
}
