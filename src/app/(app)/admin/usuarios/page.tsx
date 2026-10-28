import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { eliminarUsuario, guardarUsuario } from "../actions";

export default async function UsuariosPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sesion = await requireAdmin();
  const { error } = await searchParams;
  const db = await getDb();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-xl font-bold">Usuarios</h1>
      <p className="text-sm text-gray-500">
        Los <b>administradores</b> configuran catálogos, bases y empresa. Los <b>vendedores</b> solo crean cotizaciones y
        clientes.
      </p>
      {error && <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>}
      {db.usuarios.map((u) => (
        <div key={u.id} className="card">
          <form action={guardarUsuario} className="grid gap-3 sm:grid-cols-[1fr_1fr_8rem_1fr_auto] items-end">
            <input type="hidden" name="id" value={u.id} />
            <label>
              <span className="label">Nombre</span>
              <input name="nombre" defaultValue={u.nombre} required className="input" />
            </label>
            <label>
              <span className="label">Correo</span>
              <input name="email" type="email" defaultValue={u.email} required className="input" />
            </label>
            <label>
              <span className="label">Rol</span>
              <select name="rol" defaultValue={u.rol} className="input">
                <option value="admin">Admin</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </label>
            <label>
              <span className="label">Nueva contraseña</span>
              <input name="password" type="password" placeholder="(sin cambio)" autoComplete="new-password" className="input" />
            </label>
            <button className="btn-primary">Guardar</button>
          </form>
          {u.id !== sesion.uid && (
            <form action={eliminarUsuario} className="mt-2">
              <input type="hidden" name="id" value={u.id} />
              <button className="btn-danger">Eliminar</button>
            </form>
          )}
        </div>
      ))}
      <div className="card">
        <h2 className="font-semibold mb-3">Agregar usuario</h2>
        <form action={guardarUsuario} className="grid gap-3 sm:grid-cols-[1fr_1fr_8rem_1fr_auto] items-end">
          <label>
            <span className="label">Nombre</span>
            <input name="nombre" required className="input" />
          </label>
          <label>
            <span className="label">Correo</span>
            <input name="email" type="email" required className="input" />
          </label>
          <label>
            <span className="label">Rol</span>
            <select name="rol" defaultValue="vendedor" className="input">
              <option value="admin">Admin</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </label>
          <label>
            <span className="label">Contraseña</span>
            <input name="password" type="password" required minLength={6} autoComplete="new-password" className="input" />
          </label>
          <button className="btn-primary">Agregar</button>
        </form>
      </div>
    </div>
  );
}
