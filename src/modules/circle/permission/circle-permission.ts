import { RoleMembership } from "@prisma/client";

export enum CirclePermission {
    MANAGE = 'manage_super',
    INVITE_MEMBER = 'invite_member',
    KICK_MEMBER = 'kick_member',
    EDIT_CIRCLE = 'edit_circle',
    DELETE_CIRCLE = 'delete_circle',
    PROMOTE_DEMOTE = 'promote_demote',
    START_CPR = 'start_cpr',
    POST = 'post',
    COMMENT = 'comment',
}

export const CIRCLE_ROLE_PERMISSIONS: Record<RoleMembership, CirclePermission[]> = {
    [RoleMembership.OWNER]: [
        CirclePermission.MANAGE,
        CirclePermission.INVITE_MEMBER,
        CirclePermission.KICK_MEMBER,
        CirclePermission.EDIT_CIRCLE,
        CirclePermission.DELETE_CIRCLE,
        CirclePermission.PROMOTE_DEMOTE,
        CirclePermission.START_CPR,
        CirclePermission.POST,
        CirclePermission.COMMENT,
    ],
    [RoleMembership.ADMIN]: [
        CirclePermission.INVITE_MEMBER,
        CirclePermission.KICK_MEMBER,
        CirclePermission.START_CPR,
        CirclePermission.POST,
        CirclePermission.COMMENT,
    ],
    [RoleMembership.MEMBER]: [
        CirclePermission.POST,
        CirclePermission.COMMENT,
        CirclePermission.INVITE_MEMBER,
    ],
}