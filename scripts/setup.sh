#!/bin/bash

# Script de Setup Inicial - Meus Medicamentos
# ===========================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "\n${PURPLE}💊 Setup Inicial - Meus Medicamentos${NC}"
echo -e "${PURPLE}=====================================${NC}\n"

# Função para perguntas interativas
ask() {
    local prompt="$1"
    local default="$2"
    local response
    
    if [ -n "$default" ]; then
        echo -e "${BLUE}$prompt${NC} ${YELLOW}(padrão: $default)${NC}"
    else
        echo -e "${BLUE}$prompt${NC}"
    fi
    
    read -r response
    echo "${response:-$default}"
}

# Função para log
log() {
    echo -e "${GREEN}[SETUP] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

# 1. Verificar dependências
log "📋 Verificando dependências do sistema..."

if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale em: https://nodejs.org"
fi

if ! command -v npm &> /dev/null; then
    error "npm não encontrado"
fi

if ! command -v git &> /dev/null; then
    error "Git não encontrado. Instale em: https://git-scm.com"
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

log "✅ Node.js $NODE_VERSION"
log "✅ npm $NPM_VERSION"
log "✅ Git $(git --version | cut -d' ' -f3)"

# 2. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script a partir da raiz do projeto"
fi

# 3. Configuração interativa
echo -e "\n${BLUE}🔧 Configuração do Projeto${NC}"
echo -e "${BLUE}===========================${NC}\n"

# Configurar Git (se não estiver configurado)
if [ -z "$(git config --get user.name)" ]; then
    GIT_NAME=$(ask "Digite seu nome para Git:")
    git config user.name "$GIT_NAME"
    log "Git name configurado: $GIT_NAME"
fi

if [ -z "$(git config --get user.email)" ]; then
    GIT_EMAIL=$(ask "Digite seu email para Git:")
    git config user.email "$GIT_EMAIL"
    log "Git email configurado: $GIT_EMAIL"
fi

# 4. Instalar dependências
log "📦 Instalando dependências..."

echo -e "\n${BLUE}Instalando dependências do frontend...${NC}"
npm install

echo -e "\n${BLUE}Instalando dependências do backend...${NC}"
cd server && npm install && cd ..

log "✅ Todas as dependências instaladas"

# 5. Configurar variáveis de ambiente
log "⚙️  Configurando variáveis de ambiente..."

# Frontend
if [ ! -f ".env" ]; then
    log "Criando arquivo .env para o frontend..."
    
    echo -e "\n${BLUE}🔑 Configuração do Stripe${NC}"
    echo -e "Para obter suas chaves do Stripe:"
    echo -e "1. Acesse: ${YELLOW}https://dashboard.stripe.com/apikeys${NC}"
    echo -e "2. Copie a 'Publishable key' (começa com pk_)\n"
    
    STRIPE_PK=$(ask "Cole sua chave PÚBLICA do Stripe (pk_...):" "")
    
    if [ -n "$STRIPE_PK" ]; then
        cat > .env << EOF
# Configuração do Stripe (Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PK

# URL da API Backend
VITE_API_BASE_URL=http://localhost:3001
EOF
        log "✅ Arquivo .env criado"
    else
        cp frontend.env.example .env
        warn "⚠️  Arquivo .env criado com valores de exemplo"
        warn "   Configure suas chaves do Stripe no arquivo .env"
    fi
else
    log "✅ Arquivo .env já existe"
fi

# Backend
if [ ! -f "server/.env" ]; then
    log "Criando arquivo .env para o backend..."
    
    echo -e "\n${BLUE}🔐 Configuração do Backend${NC}"
    STRIPE_SK=$(ask "Cole sua chave SECRETA do Stripe (sk_...):" "")
    
    if [ -n "$STRIPE_SK" ] && [ -n "$STRIPE_PK" ]; then
        cat > server/.env << EOF
# Configuração do Stripe
STRIPE_SECRET_KEY=$STRIPE_SK
STRIPE_PUBLISHABLE_KEY=$STRIPE_PK
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret_aqui

# Configuração do Servidor
PORT=3001
NODE_ENV=development

# URLs do Frontend
FRONTEND_URL=http://localhost:5173
SUCCESS_URL=http://localhost:5173/success
CANCEL_URL=http://localhost:5173/cancel

# Preços dos Produtos (será configurado automaticamente)
PREMIUM_PRICE_ID=
EOF
        log "✅ Arquivo server/.env criado"
    else
        cp server/config.example.env server/.env
        warn "⚠️  Arquivo server/.env criado com valores de exemplo"
        warn "   Configure suas chaves do Stripe no arquivo server/.env"
    fi
else
    log "✅ Arquivo server/.env já existe"
fi

# 6. Configurar produtos no Stripe (opcional)
echo -e "\n${BLUE}📦 Configuração de Produtos no Stripe${NC}"
CREATE_PRODUCTS=$(ask "Deseja criar os produtos no Stripe agora? (y/n)" "y")

if [[ "$CREATE_PRODUCTS" =~ ^[Yy]$ ]]; then
    log "🚀 Criando produtos no Stripe..."
    
    if [ -f "server/.env" ] && grep -q "STRIPE_SECRET_KEY=sk_" server/.env; then
        cd server
        if node scripts/create-stripe-products.js; then
            log "✅ Produtos criados no Stripe"
        else
            warn "⚠️  Erro ao criar produtos. Configure manualmente mais tarde."
        fi
        cd ..
    else
        warn "⚠️  Chave secreta do Stripe não configurada. Configure primeiro no server/.env"
    fi
else
    log "⏭️  Pulando criação de produtos. Execute mais tarde:"
    echo -e "   ${YELLOW}cd server && node scripts/create-stripe-products.js${NC}"
fi

# 7. Configurar Git hooks (opcional)
echo -e "\n${BLUE}🪝 Configuração de Git Hooks${NC}"
SETUP_HOOKS=$(ask "Deseja configurar Git hooks para qualidade de código? (y/n)" "y")

if [[ "$SETUP_HOOKS" =~ ^[Yy]$ ]]; then
    log "Configurando Git hooks..."
    
    # Pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🧹 Executando lint antes do commit..."

# Lint frontend
if npm run lint --silent; then
    echo "✅ Frontend lint passou"
else
    echo "❌ Frontend lint falhou"
    exit 1
fi

# Lint backend
if cd server && npm run lint --silent && cd ..; then
    echo "✅ Backend lint passou"
else
    echo "❌ Backend lint falhou"
    exit 1
fi

echo "✅ Pre-commit checks passaram!"
EOF
    
    chmod +x .git/hooks/pre-commit
    log "✅ Git hooks configurados"
else
    log "⏭️  Pulando configuração de Git hooks"
fi

# 8. Teste inicial
echo -e "\n${BLUE}🧪 Teste Inicial${NC}"
TEST_SYSTEM=$(ask "Deseja testar o sistema agora? (y/n)" "y")

if [[ "$TEST_SYSTEM" =~ ^[Yy]$ ]]; then
    log "🚀 Iniciando teste do sistema..."
    
    # Iniciar backend em background
    cd server
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Aguardar backend inicializar
    sleep 5
    
    # Testar backend
    if curl -s http://localhost:3001/health > /dev/null; then
        log "✅ Backend funcionando"
    else
        warn "⚠️  Backend não está respondendo"
    fi
    
    # Parar backend
    kill $BACKEND_PID 2>/dev/null || true
    
    log "🎉 Teste básico concluído"
else
    log "⏭️  Pulando teste inicial"
fi

# 9. Resumo final
echo -e "\n${PURPLE}📋 Resumo da Configuração${NC}"
echo -e "${PURPLE}=========================${NC}"
echo -e "✅ Dependências instaladas"
echo -e "✅ Variáveis de ambiente configuradas"

if [[ "$CREATE_PRODUCTS" =~ ^[Yy]$ ]]; then
    echo -e "✅ Produtos do Stripe criados"
fi

if [[ "$SETUP_HOOKS" =~ ^[Yy]$ ]]; then
    echo -e "✅ Git hooks configurados"
fi

echo -e "\n${BLUE}🚀 Próximos Passos${NC}"
echo -e "${BLUE}=================${NC}"
echo -e "1. ${YELLOW}./start-system.sh${NC} - Iniciar o sistema completo"
echo -e "2. ${YELLOW}npm run dev${NC} - Apenas frontend"
echo -e "3. ${YELLOW}cd server && npm start${NC} - Apenas backend"
echo -e "4. ${YELLOW}./scripts/deploy.sh${NC} - Deploy para produção"

echo -e "\n${BLUE}📚 Documentação${NC}"
echo -e "${BLUE}===============${NC}"
echo -e "• ${YELLOW}README.md${NC} - Documentação principal"
echo -e "• ${YELLOW}CONTRIBUTING.md${NC} - Como contribuir"
echo -e "• ${YELLOW}docs/API.md${NC} - Documentação da API"
echo -e "• ${YELLOW}STRIPE_INTEGRATION_GUIDE.md${NC} - Guia do Stripe"

echo -e "\n${BLUE}🔗 Links Úteis${NC}"
echo -e "${BLUE}==============${NC}"
echo -e "• Dashboard Stripe: ${YELLOW}https://dashboard.stripe.com${NC}"
echo -e "• Documentação React: ${YELLOW}https://reactjs.org/docs${NC}"
echo -e "• Material-UI: ${YELLOW}https://mui.com${NC}"

echo -e "\n${GREEN}🎉 Setup concluído com sucesso!${NC}"
echo -e "${GREEN}Seu ambiente está pronto para desenvolvimento.${NC}\n"
