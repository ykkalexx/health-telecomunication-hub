using Microsoft.AspNetCore.SignalR;
using Server.core.dtos;

namespace Server.infrastructure {
    public class MedicineHub : Hub {
        public async Task UpdateMedicineData(string userId, List<Medicine> data) {
            await Clients.User(userId).SendAsync("ReceiveMedicineUpdate", data);
        }
    }
}