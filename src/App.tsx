import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { motion } from "motion/react";
import MasterDashboard from "./pages/MasterDashboard";
import TIEBoard from "./pages/TIEBoard";
import SFDCBoard from "./pages/SFDCBoard";
import Comparison from "./pages/Comparison";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full relative">
            <AnimatedBackground />
            <AppSidebar />
            <main className="flex-1 relative z-10">
              <motion.header 
                className="h-14 flex items-center border-b border-border px-4 bg-card/80 backdrop-blur-sm sticky top-0 z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SidebarTrigger />
                <motion.h2 
                  className="ml-4 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Ticket Response Analytics
                </motion.h2>
              </motion.header>
              <Routes>
                <Route path="/" element={<MasterDashboard />} />
                <Route path="/tie" element={<TIEBoard />} />
                <Route path="/sfdc" element={<SFDCBoard />} />
                <Route path="/comparison" element={<Comparison />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
