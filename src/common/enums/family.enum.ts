export enum FamilyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export type FamilyStatusType = keyof typeof FamilyStatus;
