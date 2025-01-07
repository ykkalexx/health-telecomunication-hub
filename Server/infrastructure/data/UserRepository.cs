using Server.core.interfaces;
using Server.core.entities;
using MongoDB.Driver;

namespace Server.infrastructure.data {
    public class UserRepository : IUserRepository {

        private readonly IMongoCollection<User> _users;

        public UserRepository(IMongoDatabase database) {
            _users = database.GetCollection<User>("users");
        }

        public async Task<User> CreateAsync(User user) {
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<User> GetByEmailAsync(string email) {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> GetByIdAsync(string id) {
            return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(User user) {
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        public async Task AddHealthInfoAsync(string userId, List<HealthInfo> healthInfo) {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.PushEach(u => u.HealthInfo, healthInfo);

            await _users.UpdateOneAsync(filter, update);
        }

        public async Task<List<HealthInfo>> GetHealthInfoAsync(string userId) {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user?.HealthInfo ?? new List<HealthInfo>();
        }

        public async Task AddGoalAsync(string userId, HealthGoal goal) {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.Push(u => u.Goals, goal);
            await _users.UpdateOneAsync(filter, update);
        }

        public async Task<List<HealthGoal>> GetGoalsAsync(string userId) {
            var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user?.Goals ?? new List<HealthGoal>();
        }

        public async Task UpdateGoalAsync(string userId, HealthGoal goal) {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(u => u.Id, userId),
                Builders<User>.Filter.ElemMatch(u => u.Goals, g => g.Id == goal.Id)
            );
            var update = Builders<User>.Update.Set(u => u.Goals[-1], goal);
            await _users.UpdateOneAsync(filter, update);
        }
    }
}
