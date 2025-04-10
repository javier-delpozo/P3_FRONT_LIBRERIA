import { Handlers, PageProps } from "$fresh/server.ts";
import BookCard from "../../components/BookCard.tsx";

type Author = {
  name: string;
  bio?: string | { value: string };
};

type Work = {
  title: string;
  key: string;
  covers?: number[];
};

type Data = {
  author: Author;
  works: Work[];
};

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    try {
      const [authorRes, worksRes] = await Promise.all([
        fetch(`https://openlibrary.org/authors/${id}.json`),
        fetch(`https://openlibrary.org/authors/${id}/works.json`),
      ]);

      const author = await authorRes.json();
      const worksData = await worksRes.json();

      const works = worksData.entries.slice(0, 6).map((work: Work) => ({
        title: work.title,
        key: work.key.replace("/works/", ""),
        covers: work.covers,
      }));

      return ctx.render({ author, works });
    } catch (error) {
      console.error("Error fetching author info:", error);
      return new Response("Error loading author", { status: 500 });
    }
  },
};

export default function AuthorPage({ data }: PageProps<Data>) {
  const { author, works } = data;

  const bio =
    typeof author.bio === "string"
      ? author.bio
      : author.bio?.value ?? "Biografía no disponible.";

  return (
    <div class="container">
      <header class="header">
        <h1><a href="/"> OpenLibrary Explorer</a></h1>
      </header>

      <div class="home-button-container">
        <a href="/" class="home-button">Volver al inicio</a>
      </div>

      <section>
        <h2>{author.name}</h2>
        <p>{bio}</p>
      </section>

      <h3>Obras destacadas</h3>
      <div class="grid">
        {works.map((work) => (
          <BookCard
            libro={{
              id: work.key,
              title: work.title,
              author: author.name,
              cover_i: work.covers?.[0],
            }}
          />
        ))}
      </div>
    </div>
  );
}
