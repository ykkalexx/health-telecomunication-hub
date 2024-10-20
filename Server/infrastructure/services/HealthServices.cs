using Server.core.entities;
using Server.core.interfaces;

namespace Server.infrastructure.services {
    public class HealthServices : IHealthService {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public HealthServices(IUserRepository userRepository, IConfiguration configuration) {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<List<HealthInfo>> FetchHealthInfo(string userId) {
            var existingUser = await _userRepository.GetByIdAsync(userId);
            if (existingUser == null) {
                throw new Exception("User with this id does not exist");
            }
            return await _userRepository.GetHealthInfoAsync(userId);
        }
    }
}
