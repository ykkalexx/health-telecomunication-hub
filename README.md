# Health Hub Documentation

## Project Overview

A full-stack health tracking application built with React, TypeScript, .NET Core, and MongoDB, featuring real-time updates using SignalR.

## Architecture

### Frontend (React + TypeScript)

- **State Management**: Redux + Redux Persist
- **Real-time Updates**: SignalR client integration
- **Main Components**:
  - HealthGraphs: Visualizes health metrics using Chart.js
  - GoalLists: Manages health goals
  - MedicineLists: Handles medication tracking
  - NotificationSettings: Configures user notifications

### Backend (.NET Core)

- **API Layer**: RESTful endpoints with JWT authentication
- **Services**:
  - HealthService: Manages health metrics
  - GoalService: Handles goal tracking with AI advice
  - MedicineService: Manages medications
  - NotificationService: Handles email notifications
- **Real-time**: SignalR hubs for live updates
  - HealthHub
  - GoalHub
  - MedicineHub

## Features

### Health Tracking

- Upload health data via CSV
- Visualize metrics (weight, heart rate, blood pressure)
- Real-time graph updates
- Historical data tracking

### Goals System

- Create personalized health goals
- AI-generated advice using OpenAI
- Progress tracking
- Real-time goal updates

### Medicine Management

- Add/track medications
- Set reminders
- Configure dosage and schedules
- Real-time updates

### Notification System

- Email reminders for:
  - Medicine schedules
  - Goal tracking
  - Health metrics
- Configurable notification times
- Background service for automated sending

## Setup Instructions

### Frontend Setup

```bash
cd Client
npm install
npm run dev
```

### Backend Setup

```bash
cd Server
dotnet restore
dotnet run
```

## Environment Variables

### Backend (appsettings.json)

````json
{
  "ConnectionStrings": {
    "MongoDB": "your_connection_string"
  },
  "Jwt": {
    "Key": "your_secret_key",
    "Issuer": "your_issuer",
    "Audience": "your_audience"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "Username": "your_email",
    "Password": "your_password"
  }
}
```bash

````

## Dependencies

### Frontend:

- @microsoft/signalr
- chart.js
- redux-persist
- axios

### Backend:

- MongoDB.Driver
- MailKit
- Microsoft.AspNetCore.SignalR
- JWT Bearer Authentication
