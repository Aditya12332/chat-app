// src/hooks/useUserSetup.js
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export default function useUserSetup() {
  useEffect(() => {
    const setupUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
          createdAt: new Date()
        });
      }
    };

    setupUser();
  }, []);
}
