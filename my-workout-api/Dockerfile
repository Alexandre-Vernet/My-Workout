# Base images are referenced by Java major version, not by digest, on purpose: each rebuild
# picks up the JDK/OS security patches published under the same tag, at the cost of
# strictly reproducible builds. Java 21 matches <java.version> in pom.xml and the CI.
FROM eclipse-temurin:21-jdk-resolute AS build

WORKDIR /app

# Built with the project's Maven wrapper rather than a maven:* image, so the Maven version
# is the one pinned in .mvn/wrapper/maven-wrapper.properties, same as locally and in CI.
# Dependencies first, sources after: the dependency layer stays cached as long as the
# pom does not change, instead of being downloaded again on every source change.
COPY my-workout-api/mvnw my-workout-api/pom.xml ./
COPY my-workout-api/.mvn ./.mvn
RUN sh mvnw -B dependency:go-offline

COPY my-workout-api/src ./src
RUN sh mvnw -B clean package -DskipTests

FROM eclipse-temurin:21-jre-resolute

WORKDIR /app

RUN groupadd --system app && useradd --system --gid app --no-create-home app

COPY --from=build --chown=app:app /app/target/*.jar app.jar

# Least privilege: a vulnerability in a dependency must not give root inside the container.
# Docker (>= 20.10) lets unprivileged users bind ports below 1024 inside the container, so
# server.port=80 keeps working.
USER app

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
