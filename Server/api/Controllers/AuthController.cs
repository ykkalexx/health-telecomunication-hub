using Microsoft.AspNetCore.Mvc;
using Server.core.dtos;
using Server.core.interfaces;

namespace Server.api.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService) {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto) {
            try {
                var user = await _authService.RegisterAsync(registerDto);
                return Ok(new { Message = "User registered succesfully" });
            } 
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto) {
            try {
                var (user, token) = await _authService.LoginAsync(loginDto);
                return Ok(new { User = user, Token = token });
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
