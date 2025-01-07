using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.core.dtos;
using Server.core.interfaces;

namespace Server.api.Controllers {

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase { 
        private readonly IGoalService _goalService;

        public GoalsController(IGoalService goalService) {
            _goalService = goalService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGoal([FromBody] CreateGoalDto goalDto) {
            try 
            {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId)) {
                    return Unauthorized();
                }

                var goal = await _goalService.CreateGoalAsync(userId, goalDto);
                return Ok(goal);

            } catch (Exception ex) 
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetGoals() {
            try {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId)) {
                    return Unauthorized();
                }

                var goals = await _goalService.GetGoalsAsync(userId);
                return Ok(goals);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("{goalId}")]
        public async Task<IActionResult> UpdateGoal(string goalId, [FromBody] UpdateGoalDto updateDto) {
            try {
                var userId = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(userId)) {
                    return Unauthorized();
                }

                var goal = await _goalService.UpdateGoalAsync(userId, goalId, updateDto);
                return Ok(goal);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
