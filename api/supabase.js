const { createClient } = require('@supabase/supabase-js');

let supabase;

const hasSupabaseConfig = () => Boolean(
  process.env.SUPABASE_URL
  && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
);

const getSupabase = () => {
  if (!hasSupabaseConfig()) return null;
  if (supabase) return supabase;

  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  return supabase;
};

const toDatabaseMessage = (type, message) => ({
  type,
  name: message.name,
  email: message.email,
  message: message.message || message.details || 'Not provided',
  project_type: message.projectType || null,
  budget: message.budget || null,
  source: message.source,
  status: message.status || 'new',
});

const savePortfolioMessage = async (type, message) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('portfolio_messages')
    .insert(toDatabaseMessage(type, message))
    .select()
    .single();

  if (error) throw error;
  return data;
};

const listPortfolioMessages = async () => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('portfolio_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const updatePortfolioMessage = async (id, status) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('portfolio_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deletePortfolioMessage = async (id) => {
  const client = getSupabase();
  if (!client) return null;

  const { error } = await client
    .from('portfolio_messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

module.exports = {
  deletePortfolioMessage,
  hasSupabaseConfig,
  listPortfolioMessages,
  savePortfolioMessage,
  updatePortfolioMessage,
};
