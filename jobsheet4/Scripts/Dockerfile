# Build stage
FROM openjdk:27-ea-slim-trixie 


# Set the working directory inside the container
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# RUN mkdir -p /app
WORKDIR /app


# Copy the project files into the container
COPY libs ./libs
COPY src ./src

# Create the target/classes directory for compiled classes
RUN mkdir -p target/classes

# Expose the application port and the debug port
EXPOSE 8080 5005 

# Set the command to compile and run the Java application
CMD sh -c "javac -d target/classes -cp 'libs/*:libs/xmlrpc/*' src/main/java/com/example/*.java && java -cp 'target/classes:libs/*:libs/xmlrpc/*' com.example.Main"

