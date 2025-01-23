using Microsoft.AspNetCore.SignalR;
using Server.core.entities;

namespace Server.infrastructure {
    public class HealthHub : Hub {
        public async Task UpdateHealthData(string userId, List<HealthInfo> data) {
            await Clients.User(userId).SendAsync("ReceiveHealthUpdate", data);
        }
    }
}
