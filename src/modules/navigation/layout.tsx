import { Outlet } from "react-router";

import { Header } from "./header";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-[1400px] mx-auto px-2 lg:px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
