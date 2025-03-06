# Use OpenJDK as base image
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper files (if using Maven)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (optional, speeds up builds)
RUN ./mvnw dependency:go-offline

# Copy source code and build the application
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Expose the application port (change it if necessary)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/academia-hub-0.0.1-SNAPSHOT.jar"]
