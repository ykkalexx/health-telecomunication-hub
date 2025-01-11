using Server.core.dtos;

namespace Server.core.interfaces {
    public interface IMedicineService {
        Task<Medicine> AddMedicine(string userId, Medicine medicine);
        Task<List<Medicine>> GetMedicines(string userId);
        Task<Medicine> UpdateMedicine(string userId, string medicineId, Medicine medicine);
    }
}
