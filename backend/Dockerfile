# Stage 1: Build
FROM gradle:jdk18 AS build
# Copy the project files to the /home/gradle/src directory
COPY --chown=gradle:gradle . /home/gradle/src
# Set the working directory
WORKDIR /home/gradle/src
# Build the Spring Boot JAR
RUN gradle --no-daemon bootJar

# Stage 2: Runtime
FROM eclipse-temurin:18-jre

# Create app directory
RUN mkdir -p /app

# Set working directory
WORKDIR /app

# Copy only the final JAR from the build stage
COPY --from=build /home/gradle/src/build/libs/*.jar /app/app.jar

# Expose the port your app runs on
EXPOSE 8080

# Health check (optional but recommended)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.loader.JarLauncher || exit 1

# Run the application
CMD ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]