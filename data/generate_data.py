import csv
import random
from datetime import datetime, timedelta
import os

def generate_fake_data(num_records):
    data = []
    start_date = datetime.now() - timedelta(days=365)

    for _ in range(num_records):
        date = start_date + timedelta(days=random.randint(0, 365))
        weight = round(random.uniform(50, 100), 1)
        heart_rate = random.randint(60, 100)
        blood_pressure_sys = random.randint(90, 140)
        blood_pressure_dia = random.randint(60, 90)

        data.append([
            date.strftime('%Y-%m-%d'),
            weight,
            heart_rate,
            f"{blood_pressure_sys}/{blood_pressure_dia}"
        ])

    return data

def write_csv(filename, data):
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Date', 'Weight', 'HeartRate', 'BloodPressure'])
        writer.writerows(data)

if __name__ == "__main__":
    num_records = 100
    directory = 'results'
    filename = os.path.join(directory, 'health_data.csv')

    # Ensure the results directory exists
    os.makedirs(directory, exist_ok=True)
    
    fake_data = generate_fake_data(num_records)
    write_csv(filename, fake_data)
    print(f"Generated {num_records} records in {filename}")