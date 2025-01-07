using Server.core.dtos;
using Server.core.entities;

namespace Server.core.interfaces {
    public interface IGoalService {
        Task<GoalResponseDto> CreateGoalAsync(string userId, CreateGoalDto goalDto);
        Task<List<GoalResponseDto>> GetGoalsAsync(string userId);
        Task<GoalResponseDto> UpdateGoalAsync(string userId, string goalId, UpdateGoalDto updateDto);
        Task<string> GenerateAiAdviceAsync(HealthGoal goal);
    }
}
