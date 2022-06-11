FROM amazoncorretto:11-alpine
# Create group and user to run our app
RUN addgroup -S spring && adduser -S spring -G spring
# Switching user
USER spring:spring
# Set path to our app jar files
ARG JAR_FILE=target/*.jar
#
COPY ${JAR_FILE} app.jar
# Run our app
ENTRYPOINT ["java","-jar","/app.jar"]