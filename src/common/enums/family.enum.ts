export enum FamilyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum FamilyRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export enum FamilyMemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEFT = 'LEFT',
  REMOVED = 'REMOVED',
}

export type FamilyStatusType = keyof typeof FamilyStatus;
export type FamilyRoleType = keyof typeof FamilyRole;
export type FamilyMemberStatusType = keyof typeof FamilyMemberStatus;
