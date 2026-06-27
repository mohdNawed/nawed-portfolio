const { createClient } = require('@supabase/supabase-js');

let supabase;

const hasSupabaseConfig = () => Boolean(
  process.env.SUPABASE_URL
  && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
);

const normalizeSupabaseUrl = () => {
  const rawUrl = String(process.env.SUPABASE_URL || '').trim();

  try {
    const parsedUrl = new URL(rawUrl);
    const isHostedProject = parsedUrl.hostname.endsWith('.supabase.co');
    const isLocalProject = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);

    if (!isHostedProject && !isLocalProject) {
      throw new Error('Unexpected Supabase host');
    }

    return parsedUrl.origin;
  } catch {
    throw new Error('SUPABASE_URL must be the project URL, for example https://project-ref.supabase.co.');
  }
};

const getSupabase = () => {
  if (!hasSupabaseConfig()) return null;
  if (supabase) return supabase;

  supabase = createClient(
    normalizeSupabaseUrl(),
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

const toDatabaseUser = (user) => ({
  name: user.name,
  email: user.email,
  password_hash: user.passwordHash,
  role: user.role || 'member',
});

const fromDatabaseUser = (user) => user && ({
  id: user.id,
  name: user.name,
  email: user.email,
  passwordHash: user.password_hash,
  role: user.role || 'member',
  createdAt: user.created_at,
});

const savePortfolioMessage = async (type, message) => {
  const client = getSupabase();
  if (!client) return null;

  const { error } = await client
    .from('portfolio_messages')
    .insert(toDatabaseMessage(type, message));

  if (error) throw error;
  return true;
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

const findPortfolioUserByEmail = async (email) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('portfolio_users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return fromDatabaseUser(data);
};

const savePortfolioUser = async (user) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('portfolio_users')
    .insert(toDatabaseUser(user))
    .select()
    .single();

  if (error) throw error;
  return fromDatabaseUser(data);
};

const toAuthUser = (authUser) => authUser && ({
  id: authUser.id,
  name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Portfolio User',
  email: authUser.email,
  role: authUser.app_metadata?.role === 'admin' ? 'admin' : 'member',
  createdAt: authUser.created_at,
});

const createPortfolioAuthUser = async ({ name, email, password }) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error) throw error;
  return toAuthUser(data.user);
};

const listAllAuthUsers = async () => {
  const client = getSupabase();
  if (!client) return [];

  const allUsers = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    allUsers.push(...(data.users || []));
    if (!data.users || data.users.length < perPage) break;
    page += 1;
  }

  return allUsers;
};

const findPortfolioAuthUserByEmail = async (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const users = await listAllAuthUsers();
  return toAuthUser(users.find(user => user.email?.toLowerCase() === normalizedEmail));
};

const createOrUpdatePortfolioAuthUser = async ({ name, email, password, role = 'member' }) => {
  const client = getSupabase();
  if (!client) return null;

  const appMetadata = role === 'admin' ? { role: 'admin' } : { role: 'member' };
  const existingUsers = await listAllAuthUsers();
  const existingUser = existingUsers.find(user => user.email?.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    const { data, error } = await client.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: appMetadata,
    });

    if (error) throw error;
    return toAuthUser(data.user);
  }

  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
    app_metadata: appMetadata,
  });

  if (error) throw error;
  return toAuthUser(data.user);
};

const sendPortfolioPasswordReset = async ({ email, redirectTo }) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw error;
  return data;
};

const signInPortfolioAuthUser = async ({ email, password }) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return toAuthUser(data.user);
};

module.exports = {
  createOrUpdatePortfolioAuthUser,
  createPortfolioAuthUser,
  deletePortfolioMessage,
  findPortfolioAuthUserByEmail,
  findPortfolioUserByEmail,
  hasSupabaseConfig,
  listPortfolioMessages,
  savePortfolioMessage,
  savePortfolioUser,
  sendPortfolioPasswordReset,
  signInPortfolioAuthUser,
  updatePortfolioMessage,
};
