namespace Server.core.dtos {
    public class NotificationSettings {
        public bool EmailNotificationsEnabled { get; set; }
        public List<TimeSpan> MedicineReminderTimes { get; set; } = new();
        public List<TimeSpan> GoalReminderTimes { get; set; } = new();
        public DateTime LastNotificationSent { get; set; }
    }
}
