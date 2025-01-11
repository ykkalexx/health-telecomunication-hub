using Server.core.entities;

namespace Server.core.dtos {
    public class CreateGoalDto {
        public string UserId { get; set; }
        public GoalType Type { get; set; }
        public double CurrentValue { get; set; }
        public double TargetValue { get; set; }
        public DateTime TargetDate { get; set; }
    }

    public class GoalResponseDto {
        public string Id { get; set; }
        public GoalType Type { get; set; }
        public double CurrentValue { get; set; }
        public double TargetValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime TargetDate { get; set; }
        public bool IsCompleted { get; set; }
        public string AiGeneratedAdvice { get; set; }
        public double ProgressPercentage { get; set; }
    }

    public class UpdateGoalDto {
        public string UserId { get; set; }
        public double CurrentValue { get; set; }
        public bool IsCompleted { get; set; }
    }
}
