using Server.core.dtos;
using Server.core.entities;

namespace Server.core.interfaces
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterDto registerDto);
        Task<(User user, string token)> LoginAsync(LoginDto loginDto);
        Task<User> GetUserByEmailAsync(string email);
    }
}
