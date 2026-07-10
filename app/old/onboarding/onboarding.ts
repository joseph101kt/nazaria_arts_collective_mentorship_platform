export interface AccountDetails {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileDetails {
  schoolOrOrg: string;
  bio: string;
  backgroundNotes: string;
  goals: string[];
  interests: string[];
  avatarFile: File | null;
}

export interface OnboardingState {
  account: AccountDetails;
  profile: ProfileDetails;
}

export type OnboardingStep = "account" | "profile";