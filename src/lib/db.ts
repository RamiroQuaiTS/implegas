import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { crearSemilla } from "./seed";
import type { Db } from "./types";

/**
 * "Mini BD": toda la información vive en un solo documento JSON.
 * - En Vercel se guarda en Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN).
 * - En local, sin esas variables, se guarda en data/db.json.
 */
const REDIS_KEY = "implegas:db";
const LOCAL_FILE = path.join(process.cwd(), "data", "db.json");

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

async function leer(): Promise<Db | null> {
  const r = redis();
  if (r) return (await r.get<Db>(REDIS_KEY)) ?? null;
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Db;
  } catch {
    return null;
  }
}

async function escribir(db: Db): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(REDIS_KEY, db);
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(db, null, 2));
}

export async function getDb(): Promise<Db> {
  const db = await leer();
  if (db) return db;
  const semilla = crearSemilla();
  await escribir(semilla);
  return semilla;
}

// Serializa las escrituras dentro de una misma instancia para no pisar cambios.
let cola: Promise<unknown> = Promise.resolve();

export function updateDb<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const tarea = cola.then(async () => {
    const db = await getDb();
    const resultado = await fn(db);
    await escribir(db);
    return resultado;
  });
  cola = tarea.catch(() => undefined);
  return tarea;
}

export function nuevoId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
