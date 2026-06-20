"use client";

import { useEffect, useRef, useState } from "react";

const PRESENCE_CHANNEL = "emi-workspace-presence";
const HEARTBEAT_INTERVAL = 1000;
const TAB_TIMEOUT = 3000;

export default function usePresence() {
  const [activeTabs, setActiveTabs] = useState(1);
  const tabIdRef = useRef("");

  useEffect(() => {
    tabIdRef.current = crypto.randomUUID();

    const channel = new BroadcastChannel(PRESENCE_CHANNEL);
    const tabs = new Map<string, number>();

    function sendHeartbeat() {
      channel.postMessage({
        type: "HEARTBEAT",
        tabId: tabIdRef.current,
        time: Date.now(),
      });
    }

    function updateActiveTabs() {
      const now = Date.now();

      for (const [tabId, lastSeen] of tabs.entries()) {
        if (now - lastSeen > TAB_TIMEOUT) {
          tabs.delete(tabId);
        }
      }

      setActiveTabs(tabs.size + 1);
    }

    channel.onmessage = (event) => {
      const message = event.data;

      if (message.type === "HEARTBEAT" && message.tabId !== tabIdRef.current) {
        tabs.set(message.tabId, message.time);
        updateActiveTabs();
      }
    };

    sendHeartbeat();

    const interval = setInterval(() => {
      sendHeartbeat();
      updateActiveTabs();
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, []);

  return {
    tabId: tabIdRef.current,
    activeTabs,
  };
}