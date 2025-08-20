#!/bin/bash

echo "🚀 Iniciando Sistema Meus Medicamentos com Stripe"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo -e "\n${BLUE}📋 Verificando dependências...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado. Instale em: https://nodejs.org${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado. Instale Node.js primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) encontrado${NC}"
echo -e "${GREEN}✅ npm $(npm --version) encontrado${NC}"

# Verificar se as dependências estão instaladas
echo -e "\n${BLUE}📦 Verificando instalação...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do frontend...${NC}"
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Instalando dependências do backend...${NC}"
    cd server && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Verificar arquivos de configuração
echo -e "\n${BLUE}⚙️  Verificando configuração...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado no frontend${NC}"
    echo -e "${YELLOW}   Copie frontend.env.example para .env e configure suas chaves${NC}"
fi

if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado no backend${NC}"
    echo -e "${YELLOW}   Copie server/config.example.env para server/.env e configure suas chaves${NC}"
fi

# Iniciar serviços
echo -e "\n${BLUE}🚀 Iniciando serviços...${NC}"

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${YELLOW}🛑 Parando serviços...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${BLUE}🔧 Iniciando backend na porta 3001...${NC}"
cd server
npm start &
BACKEND_PID=$!
cd ..

# Aguardar backend inicializar
sleep 3

# Verificar se backend está funcionando
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend iniciado com sucesso${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar backend${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Iniciar frontend
echo -e "${BLUE}🎨 Iniciando frontend na porta 5173...${NC}"
npm run dev &
FRONTEND_PID=$!

# Aguardar frontend inicializar
sleep 5

echo -e "\n${GREEN}🎉 Sistema iniciado com sucesso!${NC}"
echo -e "${GREEN}📱 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}🔧 Backend: http://localhost:3001${NC}"
echo -e "${GREEN}📊 Health Check: http://localhost:3001/health${NC}"

echo -e "\n${BLUE}💡 Próximos passos:${NC}"
echo -e "   1. Configure suas chaves do Stripe nos arquivos .env"
echo -e "   2. Execute: cd server && node scripts/setup-stripe-products.js"
echo -e "   3. Configure webhooks do Stripe (veja STRIPE_INTEGRATION_GUIDE.md)"
echo -e "   4. Teste o fluxo de pagamento"

echo -e "\n${YELLOW}⌨️  Pressione Ctrl+C para parar os serviços${NC}"

# Manter script rodando
wait
