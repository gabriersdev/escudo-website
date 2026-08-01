export const authors: {
  name: string,
  slug: string,
  bio: string,
  avatar: string | null,
}[] = [
  {
    name: "Time Escudo",
    slug: "escudo",
    bio: "Promovendo Educação em Segurança Cibernética para uso digital online",
    avatar: "/logo-bloco.png",
  },
  {
    name: "Gabriel Ribeiro",
    slug: "gabriel-ribeiro",
    bio: "Aluno de Bacharelado em Sistemas de Informação - Turma 2026.01",
    avatar: "/logo-bloco.png",
  },
  {
    name: "Isabella de Melo",
    slug: "isabella-melo",
    bio: "Aluna de Bacharelado em Sistemas de Informação - Turma 2025.01",
    avatar: "/logo-bloco.png",
  },
  {
    name: "Larissa Reis",
    slug: "larissa-reis",
    bio: "Aluna de Bacharelado em Sistemas de Informação - Turma 2025.01",
    avatar: "/logo-bloco.png",
  },
  {
    name: "Samuel Vieira",
    slug: "samuel-vieira",
    bio: "Aluno de Informática Integrado ao Ensino Médio",
    avatar: "/logo-bloco.png",
  },
];

export function getAuthorBySlug(slug: string) {
  return authors.find(author => author.slug === slug);
}

export function getAuthorByName(name: string) {
  return authors.find(author => author.name.toLowerCase() === name.toLowerCase());
}
