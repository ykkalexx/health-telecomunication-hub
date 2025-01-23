# API Documentation

## Authentication

POST /api/Auth/login
POST /api/Auth/register

## Health Endpoints

GET /api/Health/{userId}
POST /api/Health/upload

## Medicine Endpoints

GET /api/Medicine/{userId}
POST /api/Medicine
PUT /api/Medicine/{medicineId}

## Goals Endpoints

GET /api/Goals/{userId}
POST /api/Goals
PUT /api/Goals/{goalId}

## Notifications Endpoints

GET /api/Notification/settings/{userId}
PUT /api/Notification/settings/{userId}
