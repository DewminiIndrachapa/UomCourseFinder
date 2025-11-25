/**
 * Feather Icon Mapping
 * Maps common icon names to Feather icons for consistent usage throughout the app
 */

export const ICONS = {
  // Authentication & User
  user: 'user',
  lock: 'lock',
  mail: 'mail',
  eye: 'eye',
  eyeOff: 'eye-off',
  school: 'book',
  
  // Navigation
  home: 'home',
  search: 'search',
  bookmark: 'bookmark',
  compass: 'compass',
  
  // Actions
  add: 'plus',
  remove: 'minus',
  edit: 'edit',
  delete: 'trash-2',
  save: 'save',
  share: 'share-2',
  close: 'x',
  back: 'arrow-left',
  chevronDown: 'chevron-down',
  chevronRight: 'chevron-right',
  
  // Content
  star: 'star',
  heart: 'heart',
  calendar: 'calendar',
  clock: 'clock',
  location: 'map-pin',
  tag: 'tag',
  users: 'users',
  info: 'info',
  alert: 'alert-circle',
  check: 'check',
  
  // Settings
  settings: 'settings',
  logout: 'log-out',
  moon: 'moon',
  sun: 'sun',
  
  // Business
  business: 'briefcase',
  card: 'credit-card',
} as const;

export type IconName = keyof typeof ICONS;
