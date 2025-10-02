import { createContext, useContext, ReactNode } from 'react';

// Define the shape of the SEO data
export interface SEOData {
  [key: string]: any;
}

// Create the context with a default value
const SEOContext = createContext<SEOData | null>(null);

// Create a provider component
export const SEOProvider = ({ children, value }: { children: ReactNode; value: SEOData | null }) => {
  return <SEOContext.Provider value={value}>{children}</SEOContext.Provider>;
};

// Create a custom hook to use the SEO context
export const useSEO = () => {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error('useSEO must be used within an SEOProvider');
  }
  return context;
};