using Server.core.entities;

namespace Server.core.interfaces {
    public interface IHealthService {
        Task<List<HealthInfo>> FetchHealthInfo(string userId);
    }
}
