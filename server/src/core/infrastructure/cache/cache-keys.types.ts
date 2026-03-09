type CacheKeyStore = {
  users: {
    all: 'users:all';
    byId: (id: string) => string;
  };
  profiles: {
    all: 'profiles:all';
    byUserId: (userId: string) => string;
  };
  contacts: {
    byUserId: (userId: string) => string;
    byId: (id: string) => string;
  };
  permissions: {    
    all: 'permissions:all';
    byId: (id: string) => string;
  };
   roles: {        
    all: 'roles:all';
    byId: (id: string) => string;
   };
   sessions: {
    all: 'sessions:all';    
    byUserId: (userId: string) => string;
   };
};

export const CacheKeys: CacheKeyStore = {
  users: {
    all: 'users:all',
    byId: (id) => `users:${id}`,
  },
  profiles: {
    all: 'profiles:all',
    byUserId: (userId) => `profiles:user:${userId}`,
  },
   contacts: {
    byUserId: (userId: string) => `contacts:user:${userId}`,
    byId: (id) => `contacts:${id}`,
  },
    permissions: {  
    all: 'permissions:all',
    byId: (id) => `permissions:${id}`,
  },
    roles: {    
    all: 'roles:all',
    byId: (id) => `roles:${id}`,
  },
    sessions: {
    all: 'sessions:all',
    byUserId: (userId) => `sessions:user:${userId}`,
  },    
} as const;
