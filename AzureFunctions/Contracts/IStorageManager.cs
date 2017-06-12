using System;
using System.Threading.Tasks;

namespace AzureFunctions.Contracts
{
    public interface IStorageManager
    {
        Task<bool> VerifyOwnership(string armId);
        Task<T> GetObject<T>(string id) where T : new();
        Task<T> UpdateObject<T>(string id, Action<T> process) where T : new();
    }
}
