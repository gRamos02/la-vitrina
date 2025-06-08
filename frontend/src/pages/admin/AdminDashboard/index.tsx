import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración de la Vitrina</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Gestiona las categorías de productos.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Agrega, edita o elimina productos.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Revisa los administradores registrados.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
