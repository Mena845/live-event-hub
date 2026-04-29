import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./layouts/AppLayout";
import EventPage from "./pages/EventPage";
import PlanningPage from "./pages/PlanningPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import LivePage from "./pages/LivePage";
import RoomsPage from "./pages/RoomsPage";
import SpeakersPage from "./pages/SpeakersPage";
import SpeakerDetailPage from "./pages/SpeakerDetailPage";
import FavoritesPage from "./pages/FavoritesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/events/:eventId" element={<EventPage />} />
            <Route path="/events/:eventId/planning" element={<PlanningPage />} />
            <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/speakers" element={<SpeakersPage />} />
            <Route path="/speakers/:speakerId" element={<SpeakerDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
