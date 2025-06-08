import { baseApiUrl } from "./const";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email?: string;
  };
};

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
//   const baseApiUrl = import.meta.env.VITE_API_URL;
  console.log(`Conectando a la API en: ${baseApiUrl}`);
  const response = await fetch(`${baseApiUrl}/admin/users/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Credenciales inválidas');
  }

  return data.data;
}
