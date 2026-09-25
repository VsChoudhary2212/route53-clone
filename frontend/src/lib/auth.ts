export interface CurrentUser {
  name: string;
  email: string;
}

const SESSION_KEY = "route53_session";

function formatName(email: string): string {
  const username = email.split("@")[0];

  return username
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function login(email: string, password: string): boolean {
  if (!email.trim() || !password.trim()) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user: CurrentUser = {
    name: formatName(normalizedEmail),
    email: normalizedEmail,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return true;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const session = localStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as CurrentUser;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}