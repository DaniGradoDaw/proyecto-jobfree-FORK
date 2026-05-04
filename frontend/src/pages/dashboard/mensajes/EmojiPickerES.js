import { useMemo, useState } from "react";

const EMOJIS = [
  // Caras felices
  { e: "😀", n: "cara feliz sonrisa" }, { e: "😃", n: "cara ojos grandes feliz" },
  { e: "😄", n: "cara muy feliz" }, { e: "😁", n: "cara sonriente dientes" },
  { e: "😆", n: "cara carcajada" }, { e: "😅", n: "cara alivio sudor" },
  { e: "🤣", n: "cara rodando risa" }, { e: "😂", n: "cara llorando risa" },
  { e: "🙂", n: "cara ligeramente sonriente" }, { e: "😊", n: "cara sonriente mejillas" },
  { e: "😇", n: "cara halo angel" }, { e: "🥰", n: "cara enamorada corazones" },
  { e: "😍", n: "cara ojos corazon enamorada" }, { e: "🤩", n: "cara estrella ojos impresionada" },
  { e: "😘", n: "cara beso guiño" }, { e: "😋", n: "cara saboreando rico" },
  { e: "😛", n: "cara lengua sacar" }, { e: "😜", n: "cara guiño lengua" },
  { e: "🤪", n: "cara loca" }, { e: "🤑", n: "cara dinero" },
  { e: "🤗", n: "cara abrazo" }, { e: "🤭", n: "cara tapando boca sorpresa" },
  { e: "🤫", n: "cara silencio shh" }, { e: "🤔", n: "cara pensando" },
  // Caras neutras/negativas
  { e: "😐", n: "cara neutral" }, { e: "😑", n: "cara sin expresion" },
  { e: "😏", n: "cara sonrisa picara" }, { e: "😒", n: "cara disgustada" },
  { e: "🙄", n: "cara ojos arriba" }, { e: "😬", n: "cara mueca dientes" },
  { e: "😔", n: "cara pensativa triste" }, { e: "😪", n: "cara soñolienta" },
  { e: "😴", n: "cara durmiendo" }, { e: "🥱", n: "cara bostezando" },
  { e: "😷", n: "cara mascarilla enfermo" }, { e: "🤒", n: "cara termometro enfermo" },
  { e: "🤕", n: "cara venda herido" }, { e: "🤢", n: "cara nauseas vomito" },
  { e: "🤮", n: "cara vomitando" }, { e: "🤧", n: "cara estornudo resfriado" },
  { e: "🥵", n: "cara calor" }, { e: "🥶", n: "cara frio" },
  { e: "🤯", n: "cara explosion cabeza alucinando" }, { e: "🤠", n: "cara vaquero" },
  { e: "🥳", n: "cara fiesta celebracion" }, { e: "😎", n: "cara gafas sol genial guay" },
  { e: "🤓", n: "cara nerd gafas" }, { e: "😕", n: "cara confundida" },
  { e: "😟", n: "cara preocupada" }, { e: "😮", n: "cara sorpresa boca abierta" },
  { e: "😲", n: "cara asombrada" }, { e: "😳", n: "cara ruborizada verguenza" },
  { e: "🥺", n: "cara suplicante ojos grandes" }, { e: "😨", n: "cara asustada miedo" },
  { e: "😰", n: "cara ansiosa sudor" }, { e: "😢", n: "cara llorando triste" },
  { e: "😭", n: "cara llorando fuerte" }, { e: "😱", n: "cara gritando asustada" },
  { e: "😩", n: "cara cansada" }, { e: "😫", n: "cara agotada" },
  { e: "😤", n: "cara bufando enojada" }, { e: "😡", n: "cara enfadada roja" },
  { e: "😠", n: "cara enojada" }, { e: "🤬", n: "cara palabrotas insultos" },
  { e: "😈", n: "cara diablo sonriente" }, { e: "💀", n: "calavera muerte" },
  { e: "💩", n: "caca" }, { e: "🤡", n: "cara payaso" },
  { e: "👻", n: "fantasma" }, { e: "👽", n: "extraterrestre alien" },
  { e: "🤖", n: "robot" },
  // Gestos y manos
  { e: "👋", n: "mano saludando hola adios" }, { e: "✋", n: "mano parar alto" },
  { e: "👌", n: "mano ok perfecto" }, { e: "✌️", n: "mano victoria paz" },
  { e: "🤞", n: "dedos cruzados suerte" }, { e: "🤟", n: "mano te quiero" },
  { e: "🤘", n: "mano metal rock" }, { e: "👍", n: "pulgar arriba bien ok" },
  { e: "👎", n: "pulgar abajo mal" }, { e: "✊", n: "puno levantado" },
  { e: "👊", n: "puno golpe" }, { e: "👏", n: "aplausos palmas" },
  { e: "🙌", n: "manos arriba celebrar" }, { e: "🙏", n: "manos juntas gracias plegaria" },
  { e: "💪", n: "musculo fuerza brazo" }, { e: "👈", n: "dedo señalando izquierda" },
  { e: "👉", n: "dedo señalando derecha" }, { e: "👆", n: "dedo señalando arriba" },
  { e: "👇", n: "dedo señalando abajo" }, { e: "☝️", n: "dedo indice arriba" },
  { e: "🖐️", n: "mano cinco dedos" }, { e: "✍️", n: "mano escribiendo" },
  { e: "💅", n: "pintarse uñas" }, { e: "🤳", n: "selfie foto" },
  // Corazones
  { e: "❤️", n: "corazon rojo amor" }, { e: "🧡", n: "corazon naranja" },
  { e: "💛", n: "corazon amarillo" }, { e: "💚", n: "corazon verde" },
  { e: "💙", n: "corazon azul" }, { e: "💜", n: "corazon morado" },
  { e: "🖤", n: "corazon negro" }, { e: "🤍", n: "corazon blanco" },
  { e: "🤎", n: "corazon marron" }, { e: "💔", n: "corazon roto" },
  { e: "💕", n: "dos corazones" }, { e: "💞", n: "corazones girando" },
  { e: "💓", n: "corazon latiendo" }, { e: "💖", n: "corazon brillante" },
  { e: "💘", n: "corazon flecha cupido amor" }, { e: "💝", n: "corazon cinta regalo" },
  // Animales
  { e: "🐶", n: "perro cachorro" }, { e: "🐱", n: "gato gatito" },
  { e: "🐭", n: "raton" }, { e: "🐹", n: "hamster" },
  { e: "🐰", n: "conejo" }, { e: "🦊", n: "zorro" },
  { e: "🐻", n: "oso" }, { e: "🐼", n: "panda" },
  { e: "🐨", n: "koala" }, { e: "🐯", n: "tigre" },
  { e: "🦁", n: "leon" }, { e: "🐮", n: "vaca" },
  { e: "🐷", n: "cerdo" }, { e: "🐸", n: "rana" },
  { e: "🐵", n: "mono" }, { e: "🐔", n: "pollo gallina" },
  { e: "🐧", n: "pinguino" }, { e: "🦆", n: "pato" },
  { e: "🦅", n: "aguila" }, { e: "🦉", n: "buho" },
  { e: "🦇", n: "murcielago" }, { e: "🐺", n: "lobo" },
  { e: "🐴", n: "caballo" }, { e: "🦄", n: "unicornio" },
  { e: "🦋", n: "mariposa" }, { e: "🐢", n: "tortuga" },
  { e: "🐍", n: "serpiente" }, { e: "🦈", n: "tiburon" },
  { e: "🐬", n: "delfin" }, { e: "🐳", n: "ballena" },
  { e: "🐙", n: "pulpo" }, { e: "🦀", n: "cangrejo" },
  // Naturaleza
  { e: "🌸", n: "flor cerezo primavera" }, { e: "🌹", n: "rosa flor" },
  { e: "🌷", n: "tulipan flor" }, { e: "🌻", n: "girasol" },
  { e: "🌼", n: "flor margarita" }, { e: "🌿", n: "hoja verde planta" },
  { e: "🍀", n: "trebol suerte" }, { e: "🌱", n: "planta brote" },
  { e: "🌲", n: "arbol" }, { e: "🎄", n: "arbol navidad" },
  { e: "🍁", n: "hoja arce otoño" }, { e: "🌈", n: "arcoiris" },
  { e: "☀️", n: "sol" }, { e: "🌙", n: "luna" },
  { e: "⭐", n: "estrella" }, { e: "🌟", n: "estrella brillante" },
  { e: "✨", n: "destellos brillos" }, { e: "⚡", n: "rayo electricidad" },
  { e: "❄️", n: "copo nieve frio invierno" }, { e: "🌊", n: "ola agua mar" },
  { e: "🔥", n: "fuego llamas caliente" }, { e: "💥", n: "explosion" },
  // Comida
  { e: "🍕", n: "pizza" }, { e: "🍔", n: "hamburguesa" },
  { e: "🌮", n: "taco" }, { e: "🌯", n: "burrito wrap" },
  { e: "🍜", n: "fideos ramen" }, { e: "🍣", n: "sushi" },
  { e: "🍦", n: "helado" }, { e: "🎂", n: "tarta pastel cumpleaños" },
  { e: "🍰", n: "trozo tarta pastel" }, { e: "🍩", n: "donut rosquilla" },
  { e: "🍪", n: "galleta" }, { e: "🍫", n: "chocolate" },
  { e: "☕", n: "cafe" }, { e: "🧃", n: "zumo jugo" },
  { e: "🍺", n: "cerveza" }, { e: "🥂", n: "copas brindis celebracion" },
  { e: "🍷", n: "vino copa" }, { e: "🧁", n: "cupcake magdalena" },
  // Objetos y símbolos
  { e: "🎉", n: "fiesta celebracion confeti" }, { e: "🎊", n: "bola fiesta" },
  { e: "🎈", n: "globo" }, { e: "🎁", n: "regalo presente" },
  { e: "🏆", n: "trofeo campeon premio" }, { e: "🥇", n: "medalla oro primero" },
  { e: "🎯", n: "diana objetivo meta" }, { e: "🎵", n: "nota musical" },
  { e: "🎶", n: "notas musicales" }, { e: "📱", n: "movil telefono" },
  { e: "💻", n: "ordenador portatil" }, { e: "📷", n: "camara foto" },
  { e: "🚗", n: "coche carro" }, { e: "✈️", n: "avion vuelo viaje" },
  { e: "🏠", n: "casa hogar" }, { e: "💰", n: "dinero bolsa" },
  { e: "⏰", n: "alarma reloj despertador" }, { e: "📅", n: "calendario fecha" },
  { e: "✅", n: "check marca correcto ok" }, { e: "❌", n: "error equis no" },
  { e: "⚠️", n: "advertencia cuidado" }, { e: "💯", n: "cien puntos perfecto" },
  { e: "🔑", n: "llave" }, { e: "💡", n: "bombilla idea" },
  { e: "📝", n: "nota lapiz escribir" }, { e: "🗺️", n: "mapa mundo" },
  { e: "💬", n: "burbuja dialogo mensaje" }, { e: "📢", n: "megafono anuncio" },
  { e: "🔔", n: "campana notificacion" }, { e: "📌", n: "chincheta fijar" },
  { e: "🔍", n: "lupa buscar" }, { e: "💊", n: "pastilla medicina" },
  { e: "🚀", n: "cohete rapido" }, { e: "🌍", n: "mundo tierra planeta" },
];

function normalizar(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export default function EmojiPickerES({ onEmojiClick }) {
  const [busqueda, setBusqueda] = useState("");

  const resultado = useMemo(() => {
    if (!busqueda.trim()) return EMOJIS;
    const q = normalizar(busqueda.trim());
    return EMOJIS.filter((item) => normalizar(item.n).includes(q));
  }, [busqueda]);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl" style={{ width: 280, height: 310 }}>
      <div className="px-3 pt-3 pb-2">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar emoji..."
          autoFocus
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {resultado.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">Sin resultados</p>
        ) : (
          <div className="grid grid-cols-8 gap-0.5">
            {resultado.map((item, idx) => (
              <button
                key={item.e + idx}
                type="button"
                title={item.n}
                onClick={() => onEmojiClick(item.e)}
                className="flex items-center justify-center rounded-lg p-1 text-xl leading-none transition hover:bg-slate-100 active:scale-90"
              >
                {item.e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
