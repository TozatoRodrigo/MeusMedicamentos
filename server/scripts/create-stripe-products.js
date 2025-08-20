const readline = require('readline');

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para fazer pergunta
const question = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function createStripeProducts() {
  console.log('🚀 Configuração de Produtos Stripe - Meus Medicamentos');
  console.log('====================================================\n');

  try {
    // Solicitar chave secreta do Stripe
    const secretKey = await question('Cole sua chave SECRETA do Stripe (sk_test_... ou sk_live_...): ');
    
    if (!secretKey || (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_'))) {
      console.log('❌ Chave secreta inválida. Deve começar com sk_test_ ou sk_live_');
      process.exit(1);
    }

    // Inicializar Stripe com a chave fornecida
    const stripe = require('stripe')(secretKey);
    
    console.log('\n✅ Conectado ao Stripe');
    console.log('🔧 Criando produtos...\n');

    // 1. Criar produto Premium
    console.log('📦 Criando produto "Meus Medicamentos Premium"...');
    const product = await stripe.products.create({
      name: 'Meus Medicamentos Premium',
      description: 'Acesso completo aos recursos premium do aplicativo Meus Medicamentos. Inclui notificações inteligentes, backup na nuvem, relatórios detalhados e histórico ilimitado.',
      metadata: {
        app: 'meus-medicamentos',
        type: 'premium-subscription',
        version: '1.0.0'
      }
    });

    console.log(`✅ Produto criado: ${product.id}`);

    // 2. Criar preço mensal R$ 4,99
    console.log('💰 Criando preço mensal R$ 4,99...');
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 499, // R$ 4,99 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      nickname: 'Premium Mensal',
      metadata: {
        plan: 'premium-monthly',
        app: 'meus-medicamentos'
      }
    });

    console.log(`✅ Preço mensal criado: ${monthlyPrice.id}`);

    // 3. Criar cupom de desconto 50% OFF
    console.log('🎁 Criando cupom de desconto 50% OFF...');
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: 'once',
      name: 'Oferta Especial - Primeiro Mês 50% OFF',
      metadata: {
        campaign: 'launch-offer',
        app: 'meus-medicamentos'
      }
    });

    console.log(`✅ Cupom criado: ${coupon.id}`);

    // 4. Criar código promocional
    console.log('🏷️  Criando código promocional...');
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'PRIMEIRA50',
      active: true,
      max_redemptions: 1000, // Limite de uso
      metadata: {
        campaign: 'launch-offer',
        app: 'meus-medicamentos'
      }
    });

    console.log(`✅ Código promocional criado: ${promoCode.code}`);

    // 5. Configurar portal do cliente
    console.log('🔧 Configurando portal do cliente...');
    try {
      const portalConfig = await stripe.billingPortal.configurations.create({
        business_profile: {
          headline: 'Meus Medicamentos - Gerenciar Assinatura'
        },
        features: {
          customer_update: {
            allowed_updates: ['email', 'address'],
            enabled: true
          },
          invoice_history: {
            enabled: true
          },
          payment_method_update: {
            enabled: true
          },
          subscription_cancel: {
            enabled: true,
            mode: 'at_period_end',
            proration_behavior: 'none'
          },
          subscription_pause: {
            enabled: false
          },
          subscription_update: {
            enabled: true,
            default_allowed_updates: ['price'],
            proration_behavior: 'create_prorations'
          }
        }
      });

      console.log(`✅ Portal do cliente configurado: ${portalConfig.id}`);
    } catch (error) {
      console.log('⚠️  Portal do cliente: Configure manualmente no dashboard');
    }

    // Exibir resumo
    console.log('\n🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('=====================================');
    console.log(`\n📋 Resumo dos produtos criados:`);
    console.log(`   🏷️  Produto: ${product.name}`);
    console.log(`   🆔 ID do Produto: ${product.id}`);
    console.log(`   💰 Preço: R$ 4,99/mês`);
    console.log(`   🆔 ID do Preço: ${monthlyPrice.id}`);
    console.log(`   🎁 Cupom: 50% OFF primeiro mês`);
    console.log(`   🆔 ID do Cupom: ${coupon.id}`);
    console.log(`   🏷️  Código Promo: ${promoCode.code}`);

    console.log(`\n⚙️  Configure seu arquivo server/.env:`);
    console.log(`   STRIPE_SECRET_KEY=${secretKey}`);
    console.log(`   PREMIUM_PRICE_ID=${monthlyPrice.id}`);

    // Obter chave pública correspondente
    const isTest = secretKey.startsWith('sk_test_');
    const pubKeyPrefix = isTest ? 'pk_test_' : 'pk_live_';
    
    console.log(`\n⚙️  Configure seu arquivo .env (frontend):`);
    console.log(`   VITE_STRIPE_PUBLISHABLE_KEY=${pubKeyPrefix}[sua_chave_publica]`);
    console.log(`   VITE_API_BASE_URL=http://localhost:3001`);

    console.log(`\n📊 Acesse seu dashboard Stripe:`);
    const dashboardUrl = isTest ? 
      'https://dashboard.stripe.com/test/products' : 
      'https://dashboard.stripe.com/products';
    console.log(`   ${dashboardUrl}`);

    console.log(`\n🔗 Links úteis:`);
    console.log(`   📚 Documentação: https://stripe.com/docs`);
    console.log(`   🔑 Chaves API: https://dashboard.stripe.com/apikeys`);
    console.log(`   🪝 Webhooks: https://dashboard.stripe.com/webhooks`);

    console.log(`\n🚀 Próximos passos:`);
    console.log(`   1. Configure as variáveis de ambiente mostradas acima`);
    console.log(`   2. Reinicie o servidor backend`);
    console.log(`   3. Teste o fluxo de assinatura no app`);
    console.log(`   4. Configure webhooks para produção`);

  } catch (error) {
    console.error('\n❌ Erro ao criar produtos:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('💡 Verifique se sua chave secreta está correta');
    } else if (error.type === 'StripePermissionError') {
      console.log('💡 Verifique se sua conta tem permissões para criar produtos');
    }
    
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Executar o script
createStripeProducts().then(() => {
  console.log('\n✨ Script concluído!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
