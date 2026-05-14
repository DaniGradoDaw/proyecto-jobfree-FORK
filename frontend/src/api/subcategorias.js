import { apiFetch } from "api/config";

// todas las subcategorías (para el selector del formulario de servicios)
export async function obtenerTodasSubcategorias() {
  const res = await apiFetch("/subcategorias");

  if (!res.ok) {
    throw new Error("Error al obtener subcategorías");
  }

  return res.json();
}

export async function obtenerSubcategoriaPorId(id) {
  const res = await apiFetch("/subcategorias/" + id);

  if (!res.ok) {
    throw new Error("Error al obtener la subcategoría");
  }

  return res.json();
}

export async function obtenerSubcategoriasPopulares() {
  const res = await apiFetch("/subcategorias/populares");
  if (!res.ok) throw new Error("Error al obtener servicios populares");
  return res.json();
}

// subcategorías por categoría con paginación
export async function obtenerSubcategoriasPorCategoria(id, pagina = 0) {

  const res = await apiFetch(
    "/subcategorias/categoria/" + id + "?page=" + pagina + "&size=8"
  );

  if (!res.ok) {
    throw new Error("Error al obtener subcategorías");
  }

  return res.json();
}
