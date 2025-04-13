using MongoDB.Driver;
using Server.core.entities;
using Server.core.interfaces;

namespace Server.infrastructure.services {
    public class NotificationBackgroundService : BackgroundService {
        private readonly IServiceProvider _services;
        private readonly ILogger<NotificationBackgroundService> _logger;

        public NotificationBackgroundService( IServiceProvider services,ILogger<NotificationBackgroundService> logger) {
            _services = services;
            _logger = logger;
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
            while (!stoppingToken.IsCancellationRequested) {
                using (var scope = _services.CreateScope()) {
                    var mongoDb = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    var userCollection = mongoDb.GetCollection<User>("Users");

                    var currentTime = DateTime.Now.TimeOfDay;
                    var twoMinutesAgo = DateTime.Now.AddMinutes(-2).TimeOfDay;
                    
                    _logger.LogInformation($"Checking for reminders at {DateTime.Now}");
                    
                    var users = await userCollection.Find(u => 
                        u.NotificationSettings.EmailNotificationsEnabled &&
                        u.NotificationSettings.MedicineReminderTimes.Any(t => 
                            t >= twoMinutesAgo && t <= currentTime))
                        .ToListAsync();

                    foreach (var user in users) {
                        await SendReminders(user, emailService);
                    }
                }
                await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
            }
        }

        private async Task SendReminders(User user, IEmailService emailService) {
            var activeMedicines = user.Medicine.Where(m => !m.IsCompleted).ToList();
            var activeGoals = user.Goals.Where(g => !g.IsCompleted).ToList();

            if (activeMedicines.Any()) {
                await emailService.SendEmailAsync(
                    user.Email,
                    "Medicine Reminder",
                    $"Don't forget to take: {string.Join(", ", activeMedicines.Select(m => m.MedicineName))}"
                );
            }

            if (activeGoals.Any()) {
                await emailService.SendEmailAsync(
                    user.Email,
                    "Goal Progress Reminder",
                    $"Keep working on your goals: {string.Join(", ", activeGoals.Select(g => g.Type))}"
                );
            }
        }

    }
}
