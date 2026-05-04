import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import LanguageMenu from "components/layout/public/LanguageMenu";
import { useLanguage } from "context/LanguageContext";

function Menu() {

  // estado menú móvil
  const [open, setOpen] = useState(false);

  // idioma actual
  const { tx } = useLanguage();

  return (
    <>
      <nav className="hidden md:flex justify-center items-center gap-8 py-3 bg-gradient-to-r from-green-500 to-emerald-400">

        <Link to="/" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          {tx("Inicio")}
        </Link>

        <div className="relative group">

          <button className="flex items-center gap-1 text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition cursor-pointer">
            {tx("Servicios")}
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          <div className="absolute left-0 top-full pt-2 z-50 hidden group-hover:block w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">

            <Link to="/servicios?categoria=1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
             {tx("Mantenimiento")}
            </Link>

            <Link to="/servicios?categoria=2" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {tx("Reparaciones")}
            </Link>

            <Link to="/servicios?categoria=3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {tx("Cuidado personal")}
            </Link>

            <Link to="/servicios?categoria=4" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {tx("Mascotas")}
            </Link>

            <Link to="/servicios?categoria=5" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {tx("Clases")}
            </Link>

            <Link to="/servicios?categoria=6" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {tx("Urgencias")}
            </Link>

            <Link to="/servicios?categoria=7" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {tx("Otros")}
            </Link>

          </div>

        </div>

        <Link to="/conocenos" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          {tx("Conocenos")}
        </Link>

        <Link to="/para-profesionales" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          {tx("Para profesionales")}
        </Link>

        <Link to="/contacto" className="text-white font-medium px-4 py-1 rounded-full border-2 border-transparent hover:border-white hover:bg-white/10 transition">
          {tx("Contacto")}
        </Link>

        <div className="ml-8">
  <LanguageMenu />
</div>

      </nav>

      {/* versión del menú para móvil */}
      <div className="md:hidden bg-gradient-to-r from-green-500 to-emerald-400">

        {/* botón hamburguesa */}
        <div className="flex justify-between items-center px-4 py-3">

          <button onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="text-white cursor-pointer">
            {open ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

        </div>

        {/* enlaces que aparecen al abrir el menú */}
        {open && (

          <div className="flex flex-col gap-2 px-4 pb-4 text-white transition-all duration-200">

            <Link to="/" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              {tx("Inicio")}
            </Link>

            <Link to="/servicios" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              {tx("Servicios")}
            </Link>

            <Link to="/conocenos" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              {tx("Conocenos")}
            </Link>

            <Link to="/para-profesionales" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              {tx("Para profesionales")}
            </Link>

            <Link to="/contacto" onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-white/10 text-white">
              {tx("Contacto")}
            </Link>

          </div>

        )}

      </div>
    </>
  );
}

export default Menu;
