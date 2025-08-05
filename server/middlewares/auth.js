 // middlewares/auth.js
import { clerkClient } from "@clerk/clerk-sdk-node";

export const auth = async (req, res, next) => {
  try {
    const { userId  } = req.auth;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found." });
    }

    const user = await clerkClient.users.getUser(userId);

    // Fetch the user's free usage from private metadata
    const freeUsage = user.privateMetadata?.free_usage ?? 0;
    const hasPremiumPlan = user.publicMetadata?.plan === 'premium';

    req.free_usage = freeUsage;
    req.plan = hasPremiumPlan ? "premium" : "free";
    req.userId = userId;

    next();
  } catch (error) {
    console.error("🔒 Auth middleware error:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
