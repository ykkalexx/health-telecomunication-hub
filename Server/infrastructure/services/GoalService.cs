using Server.core.dtos;
using Server.core.entities;
using Server.core.interfaces;
using System.Text.Json;

namespace Server.infrastructure.services {
    public class GoalService : IGoalService {
        private readonly IUserRepository _userRepository;
        private readonly HttpClient _httpClient;
        private readonly string _openAiApiKey;

        public GoalService(IUserRepository userRepository, IConfiguration configuration) {
            _userRepository = userRepository;
            _httpClient = new HttpClient();
            _openAiApiKey = configuration["OpenAI:ApiKey"];
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_openAiApiKey}");
        }

        public async Task<GoalResponseDto> CreateGoalAsync(string userId, CreateGoalDto goalDto) {
            var goal = new HealthGoal {
                Type = goalDto.Type,
                CurrentValue = goalDto.CurrentValue,
                TargetValue = goalDto.TargetValue,
                StartDate = DateTime.UtcNow,
                TargetDate = goalDto.TargetDate,
                IsCompleted = false
            };

            goal.AiGeneratedAdvice = await GenerateAiAdviceAsync(goal);
            await _userRepository.AddGoalAsync(userId, goal);

            return MapToGoalResponseDto(goal);
        }

        public async Task<List<GoalResponseDto>> GetGoalsAsync(string userId) {
            var goals = await _userRepository.GetGoalsAsync(userId);
            return goals.Select(MapToGoalResponseDto).ToList();
        }

        public async Task<GoalResponseDto> UpdateGoalAsync(string userId, string goalId, UpdateGoalDto updateDto) {
            var goals = await _userRepository.GetGoalsAsync(userId);
            var goal = goals.FirstOrDefault(g => g.Id == goalId);

            if (goal == null)
                throw new KeyNotFoundException("Goal not found");

            goal.CurrentValue = updateDto.CurrentValue;
            goal.IsCompleted = updateDto.IsCompleted;

            await _userRepository.UpdateGoalAsync(userId, goal);

            return MapToGoalResponseDto(goal);
        }

        public async Task<string> GenerateAiAdviceAsync(HealthGoal goal) {
            var prompt = GeneratePromptForGoal(goal);

            var requestBody = new {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
            new { role = "user", content = prompt }
        },
                max_tokens = 150
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                System.Text.Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                jsonContent
            );

            var responseContent = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<OpenAiResponse>(responseContent);

            if (responseObject?.choices == null || responseObject.choices.Length == 0) {
                throw new Exception($"OpenAI API error: {responseContent}");
            }

            return responseObject.choices[0].message.content;
        }

        private string GeneratePromptForGoal(HealthGoal goal) {
            var timeFrame = (goal.TargetDate - goal.StartDate).Days;
            var change = goal.TargetValue - goal.CurrentValue;

            return goal.Type switch {
                GoalType.Weight => $"Give me a short, practical advice on how to {(change < 0 ? "lose" : "gain")} {Math.Abs(change)}kg of weight in {timeFrame} days in a healthy way.",
                GoalType.HeartRate => $"Give me practical advice on how to {(change < 0 ? "lower" : "increase")} my resting heart rate from {goal.CurrentValue} to {goal.TargetValue} bpm.",
                _ => $"Give me practical health advice for improving my {goal.Type} from {goal.CurrentValue} to {goal.TargetValue}."
            };
        }

        private GoalResponseDto MapToGoalResponseDto(HealthGoal goal) {
            var totalChange = goal.TargetValue - goal.CurrentValue;
            var currentProgress = goal.CurrentValue - goal.CurrentValue; // This would need to be updated with actual current value
            var progressPercentage = (currentProgress / totalChange) * 100;

            return new GoalResponseDto {
                Id = goal.Id,
                Type = goal.Type,
                CurrentValue = goal.CurrentValue,
                TargetValue = goal.TargetValue,
                StartDate = goal.StartDate,
                TargetDate = goal.TargetDate,
                IsCompleted = goal.IsCompleted,
                AiGeneratedAdvice = goal.AiGeneratedAdvice,
                ProgressPercentage = progressPercentage
            };
        }

        private class OpenAiResponse {
            public Choice[] choices { get; set; }
            public class Choice {
                public Message message { get; set; }
            }
            public class Message {
                public string content { get; set; }
            }
        }
    }
}
