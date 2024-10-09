using Server.core.entities;

namespace Server.core.interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByIdAsync(string id);
        Task UpdateAsync(User user);
    }
}
