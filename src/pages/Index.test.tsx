import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from './Index';
import { SEOProvider } from '@/contexts/SEOContext';
import SEOHead from '@/components/SEOHead';
import { vi } from 'vitest';

// Mock the SEOHead component to check its props
vi.mock('@/components/SEOHead', () => ({
  default: vi.fn(() => null),
}));

// Mock other hooks and components used by Index
vi.mock('@/hooks/useSitemap', () => ({
  useSitemapAutoUpdate: vi.fn(),
}));
vi.mock('@/hooks/useContent', () => ({
  useContent: () => ({
    getContent: (key: string, fallback: string) => fallback,
  }),
}));
vi.mock('@/components/Header', () => ({
  default: () => <header>Header</header>,
}));
vi.mock('@/components/TrendingSection', () => ({
    default: () => <div>Trending Section</div>,
}));
vi.mock('@/components/ads/AdComponent', () => ({
    AdComponent: () => <div>Ad</div>,
}));


describe('Index component', () => {
  it('should consume SEO data from the SEOContext and pass it to SEOHead', async () => {
    const mockSeoData = {
      home: { title: 'Test Home Title', description: 'Test Description' },
    };

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEOProvider value={mockSeoData}>
            <Index />
          </SEOProvider>
        </MemoryRouter>
      </HelmetProvider>
    );

    // Check that SEOHead was called with the correct props from the context
    await waitFor(() => {
        expect(SEOHead).toHaveBeenCalledWith(
            expect.objectContaining({
              pageType: 'home',
              seoData: mockSeoData.home,
            }),
            expect.anything()
          );
    });
  });
});