import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const SyncUser = () => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const sync = async () => {
        try {
          await fetch('/api/users/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress.emailAddress,
              name: user.fullName || "User"
            })
          });
          console.log("User synced to DB successfully");
        } catch (error) {
          console.error("Sync failed:", error);
        }
      };
      sync();
    }
  }, [isSignedIn, user]);

  return null; // Ye UI kuch show nahi karega, bas background mein chalega
};

export default SyncUser;