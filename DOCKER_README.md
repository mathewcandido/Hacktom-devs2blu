# 🐳 Docker Environment - Talent Incubator Platform

Este diretório contém a configuração completa do ambiente Docker para a **Plataforma Incubadora de Talentos**.

## 🏗️ **Arquitetura**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Database     │    │    Adminer      │
│   Next.js       │◄──►│     MySQL       │◄──►│  Web Interface  │
│   Port: 3000    │    │   Port: 3306    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### **1. Iniciar Ambiente Completo**
```bash
# Dar permissão ao script
chmod +x docker-dev.sh

# Iniciar todos os serviços
./docker-dev.sh start
```

### **2. Acessar Aplicação**
- **Frontend**: http://localhost:3000 ou http://localhost:3001
- **Database**: localhost:3306 (user: `dev_user`, pass: `dev_password`)
- **Adminer**: http://localhost:8080 (interface web do MySQL)

## 📋 **Comandos Disponíveis**

```bash
# Gerenciamento básico
./docker-dev.sh start      # Iniciar ambiente
./docker-dev.sh stop       # Parar containers
./docker-dev.sh restart    # Reiniciar ambiente
./docker-dev.sh status     # Ver status

# Debugging
./docker-dev.sh logs               # Logs de todos os serviços
./docker-dev.sh logs frontend      # Logs específicos do frontend
./docker-dev.sh logs database      # Logs específicos do MySQL

# Manutenção
./docker-dev.sh clean      # Limpar ambiente (⚠️ remove dados!)
./docker-dev.sh rebuild    # Rebuild completo sem cache
./docker-dev.sh shell      # Acessar shell do frontend
./docker-dev.sh shell database  # Acessar shell do MySQL

# Backup & Restore
./docker-dev.sh backup           # Criar backup do banco
./docker-dev.sh restore backup.sql  # Restaurar backup
```

## 🗄️ **Estrutura do Banco de Dados**

### **Tabelas Principais**
- **participants** - Dados dos participantes
- **leaders** - Dados dos líderes/mentores
- **evaluations** - Avaliações dos participantes
- **timeline_events** - Eventos do timeline
- **participant_skills** - Skills dos participantes
- **leader_interests** - Interesses dos líderes

### **Dados de Exemplo**
O banco é automaticamente populado com:
- ✅ 8 participantes de exemplo
- ✅ 8 líderes de exemplo
- ✅ 15+ avaliações
- ✅ 20+ eventos de timeline
- ✅ 25+ interesses de líderes
- ✅ Skills mapeadas por área

## 🔧 **Configurações**

### **Frontend Container**
```yaml
Ports: 3000:3000, 3001:3001
Environment: development
Health Check: curl localhost:3000
Volumes: Hot reload ativo
```

### **MySQL Container**
```yaml
Port: 3306
Database: talent_incubator
User: dev_user
Password: dev_password
Root Password: root123
```

### **Adminer Container**
```yaml
Port: 8080
Theme: Dracula
Server: database (container name)
```

## 🔍 **Troubleshooting**

### **Container não sobe**
```bash
# Ver logs detalhados
./docker-dev.sh logs

# Verificar status
./docker-dev.sh status

# Rebuild se necessário
./docker-dev.sh rebuild
```

### **Erro de conexão com banco**
```bash
# Verificar se MySQL está saudável
docker-compose ps

# Ver logs do banco
./docker-dev.sh logs database

# Testar conexão manual
docker-compose exec database mysql -u dev_user -pdev_password -e "SHOW DATABASES;"
```

### **Frontend não carrega**
```bash
# Verificar logs do frontend
./docker-dev.sh logs frontend

# Acessar shell e debuggar
./docker-dev.sh shell frontend

# Verificar se dependências estão instaladas
docker-compose exec frontend yarn --version
```

## 🛡️ **Health Checks**

Todos os containers possuem health checks configurados:

- **Frontend**: Verifica se aplicação responde na porta 3000
- **Database**: Testa conexão MySQL com credenciais
- **Adminer**: Health check automático do Docker

## 📦 **Volumes**

### **Persistentes**
- `mysql_data` - Dados do MySQL
- `mysql_logs` - Logs do MySQL

### **Desenvolvimento**
- `./Frontend:/app` - Hot reload do código frontend
- `/app/node_modules` - Cache das dependências

## 🌐 **Rede**

Todos os containers estão na rede `talent-incubator-network` para comunicação interna.

## 🔒 **Segurança**

### **⚠️ Para Produção, alterar:**
- Senhas padrão do MySQL
- Remover Adminer 
- Configurar HTTPS
- Usar secrets para credenciais
- Configurar firewall

## 📊 **Monitoramento**

### **Verificar Performance**
```bash
# Uso de recursos
docker stats

# Logs em tempo real
./docker-dev.sh logs

# Health status
./docker-dev.sh status
```

## 🚀 **Deploy em Produção**

Para produção, crie um `docker-compose.prod.yml` com:
- Variáveis de ambiente via secrets
- Volumes de backup
- Proxy reverso (nginx)
- Certificados SSL
- Logs centralizados

---

**🎯 Este ambiente está pronto para desenvolvimento e pode ser facilmente adaptado para produção!**