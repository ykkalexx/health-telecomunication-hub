1.  User Management System:
    Password Recovery Lambda: Implement password reset functionality via email.

2.  Medication Management System:
    Reminder System Lambda: Trigger reminders for medication schedules.

3.  Notification System:
    Email Notification Lambda: Send medication reminders via email.
    Web Push Notification Lambda: Send browser-based notifications for medication reminders.
    Scheduled Jobs Lambda: Run the notification system periodically.

The user will have CSV file with their information (create a python script that will generate fake ones).
Upload using a model on frontend
Create a lambda that will parse the files keeping sake and look for whats needed and also store the actual on a S3 for safe
Return the Data in JSON
The data will be held on frontend and then ill create a C# Backend that will populate the Data in backend
Add it to the users health info
Then go from there with creating the rest of the HealthTracker Dashboard
