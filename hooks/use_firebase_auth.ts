import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { InAuthUser } from '@/models/in_auth_user';
import FirebaseClient from '@/models/firebase_client';

const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);

      if (signInResult.user) {
        const { uid, email, displayName, photoURL } = signInResult.user;

        const result = await fetch('/api/members.add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid, email, displayName, photoURL }),
        });

        const resData = await result.json();
        console.info({ status: result.status });
        console.info(resData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    const { uid, email, photoURL, displayName } = authState;
    setLoading(true);
    setAuthUser({
      uid,
      email,
      photoURL,
      displayName,
    });
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged);

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
};

export default useFirebaseAuth;
