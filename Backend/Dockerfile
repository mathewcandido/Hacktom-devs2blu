# Dockerfile para MySQL Database
FROM mysql:8.0

# Configurar variáveis de ambiente para MySQL
ENV MYSQL_ROOT_PASSWORD=root123
ENV MYSQL_DATABASE=talent_incubator
ENV MYSQL_USER=dev_user
ENV MYSQL_PASSWORD=dev_password

# Expor porta padrão do MySQL
EXPOSE 3306

# Criar diretório para scripts de inicialização
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Configurações personalizadas do MySQL
COPY ./mysql.cnf /etc/mysql/conf.d/custom.cnf

# Volume para persistir dados
VOLUME ["/var/lib/mysql"]