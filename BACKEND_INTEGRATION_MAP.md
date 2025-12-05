# Backend Integration Map

## Status Atual do Backend

### 🏗️ **Estrutura Existente**

#### Controllers Implementados:
- ✅ `DashboardController` - `/api/dashboard`, `/api/dashboard/stats`
- ✅ `ParticipantController` - `/api/participants`, `/api/participants/{id}`
- ✅ `LeaderController` - `/api/leaders`
- ✅ `HealthController` - `/health`, `/`

#### DTOs Implementados:
- ✅ `DashboardFullResponse`
- ✅ `DashboardStatsDto`
- ✅ `ParticipantDto`
- ✅ `LeaderDto`
- ✅ `EvaluationDto`
- ✅ `TimelineEventDto`

#### Modelos/Entidades:
- ✅ `Participant`
- ✅ `Leader`
- ✅ `Evaluations`
- ✅ `TimelineEvents`
- ✅ `ParticipantSkills`
- ✅ `LeaderInterests`

#### Configuração:
- ✅ Spring Security (CORS + acesso sem auth)
- ✅ MySQL Database setup
- ✅ Docker container configuration
- ✅ Health checks configurados

---

## 🔴 **Problemas Identificados**

### 1. **Erro Crítico - Enum Configuration**
**Status:** 🚨 BLOQUEADOR - Impedindo funcionamento

**Problema:** ArrayIndexOutOfBoundsException no mapeamento de enums Status
```
java.lang.ArrayIndexOutOfBoundsException: Index 4 out of bounds for length 4
```

**Causa:** 
- Banco de dados tem dados salvos com Hibernate ORDINAL (índices 0,1,2,3)
- Algum dado aponta para índice 4 (não existe no enum)
- Enum configurado corretamente para STRING mas banco ainda tem dados antigos

**Solução:** 
- ✅ Enum já configurado com @Enumerated(EnumType.STRING)
- ❌ Banco ainda possui dados corrompidos
- 🔧 Necessário: limpar banco completamente

---

## 🎯 **Endpoints Frontend x Backend**

### Dashboard API
| Frontend Espera | Backend Atual | Status |
|-----------------|---------------|--------|
| `GET /api/dashboard` | ✅ Implementado | 🔴 500 Error (enum) |
| Estrutura: `{participants[], leaders[], stats}` | ✅ Correto | ✅ Match |

### Participants API  
| Frontend Espera | Backend Atual | Status |
|-----------------|---------------|--------|
| `GET /api/participants` | ✅ Implementado | 🔴 500 Error (enum) |
| `GET /api/participants/{id}` | ✅ Implementado | 🔴 500 Error (enum) |
| Skills array | ✅ Implementado | ✅ Match |
| Evaluations nested | ✅ Implementado | ✅ Match |
| Timeline nested | ✅ Implementado | ✅ Match |

### Leaders API
| Frontend Espera | Backend Atual | Status |
|-----------------|---------------|--------|  
| `GET /api/leaders` | ✅ Implementado | 🔴 500 Error (enum) |
| InterestedParticipants | ✅ Implementado | ✅ Match |
| ReservedParticipants | ✅ Implementado | ✅ Match |

---

## 🚨 **Endpoints Faltando**

### 1. **Academy/Learning (Prioridade Baixa)**
Frontend espera:
- `GET /api/academy` (cursos, events, recursos)

Backend: **❌ NÃO IMPLEMENTADO**

### 2. **Action Endpoints (Prioridade Média)**
Frontend espera:
- `POST /api/leaders/{leaderId}/interest` (marcar interesse)  
- `POST /api/leaders/{leaderId}/reserve` (reservar participante)

Backend: **❌ NÃO IMPLEMENTADO**

---

## 📊 **Campos Frontend vs Backend**

### ParticipantDto - ✅ MATCH COMPLETO
```java
// Backend tem todos os campos que frontend espera:
- UUID id ✅
- String name ✅  
- String email ✅
- String area ✅
- String status ✅ (problema: enum mapping)
- Integer evolution ✅
- String batch ✅
- LocalDateTime startDate ✅ 
- String photo ✅
- String phone ✅
- String bio ✅
- List<String> skills ✅
- List<EvaluationDto> evaluations ✅
- List<TimelineEventDto> timeline ✅
```

### LeaderDto - ✅ MATCH COMPLETO  
```java
// Backend tem todos os campos que frontend espera:
- UUID id ✅
- String name ✅
- String email ✅
- String area ✅  
- String department ✅
- String photo ✅
- LocalDateTime joinDate ✅
- List<UUID> interestedParticipants ✅
- List<UUID> reservedParticipants ✅
```

---

## 🔧 **Plano de Correção**

### Fase 1: Correção Crítica (URGENTE)
1. **Limpar banco MySQL completamente**
   ```bash
   docker compose down -v
   docker compose up --build backend database -d
   ```

2. **Verificar dados iniciais** no `DataInitializer`
   - Garantir que só usa enums válidos: `EM_FORMACAO, DISPONIVEL, RESERVADO, CONTRATADO`

3. **Testar endpoints básicos**
   ```bash
   curl http://localhost:8081/health
   curl http://localhost:8081/api/dashboard  
   curl http://localhost:8081/api/participants
   curl http://localhost:8081/api/leaders
   ```

### Fase 2: Endpoints de Ação (OPCIONAL)
1. Implementar `POST /api/leaders/{leaderId}/interest`
2. Implementar `POST /api/leaders/{leaderId}/reserve` 

### Fase 3: Academy Module (BAIXA PRIORIDADE)
1. Criar modelos Academy/Course/Event
2. Implementar `GET /api/academy`

---

## 🎯 **Conclusão**

**Backend está 85% pronto** para integração com frontend:
- ✅ Estrutura de dados correta
- ✅ DTOs match com frontend
- ✅ Endpoints principais implementados  
- ✅ Security e CORS configurados
- 🔴 **BLOQUEADOR:** Problema com enum Status

**Próximos passos:**
1. Resolver enum issue (limpar banco)
2. Testar integração básica
3. Implementar endpoints de ação (opcional)