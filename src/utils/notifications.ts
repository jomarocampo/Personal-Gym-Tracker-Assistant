import * as Notifications from "expo-notifications";

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleWeeklySummary(
  dayOfWeek: number, // 1=Sunday, 2=Monday, ... 7=Saturday
  hour: number,
  minute: number = 0
): Promise<string> {
  await cancelNotificationsByTag("weekly_summary");

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Weekly Workout Summary",
      body: "Check out your progress this week!",
      data: { type: "weekly_summary" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: dayOfWeek,
      hour,
      minute,
    },
  });

  return id;
}

export async function scheduleWorkoutNudge(
  hour: number = 17,
  minute: number = 0
): Promise<string> {
  await cancelNotificationsByTag("workout_nudge");

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to Train!",
      body: "You haven't worked out today. Ready to hit the gym?",
      data: { type: "workout_nudge" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
}

export async function cancelNotificationsByTag(tag: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.type === tag) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function configureForegroundNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
