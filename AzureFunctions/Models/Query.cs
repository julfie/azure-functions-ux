using System;

namespace AzureFunctions.Models
{
    public class Query
    {
        public Guid? Id { get; set; }
        public string Value { get; set; }
        public DateTimeOffset? CreatedTime { get; set; }
        public DateTimeOffset? ModifiedTime { get; set; }

        public Query()
        {
            Id = null;
            Value = string.Empty;
            CreatedTime = null;
            ModifiedTime = null;
        }

        public Query(string value)
        {
            Id = Guid.NewGuid();
            Value = value;
            CreatedTime = DateTimeOffset.UtcNow;
            ModifiedTime = DateTimeOffset.UtcNow;
        }
    }
}