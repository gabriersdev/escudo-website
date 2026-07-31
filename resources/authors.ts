export const authors: {
  name: string,
  slug: string,
  bio: string,
  avatar: string | null,
}[] = [
  {
    name: "The Journal",
    slug: "the-journal",
    bio: "Pensamentos, histórias e ideias da equipe editorial.",
    avatar: null,
  }
];

export function getAuthorBySlug(slug: string) {
  return authors.find(author => author.slug === slug);
}

export function getAuthorByName(name: string) {
  return authors.find(author => author.name.toLowerCase() === name.toLowerCase());
}
