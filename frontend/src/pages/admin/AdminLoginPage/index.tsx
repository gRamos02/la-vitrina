"use client";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { loginAdmin } from '@/api/admin'; 
import { useAtomValue, useSetAtom } from 'jotai';
import { setTokenAtom, tokenAtom } from '@/atoms/auth';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const setToken = useSetAtom(setTokenAtom);
  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [token, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const data = await loginAdmin(email, password);

      setToken(data.token);
      navigate('/admin/dashboard');

    } catch (err: any) {
      toast.error("Error al iniciar sesión: ", {
        description: err.message || 'Credenciales inválidas',
      })
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-4 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Inicio de Sesión (Admin)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@lavitrina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
