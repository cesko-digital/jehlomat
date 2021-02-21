FROM gradle:6.7.0-jdk11 as gradle

COPY . /home/gradle/server
WORKDIR /home/gradle/server/service-user
RUN gradle shadowJar --no-daemon

FROM gcr.io/distroless/java:11

EXPOSE 8081

COPY --from=gradle --chown=nonroot:nonroot /home/gradle/server/service-user/build/libs/service-user-all.jar /app/service-user-all.jar

WORKDIR "/app"
USER nonroot
CMD ["service-user-all.jar"]