import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

console.log('Create Payment Intent handler iniciado!')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, priceId } = await req.json()
    console.log('Dados recebidos:', { userId, priceId })

    if (!userId || !priceId) {
      throw new Error('userId e priceId são obrigatórios')
    }

    // Buscar ou criar cliente no Stripe
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    console.log('Subscription encontrada:', subscriptions)

    let customerId = subscriptions?.stripe_customer_id

    if (!customerId) {
      console.log('Criando novo cliente no Stripe')
      const customer = await stripe.customers.create({
        metadata: {
          supabase_user_id: userId,
        },
      })
      customerId = customer.id

      await supabaseAdmin
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId)
    }

    console.log('Customer ID:', customerId)

    // Buscar preço para obter o valor
    const price = await stripe.prices.retrieve(priceId)
    
    // Criar PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      setup_future_usage: 'off_session',
      amount: price.unit_amount!,
      currency: price.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        priceId,
        userId,
      },
    })

    console.log('PaymentIntent criado:', paymentIntent.id)

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao criar payment intent:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})