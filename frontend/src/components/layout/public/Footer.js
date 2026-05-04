import { Link } from "react-router-dom";
import logo from "assets/images/logo.png";

import { useLanguage } from "context/LanguageContext";

function Footer() {

  const { tx } = useLanguage();

  return (
    // footer principal
    <footer className="bg-[#4b5070] text-white body-font">
      {/* contenedor */}
      <div className="container px-5 py-16 mx-auto">
        {/* columnas */}
        <div className="flex flex-wrap md:text-left text-center -mx-4">
          {/* columna logo y newsletter */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 lg:pr-10 mb-10 md:mb-0">
            {/* logo */}
            <img src={logo} alt="JobFree" className="h-16 mb-4 mx-auto md:mx-0" />

            {/* texto newsletter */}
            <p className="mb-3 text-sm text-gray-200">
              {tx("Suscribete a nuestra newsletter")}
            </p>

            {/* formulario */}
            <form className="flex items-center gap-3 justify-center md:justify-start">
              <input
                type="email"
                required
                placeholder={tx("Introduce tu email")}
                aria-label={tx("Introduce tu email")}
                className="bg-[#5d6185] text-white text-sm rounded px-3 py-2 outline-none w-full md:max-w-[220px]"
              />

              <button
                type="submit"
                className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition whitespace-nowrap">
                {tx("Suscribirse")}
              </button>
            </form>
          </div>

          {/* columna conocenos */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="font-semibold text-sm mb-3 tracking-widest">
              {tx("Conocenos")}
            </h2>

            <nav className="list-none mb-8 space-y-1">
              <li>
                <Link to="/conocenos" className="text-gray-200 hover:text-white">
                  {tx("Quienes somos")}
                </Link>
              </li>

              <li>
                <Link to="/conocenos" className="text-gray-200 hover:text-white">
                  {tx("Que ofrecemos")}
                </Link>
              </li>

              <li>
                <Link to="/contacto" className="text-gray-200 hover:text-white">
                  {tx("Contacto")}
                </Link>
              </li>
            </nav>
          </div>

          {/* columna servicios */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="font-semibold text-sm mb-3 tracking-widest">
              {tx("Servicios")}
            </h2>

            <nav className="list-none mb-8 space-y-1">
              <li>
                <Link to="/servicios" className="text-gray-200 hover:text-white">
                  {tx("Servicios disponibles")}
                </Link>
              </li>

              <li>
                <Link to="/servicios" className="text-gray-200 hover:text-white">
                  {tx("Profesionales")}
                </Link>
              </li>

              <li>
                <Link to="/servicios" className="text-gray-200 hover:text-white">
                  {tx("Reservas")}
                </Link>
              </li>
            </nav>
          </div>

          {/* columna legal */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="font-semibold text-sm mb-3 tracking-widest">
              {tx("Legal")}
            </h2>

            <nav className="list-none mb-8 space-y-1">
              <li>
                <Link to="/terminos" className="text-gray-200 hover:text-white">
                  {tx("Terminos y condiciones")}
                </Link>
              </li>

              <li>
                <Link to="/privacidad" className="text-gray-200 hover:text-white">
                  {tx("Politica de privacidad")}
                </Link>
              </li>

              <li>
                <Link to="/cookies" className="text-gray-200 hover:text-white">
                  {tx("Politica de cookies")}
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>

      {/* línea separadora */}
      <div className="border-t-[3px] border-gray-400/40">
        <div className="container px-5 py-4 mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-200">
            Copyright © {new Date().getFullYear()} JobFree
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
