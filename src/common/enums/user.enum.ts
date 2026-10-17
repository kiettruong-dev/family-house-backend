export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export type UserStatusType = keyof typeof UserStatus;
