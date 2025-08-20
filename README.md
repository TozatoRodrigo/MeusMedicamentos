# 💊 Meus Medicamentos

<div align="center">

![Meus Medicamentos Logo](public/pharmacy-icon.svg)

**Controle inteligente de medicações e vitaminas com sistema premium**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.1-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[🚀 Demo](#demo) • [📦 Instalação](#instalação) • [⚙️ Configuração](#configuração) • [📖 Documentação](#documentação) • [🤝 Contribuição](#contribuição)

</div>

---

## 📋 Sobre o Projeto

**Meus Medicamentos** é uma aplicação web moderna e responsiva para controle inteligente de medicações e vitaminas. O projeto oferece funcionalidades gratuitas essenciais e um sistema premium com recursos avançados, integrado ao Stripe para processamento de pagamentos.

### ✨ Principais Funcionalidades

#### 🆓 **Versão Gratuita**
- ✅ **Cadastro de Medicações** - Adicione medicamentos e vitaminas
- ✅ **Agendamento de Horários** - Configure horários de tomada
- ✅ **Lista Organizada** - Visualize todas as medicações
- ✅ **Histórico Básico** - Acompanhe medicações tomadas
- ✅ **Interface Responsiva** - Funciona em mobile e desktop

#### 💎 **Versão Premium** (R$ 4,99/mês)
- 🔔 **Notificações Inteligentes** - 6 tipos de lembretes personalizados
- ☁️ **Backup na Nuvem** - Sincronização automática entre dispositivos
- 📊 **Relatórios Detalhados** - Gráficos e métricas de adesão
- 📚 **Histórico Ilimitado** - Acesso completo ao histórico
- 🎁 **Oferta Especial** - 50% OFF no primeiro mês

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18.2** - Biblioteca JavaScript para interfaces
- **Material-UI 5.14** - Componentes de design system
- **Framer Motion** - Animações fluidas e interativas
- **Vite** - Build tool moderna e rápida
- **PWA** - Progressive Web App com service worker

### **Backend**
- **Node.js 18+** - Runtime JavaScript server-side
- **Express.js** - Framework web minimalista
- **Stripe API** - Processamento de pagamentos
- **Webhooks** - Sincronização automática de eventos
- **CORS & Helmet** - Segurança e controle de acesso

### **Pagamentos**
- **Stripe Checkout** - Interface segura de pagamento
- **Stripe Portal** - Gerenciamento de assinaturas
- **Webhooks** - Eventos em tempo real
- **Cupons & Promoções** - Sistema de descontos

---

## 🚀 Demo

### **Screenshots**

<div align="center">

| Tela Principal | Modal Premium | Checkout Stripe |
|:---:|:---:|:---:|
| ![Main](docs/screenshots/main.png) | ![Premium](docs/screenshots/premium.png) | ![Checkout](docs/screenshots/checkout.png) |

</div>

### **Recursos Visuais**
- 🎨 **Design Moderno** - Interface limpa e intuitiva
- 📱 **Totalmente Responsivo** - Adaptado para todos os dispositivos
- 🌙 **Tema Profissional** - Cores harmoniosas e gradientes
- ⚡ **Animações Suaves** - Micro-interações com Framer Motion
- 🎯 **UX Otimizada** - Fluxos de usuário bem definidos

---

## 📦 Instalação

### **Pré-requisitos**
- Node.js 18 ou superior
- npm ou yarn
- Conta no Stripe (para funcionalidades premium)

### **Instalação Rápida**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/meus-medicamentos.git
cd meus-medicamentos

# Instale as dependências
npm install
cd server && npm install && cd ..

# Configure o ambiente
./configure-stripe.sh

# Inicie o sistema
./start-system.sh
```

### **Instalação Manual**

```bash
# 1. Clone e instale dependências
git clone https://github.com/seu-usuario/meus-medicamentos.git
cd meus-medicamentos
npm install

# 2. Configure backend
cd server
npm install
cp config.example.env .env
# Edite server/.env com suas chaves do Stripe

# 3. Configure frontend
cd ..
cp frontend.env.example .env
# Edite .env com sua chave pública do Stripe

# 4. Crie produtos no Stripe
cd server
node scripts/create-stripe-products.js

# 5. Inicie os serviços
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
npm run dev
```

---

## ⚙️ Configuração

### **Variáveis de Ambiente**

#### **Backend** (`server/.env`)
```env
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret
PREMIUM_PRICE_ID=price_id_do_produto_premium
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

#### **Frontend** (`.env`)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica
VITE_API_BASE_URL=http://localhost:3001
```

### **Configuração do Stripe**

1. **Criar Produtos**
   ```bash
   cd server
   node scripts/create-stripe-products.js
   ```

2. **Configurar Webhooks**
   ```bash
   # Desenvolvimento
   stripe listen --forward-to localhost:3001/webhook
   
   # Produção - Configure no dashboard
   # Endpoint: https://seudominio.com/webhook
   ```

3. **Portal do Cliente**
   - Configure em: https://dashboard.stripe.com/settings/billing/portal
   - Ative cancelamento e atualizações de pagamento

---

## 📖 Documentação

### **Estrutura do Projeto**
```
meus-medicamentos/
├── 📁 public/              # Arquivos estáticos
├── 📁 src/                 # Código fonte do frontend
│   ├── 📁 components/      # Componentes React
│   ├── 📁 services/        # Serviços e APIs
│   └── 📄 main.jsx         # Ponto de entrada
├── 📁 server/              # Backend Node.js
│   ├── 📁 routes/          # Rotas da API
│   ├── 📁 scripts/         # Scripts utilitários
│   └── 📄 server.js        # Servidor Express
├── 📁 docs/                # Documentação
└── 📄 README.md            # Este arquivo
```

### **Documentação Técnica**
- [📚 Guia de Integração Stripe](STRIPE_INTEGRATION_GUIDE.md)
- [🔧 Configuração de Produtos](server/scripts/README.md)
- [🐛 Erros Corrigidos](ERROS_CORRIGIDOS.md)
- [📊 API Reference](docs/API.md)

### **Scripts Disponíveis**

#### **Frontend**
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview da build
npm run lint         # Verificar código
```

#### **Backend**
```bash
npm start            # Produção
npm run dev          # Desenvolvimento com nodemon
```

#### **Sistema**
```bash
./start-system.sh    # Iniciar sistema completo
./configure-stripe.sh # Configurar Stripe automaticamente
```

---

## 🔒 Segurança

### **Medidas Implementadas**
- ✅ **HTTPS Obrigatório** em produção
- ✅ **Validação de Webhooks** com assinaturas
- ✅ **Sanitização de Dados** em todas as entradas
- ✅ **CORS Configurado** para origens específicas
- ✅ **Helmet.js** para headers de segurança
- ✅ **Rate Limiting** (recomendado para produção)

### **Boas Práticas**
- 🔐 Chaves secretas nunca expostas no frontend
- 🛡️ Validação de dados no backend
- 📝 Logs de auditoria para ações críticas
- 🔄 Rotação regular de chaves de API

---

## 🚀 Deploy

### **Frontend (Vercel/Netlify)**
```bash
# Build
npm run build

# Deploy automático via Git
git push origin main
```

### **Backend (Railway/Heroku)**
```bash
# Configurar variáveis de ambiente
# Fazer deploy via Git ou CLI
```

### **Webhooks de Produção**
Configure no dashboard do Stripe:
- **URL:** `https://seudominio.com/webhook`
- **Eventos:** `checkout.session.completed`, `customer.subscription.*`

---

## 📊 Monitoramento

### **Métricas Importantes**
- 💰 **MRR** (Monthly Recurring Revenue)
- 📈 **Taxa de Conversão** do checkout
- 📉 **Churn Rate** de cancelamentos
- 🔄 **Retenção** de usuários premium

### **Ferramentas**
- **Stripe Dashboard** - Métricas financeiras
- **Google Analytics** - Comportamento dos usuários
- **Sentry** - Monitoramento de erros (recomendado)

---

## 🧪 Testes

### **Cartões de Teste**
```
Sucesso:     4242 4242 4242 4242
Falha:       4000 0000 0000 0002
3D Secure:   4000 0025 0000 3155
```

### **Cenários de Teste**
- ✅ Cadastro de medicação
- ✅ Fluxo de assinatura premium
- ✅ Cancelamento de assinatura
- ✅ Webhooks de pagamento
- ✅ Interface responsiva

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Veja como contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Diretrizes**
- 📝 Use mensagens de commit descritivas
- 🧪 Adicione testes para novas funcionalidades
- 📖 Atualize a documentação quando necessário
- 🎨 Siga os padrões de código estabelecidos

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Rodrigo Dias Tozato**

- 💼 LinkedIn: [seu-linkedin](https://linkedin.com/in/seu-linkedin)
- 🐙 GitHub: [@seu-usuario](https://github.com/seu-usuario)
- 📧 Email: seu-email@exemplo.com

---

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Biblioteca JavaScript
- [Material-UI](https://mui.com/) - Componentes de design
- [Stripe](https://stripe.com/) - Processamento de pagamentos
- [Vite](https://vitejs.dev/) - Build tool moderna
- [Framer Motion](https://www.framer.com/motion/) - Animações

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

**🚀 Feito com ❤️ por [Rodrigo Dias Tozato](https://github.com/seu-usuario)**

</div>
