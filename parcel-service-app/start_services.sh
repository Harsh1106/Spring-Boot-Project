#!/bin/bash

# Kill existing microservice processes
echo "Stopping existing services..."
pkill -f "eureka-server"
pkill -f "user-service"
pkill -f "booking-service"
pkill -f "tracking-service"
pkill -f "history-service"
pkill -f "pickup-service"
pkill -f "status-service"
pkill -f "ng serve"

echo "Starting Eureka Server..."
nohup java -jar backend/eureka-server/target/eureka-server-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &
echo "Waiting for Eureka to initialize..."
sleep 10

echo "Starting User Service..."
nohup java -jar backend/user-service/target/user-service-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &
echo "Waiting for User Service (and H2 DB) to initialize..."
sleep 10

echo "Starting Booking Service..."
nohup java -jar backend/booking-service/target/booking-service-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &

echo "Starting Tracking Service..."
nohup java -jar backend/tracking-service/target/tracking-service-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &

echo "Starting History Service..."
nohup java -jar backend/history-service/target/history-service-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &

echo "Starting Pickup Service..."
nohup java -jar backend/pickup-service/target/pickup-service-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &

echo "Starting Status Service..."
nohup java -jar backend/status-service/target/status-service-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &

echo "Starting Frontend..."
(cd frontend && nohup ng serve > /dev/null 2>&1 &)

echo "All services started in background."
