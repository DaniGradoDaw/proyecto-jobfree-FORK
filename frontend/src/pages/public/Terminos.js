import LanguageMenu from "components/layout/public/LanguageMenu";
import { useLanguage } from "context/LanguageContext";

const contenido = {
  es: {
    titulo: "Términos y condiciones",
    intro:
      "Las presentes condiciones generales de uso e información legal se aplican al sitio web de JobFree y a los servicios digitales relacionados con la plataforma.",
    parrafos: [
      "A través de estas condiciones, JobFree pone a disposición de los usuarios una plataforma que permite conectar a clientes que necesitan servicios con profesionales que desean ofrecerlos. Al acceder, registrarte o utilizar la plataforma, aceptas estas condiciones de uso.",
      "JobFree actúa como intermediario tecnológico. No presta directamente los servicios anunciados por los profesionales, ni forma parte de la relación contractual concreta que pueda generarse entre cliente y profesional, salvo en aquello que corresponda al funcionamiento técnico de la plataforma.",
    ],
    secciones: [
      {
        titulo: "1. Objeto",
        contenido:
          "Estos términos regulan el acceso y uso de JobFree, una plataforma digital que conecta a clientes con profesionales que ofrecen servicios. JobFree actúa como intermediario tecnológico y facilita la búsqueda, contacto, reserva, valoración y gestión de servicios.",
      },
      {
        titulo: "2. Aceptación de los términos",
        contenido:
          "Al registrarte, iniciar sesión, publicar servicios, realizar reservas o utilizar cualquier funcionalidad de la plataforma, aceptas estos términos y condiciones. Si no estás de acuerdo, no debes utilizar JobFree.",
      },
      {
        titulo: "3. Usuarios de la plataforma",
        contenido:
          "La plataforma permite el registro de clientes y profesionales. Los clientes pueden buscar y reservar servicios. Los profesionales pueden crear un perfil, publicar servicios y gestionar solicitudes. Cada usuario es responsable de mantener sus datos actualizados y de proteger sus credenciales de acceso.",
      },
      {
        titulo: "4. Registro y veracidad de la información",
        contenido:
          "El usuario se compromete a proporcionar información real, completa y actualizada. JobFree podrá suspender o cancelar cuentas si detecta datos falsos, uso fraudulento, suplantación de identidad o incumplimiento de estos términos.",
      },
      {
        titulo: "5. Servicios publicados por profesionales",
        contenido:
          "Los profesionales son responsables de la información publicada sobre sus servicios, incluyendo descripción, precio, disponibilidad, zona de trabajo, experiencia, imágenes y condiciones particulares. JobFree no garantiza la calidad final del servicio prestado por terceros.",
      },
      {
        titulo: "6. Reservas y contratación",
        contenido:
          "Las reservas realizadas en JobFree representan una solicitud de servicio entre cliente y profesional. El profesional puede aceptar, rechazar o gestionar la solicitud según su disponibilidad. Las condiciones concretas del servicio deberán ser claras antes de su realización.",
      },
      {
        titulo: "7. Pagos, comisiones y planes",
        contenido:
          "JobFree puede ofrecer pagos online, planes de suscripción, promociones o comisiones asociadas al uso de la plataforma. Los precios, beneficios y condiciones de cada plan se mostrarán antes de contratarlo. Los importes podrán actualizarse, pero no afectarán retroactivamente a contrataciones ya confirmadas.",
      },
      {
        titulo: "8. Valoraciones y contenido de usuarios",
        contenido:
          "Los usuarios pueden publicar valoraciones, reseñas, mensajes, imágenes u otro contenido relacionado con la experiencia en la plataforma. No se permite contenido ofensivo, discriminatorio, falso, ilegal, publicitario no autorizado o que vulnere derechos de terceros.",
      },
      {
        titulo: "9. Uso permitido",
        contenido:
          "No está permitido utilizar JobFree para actividades ilegales, manipular reservas o valoraciones, enviar spam, intentar acceder a cuentas ajenas, vulnerar la seguridad del sistema, recopilar datos sin autorización o utilizar la plataforma de forma que perjudique a otros usuarios.",
      },
      {
        titulo: "10. Responsabilidad",
        contenido:
          "JobFree trabaja para ofrecer una plataforma segura y funcional, pero no puede garantizar la disponibilidad permanente del servicio ni responder por acuerdos, incumplimientos, daños o conflictos derivados directamente de la relación entre clientes y profesionales.",
      },
      {
        titulo: "11. Suspensión o cancelación de cuentas",
        contenido:
          "JobFree podrá limitar, suspender o cancelar el acceso de un usuario si incumple estos términos, realiza un uso abusivo de la plataforma, genera riesgos para otros usuarios o afecta al correcto funcionamiento del servicio.",
      },
      {
        titulo: "12. Protección de datos",
        contenido:
          "El tratamiento de datos personales se realizará conforme a la política de privacidad de JobFree. Los usuarios deben consultar dicha política para conocer qué datos se recogen, con qué finalidad se utilizan y cómo ejercer sus derechos.",
      },
      {
        titulo: "13. Modificaciones",
        contenido:
          "JobFree podrá actualizar estos términos para adaptarlos a cambios legales, técnicos o funcionales. Cuando los cambios sean relevantes, se comunicarán de forma razonable dentro de la plataforma o por los medios disponibles.",
      },
      {
        titulo: "14. Contacto",
        contenido:
          "Para cualquier duda sobre estos términos y condiciones, puedes contactar con JobFree a través de la página de contacto disponible en la plataforma.",
      },
      {
        titulo: "15. Legislación aplicable",
        contenido:
          "Estas condiciones se regirán por la legislación española. Cualquier controversia relacionada con el uso de la plataforma se resolverá conforme a la normativa aplicable y, cuando proceda, ante los juzgados y tribunales competentes.",
      },
    ],
    cierre:
      "Última actualización: 30 de abril de 2026. Este documento es una base informativa para la plataforma JobFree. Para una versión jurídicamente definitiva, conviene revisarlo con asesoramiento legal especializado.",
  },
  en: {
    titulo: "Terms and conditions",
    intro:
      "These general terms of use and legal information apply to the JobFree website and to the digital services related to the platform.",
    parrafos: [
      "Through these terms, JobFree provides users with a platform that connects customers who need services with professionals who wish to offer them. By accessing, registering or using the platform, you accept these terms of use.",
      "JobFree acts as a technology intermediary. It does not directly provide the services advertised by professionals, nor is it part of the specific contractual relationship that may arise between a customer and a professional, except for matters related to the technical operation of the platform.",
    ],
    secciones: [
      {
        titulo: "1. Purpose",
        contenido:
          "These terms govern access to and use of JobFree, a digital platform that connects customers with professionals offering services. JobFree acts as a technology intermediary and facilitates search, contact, booking, reviews and service management.",
      },
      {
        titulo: "2. Acceptance of the terms",
        contenido:
          "By registering, logging in, publishing services, making bookings or using any platform feature, you accept these terms and conditions. If you do not agree, you must not use JobFree.",
      },
      {
        titulo: "3. Platform users",
        contenido:
          "The platform allows customers and professionals to register. Customers can search for and book services. Professionals can create a profile, publish services and manage requests. Each user is responsible for keeping their data up to date and protecting their access credentials.",
      },
      {
        titulo: "4. Registration and accuracy of information",
        contenido:
          "Users agree to provide true, complete and up-to-date information. JobFree may suspend or cancel accounts if it detects false data, fraudulent use, impersonation or breach of these terms.",
      },
      {
        titulo: "5. Services published by professionals",
        contenido:
          "Professionals are responsible for the information published about their services, including description, price, availability, work area, experience, images and specific conditions. JobFree does not guarantee the final quality of services provided by third parties.",
      },
      {
        titulo: "6. Bookings and hiring",
        contenido:
          "Bookings made through JobFree represent a service request between a customer and a professional. The professional may accept, reject or manage the request according to availability. The specific service conditions must be clear before the service is carried out.",
      },
      {
        titulo: "7. Payments, fees and plans",
        contenido:
          "JobFree may offer online payments, subscription plans, promotions or fees linked to platform use. Prices, benefits and conditions for each plan will be shown before purchase. Amounts may be updated, but changes will not apply retroactively to already confirmed purchases.",
      },
      {
        titulo: "8. Reviews and user content",
        contenido:
          "Users may publish ratings, reviews, messages, images or other content related to their platform experience. Offensive, discriminatory, false, illegal, unauthorized advertising content or content that infringes third-party rights is not allowed.",
      },
      {
        titulo: "9. Permitted use",
        contenido:
          "JobFree may not be used for illegal activities, manipulating bookings or reviews, sending spam, attempting to access third-party accounts, compromising system security, collecting data without authorization or using the platform in a way that harms other users.",
      },
      {
        titulo: "10. Liability",
        contenido:
          "JobFree works to provide a secure and functional platform, but cannot guarantee permanent service availability or be liable for agreements, breaches, damages or disputes arising directly from the relationship between customers and professionals.",
      },
      {
        titulo: "11. Account suspension or cancellation",
        contenido:
          "JobFree may limit, suspend or cancel user access if these terms are breached, the platform is used abusively, risks are created for other users or the proper operation of the service is affected.",
      },
      {
        titulo: "12. Data protection",
        contenido:
          "Personal data will be processed in accordance with JobFree's privacy policy. Users should consult that policy to understand what data is collected, for what purpose it is used and how to exercise their rights.",
      },
      {
        titulo: "13. Changes",
        contenido:
          "JobFree may update these terms to reflect legal, technical or functional changes. When changes are relevant, they will be communicated reasonably through the platform or available channels.",
      },
      {
        titulo: "14. Contact",
        contenido:
          "For any questions about these terms and conditions, you can contact JobFree through the contact page available on the platform.",
      },
      {
        titulo: "15. Applicable law",
        contenido:
          "These terms shall be governed by Spanish law. Any dispute related to the use of the platform will be resolved in accordance with applicable regulations and, where appropriate, before the competent courts.",
      },
    ],
    cierre:
      "Last updated: April 30, 2026. This document is an informational basis for the JobFree platform. For a legally definitive version, it should be reviewed with specialized legal advice.",
  },
};

function Terminos() {
  const { idioma } = useLanguage();
  const texto = contenido[idioma] || contenido.es;

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 flex justify-end">
        <LanguageMenu variant="light" />
      </div>

      <article className="max-w-4xl ml-8 mr-auto lg:ml-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {texto.titulo}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            {texto.intro}
          </p>
        </div>

        <div className="space-y-8 text-[15px] leading-7 text-gray-700 sm:text-base">
          {texto.parrafos.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}

          {texto.secciones.map((seccion) => (
            <section key={seccion.titulo} className="pt-2">
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                {seccion.titulo}
              </h2>
              <p>{seccion.contenido}</p>
            </section>
          ))}

          <p className="border-t border-gray-200 pt-8 text-sm leading-6 text-gray-500">
            {texto.cierre}
          </p>
        </div>
      </article>
    </main>
  );
}

export default Terminos;
