"use client";

import { useEffect, useRef, useState } from "react";
import { WorkspaceState } from "@/types";

const CHANNEL_NAME = "emi-workspace";

type Props = {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
};

export default function useSharedWorkspace({ state, setState }: Props) {
  const [tabId, setTabId] = useState("");
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isReceivingRef = useRef(false);

  useEffect(() => {
    const id = crypto.randomUUID();
    setTabId(id);

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const message = event.data;

      if (message.sourceTabId === id) return;

      if (message.type === "STATE_UPDATE") {
        isReceivingRef.current = true;
        setState(message.payload);

        setTimeout(() => {
          isReceivingRef.current = false;
        }, 0);
      }
    };

    return () => {
      channel.close();
    };
  }, [setState]);

  useEffect(() => {
    if (!channelRef.current) return;
    if (!tabId) return;
    if (isReceivingRef.current) return;

    channelRef.current.postMessage({
      type: "STATE_UPDATE",
      payload: state,
      sourceTabId: tabId,
    });
  }, [state, tabId]);

  return { tabId };
}