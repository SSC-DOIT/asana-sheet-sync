import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BarChart3, GitCompare, Activity } from "lucide-react";

// Lazy load page components for code splitting
const MasterDashboard = lazy(() => import("./pages/MasterDashboard"));
const TIEBoard = lazy(() => import("./pages/TIEBoard"));
const SFDCBoard = lazy(() => import("./pages/SFDCBoard"));
const Comparison = lazy(() => import("./pages/Comparison"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full relative bg-background">
          {/* Animated Background */}
          <AnimatedBackground />

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border"
          >
            <div className="max-w-[1400px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h1 
                    className="text-2xl font-bold text-primary mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Ticket Response Analytics
                  </motion.h1>
                  <p className="text-sm text-muted-foreground">
                    Strategic performance dashboard • 12-month rolling analysis
                  </p>
                </div>
                <Badge variant="outline" className="gap-2 px-3 py-1.5">
                  <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
                  Live Data
                </Badge>
              </div>

              {/* Tab Navigation */}
              <nav className="grid grid-cols-4 gap-4">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-card shadow-sm border border-border"
                        : "hover:bg-muted/50"
                    }`
                  }
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">Command Center</span>
                </NavLink>

                <NavLink
                  to="/tie"
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-card shadow-sm border border-border"
                        : "hover:bg-muted/50"
                    }`
                  }
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium text-sm">TIE Analytics</span>
                </NavLink>

                <NavLink
                  to="/sfdc"
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-card shadow-sm border border-border"
                        : "hover:bg-muted/50"
                    }`
                  }
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium text-sm">SFDC Analytics</span>
                </NavLink>

                <NavLink
                  to="/comparison"
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-card shadow-sm border border-border"
                        : "hover:bg-muted/50"
                    }`
                  }
                >
                  <GitCompare className="w-4 h-4" />
                  <span className="font-medium text-sm">Comparison</span>
                </NavLink>
              </nav>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="relative z-10">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<MasterDashboard />} />
                <Route path="/tie" element={<TIEBoard />} />
                <Route path="/sfdc" element={<SFDCBoard />} />
                <Route path="/comparison" element={<Comparison />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
