import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

console.log('Webhook handler iniciado!')

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('Stripe-Signature')
    
    if (!signature) {
      return new Response('Assinatura não encontrada', { status: 400 })
    }

    // Obter o corpo da requisição como texto para verificação
    const body = await req.text()
    
    // Verificar a assinatura do webhook
    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      cryptoProvider
    )

    console.log(`Evento recebido: ${receivedEvent.type}`)

    // Processar diferentes tipos de eventos
    switch (receivedEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = receivedEvent.data.object
        // Atualizar status da assinatura no banco
        const { data, error } = await supabaseAdmin
          .from('subscriptions')
          .update({ 
            status: subscription.status,
            stripe_subscription_id: subscription.id
          })
          .eq('stripe_customer_id', subscription.customer)
        
        if (error) {
          console.error('Erro ao atualizar assinatura:', error)
          return new Response(JSON.stringify({ error: 'Erro ao processar webhook' }), { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        break

      case 'customer.subscription.deleted':
        // Implementar lógica de cancelamento
        break
    }

    return new Response(JSON.stringify({ received: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Erro no webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})