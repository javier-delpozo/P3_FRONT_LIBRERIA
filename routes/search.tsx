// routes/search.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import BookCard from "../components/BookCard.tsx";

type Libro = {
  id: string;
  title: string;
  author: string;
  cover_i?: number;
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    if (!q) return ctx.render([]);

    const res = await fetch(`https://openlibrary.org/search.json?q=${q}`);
    const data = await res.json();
    const libros: Libro[] = data.docs.slice(0, 9).map((libro: any) => ({
      id: libro.key.replace("/works/", ""),
      title: libro.title,
      author: libro.author_name?.[0] || "Autor desconocido",
      cover_i: libro.cover_i,
    }));

    return ctx.render(libros);
  },
};

export default function Search({ data }: PageProps<Libro[]>) {
  return (
    <div class="container">
        <div class="home-button-container">
       <a href="/" class="home-button"> Volver al inicio</a>
      </div>

      <form method="GET" action="/search">
        <input type="text" name="q" placeholder="Buscar libros..." />
        <button type="submit">Buscar</button>
      </form>

      {data.length > 0
        ? <div class="grid">{data.map((libro) => <BookCard libro={libro} />)}</div>
        : <p>No se encontraron libros con ese título.</p>}
    </div>
  );
}
