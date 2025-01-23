using Microsoft.AspNetCore.SignalR;
using Server.core.entities;
using Server.core.interfaces;

namespace Server.infrastructure.services {
    public class HealthServices : IHealthService {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<HealthHub> _hubContext;

        public HealthServices(IUserRepository userRepository, IConfiguration configuration, IHubContext<HealthHub> hubContext) {
            _userRepository = userRepository;
            _hubContext = hubContext;
            _configuration = configuration;
        }

        public async Task<List<HealthInfo>> FetchHealthInfo(string userId) {
            var existingUser = await _userRepository.GetByIdAsync(userId);
            if (existingUser == null) {
                throw new Exception("User with this id does not exist");
            }
            var healthInfo = await _userRepository.GetHealthInfoAsync(userId);
            await _hubContext.Clients.User(userId).SendAsync("ReceiveHealthUpdate", healthInfo);
            return healthInfo;
        }
    }
}
