# Script para inicializar os containers
#!/bin/bash

echo "🚀 Iniciando Talent Incubator - Full Stack Docker"
echo "================================================="

# Parar containers existentes
echo "📋 Parando containers existentes..."
docker-compose down

# Limpar imagens antigas (opcional)
echo "🧹 Limpando cache Docker..."
docker system prune -f

# Construir e iniciar todos os serviços
echo "🔨 Construindo e iniciando serviços..."
docker-compose up --build -d

# Aguardar inicialização
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

# Verificar status
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
echo "🗄️ Adminer (MySQL): http://localhost:8080"
echo "📖 Backend Health: http://localhost:8080/actuator/health"
echo ""
echo "Para monitorar logs: docker-compose logs -f"
echo "Para parar: docker-compose down"