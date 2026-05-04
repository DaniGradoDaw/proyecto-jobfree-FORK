import { useState } from "react";
import Sidebar from "components/layout/dashboard/Sidebar";
import Topbar from "components/layout/dashboard/Topbar";
import { Outlet } from "react-router-dom";

function ClienteDashboard() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
  });

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("sidebar-collapsed", String(next)); } catch {}
      return next;
    });
  }

  return (
    <div className="min-h-screen">

      <Sidebar
        tipo="cliente"
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
      />

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`transition-all duration-300 ml-0 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
        <Topbar setOpen={setOpen} collapsed={collapsed} />
        <div className="p-6 mt-16">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default ClienteDashboard;
