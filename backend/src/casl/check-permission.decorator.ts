import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMISSION = 'check_permission';

export interface PermissionMetadata {
  action: string;
  subject: string;
}

export const CheckPermission = (
  actionOrPermission: string,
  subject?: string,
) => {
  let action = actionOrPermission;
  let resolvedSubject = subject;

  // Handle both formats:
  // 1. CheckPermission('users', 'create') - separate action and subject
  // 2. CheckPermission('users:create') - combined format
  if (!subject && actionOrPermission.includes(':')) {
    const [res, act] = actionOrPermission.split(':');
    resolvedSubject = res;
    action = act;
  }

  return SetMetadata(CHECK_PERMISSION, {
    action,
    subject: resolvedSubject || 'all',
  } as PermissionMetadata);
};
