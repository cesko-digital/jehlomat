FROM gradle:6.7.0-jdk11 as gradle

COPY . /home/gradle/server
WORKDIR /home/gradle/server/service-jehlomat
RUN gradle shadowJar --no-daemon

FROM gcr.io/distroless/java:11

EXPOSE 8082

COPY --from=gradle --chown=nonroot:nonroot /home/gradle/server/service-jehlomat/build/libs/service-jehlomat-all.jar /app/service-jehlomat-all.jar

WORKDIR "/app"
USER nonroot
CMD ["service-jehlomat-all.jar"]