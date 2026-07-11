import { RoleMembership } from "@prisma/client";

export enum CirclePermission {
    MANAGE = 'manage_super',
    INVITE_MEMBER = 'invite_member',
    ACCEPT_USE_JOIN = 'accept_use_join',
    KICK_MEMBER = 'kick_member',
    EDIT_CIRCLE = 'edit_circle',
    DELETE_CIRCLE = 'delete_circle',
    PROMOTE_DEMOTE = 'promote_demote',
    START_CPR = 'start_cpr',
    POST = 'post',
    COMMENT = 'comment',
    STATISTICS = 'statistics',
    UPDATE_LEVEL = 'update_level',
}

export const CIRCLE_ROLE_PERMISSIONS: Record<RoleMembership, CirclePermission[]> = {
    [RoleMembership.OWNER]: [
        CirclePermission.MANAGE,
        CirclePermission.INVITE_MEMBER,
        CirclePermission.ACCEPT_USE_JOIN,
        CirclePermission.KICK_MEMBER,
        CirclePermission.EDIT_CIRCLE,
        CirclePermission.DELETE_CIRCLE,
        CirclePermission.PROMOTE_DEMOTE,
        CirclePermission.START_CPR,
        CirclePermission.POST,
        CirclePermission.COMMENT,
        CirclePermission.STATISTICS,
        CirclePermission.UPDATE_LEVEL,
    ],
    [RoleMembership.ADMIN]: [
        CirclePermission.INVITE_MEMBER,
        CirclePermission.ACCEPT_USE_JOIN,
        CirclePermission.KICK_MEMBER,
        CirclePermission.START_CPR,
        CirclePermission.POST,
        CirclePermission.COMMENT,
        CirclePermission.UPDATE_LEVEL,

    ],
    [RoleMembership.MEMBER]: [
        CirclePermission.POST,
        CirclePermission.COMMENT,
        CirclePermission.INVITE_MEMBER,
    ],
}
