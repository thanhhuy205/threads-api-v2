import { CirclePermission } from "@/modules/circle/permission/circle-permission";

export const checkCirclePermission = (userPermissions: CirclePermission[], requiredPermission: CirclePermission): boolean => {
    return userPermissions.includes(requiredPermission);
}