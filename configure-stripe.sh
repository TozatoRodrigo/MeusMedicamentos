#!/bin/bash

echo "🚀 Configuração Automática - Stripe + Meus Medicamentos"
echo "======================================================="

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}📋 Configurando arquivos de ambiente...${NC}"

# Configurar backend
echo -e "${YELLOW}🔧 Configurando backend...${NC}"
cp server/production.env server/.env
echo -e "${GREEN}✅ Backend configurado${NC}"

# Configurar frontend
echo -e "${YELLOW}🎨 Configurando frontend...${NC}"
cp frontend-production.env .env
echo -e "${GREEN}✅ Frontend configurado${NC}"

echo -e "\n${BLUE}🎉 Configuração concluída!${NC}"
echo -e "\n${GREEN}📋 Produtos criados no Stripe:${NC}"
echo -e "   🏷️  Produto: Meus Medicamentos Premium"
echo -e "   🆔 ID: prod_Su4VDzuCwkOHEG"
echo -e "   💰 Preço: R$ 4,99/mês"
echo -e "   🆔 Price ID: price_1RyGMI0Tz9khDe1DJIAeUWTR"
echo -e "   🎁 Cupom: 50% OFF (Código: PRIMEIRA50)"

echo -e "\n${GREEN}🔗 Links importantes:${NC}"
echo -e "   📊 Dashboard: https://dashboard.stripe.com/products"
echo -e "   🔑 API Keys: https://dashboard.stripe.com/apikeys"
echo -e "   🪝 Webhooks: https://dashboard.stripe.com/webhooks"

echo -e "\n${BLUE}🚀 Para iniciar o sistema:${NC}"
echo -e "   ./start-system.sh"

echo -e "\n${YELLOW}⚠️  Importante:${NC}"
echo -e "   - Você está usando chaves de PRODUÇÃO"
echo -e "   - Pagamentos serão processados de verdade"
echo -e "   - Configure webhooks para produção"
echo -e "   - Teste primeiro com chaves de teste se necessário"
