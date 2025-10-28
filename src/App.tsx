import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <header className="h-14 flex items-center border-b border-border px-4 bg-card">
                <SidebarTrigger />
                <h2 className="ml-4 font-semibold text-foreground">Ticket Response Analytics</h2>
              </header>
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
