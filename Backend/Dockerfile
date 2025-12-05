# Dockerfile simplificado para evitar problemas de cache
FROM maven:3.9.4-amazoncorretto-17

WORKDIR /app

# Copiar tudo de uma vez
COPY . .

# Build e executar diretamente
RUN mvn clean package -DskipTests

# Expor porta
EXPOSE 8080

# Executar aplicação
CMD ["java", "-jar", "target/TalentHub-0.0.1-SNAPSHOT.jar"]
