export interface VisitUserProfile {
  profileName: string;
  authUserId: string;
  bio: string;
  profileImageUrl: string;
  gender: "MALE" | "FEMALE" | "OTHER";
}
