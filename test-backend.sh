#!/bin/bash

echo "🧪 Testando Backend APIs..."
echo "================================="

# Aguardar backend iniciar
echo "⏳ Aguardando backend inicializar..."
sleep 15

# Testar health check
echo ""
echo "1. 🩺 Health Check:"
curl -f http://localhost:8080/actuator/health || echo "❌ Health check falhou"

# Testar dashboard stats
echo ""
echo "2. 📊 Dashboard Stats:"
curl -f http://localhost:8080/api/dashboard/stats || echo "❌ Dashboard stats falhou"

# Testar participants
echo ""
echo "3. 👥 Participants:"
curl -f http://localhost:8080/api/participants | head -c 200 || echo "❌ Participants falhou"

# Testar leaders
echo ""
echo "4. 👨‍💼 Leaders:"
curl -f http://localhost:8080/api/leaders | head -c 200 || echo "❌ Leaders falhou"

echo ""
echo "✅ Testes concluídos!"