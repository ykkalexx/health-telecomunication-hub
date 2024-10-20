﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.core.entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public List<HealthInfo> HealthInfo { get; set; } = new List<HealthInfo>();
    }
}
