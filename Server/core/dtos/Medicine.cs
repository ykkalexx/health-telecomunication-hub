namespace Server.core.dtos {
    public class Medicine {
        public string UserId { get; set; }
        public string MedicineName { get; set; }
        public int QuantityPerDay { get; set; }
        public DateTime TimesPerDay { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Boolean IsCompleted { get; set; }
    }
}
