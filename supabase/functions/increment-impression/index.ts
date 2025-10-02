import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { ad_id } = await req.json()

    if (!ad_id) {
      return new Response(
        JSON.stringify({ error: 'ad_id is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get current impression count and increment it
    const { data: currentAd, error: fetchError } = await supabaseClient
      .from('ads')
      .select('impression_count')
      .eq('id', ad_id)
      .single()

    if (fetchError) {
      console.error('Error fetching current ad:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch ad' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Increment impression count
    const { error } = await supabaseClient
      .from('ads')
      .update({ 
        impression_count: (currentAd.impression_count || 0) + 1
      })
      .eq('id', ad_id)

    if (error) {
      console.error('Error incrementing impression:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to increment impression' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})