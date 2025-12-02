#!/bin/bash

# Script otimizado para desenvolvimento com Yarn
# Uso: ./yarn-docker.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verificar Docker
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando! Por favor, inicie o Docker Desktop."
        exit 1
    fi
}

# Start rápido com Yarn
quick_start() {
    log "🚀 Iniciando ambiente com Yarn otimizado..."
    check_docker
    
    # Build apenas se necessário
    log "Construindo containers (cache otimizado)..."
    docker-compose build --parallel
    
    # Iniciar todos os serviços
    log "Iniciando serviços..."
    docker-compose up -d
    
    # Aguardar saúde dos serviços
    log "Aguardando serviços ficarem prontos..."
    sleep 15
    
    # Mostrar status
    show_status
}

# Status detalhado
show_status() {
    log "📊 Status dos serviços:"
    docker-compose ps
    echo ""
    
    success "🎯 Serviços disponíveis:"
    echo "   🌐 Frontend: http://localhost:3000"
    echo "   🔧 Backend:  http://localhost:8000 (placeholder)"
    echo "   🗄️  Database: localhost:3306"
    echo "   📱 Adminer:  http://localhost:8080"
    echo ""
    
    log "📋 Comandos úteis:"
    echo "   ./yarn-docker.sh logs frontend  # Ver logs do frontend"
    echo "   ./yarn-docker.sh shell frontend # Acessar container"
    echo "   ./yarn-docker.sh restart       # Reiniciar tudo"
}

# Logs específicos
show_logs() {
    if [ -z "$2" ]; then
        log "Logs de todos os serviços:"
        docker-compose logs -f --tail=50
    else
        log "Logs do serviço: $2"
        docker-compose logs -f --tail=100 "$2"
    fi
}

# Restart otimizado
restart_services() {
    log "🔄 Reiniciando serviços..."
    docker-compose restart
    sleep 10
    show_status
}

# Stop limpo
stop_services() {
    log "🛑 Parando serviços..."
    docker-compose down
    success "Serviços parados!"
}

# Shell no container
enter_shell() {
    service=${2:-frontend}
    log "🐚 Entrando no container: $service"
    docker-compose exec "$service" /bin/sh
}

# Rebuild completo
full_rebuild() {
    log "🏗️  Rebuild completo..."
    docker-compose down
    docker-compose build --no-cache --parallel
    docker-compose up -d
    success "Rebuild concluído!"
}

# Install/Update dependências
update_deps() {
    log "📦 Atualizando dependências do frontend..."
    docker-compose exec frontend yarn install
    success "Dependências atualizadas!"
}

# Comando help
show_help() {
    echo "🐳 Yarn Docker - Talent Incubator Platform"
    echo ""
    echo "Uso: ./yarn-docker.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  start      - Início rápido (recomendado)"
    echo "  status     - Ver status dos containers"
    echo "  logs       - Ver logs (adicione nome do serviço)"
    echo "  restart    - Reiniciar serviços"
    echo "  stop       - Parar containers"
    echo "  shell      - Entrar no container (padrão: frontend)"
    echo "  rebuild    - Rebuild completo"
    echo "  update     - Atualizar dependências"
    echo "  help       - Esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./yarn-docker.sh start"
    echo "  ./yarn-docker.sh logs frontend"
    echo "  ./yarn-docker.sh shell backend"
}

# Router de comandos
case "$1" in
    start)
        quick_start
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$@"
        ;;
    restart)
        restart_services
        ;;
    stop)
        stop_services
        ;;
    shell)
        enter_shell "$@"
        ;;
    rebuild)
        full_rebuild
        ;;
    update)
        update_deps
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            show_help
        else
            error "Comando desconhecido: $1"
            show_help
            exit 1
        fi
        ;;
esac