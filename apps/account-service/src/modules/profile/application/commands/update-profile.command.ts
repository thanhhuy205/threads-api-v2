export type UpdateProfileCommand = {
  identity: string;
  name?: string | null;
  bio?: string | null;
  labelWebsite?: string | null;
  website?: string | null;
  companyName?: string | null;
  companySize?: string | null;
};
