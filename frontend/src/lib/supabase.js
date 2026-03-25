// Mock Supabase client for THRESHOLD
// Replace with real Supabase when credentials are provided

const STORAGE_KEY = 'threshold_auth';
const DATA_KEY = 'threshold_data';

// Helper to get/set localStorage
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredAuth = (data) => {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const getStoredData = () => {
  try {
    const stored = localStorage.getItem(DATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setStoredData = (data) => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

// Mock user database
const mockUsers = {};

// Generate mock UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Auth state change listeners
let authListeners = [];

const notifyAuthChange = (event, session) => {
  authListeners.forEach(callback => callback(event, session));
};

// Mock Supabase client
export const supabase = {
  auth: {
    getSession: async () => {
      const stored = getStoredAuth();
      if (stored) {
        return { data: { session: stored }, error: null };
      }
      return { data: { session: null }, error: null };
    },
    
    signUp: async ({ email, password, options }) => {
      const userId = generateUUID();
      const user = {
        id: userId,
        email,
        created_at: new Date().toISOString(),
        user_metadata: options?.data || {}
      };
      
      mockUsers[email] = { user, password };
      
      const session = {
        user,
        access_token: 'mock_token_' + userId,
        expires_at: Date.now() + 3600000
      };
      
      setStoredAuth(session);
      
      // Initialize user data
      const data = getStoredData();
      data.profiles = data.profiles || {};
      data.profiles[userId] = {
        id: userId,
        email,
        first_name: options?.data?.first_name || '',
        tier: 'free',
        onboarding_complete: false,
        commitment_statement: null,
        fighting_for: null,
        created_at: new Date().toISOString()
      };
      
      data.streaks = data.streaks || {};
      data.streaks[userId] = {
        id: generateUUID(),
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        total_days_free: 0,
        start_date: null,
        last_updated: null
      };
      
      setStoredData(data);
      
      notifyAuthChange('SIGNED_IN', session);
      
      return { data: { user, session }, error: null };
    },
    
    signInWithPassword: async ({ email, password }) => {
      const stored = mockUsers[email];
      
      // Also check localStorage for previously registered users
      const data = getStoredData();
      const existingProfile = Object.values(data.profiles || {}).find(p => p.email === email);
      
      if (existingProfile) {
        const user = {
          id: existingProfile.id,
          email: existingProfile.email,
          created_at: existingProfile.created_at
        };
        
        const session = {
          user,
          access_token: 'mock_token_' + user.id,
          expires_at: Date.now() + 3600000
        };
        
        setStoredAuth(session);
        notifyAuthChange('SIGNED_IN', session);
        
        return { data: { user, session }, error: null };
      }
      
      if (!stored) {
        return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
      }
      
      const session = {
        user: stored.user,
        access_token: 'mock_token_' + stored.user.id,
        expires_at: Date.now() + 3600000
      };
      
      setStoredAuth(session);
      notifyAuthChange('SIGNED_IN', session);
      
      return { data: { user: stored.user, session }, error: null };
    },
    
    signOut: async () => {
      setStoredAuth(null);
      notifyAuthChange('SIGNED_OUT', null);
      return { error: null };
    },
    
    onAuthStateChange: (callback) => {
      authListeners.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners = authListeners.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  },
  
  from: (table) => {
    const data = getStoredData();
    data[table] = data[table] || {};
    
    return {
      select: (columns = '*') => {
        let filters = [];
        
        const createFilterChain = () => ({
          eq: (field, value) => {
            filters.push({ field, value });
            return createFilterChain();
          },
          single: async () => {
            let items = Object.values(data[table]);
            for (const filter of filters) {
              items = items.filter(i => i[filter.field] === filter.value);
            }
            const item = items[0] || null;
            return { data: item, error: item ? null : { message: 'Not found' } };
          },
          order: (orderField, options) => ({
            async then(resolve) {
              let items = Object.values(data[table]);
              for (const filter of filters) {
                items = items.filter(i => i[filter.field] === filter.value);
              }
              if (options?.ascending === false) {
                items.sort((a, b) => new Date(b[orderField]) - new Date(a[orderField]));
              } else {
                items.sort((a, b) => new Date(a[orderField]) - new Date(b[orderField]));
              }
              resolve({ data: items, error: null });
            }
          }),
          async then(resolve) {
            let items = Object.values(data[table]);
            for (const filter of filters) {
              items = items.filter(i => i[filter.field] === filter.value);
            }
            resolve({ data: items, error: null });
          }
        });
        
        return {
          ...createFilterChain(),
          order: (orderField, options) => ({
            async then(resolve) {
              let items = Object.values(data[table]);
              if (options?.ascending === false) {
                items.sort((a, b) => new Date(b[orderField]) - new Date(a[orderField]));
              }
              resolve({ data: items, error: null });
            }
          }),
          single: async () => {
            const items = Object.values(data[table]);
            return { data: items[0] || null, error: null };
          },
          async then(resolve) {
            resolve({ data: Object.values(data[table]), error: null, count: Object.values(data[table]).length });
          }
        };
      },
      
      insert: (item) => ({
        select: () => ({
          single: async () => {
            const id = item.id || generateUUID();
            const newItem = { ...item, id, created_at: new Date().toISOString() };
            data[table][id] = newItem;
            setStoredData(data);
            return { data: newItem, error: null };
          },
          async then(resolve) {
            const id = item.id || generateUUID();
            const newItem = { ...item, id, created_at: new Date().toISOString() };
            data[table][id] = newItem;
            setStoredData(data);
            resolve({ data: [newItem], error: null });
          }
        }),
        async then(resolve) {
          const id = item.id || generateUUID();
          const newItem = { ...item, id, created_at: new Date().toISOString() };
          data[table][id] = newItem;
          setStoredData(data);
          resolve({ data: newItem, error: null });
        }
      }),
      
      update: (updates) => ({
        eq: (field, value) => {
          const doUpdate = () => {
            const items = Object.values(data[table]);
            const item = items.find(i => i[field] === value);
            if (item) {
              const updated = { ...item, ...updates, updated_at: new Date().toISOString() };
              data[table][item.id] = updated;
              setStoredData(data);
              return { data: updated, error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          };
          
          return {
            select: () => ({
              single: async () => doUpdate(),
              async then(resolve) {
                const result = doUpdate();
                resolve({ data: result.data ? [result.data] : [], error: result.error });
              }
            }),
            async then(resolve) {
              resolve(doUpdate());
            }
          };
        }
      }),
      
      upsert: (item) => ({
        select: () => ({
          single: async () => {
            const id = item.id || item.user_id || generateUUID();
            // Find existing by user_id for tables like streaks
            let existingKey = Object.keys(data[table]).find(k => {
              const existing = data[table][k];
              return existing.user_id === item.user_id || existing.id === id;
            });
            
            if (existingKey) {
              const updated = { ...data[table][existingKey], ...item, updated_at: new Date().toISOString() };
              data[table][existingKey] = updated;
              setStoredData(data);
              return { data: updated, error: null };
            } else {
              const newItem = { ...item, id, created_at: new Date().toISOString() };
              data[table][id] = newItem;
              setStoredData(data);
              return { data: newItem, error: null };
            }
          }
        }),
        async then(resolve) {
          const id = item.id || item.user_id || generateUUID();
          let existingKey = Object.keys(data[table]).find(k => {
            const existing = data[table][k];
            return existing.user_id === item.user_id || existing.id === id;
          });
          
          if (existingKey) {
            const updated = { ...data[table][existingKey], ...item, updated_at: new Date().toISOString() };
            data[table][existingKey] = updated;
            setStoredData(data);
            resolve({ data: updated, error: null });
          } else {
            const newItem = { ...item, id, created_at: new Date().toISOString() };
            data[table][id] = newItem;
            setStoredData(data);
            resolve({ data: newItem, error: null });
          }
        }
      }),
      
      delete: () => ({
        eq: (field, value) => ({
          async then(resolve) {
            const key = Object.keys(data[table]).find(k => data[table][k][field] === value);
            if (key) {
              delete data[table][key];
              setStoredData(data);
            }
            resolve({ error: null });
          }
        })
      })
    };
  }
};

export default supabase;
