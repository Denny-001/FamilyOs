export const i18n = {
  en: {
    welcome: 'Welcome to FamilyOS',
    feed: 'Feed',
    events: 'Events',
    tasks: 'Tasks',
    contributions: 'Contributions',
    vault: 'Vault',
    notifications: 'Notifications',
    login: 'Log in',
    register: 'Create account',
  },
  sw: {
    welcome: 'Karibu FamilyOS',
    feed: 'Mipasho',
    events: 'Matukio',
    tasks: 'Kazi',
    contributions: 'Michango',
    vault: 'Ghala',
    notifications: 'Taarifa',
    login: 'Ingia',
    register: 'Sajili',
  },
};

export type Language = keyof typeof i18n;