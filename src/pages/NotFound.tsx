
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const getDashboardPath = () => {
    if (!isAuthenticated || !role) return "/signin";
    
    switch (role) {
      case "student":
        return "/student-dashboard";
      case "faculty":
        return "/faculty-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/signin";
    }
  };

  const dashboardPath = getDashboardPath();
  const dashboardText = isAuthenticated ? "Return to Dashboard" : "Return to Sign In";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-foreground">Oops! Page not found</p>
        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <Button asChild className="mt-6 inline-flex items-center gap-2">
          <Link to={dashboardPath}>
            <ArrowLeft className="h-4 w-4" />
            {dashboardText}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
