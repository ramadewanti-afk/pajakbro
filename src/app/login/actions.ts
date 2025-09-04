'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// This function is now designed to be called from a client-side component
// as Firebase Auth client SDK is friendlier for web.
// The 'use server' directive is not strictly needed if all auth logic moves client-side,
// but we keep it for other potential server actions.

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: 'Input tidak valid.' };
  }

  // NOTE: This part is tricky on the server. Firebase's primary web SDK
  // is client-side. For server-side rendering and actions, you'd typically
  // use the Firebase Admin SDK and manage sessions with cookies.
  // To keep it simple and use the client SDK, the actual sign-in call
  // should be made on the client. This server action is now a placeholder
  // or could be used for other logic. The client will handle the sign-in.
  
  // A true server-side implementation would look like this (with Admin SDK):
  /*
  try {
    const userCredential = await admin.auth().getUserByEmail(parsed.data.email);
    // Here you would verify password, create a session cookie, etc.
    return { success: true };
  } catch (error) {
    return { error: 'Email atau password salah.' };
  }
  */

  // Since we'll call firebase on the client, this action doesn't do much.
  // We return success and let the client handle the redirect.
  return { success: true };
}

export async function logoutAction() {
    // Similarly, this would be done on the client with the client SDK
    // to ensure the local auth state is cleared.
    return { success: true };
}
