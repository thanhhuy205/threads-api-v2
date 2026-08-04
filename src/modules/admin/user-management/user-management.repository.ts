import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/pagination";
import { Prisma, UserStatus } from "@prisma/client";
import type { GetAdminUsersInput } from "./interfaces/get-admin-users.input";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  status: true,
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

const moderatedUserSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  status: true,
} satisfies Prisma.UserSelect;

type AdminUserRow = Prisma.UserGetPayload<{
  select: typeof adminUserSelect;
}>;

class UserManagementRepository
  implements IPagination<Prisma.UserWhereInput, AdminUserRow> {
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

  async updateUserBanFields(
    input: {
      userId: string;
      status: UserStatus;
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.update({
      where: { id: input.userId },
      data: {
        status: input.status,
      },
      select: moderatedUserSelect,
    });
  }

}

export const userManagementRepository = new UserManagementRepository();
