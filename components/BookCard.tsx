// components/BookCard.tsx
type Props = {
    libro: {
      id: string;
      title: string;
      author: string;
      cover_i?: number;
    };
  };
  
  export default function BookCard({ libro }: Props) {
    const portada = libro.cover_i
      ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-L.jpg`
      : "/no-cover.jpg";
  
    return (
      <a href={`/book/${libro.id}`} class="card">
        <img src={portada} alt={`Portada de ${libro.title}`} />
        <h3>{libro.title}</h3>
        <p>{libro.author}</p>
      </a>
    );
  }
  