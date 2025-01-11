using Microsoft.AspNetCore.Mvc;
using Server.core.dtos;
using Server.core.interfaces;

namespace Server.api.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    public class MedicineController : ControllerBase {
        private readonly IMedicineService _medicineService;

        public MedicineController(IMedicineService medicineService) {
            _medicineService = medicineService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMedicine([FromBody] Medicine medicine) {
            try {
                if (string.IsNullOrEmpty(medicine.UserId)) {
                    return BadRequest("UserId is required");
                }

                var newMedicine = await _medicineService.AddMedicine(medicine.UserId, medicine);
                return Ok(newMedicine);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMedicines(string userId) {
            try {
                if (string.IsNullOrEmpty(userId)) {
                    return BadRequest("UserId is required");
                }

                var medicines = await _medicineService.GetMedicines(userId);
                return Ok(medicines);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{medicineId}")]
        public async Task<IActionResult> UpdateMedicine(string medicineId, [FromBody] Medicine medicine) {
            try {
                if (string.IsNullOrEmpty(medicine.UserId)) {
                    return BadRequest("UserId is required");
                }

                var updatedMedicine = await _medicineService.UpdateMedicine(medicine.UserId, medicineId, medicine);
                return Ok(updatedMedicine);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
