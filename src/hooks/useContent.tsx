import { useState, useEffect } from 'react';
import { fetchContentBySection } from '@/services/contentApi';

export const useContent = (section: string) => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      console.log(`🔄 Loading content for section: ${section}`);
      const sectionContent = await fetchContentBySection(section);
      console.log(`📊 Content loaded for ${section}:`, sectionContent);
      setContent(sectionContent);
      setLoading(false);
    };

    loadContent();
  }, [section]);

  const getContent = (key: string, fallback: string = '') => {
    return content[key] || fallback;
  };

  return { content, loading, getContent };
};