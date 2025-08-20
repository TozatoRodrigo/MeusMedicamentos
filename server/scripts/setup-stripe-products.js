const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

async function setupStripeProducts() {
  try {
    console.log('🚀 Configurando produtos no Stripe...\n');

    // Criar produto Premium
    const product = await stripe.products.create({
      name: 'Meus Medicamentos Premium',
      description: 'Acesso completo aos recursos premium do aplicativo Meus Medicamentos',
      metadata: {
        app: 'meus-medicamentos',
        type: 'premium-subscription'
      },
      images: [
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
      ]
    });

    console.log('✅ Produto criado:', product.id);

    // Criar preço mensal (R$ 4,99)
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 499, // R$ 4,99 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
        interval_count: 1
      },
      metadata: {
        plan: 'premium-monthly'
      }
    });

    console.log('✅ Preço mensal criado:', monthlyPrice.id);

    // Criar cupom de desconto para primeiro mês (50% OFF)
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: 'once',
      name: 'Oferta Especial - Primeiro Mês 50% OFF',
      metadata: {
        campaign: 'launch-offer'
      }
    });

    console.log('✅ Cupom de desconto criado:', coupon.id);

    // Criar código promocional
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: 'PRIMEIRA50',
      active: true,
      metadata: {
        campaign: 'launch-offer'
      }
    });

    console.log('✅ Código promocional criado:', promoCode.code);

    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`   Produto ID: ${product.id}`);
    console.log(`   Preço Mensal ID: ${monthlyPrice.id}`);
    console.log(`   Cupom ID: ${coupon.id}`);
    console.log(`   Código Promocional: ${promoCode.code}`);
    
    console.log('\n⚙️  Configure seu arquivo .env:');
    console.log(`   PREMIUM_PRICE_ID=${monthlyPrice.id}`);
    
    return {
      product,
      monthlyPrice,
      coupon,
      promoCode
    };

  } catch (error) {
    console.error('❌ Erro ao configurar produtos:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupStripeProducts().then(() => {
    console.log('\n✨ Produtos configurados com sucesso!');
    process.exit(0);
  });
}

module.exports = setupStripeProducts;
