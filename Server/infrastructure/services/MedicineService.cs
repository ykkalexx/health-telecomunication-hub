using Microsoft.AspNetCore.SignalR;
using Server.core.dtos;
using Server.core.interfaces;

namespace Server.infrastructure.services {
    public class MedicineService : IMedicineService {
        private readonly IUserRepository _userRepository;
        private readonly HttpClient _httpClient;
        private readonly IHubContext<MedicineHub> _hubContext;

        public MedicineService(IUserRepository userRepository, IHubContext<MedicineHub> hubContext) {
            _userRepository = userRepository;
            _httpClient = new HttpClient();
            _hubContext = hubContext;
        }

        public async Task<Medicine> AddMedicine(string userId, Medicine medicine) {
            var newmed = new Medicine {
                MedicineName = medicine.MedicineName,
                QuantityPerDay = medicine.QuantityPerDay,
                TimesPerDay = medicine.TimesPerDay,
                StartDate = DateTime.UtcNow,
                EndDate = medicine.EndDate,
                IsCompleted = false
            };

            await _userRepository.AddMedicineAsync(userId, newmed);
            var medicines = await _userRepository.GetMedicines(userId);
            await _hubContext.Clients.User(userId).SendAsync("ReceiveMedicineUpdate", medicines);
            return newmed;
        }

        public async Task<List<Medicine>> GetMedicines(string userId) {
            return await _userRepository.GetMedicines(userId);
        }

        public async Task<Medicine> UpdateMedicine(string userId, string medicineId, Medicine medicine) {
            var medicines = await _userRepository.GetMedicines(userId);
            var med = medicines.FirstOrDefault(m => m.UserId == medicineId);

            if (med == null)
                throw new KeyNotFoundException("Medicine not found");

            med.MedicineName = medicine.MedicineName;
            med.QuantityPerDay = medicine.QuantityPerDay;
            med.TimesPerDay = medicine.TimesPerDay;
            med.EndDate = medicine.EndDate;
            med.IsCompleted = medicine.IsCompleted;

            await _userRepository.UpdateMedicine(userId, med);

            return med;
        }

    }
}
