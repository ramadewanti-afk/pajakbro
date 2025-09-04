'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: 'Input tidak valid.' };
  }

  // Mock authentication
  if (
    parsed.data.email === 'admin@pajak.bro' &&
    parsed.data.password === 'admin123'
  ) {
    cookies().set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true };
  } else {
    return { error: 'Email atau password salah.' };
  }
}

export async function logoutAction() {
    cookies().delete('auth');
    return { success: true };
}
