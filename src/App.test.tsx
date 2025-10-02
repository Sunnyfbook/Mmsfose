import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { useSEO } from './contexts/SEOContext';
import { vi } from 'vitest';

// A simple component to consume the context and display the data
const TestConsumer = () => {
  const seoData = useSEO();
  return <div data-testid="seo-data">{JSON.stringify(seoData)}</div>;
};

// Mock the Index component to use our TestConsumer
vi.mock('./pages/Index', () => ({
  default: () => <TestConsumer />,
}));

// Mock BrowserRouter to avoid the nested router error
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        BrowserRouter: ({ children }) => <>{children}</>,
    };
});

describe('App component', () => {
  it('should provide SEO data through the SEOProvider', () => {
    const mockSeoData = { home: { title: 'Mock Home Title' } };

    render(
      <MemoryRouter>
        <App seoData={mockSeoData} />
      </MemoryRouter>
    );

    const seoDataElement = screen.getByTestId('seo-data');
    expect(seoDataElement).toHaveTextContent(JSON.stringify(mockSeoData));
  });
});