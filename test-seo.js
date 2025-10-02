import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://lbmortayknpfqkpwuvmy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibW9ydGF5a25wZnFrcHd1dm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDEwNDAsImV4cCI6MjA3NDcxNzA0MH0.eAP10gVsLHClw6TC1akinRdSqa9ymWGa0e2kQX6UCDI";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testSEOData() {
  console.log('Testing SEO data fetch...');

  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('seo_settings')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection error:', testError);
      return;
    }

    console.log('✅ Database connection successful');

    // Fetch home page SEO data
    const { data: homeData, error: homeError } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', 'home')
      .single();

    if (homeError) {
      console.error('❌ Error fetching home SEO data:', homeError);
    } else {
      console.log('✅ Home SEO data:', homeData);
    }

    // Fetch all SEO settings
    const { data: allData, error: allError } = await supabase
      .from('seo_settings')
      .select('*');

    if (allError) {
      console.error('❌ Error fetching all SEO data:', allError);
    } else {
      console.log('✅ All SEO settings:', allData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSEOData();
