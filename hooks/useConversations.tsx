"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
  const params = useParams();

  const conversationsId = useMemo(
    () => params?.conversationsId || ("" as string),
    [params?.conversationId]
  );

  const isActive = useMemo(() => !!conversationsId, [conversationsId]);

  return {
    isActive,
    conversationId: conversationsId,
  };
};
