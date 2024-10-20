using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Server.core.entities {
    public class HealthInfo {
        public DateTime Date { get; set; }
        public double Weight { get; set; }  
        public int HeartRate { get; set; }
        public string BloodPressure { get; set; }
    }
}
