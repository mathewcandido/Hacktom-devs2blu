# --- ESTÁGIO 1: Buildar a aplicação ---
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
# Copia o arquivo pom.xml e baixa as dependências primeiro para cache otimizado
COPY pom.xml .
RUN mvn dependency:go-offline
# Copia o restante do código fonte
COPY src ./src
# Empacota a aplicação em um JAR executável
RUN mvn package -DskipTests

# --- ESTÁGIO 2: Rodar a aplicação ---
# Usa uma imagem base leve que já tem o Java 17 instalado (JRE)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia o JAR gerado do estágio de build para o novo estágio
COPY --from=build /app/target/TalentHub-0.0.1-SNAPSHOT.jar app.jar

# Define a porta que o Spring Boot usa por padrão
EXPOSE 8080

# Comando para rodar a aplicação quando o contêiner inicia
ENTRYPOINT ["java", "-jar", "app.jar"]
