import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/pagination";
import { Prisma, UserStatus } from "@prisma/client";
import type { GetAdminUsersInput } from "./interfaces/get-admin-users.input";
import type { UpdateExpiredBannedUsersInput } from "./interfaces/update-expired-banned-users.input";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  status: true,
  bannedUntil: true,
  verifiedAt: true,
  createdAt: true,
  userRoles: {
    select: {
      role: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

type AdminUserRow = Prisma.UserGetPayload<{
  select: typeof adminUserSelect;
}>;

class UserManagementRepository
  implements IPagination<Prisma.UserWhereInput, AdminUserRow>
{
  findAll({
    page,
    limit,
    where,
    props,
  }: {
    page: number;
    limit: number;
    where?: Prisma.UserWhereInput;
    props?: {
      orderBy?: Prisma.UserOrderByWithRelationInput[];
    };
  }): Promise<AdminUserRow[]> {
    const { offset, currentLimit } = buildPagination({ page, limit });

    return prisma.user.findMany({
      where,
      skip: offset,
      take: currentLimit,
      orderBy: props?.orderBy,
      select: adminUserSelect,
    });
  }

  count({
    where,
  }: {
    where?: Prisma.UserWhereInput;
    props?: any;
  }): Promise<number> {
    return prisma.user.count({ where });
  }

  /**
   * DB read for admin user listing.
   * Includes bannedUntil so admin screens can show temporary-ban expiry.
   */
  async findAllUsers(input: GetAdminUsersInput) {
    return this.findAll({
      page: input.page,
      limit: input.limit,
      props: {
        orderBy: [{ createdAt: "desc" }],
      },
    });
  }

  async countAllUsers({ where }: { where?: Prisma.UserWhereInput } = {}) {
    return this.count({
      where,
      props: {},
    });
  }

  async updateUserStatus(
    userId: string,
    status: UserStatus,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  /**
   * DB write for ban-related columns only.
   * No business decision lives here; service decides status and bannedUntil.
   */
  async updateUserBanFields(
    input: {
      userId: string;
      status: UserStatus;
      bannedUntil?: Date | null;
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.update({
      where: { id: input.userId },
      data: {
        status: input.status,
        bannedUntil: input.bannedUntil,
      },
    });
  }

  /**
   * DB bulk update for users whose temporary ban expired before input.now.
   * Worker/service supplies the target status and clear value.
   */
  async updateExpiredBannedUsers(input: UpdateExpiredBannedUsersInput) {
    return prisma.user.updateMany({
      where: {
        status: UserStatus.BANNED,
        bannedUntil: {
          lt: input.now,
        },
      },
      data: {
        status: input.status,
        bannedUntil: input.bannedUntil,
      },
    });
  }
}

export const userManagementRepository = new UserManagementRepository();
