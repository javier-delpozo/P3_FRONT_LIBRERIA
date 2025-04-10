// routes/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import BookCard from "../components/BookCard.tsx";

const featuredBooks = [
  "To Kill a Mockingbird",
  "1984",
  "The Great Gatsby",
  "Pride and Prejudice",
  "The Hobbit",
  "Moby-Dick",
  "Jane Eyre",
  "War and Peace",
  "The Catcher in the Rye",
  "Brave New World",
  "The Lord of the Rings",
  "Crime and Punishment",
  "The Alchemist",
  "The Picture of Dorian Gray",
  "Harry Potter and the Sorcerer's Stone",
];


type Libro = {
  id: string;
  title: string;
  author: string;
  cover_i?: number;
};

export const handler: Handlers = {
  async GET(_, ctx) {
    const libros: Libro[] = [];

    for (const titulo of featuredBooks) {
      const res = await fetch(`https://openlibrary.org/search.json?q=${titulo}`);
      const data = await res.json();
      const libro = data.docs[0];
      if (libro) {
        libros.push({
          id: libro.key.replace("/works/", ""),
          title: libro.title,
          author: libro.author_name?.[0] || "Autor desconocido",
          cover_i: libro.cover_i,
        });
      }
    }

    return ctx.render(libros);
  },
};

export default function Home({ data }: PageProps<Libro[]>) {
  return (
    <div class="container">
      <h1>Libros Destacados</h1>
      <div class="search-button-container">
      <a href="/search" class="search-button"> Buscar libros o autores</a>
      </div>
      <div class="grid">
        {data.map((libro) => <BookCard libro={libro} />)}
      </div>
   
    </div>
  );
}
