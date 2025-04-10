import { Handlers, PageProps } from "$fresh/server.ts";

type Author = {
  author: {
    key: string;
    name?: string; // Solo si ya viene el nombre en esta parte
  };
};

type BookData = {
  title: string;
  description?: string | { value: string };
  created?: { value: string };
  first_publish_date?: string;
  number_of_pages?: number;
  covers?: number[];
  authors: Author[];
};

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    try {
      const res = await fetch(`https://openlibrary.org/works/${id}.json`);
      const book: BookData = await res.json();

      const authorKey = book.authors?.[0]?.author?.key;
      let authorName = "Autor desconocido";

      if (authorKey) {
        const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
        const authorData = await authorRes.json();
        authorName = authorData.name;
      }

      return ctx.render({ book, authorName });
    } catch (error) {
      console.error("Error fetching book or author data:", error);
      return new Response("Error loading book", { status: 500 });
    }
  },
};


export default function BookPage({ data }: PageProps<{ book: BookData; authorName: string }>) {
  const { book, authorName } = data;

  const title = book.title;
  const description = typeof book.description === "string"
    ? book.description
    : book.description?.value ?? "Sin descripción disponible.";

  const date = book.first_publish_date ?? book.created?.value?.slice(0, 10);
  const pages = book.number_of_pages ?? "Desconocido";
  const cover = book.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
    : "/no-cover.jpg";

  const authorId = book.authors?.[0]?.author?.key?.replace("/authors/", "");
  const authorLink = authorId ? `/author/${authorId}` : null;

  return (
    <div class="container">
      <header class="header">
        <h1><a href="/"> OpenLibrary Explorer</a></h1>
      </header>

      <div class="home-button-container">
        <a href="/" class="home-button"> Volver al inicio</a>
      </div>

      <div class="book-details">
        <img src={cover} alt={`Portada de ${title}`} class="book-cover" />
        <div class="book-info">
          <h2>{title}</h2>
          <p><strong>Descripción:</strong> {description}</p>
          <p><strong>Publicado en:</strong> {date}</p>
          <p><strong>Número de páginas:</strong> {pages}</p>
          <p>
            <strong>Autor:</strong>{" "}
            {authorLink
              ? <a href={authorLink}>{authorName}</a>
              : "Autor desconocido"}
          </p>
        </div>
      </div>
    </div>
  );
}

