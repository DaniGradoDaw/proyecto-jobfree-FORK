import { useLanguage } from "context/LanguageContext";

function Contacto() {

  const { tx } = useLanguage();

  return (
    <div>
      <h2>{tx("Contacto")}</h2>

      <p>{tx("Email")}: soporte@jobfree.com</p>
      <p>{tx("Teléfono")}: +34 600 123 456</p>
      <p>{tx("Ubicación")}: Écija (Sevilla)</p>
    </div>
  );
}

export default Contacto;
