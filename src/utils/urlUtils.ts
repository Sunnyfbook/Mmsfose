// Convert title to URL-friendly slug
export const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .substring(0, 100); // Limit length
};

// Convert slug back to searchable format (for finding video by slug)
export const slugToSearchTerm = (slug: string): string => {
  return slug.replace(/-/g, ' ');
};