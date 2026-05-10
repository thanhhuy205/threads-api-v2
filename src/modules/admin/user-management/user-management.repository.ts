class UserManagementRepository {
  async updateUserModeration(_userId: string, _action: "lock" | "unlock" | "temporary_ban") {
    return;
  }
}

export const userManagementRepository = new UserManagementRepository();
