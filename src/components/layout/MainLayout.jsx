import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <TopNav />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-4 pb-[calc(var(--bottomnav-height)+1rem)] md:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
