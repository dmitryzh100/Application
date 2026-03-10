import { ChatRole } from '../enums/chat.enum';

const ALLOWED_ROLES: ChatRole[] = [ChatRole.USER, ChatRole.ASSISTANT];

export const hasRole = (role: string, roles: ChatRole[] = ALLOWED_ROLES): boolean => {
  return roles.includes(role as ChatRole);
};
