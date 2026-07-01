const {
  hasSupabaseConfig,
} = require('../../api/supabase');

const getDatabaseStatus = () => ({
  messageStorage: hasSupabaseConfig() ? 'supabase' : (process.env.MONGO_URI ? 'mongodb' : 'memory'),
  authStorage: hasSupabaseConfig() ? 'supabase-auth' : (process.env.MONGO_URI ? 'mongodb' : 'memory'),
});

module.exports = {
  getDatabaseStatus,
};
