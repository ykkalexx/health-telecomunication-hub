using Server.core.dtos;
using Server.core.entities;

namespace Server.core.interfaces
{
    public interface IUserRepository {
        Task<User> CreateAsync(User user);
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByIdAsync(string id);
        Task UpdateAsync(User user);
        Task AddHealthInfoAsync(string userId, List<HealthInfo> healthInfo);
        Task<List<HealthInfo>> GetHealthInfoAsync(string userId);
        Task AddGoalAsync(string userId, HealthGoal goal);
        Task<List<HealthGoal>> GetGoalsAsync(string userId);
        Task UpdateGoalAsync(string userId, HealthGoal goal);
        Task AddMedicineAsync(string userId, Medicine medicine);
        Task<List<Medicine>> GetMedicines(string userId);
        Task UpdateMedicine(string userId, Medicine medicine);

    }
}
