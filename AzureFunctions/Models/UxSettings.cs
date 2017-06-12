using System.Collections.Generic;
using System.Linq;

namespace AzureFunctions.Models
{
    public class UxSettings
    {
        public IEnumerable<Query> Graphs { get; set; } = Enumerable.Empty<Query>();
    }
}