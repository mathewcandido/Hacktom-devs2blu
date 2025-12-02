#!/bin/bash

# Script para gerenciar o ambiente Docker Compose
# Uso: ./docker-dev.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando! Por favor, inicie o Docker Desktop."
        exit 1
    fi
}

# Função para build e start
start() {
    log "Iniciando ambiente de desenvolvimento..."
    check_docker
    
    log "Construindo e iniciando containers..."
    docker-compose up --build -d
    
    log "Aguardando serviços ficarem saudáveis..."
    sleep 10
    
    # Verificar status dos serviços
    if docker-compose ps | grep -q "healthy\|Up"; then
        success "Ambiente iniciado com sucesso!"
        echo ""
        echo "🚀 Serviços disponíveis:"
        echo "   Frontend: http://localhost:3000 ou http://localhost:3001"
        echo "   Database: localhost:3306 (user: dev_user, pass: dev_password)"
        echo "   Adminer:  http://localhost:8080 (interface web do MySQL)"
        echo ""
        echo "📊 Para ver os logs: ./docker-dev.sh logs"
        echo "🛑 Para parar: ./docker-dev.sh stop"
    else
        error "Alguns serviços não iniciaram corretamente. Verificando logs..."
        docker-compose logs --tail=50
    fi
}

# Função para parar containers
stop() {
    log "Parando containers..."
    docker-compose down
    success "Containers parados!"
}

# Função para restart
restart() {
    log "Reiniciando ambiente..."
    stop
    sleep 2
    start
}

# Função para ver logs
logs() {
    if [ -z "$2" ]; then
        log "Mostrando logs de todos os serviços..."
        docker-compose logs -f --tail=100
    else
        log "Mostrando logs do serviço: $2"
        docker-compose logs -f --tail=100 "$2"
    fi
}

# Função para status dos containers
status() {
    log "Status dos containers:"
    docker-compose ps
    echo ""
    
    # Health check detalhado
    log "Health check detalhado:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Função para limpar ambiente
clean() {
    warn "Esta operação irá remover todos os containers, volumes e imagens do projeto!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Removendo containers..."
        docker-compose down -v --rmi all --remove-orphans
        
        log "Limpando volumes órfãos..."
        docker volume prune -f
        
        success "Ambiente limpo!"
    else
        log "Operação cancelada."
    fi
}

# Função para rebuild (sem cache)
rebuild() {
    log "Rebuild completo (sem cache)..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    success "Rebuild concluído!"
}

# Função para acessar shell do container
shell() {
    if [ -z "$2" ]; then
        log "Acessando shell do frontend..."
        docker-compose exec frontend /bin/bash
    else
        log "Acessando shell do container: $2"
        docker-compose exec "$2" /bin/bash
    fi
}

# Função para backup do banco
backup() {
    log "Criando backup do banco de dados..."
    
    # Criar diretório de backup se não existir
    mkdir -p ./backups
    
    # Nome do arquivo com timestamp
    BACKUP_FILE="./backups/talent_incubator_$(date +%Y%m%d_%H%M%S).sql"
    
    # Executar backup
    docker-compose exec database mysqldump -u dev_user -pdev_password talent_incubator > "$BACKUP_FILE"
    
    if [ -f "$BACKUP_FILE" ]; then
        success "Backup criado: $BACKUP_FILE"
    else
        error "Falha ao criar backup!"
        exit 1
    fi
}

# Função para restaurar backup
restore() {
    if [ -z "$2" ]; then
        error "Por favor, especifique o arquivo de backup!"
        echo "Uso: ./docker-dev.sh restore <arquivo_backup.sql>"
        exit 1
    fi
    
    if [ ! -f "$2" ]; then
        error "Arquivo de backup não encontrado: $2"
        exit 1
    fi
    
    warn "Esta operação irá substituir todos os dados do banco!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Restaurando backup: $2"
        docker-compose exec -T database mysql -u dev_user -pdev_password talent_incubator < "$2"
        success "Backup restaurado!"
    else
        log "Operação cancelada."
    fi
}

# Função de ajuda
help() {
    echo "🐳 Script de Gerenciamento Docker - Talent Incubator"
    echo ""
    echo "Uso: ./docker-dev.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Iniciar ambiente (build + up)"
    echo "  stop      - Parar containers"
    echo "  restart   - Reiniciar ambiente"
    echo "  status    - Ver status dos containers"
    echo "  logs      - Ver logs (adicione nome do serviço para logs específicos)"
    echo "  clean     - Limpar ambiente completo (⚠️  remove dados!)"
    echo "  rebuild   - Rebuild completo sem cache"
    echo "  shell     - Acessar shell do container (padrão: frontend)"
    echo "  backup    - Criar backup do banco de dados"
    echo "  restore   - Restaurar backup (especifique o arquivo)"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./docker-dev.sh start"
    echo "  ./docker-dev.sh logs frontend"
    echo "  ./docker-dev.sh shell database"
    echo "  ./docker-dev.sh restore ./backups/backup_20241201.sql"
}

# Processar comando
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$@"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    rebuild)
        rebuild
        ;;
    shell)
        shell "$@"
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$@"
        ;;
    help|--help|-h)
        help
        ;;
    *)
        if [ -z "$1" ]; then
            help
        else
            error "Comando desconhecido: $1"
            help
            exit 1
        fi
        ;;
esac