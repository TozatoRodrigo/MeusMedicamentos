#!/bin/bash

# Script de Deploy Automatizado - Meus Medicamentos
# ================================================

set -e  # Sair se qualquer comando falhar

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
FRONTEND_BUILD_DIR="dist"
BACKEND_DIR="server"
DEPLOY_ENV=${1:-production}

echo -e "\n${BLUE}🚀 Deploy Automatizado - Meus Medicamentos${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Ambiente: ${DEPLOY_ENV}${NC}\n"

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script a partir da raiz do projeto"
fi

# 1. Verificar dependências
log "📋 Verificando dependências..."
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale em: https://nodejs.org"
fi

if ! command -v npm &> /dev/null; then
    error "npm não encontrado"
fi

log "✅ Node.js $(node --version) encontrado"
log "✅ npm $(npm --version) encontrado"

# 2. Instalar dependências se necessário
log "📦 Verificando e instalando dependências..."
if [ ! -d "node_modules" ]; then
    log "Instalando dependências do frontend..."
    npm ci
fi

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    log "Instalando dependências do backend..."
    cd $BACKEND_DIR && npm ci && cd ..
fi

log "✅ Dependências instaladas"

# 3. Executar testes
log "🧪 Executando testes..."
if npm run test --if-present; then
    log "✅ Testes do frontend passaram"
else
    error "❌ Testes do frontend falharam"
fi

if cd $BACKEND_DIR && npm run test --if-present && cd ..; then
    log "✅ Testes do backend passaram"
else
    error "❌ Testes do backend falharam"
fi

# 4. Executar lint
log "🧹 Executando lint..."
if npm run lint --if-present; then
    log "✅ Lint do frontend passou"
else
    log "⚠️  Avisos de lint encontrados no frontend"
fi

if cd $BACKEND_DIR && npm run lint --if-present && cd ..; then
    log "✅ Lint do backend passou"
else
    log "⚠️  Avisos de lint encontrados no backend"
fi

# 5. Build do frontend
log "🏗️  Fazendo build do frontend..."
if [ "$DEPLOY_ENV" = "production" ]; then
    # Verificar se variáveis de ambiente estão configuradas
    if [ -z "$VITE_STRIPE_PUBLISHABLE_KEY" ] && [ ! -f ".env" ]; then
        error "Variáveis de ambiente não configuradas para produção"
    fi
fi

npm run build
log "✅ Build do frontend concluído"

# 6. Verificar build
if [ ! -d "$FRONTEND_BUILD_DIR" ]; then
    error "Diretório de build não encontrado"
fi

BUILD_SIZE=$(du -sh $FRONTEND_BUILD_DIR | cut -f1)
log "📊 Tamanho do build: $BUILD_SIZE"

# 7. Deploy baseado no ambiente
case $DEPLOY_ENV in
    "production")
        log "🌟 Fazendo deploy para PRODUÇÃO..."
        
        # Verificar se é um commit tagged
        if git describe --exact-match --tags HEAD &>/dev/null; then
            TAG=$(git describe --exact-match --tags HEAD)
            log "🏷️  Fazendo deploy da versão: $TAG"
        else
            log "⚠️  Deploy de produção sem tag de versão"
        fi
        
        # Deploy do frontend (exemplo com Vercel)
        if command -v vercel &> /dev/null; then
            log "🚀 Fazendo deploy do frontend para Vercel..."
            vercel --prod --yes
        else
            log "⚠️  Vercel CLI não encontrado, pulando deploy do frontend"
        fi
        
        # Deploy do backend (exemplo com Railway)
        if command -v railway &> /dev/null; then
            log "🚀 Fazendo deploy do backend para Railway..."
            cd $BACKEND_DIR
            railway up --service backend
            cd ..
        else
            log "⚠️  Railway CLI não encontrado, pulando deploy do backend"
        fi
        ;;
        
    "staging")
        log "🧪 Fazendo deploy para STAGING..."
        
        # Deploy para ambiente de staging
        if command -v vercel &> /dev/null; then
            log "🚀 Fazendo deploy do frontend para staging..."
            vercel --yes
        fi
        ;;
        
    "preview")
        log "👀 Criando preview do deploy..."
        
        # Criar preview build
        if command -v vercel &> /dev/null; then
            vercel --yes
        fi
        ;;
        
    *)
        error "Ambiente inválido: $DEPLOY_ENV. Use: production, staging, ou preview"
        ;;
esac

# 8. Verificação pós-deploy
log "🔍 Verificando deploy..."

case $DEPLOY_ENV in
    "production")
        # Verificar se o site está respondendo
        if command -v curl &> /dev/null; then
            PROD_URL="https://meusmedicamentos.com"  # Substitua pela sua URL
            if curl -f -s "$PROD_URL" > /dev/null; then
                log "✅ Site de produção está respondendo"
            else
                log "⚠️  Site de produção não está respondendo"
            fi
        fi
        ;;
esac

# 9. Limpeza
log "🧹 Fazendo limpeza..."
# Manter arquivos de build para debug se necessário
# rm -rf $FRONTEND_BUILD_DIR

# 10. Relatório final
log "📊 Relatório do Deploy"
echo -e "${BLUE}========================${NC}"
echo -e "Ambiente: ${DEPLOY_ENV}"
echo -e "Data: $(date)"
echo -e "Commit: $(git rev-parse --short HEAD)"
echo -e "Branch: $(git branch --show-current)"
echo -e "Build Size: $BUILD_SIZE"

if git describe --exact-match --tags HEAD &>/dev/null; then
    echo -e "Versão: $(git describe --exact-match --tags HEAD)"
fi

log "🎉 Deploy concluído com sucesso!"

# 11. Notificações (opcional)
if [ -n "$SLACK_WEBHOOK" ]; then
    log "📢 Enviando notificação para Slack..."
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Deploy realizado com sucesso!\n**Ambiente:** $DEPLOY_ENV\n**Commit:** $(git rev-parse --short HEAD)\n**Branch:** $(git branch --show-current)\"}" \
        "$SLACK_WEBHOOK"
fi

echo -e "\n${GREEN}✨ Deploy finalizado!${NC}\n"
