using Microsoft.AspNetCore.SignalR;
using Server.core.dtos;

namespace Server.infrastructure {
    public class GoalHub : Hub {
        public async Task UpdateGoalData(string userId, List<GoalResponseDto> data) {
            await Clients.User(userId).SendAsync("ReceiveGoalUpdate", data);
        }
    }
}