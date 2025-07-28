export interface UserProfile {
  profileName: string;
  publicId: string;
  bio: string;
  profileImageUrl: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateCreated: string;
  dateUpdated: string;
}
