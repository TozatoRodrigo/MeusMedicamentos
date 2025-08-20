#!/bin/bash

# Script para Inicializar Repositório Git - Meus Medicamentos
# ===========================================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "\n${BLUE}🔧 Inicialização do Repositório Git${NC}"
echo -e "${BLUE}===================================${NC}\n"

# Função para log
log() {
    echo -e "${GREEN}[GIT] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    error "Git não encontrado. Instale em: https://git-scm.com"
fi

# Verificar se já é um repositório Git
if [ -d ".git" ]; then
    warn "Este diretório já é um repositório Git"
    EXISTING_REPO=true
else
    EXISTING_REPO=false
fi

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script a partir da raiz do projeto"
fi

# Configurar Git se necessário
if [ -z "$(git config --get user.name)" ]; then
    echo -e "${BLUE}Configuração do Git necessária${NC}"
    read -p "Digite seu nome: " GIT_NAME
    git config --global user.name "$GIT_NAME"
    log "Nome configurado: $GIT_NAME"
fi

if [ -z "$(git config --get user.email)" ]; then
    read -p "Digite seu email: " GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
    log "Email configurado: $GIT_EMAIL"
fi

# Inicializar repositório se necessário
if [ "$EXISTING_REPO" = false ]; then
    log "Inicializando repositório Git..."
    git init
    
    # Configurar branch principal como main
    git branch -M main
    log "Branch principal configurada como 'main'"
fi

# Verificar arquivos ignorados
log "Verificando arquivos a serem commitados..."

# Mostrar status
git status

# Adicionar todos os arquivos
log "Adicionando arquivos ao staging..."
git add .

# Verificar se há algo para commitar
if git diff --cached --quiet; then
    warn "Nenhuma mudança para commitar"
    exit 0
fi

# Fazer commit inicial
log "Fazendo commit inicial..."
COMMIT_MESSAGE="feat: implementação inicial do Meus Medicamentos

✨ Funcionalidades implementadas:
- Sistema completo de controle de medicações
- Interface responsiva com Material-UI
- Sistema premium com integração Stripe
- Backend Node.js/Express com API RESTful
- PWA com service worker e manifest
- Documentação profissional completa
- Scripts de automação e deploy
- CI/CD com GitHub Actions

🎯 Recursos Premium (R$ 4,99/mês):
- Notificações inteligentes personalizadas
- Backup automático na nuvem
- Relatórios detalhados de adesão
- Histórico ilimitado de medicações

🛠️ Stack Técnica:
- Frontend: React 18, Material-UI, Framer Motion
- Backend: Node.js, Express, Stripe API
- Build: Vite, ESLint, Prettier
- Deploy: GitHub Actions, Vercel, Railway

📚 Documentação:
- README.md profissional
- Guia de contribuição
- Documentação da API
- Templates para issues/PRs
- Scripts de setup e deploy

🔒 Segurança:
- Validação de webhooks
- Headers de segurança
- Sanitização de dados
- Chaves de API protegidas

Closes #1"

git commit -m "$COMMIT_MESSAGE"
log "✅ Commit inicial realizado"

# Perguntar sobre repositório remoto
echo -e "\n${BLUE}🌐 Configuração do Repositório Remoto${NC}"
read -p "Deseja configurar um repositório remoto no GitHub? (y/n): " SETUP_REMOTE

if [[ "$SETUP_REMOTE" =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Para configurar o repositório remoto:${NC}"
    echo -e "1. Crie um repositório no GitHub: ${YELLOW}https://github.com/new${NC}"
    echo -e "2. Nome sugerido: ${YELLOW}meus-medicamentos${NC}"
    echo -e "3. Mantenha como público para usar GitHub Pages"
    echo -e "4. NÃO inicialize com README (já temos um)\n"
    
    read -p "Cole a URL do repositório (https://github.com/usuario/repo.git): " REPO_URL
    
    if [ -n "$REPO_URL" ]; then
        log "Adicionando repositório remoto..."
        git remote add origin "$REPO_URL"
        
        log "Fazendo push inicial..."
        git push -u origin main
        
        log "✅ Repositório configurado e código enviado!"
        
        echo -e "\n${BLUE}🎉 Próximos passos:${NC}"
        echo -e "1. Acesse: ${YELLOW}$REPO_URL${NC}"
        echo -e "2. Configure secrets para GitHub Actions:"
        echo -e "   - STRIPE_PUBLISHABLE_KEY"
        echo -e "   - STRIPE_SECRET_KEY"
        echo -e "   - VERCEL_TOKEN (para deploy)"
        echo -e "3. Configure branch protection rules"
        echo -e "4. Ative GitHub Pages (se desejado)"
    else
        warn "URL não fornecida. Configure o remoto manualmente:"
        echo -e "   ${YELLOW}git remote add origin <URL_DO_REPOSITORIO>${NC}"
        echo -e "   ${YELLOW}git push -u origin main${NC}"
    fi
else
    log "Repositório local criado. Para configurar remoto mais tarde:"
    echo -e "   ${YELLOW}git remote add origin <URL_DO_REPOSITORIO>${NC}"
    echo -e "   ${YELLOW}git push -u origin main${NC}"
fi

# Criar tags inicial
log "Criando tag inicial v1.0.0..."
git tag -a v1.0.0 -m "🎉 Lançamento inicial do Meus Medicamentos

Primeira versão estável com:
- Sistema completo de medicações
- Integração Stripe para premium
- Interface responsiva e moderna
- Documentação profissional
- Scripts de automação"

if git remote get-url origin &>/dev/null; then
    log "Enviando tags para o repositório remoto..."
    git push origin --tags
fi

log "✅ Tag v1.0.0 criada"

# Resumo final
echo -e "\n${GREEN}🎉 Repositório Git configurado com sucesso!${NC}"
echo -e "\n${BLUE}📊 Resumo:${NC}"
echo -e "• Repositório inicializado"
echo -e "• Commit inicial realizado"
echo -e "• Tag v1.0.0 criada"

if git remote get-url origin &>/dev/null; then
    echo -e "• Repositório remoto configurado"
    echo -e "• Código enviado para GitHub"
fi

echo -e "\n${BLUE}🔗 Links úteis:${NC}"
if git remote get-url origin &>/dev/null; then
    REPO_URL=$(git remote get-url origin)
    echo -e "• Repositório: ${YELLOW}${REPO_URL/.git/}${NC}"
    echo -e "• Issues: ${YELLOW}${REPO_URL/.git/}/issues${NC}"
    echo -e "• Actions: ${YELLOW}${REPO_URL/.git/}/actions${NC}"
fi

echo -e "\n${GREEN}✨ Pronto para desenvolvimento colaborativo!${NC}\n"
