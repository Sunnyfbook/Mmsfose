import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-card px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 bg-gradient-viral rounded-full flex items-center justify-center">
            <span className="text-4xl sm:text-6xl font-bold text-white">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')} 
            variant="viral" 
            size="lg"
            className="shadow-viral hover:shadow-glow transition-all duration-300"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            size="lg"
            className="border-primary/30 hover:bg-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
