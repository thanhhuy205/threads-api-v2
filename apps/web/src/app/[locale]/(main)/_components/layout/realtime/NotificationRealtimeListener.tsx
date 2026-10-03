"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";
import { useRealtime } from "@/components/layout/RealtimeProvider";
import { notificationKeys } from "@/features/notification";
import { postKeys } from "@/features/post/keys";
import { applyOptimisticPostPatch } from "@/features/post/hooks/shared";
import { RealtimeReportToast } from "./RealtimeReportToast";
import { RealtimeNotificationToast } from "./RealtimeNotificationToast";
import {
  extractRealtimeNotificationToastPayload,
  extractRealtimeReportPayload,
  REALTIME_TOAST_DURATION,
  RealtimeNotificationEvent,
} from "./helper";

export function NotificationRealtimeListener() {
  const { user } = useAuth();
  const { getClient } = useRealtime();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let isActive = true;
    let cleanup: (() => void) | undefined;

    void getClient().then((pusher) => {
      if (!isActive || !pusher || !user?.id) return;

      const notificationChannelName = `private-user-notification-${user.id}`;
      const notificationChannel = pusher.subscribe(notificationChannelName);

      const handleNewNotification = (payload: RealtimeNotificationEvent) => {
        const toastPayload = extractRealtimeNotificationToastPayload(payload);
        if (!toastPayload.message) {
          console.log("Ignoring notification because message is empty");
          return;
        }

        toast.custom(
          () => (
            <RealtimeNotificationToast
              message={toastPayload.message}
              avatar={toastPayload.avatar}
              originPostId={toastPayload.originPostId}
              onOpenPost={(postId) => router.push(`/post/${postId}`)}
            />
          ),
          {
            position: "top-right",
            duration: REALTIME_TOAST_DURATION,
          },
        );

        void queryClient.invalidateQueries({
          queryKey: notificationKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: notificationKeys.unread(),
        });
      };

      const handleOpenTarget = (type: string, publicId: string) => {
        const upperType = type.toUpperCase();
        if (upperType === "POST") {
          router.push(`/post/${publicId}`);
        } else if (upperType === "USER") {
          router.push(`/${publicId}`);
        }
      };

      const handleReportNotification = (payload: RealtimeNotificationEvent) => {
        const reportPayload = extractRealtimeReportPayload(payload);
        if (!reportPayload.message) return;

        toast.custom(
          (t) => (
            <RealtimeReportToast
              reportId={reportPayload.reportId}
              targetPublicId={reportPayload.targetPublicId}
              targetType={reportPayload.targetType}
              message={reportPayload.message}
              action={reportPayload.action}
              toastId={t}
              onOpenTarget={handleOpenTarget}
            />
          ),
          {
            position: "bottom-right",
            duration: 6000,
          },
        );

        const upperTargetType = reportPayload.targetType.toUpperCase();
        if (upperTargetType === "POST" && reportPayload.targetPublicId) {
          if (reportPayload.action === "hide") {
            applyOptimisticPostPatch(
              queryClient,
              postKeys.all,
              reportPayload.targetPublicId,
              (post) => {
                (post as any).isHidden = true;
              },
            );
          } else if (reportPayload.action === "disinformation") {
            applyOptimisticPostPatch(
              queryClient,
              postKeys.all,
              reportPayload.targetPublicId,
              (post) => {
                (post as any).isDisinformation = true;
              },
            );
          }
        }

        void queryClient.invalidateQueries({
          queryKey: notificationKeys.lists(),
        });
        void queryClient.invalidateQueries({
          queryKey: notificationKeys.unread(),
        });
      };

      notificationChannel.bind("new-notifications", handleNewNotification);
      notificationChannel.bind("like-count-update", handleNewNotification);
      notificationChannel.bind("report-processed", handleReportNotification);
      notificationChannel.bind("report-notification", handleReportNotification);

      cleanup = () => {
        notificationChannel.unbind("new-notifications", handleNewNotification);
        notificationChannel.unbind("like-count-update", handleNewNotification);
        notificationChannel.unbind(
          "report-processed",
          handleReportNotification,
        );
        notificationChannel.unbind(
          "report-notification",
          handleReportNotification,
        );

        pusher.unsubscribe(notificationChannelName);
      };
    });

    return () => {
      isActive = false;
      cleanup?.();
    };
  }, [getClient, queryClient, router, user?.id]);

  return null;
}
