using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.core.entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public List<HealthInfo> HealthInfo { get; set; } = new List<HealthInfo>();
        public List<HealthGoal> Goals { get; set; } = new List<HealthGoal>();
    }

    public class HealthGoal {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public GoalType Type { get; set; }
        public double CurrentValue { get; set; }
        public double TargetValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime TargetDate { get; set; }
        public bool IsCompleted { get; set; }
        public string AiGeneratedAdvice { get; set;}
    }

    public enum GoalType
    {
        Weight,
        HeartRate,
        BloodPressureSystolic,
        BloodPressureDiastolic
    }
}
