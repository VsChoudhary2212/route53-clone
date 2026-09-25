export interface User {
  name: string;
  email: string;
}

const USER: User = {
  name: "Vishnu Choudhary",
  email: "vishnu@example.com",
};

const SESSION_KEY = "route53_session";

export function login(
  email: string,
  password: string
): User | null {
  if (!email || !password) {
    return null;
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(USER)
  );

  return USER;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const session = localStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}