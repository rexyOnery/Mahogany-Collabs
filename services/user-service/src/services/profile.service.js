import { Profile } from "../models/profile.model.js";

export const getOrCreateProfile = async (identity) => {
  const existing = await Profile.findOne({ authUserId: identity.sub });
  if (existing) {
    return existing;
  }

  return Profile.create({
    authUserId: identity.sub,
    email: identity.email,
    displayName: identity.name || identity.email?.split("@")[0] || "Archive Member"
  });
};

export const updateProfile = async (identity, updates) =>
  Profile.findOneAndUpdate(
    { authUserId: identity.sub },
    {
      $set: {
        ...updates,
        email: identity.email
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
