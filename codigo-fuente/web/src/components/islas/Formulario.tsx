/**
 * Formulario de contacto (isla React). Úselo con client:visible:
 *
 *   import Formulario from '@/components/islas/Formulario';
 *   <Formulario client:visible />
 *   <Formulario client:visible planInicial="visible" paginaGracias="/gracias/" />
 *   <Formulario client:visible id="formulario-solicitud" />  ← si la sección que lo envuelve ya es #formulario
 *
 * - Envía a Formspree (CONTACTO.formspreeId) por fetch con Accept: application/json.
 * - Sin JS, el mismo <form> se envía de forma nativa a Formspree (mejora progresiva).
 * - Preselecciona el plan desde ?plan=<id> (landing | esencial | visible | atencion | emprendedor | no-se).
 * - Campos no controlados: lo que la persona escriba antes de la hidratación no se pierde.
 * - Honeypot _gotcha: si un robot lo llena, se simula éxito y no se envía nada.
 * - Los errores de formato aparecen al salir de un campo solo después del primer intento de envío
 *   (antes, un error nuevo empujaría los campos de abajo justo cuando la persona hace clic).
 * - Mientras envía, el botón sigue enfocable (aria-disabled); si falla, el foco va al aviso.
 */
import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent, type ReactNode, type SubmitEvent } from 'react';
import { ArrowRight, ChevronDown, CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { RUTA_WHATSAPP } from '@/components/ui/iconos';
import { CONTACTO, FUNDADOR, PLANES, PLAN_ENTRADA, LANDING, SITIO, enlaceWhatsApp } from '@/data/sitio';

// ─── Configuración ──────────────────────────────────────────────────────────

const URL_ENVIO = `https://formspree.io/f/${CONTACTO.formspreeId}`;
const RUTA_PRIVACIDAD = '/politica-de-privacidad/';

const OPCIONES_PLAN = [
  { valor: 'landing', texto: LANDING.nombre },
  ...PLANES.map((p) => ({ valor: p.id as string, texto: p.nombre })),
  { valor: 'emprendedor', texto: PLAN_ENTRADA.nombre },
  { valor: 'no-se', texto: 'Aún no sé' },
] as const;

const CAMPOS = ['nombre', 'empresa', 'whatsapp', 'email', 'sitio_web', 'plan', 'mensaje', 'autorizacion'] as const;
type Campo = (typeof CAMPOS)[number];
type Errores = Partial<Record<Campo, string>>;
type Estado = 'inicial' | 'enviando' | 'exito' | 'error';
/** red: el envío no salió (sin conexión); respuesta: Formspree lo recibió y no lo registró (4xx/5xx). */
type TipoError = 'red' | 'respuesta';
type Datos = Record<Campo, string>;

const ICONO = { strokeWidth: 1.75, 'aria-hidden': true } as const;

/** Glifo de WhatsApp (el mismo de los demás botones de WhatsApp del sitio). */
function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d={RUTA_WHATSAPP} />
    </svg>
  );
}

// ─── Validación ─────────────────────────────────────────────────────────────

function validar(campo: Campo, valor: string): string {
  const v = valor.trim();
  switch (campo) {
    case 'nombre':
      if (!v) return 'Escriba su nombre.';
      return v.length >= 2 ? '' : 'Escriba su nombre completo.';
    case 'empresa':
      return v ? '' : 'Escriba el nombre de su empresa o negocio.';
    case 'whatsapp': {
      if (!v) return 'Escriba su número de WhatsApp.';
      const digitos = v.replace(/\D/g, '').length;
      return /^[+\d\s().-]+$/.test(v) && digitos >= 10 && digitos <= 15
        ? ''
        : 'Revise el número: escriba los 10 dígitos de su celular, con o sin +57.';
    }
    case 'email':
      if (!v) return '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Revise el correo: debe tener la forma nombre@empresa.com.';
    case 'sitio_web':
      if (!v) return '';
      return /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(v) ? '' : 'Revise la dirección: por ejemplo, miempresa.com.';
    case 'plan':
      return v ? '' : 'Elija un plan o la opción «Aún no sé».';
    case 'mensaje':
      if (!v) return 'Cuéntenos brevemente qué necesita.';
      return v.length >= 10 ? '' : 'Agregue un poco más de detalle (al menos 10 caracteres).';
    case 'autorizacion':
      return v ? '' : 'Para responderle necesitamos su autorización para tratar sus datos.';
  }
}

function leerDatos(form: HTMLFormElement): Datos {
  const fd = new FormData(form);
  const datos = {} as Datos;
  for (const c of CAMPOS) datos[c] = String(fd.get(c) ?? '');
  return datos;
}

function nombrePlan(valor: string) {
  return OPCIONES_PLAN.find((o) => o.valor === valor)?.texto ?? '';
}

function mensajeWhatsApp(d: Partial<Datos>) {
  const partes = [
    `Hola, soy ${d.nombre?.trim() || '…'}${d.empresa?.trim() ? ` de ${d.empresa.trim()}` : ''}.`,
    d.plan ? `Me interesa: ${nombrePlan(d.plan)}.` : '',
    d.mensaje?.trim() ?? '',
  ];
  return partes.filter(Boolean).join(' ');
}

// ─── Piezas ─────────────────────────────────────────────────────────────────

const CLASE_CAMPO =
  'block w-full min-h-12 rounded-xl bg-surface-lowest px-4 py-3 text-base text-ink placeholder:text-ink-mute ' +
  'outline-none ring-1 ring-inset ring-white/[0.06] transition-shadow duration-200 ' +
  'focus:ring-2 focus:ring-primary/70 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#ffb4ab]/70';

function Etiqueta({ htmlFor, opcional, children }: { htmlFor: string; opcional?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.9375rem] font-medium text-ink">
      {children}
      {opcional && <span className="font-normal text-ink-soft"> (opcional)</span>}
    </label>
  );
}

function Ayuda({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm leading-snug text-ink-soft">
      {children}
    </p>
  );
}

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm leading-snug text-[#ffb4ab]">
      <CircleAlert size={16} {...ICONO} className="mt-0.5 shrink-0" />
      {texto}
    </p>
  );
}

// ─── Componente ─────────────────────────────────────────────────────────────

interface Props {
  /** Plan elegido por defecto si la URL no trae ?plan=. */
  planInicial?: string;
  /** Si se da, tras el envío exitoso se navega a esta ruta (ej. "/gracias/"). */
  paginaGracias?: string;
  /** Texto del botón de envío. */
  textoBoton?: string;
  /** Superficie de la sección donde va: 'base' (#131315) → tarjeta surface-low; 'bajo' → tarjeta surface-high. */
  fondo?: 'base' | 'bajo';
  /** id del <form>. Por defecto "formulario" (BarraMovil se oculta al verlo). Cámbielo si la sección que lo
   *  envuelve ya tiene id="formulario", para no repetir ids. */
  id?: string;
}

export default function Formulario({ planInicial = '', paginaGracias, textoBoton = 'Enviar solicitud', fondo = 'base', id: idFormulario = 'formulario' }: Props) {
  const capa = fondo === 'bajo' ? 'bg-surface-high' : 'bg-surface-low';
  const uid = useId();
  const id = (campo: string) => `${uid}-${campo}`;

  const formRef = useRef<HTMLFormElement>(null);
  const confirmacionRef = useRef<HTMLDivElement>(null);
  const avisoErrorRef = useRef<HTMLDivElement>(null);
  const [intentado, setIntentado] = useState(false);
  const [tipoError, setTipoError] = useState<TipoError>('red');
  const [hidratado, setHidratado] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>('inicial');
  const [resumen, setResumen] = useState('');
  const [ultimosDatos, setUltimosDatos] = useState<Partial<Datos>>({});

  // Tras hidratar: validación propia en español y plan desde la URL.
  useEffect(() => {
    setHidratado(true);
    const form = formRef.current;
    if (!form) return;
    const select = form.elements.namedItem('plan');
    const desdeUrl = new URLSearchParams(window.location.search).get('plan') ?? '';
    const elegido = OPCIONES_PLAN.some((o) => o.valor === desdeUrl) ? desdeUrl : planInicial;
    if (select instanceof HTMLSelectElement && !select.value && elegido) select.value = elegido;
    const origen = form.elements.namedItem('pagina');
    if (origen instanceof HTMLInputElement) origen.value = window.location.pathname + window.location.search;
  }, [planInicial]);

  useEffect(() => {
    if (estado === 'exito') confirmacionRef.current?.focus();
    if (estado === 'error') avisoErrorRef.current?.focus();
  }, [estado]);

  function valorDe(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    return el instanceof HTMLInputElement && el.type === 'checkbox' ? (el.checked ? 'si' : '') : el.value;
  }

  function esCampo(nombre: string): nombre is Campo {
    return (CAMPOS as readonly string[]).includes(nombre);
  }

  /** Tras el primer intento de envío, al salir de un campo con contenido se valida. */
  function alSalir(e: FocusEvent<HTMLFormElement>) {
    if (!intentado) return;
    const el = e.target;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) return;
    if (!esCampo(el.name)) return;
    const valor = valorDe(el);
    if (!valor.trim() && !errores[el.name]) return;
    const nombre = el.name;
    setErrores((prev) => ({ ...prev, [nombre]: validar(nombre, valor) || undefined }));
  }

  /** Mientras corrige un campo marcado, el error se actualiza en vivo. */
  function alCambiar(e: ChangeEvent<HTMLFormElement>) {
    const el = e.target;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) return;
    if (!esCampo(el.name) || !errores[el.name]) return;
    const nombre = el.name;
    setErrores((prev) => ({ ...prev, [nombre]: validar(nombre, valorDe(el)) || undefined }));
  }

  async function alEnviar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === 'enviando') return;
    setIntentado(true);
    const form = e.currentTarget;
    const datos = leerDatos(form);
    setUltimosDatos(datos);

    // Honeypot: un robot llenó el campo oculto. Se simula éxito.
    const trampa = form.elements.namedItem('_gotcha');
    if (trampa instanceof HTMLInputElement && trampa.value) {
      setEstado('exito');
      return;
    }

    const nuevos: Errores = {};
    for (const c of CAMPOS) {
      const m = validar(c, datos[c]);
      if (m) nuevos[c] = m;
    }
    setErrores(nuevos);
    const fallidos = CAMPOS.filter((c) => nuevos[c]);
    if (fallidos.length) {
      setResumen(
        fallidos.length === 1 ? 'Hay un campo por corregir.' : `Hay ${fallidos.length} campos por corregir.`,
      );
      const primero = form.elements.namedItem(fallidos[0]!);
      if (primero instanceof HTMLElement) primero.focus();
      return;
    }

    setResumen('');
    setEstado('enviando');
    try {
      const cuerpo = new FormData(form);
      cuerpo.set('plan', nombrePlan(datos.plan) || datos.plan);
      cuerpo.set('autorizacion', 'Sí, autoriza el tratamiento de sus datos personales');
      cuerpo.set('_subject', `Nueva solicitud web: ${datos.nombre.trim()} (${datos.empresa.trim()})`);
      if (datos.email.trim()) cuerpo.set('_replyto', datos.email.trim());

      let respuesta: Response;
      try {
        respuesta = await fetch(URL_ENVIO, { method: 'POST', body: cuerpo, headers: { Accept: 'application/json' } });
      } catch {
        setTipoError('red');
        setEstado('error');
        return;
      }
      if (!respuesta.ok) {
        setTipoError('respuesta');
        setEstado('error');
        return;
      }

      if (paginaGracias) {
        window.location.assign(paginaGracias);
        return;
      }
      form.reset();
      setEstado('exito');
    } catch {
      setTipoError('red');
      setEstado('error');
    }
  }

  const ariaCampo = (campo: Campo, ayuda?: boolean) => ({
    id: id(campo),
    name: campo,
    'aria-invalid': errores[campo] ? true : undefined,
    'aria-describedby': [ayuda ? id(`${campo}-ayuda`) : '', errores[campo] ? id(`${campo}-error`) : ''].filter(Boolean).join(' ') || undefined,
  });

  // ── Éxito ────────────────────────────────────────────────────────────────
  if (estado === 'exito') {
    return (
      <div className={`relative overflow-hidden rounded-[1.5rem] ${capa} p-6 sm:p-10`} role="status">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(74_222_128/0.18),transparent_70%)]"
        />
        <div ref={confirmacionRef} tabIndex={-1} className="relative outline-none">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-lowest text-online">
            <CircleCheck size={26} {...ICONO} />
          </span>
          <p className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
            Recibimos su solicitud
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
            Gracias{ultimosDatos.nombre?.trim() ? `, ${ultimosDatos.nombre.trim().split(/\s+/)[0]}` : ''}. Le escribiremos
            por WhatsApp para preparar su revisión digital gratuita. {CONTACTO.respuestaHumana}
          </p>
        </div>
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={enlaceWhatsApp(mensajeWhatsApp(ultimosDatos))}
            target="_blank"
            rel="noopener noreferrer"
            className="boton boton-secundario w-full sm:w-auto"
          >
            <IconoWhatsApp className="shrink-0 text-whatsapp" />
            Adelantar la conversación por WhatsApp
            <span className="sr-only">{' (se abre en una pestaña nueva)'}</span>
          </a>
          <a href="/proyectos/" className="boton w-full text-primary hover:bg-white/5 sm:w-auto">
            Ver proyectos mientras tanto
            <ArrowRight size={18} {...ICONO} />
          </a>
        </div>
      </div>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────────────
  const enviando = estado === 'enviando';

  return (
    <form
      id={idFormulario}
      ref={formRef}
      action={URL_ENVIO}
      method="POST"
      noValidate={hidratado}
      onSubmit={alEnviar}
      onBlur={alSalir}
      onChange={alCambiar}
      aria-busy={enviando || undefined}
      className={`relative rounded-[1.5rem] ${capa} p-6 sm:p-8 lg:p-10`}
    >
      <p className="text-sm leading-relaxed text-ink-soft">Todos los campos son obligatorios, salvo los marcados como opcionales.</p>

      <div className="mt-6 grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <div>
          <Etiqueta htmlFor={id('nombre')}>Nombre</Etiqueta>
          <input {...ariaCampo('nombre')} type="text" autoComplete="name" required minLength={2} className={CLASE_CAMPO} />
          <MensajeError id={id('nombre-error')} texto={errores.nombre} />
        </div>

        <div>
          <Etiqueta htmlFor={id('empresa')}>Empresa o negocio</Etiqueta>
          <input {...ariaCampo('empresa')} type="text" autoComplete="organization" required className={CLASE_CAMPO} />
          <MensajeError id={id('empresa-error')} texto={errores.empresa} />
        </div>

        <div>
          <Etiqueta htmlFor={id('whatsapp')}>WhatsApp</Etiqueta>
          <input
            {...ariaCampo('whatsapp', true)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="300 123 4567"
            className={CLASE_CAMPO}
          />
          <Ayuda id={id('whatsapp-ayuda')}>Le responderemos por este número.</Ayuda>
          <MensajeError id={id('whatsapp-error')} texto={errores.whatsapp} />
        </div>

        <div>
          <Etiqueta htmlFor={id('email')} opcional>
            Correo electrónico
          </Etiqueta>
          <input
            {...ariaCampo('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="nombre@empresa.com"
            className={CLASE_CAMPO}
          />
          <MensajeError id={id('email-error')} texto={errores.email} />
        </div>

        <div>
          <Etiqueta htmlFor={id('sitio_web')} opcional>
            Sitio web actual
          </Etiqueta>
          <input
            {...ariaCampo('sitio_web')}
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="miempresa.com"
            className={CLASE_CAMPO}
          />
          <MensajeError id={id('sitio_web-error')} texto={errores.sitio_web} />
        </div>

        <div>
          <Etiqueta htmlFor={id('plan')}>Plan de interés</Etiqueta>
          <div className="relative">
            <select {...ariaCampo('plan')} required defaultValue="" className={`${CLASE_CAMPO} cursor-pointer appearance-none pr-11`}>
              <option value="" disabled>
                Seleccione una opción
              </option>
              {OPCIONES_PLAN.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.texto}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              {...ICONO}
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft"
            />
          </div>
          <MensajeError id={id('plan-error')} texto={errores.plan} />
        </div>

        <div className="sm:col-span-2">
          <Etiqueta htmlFor={id('mensaje')}>¿Qué necesita?</Etiqueta>
          <textarea
            {...ariaCampo('mensaje')}
            rows={4}
            required
            minLength={10}
            placeholder="Por ejemplo: somos una firma contable y queremos recibir más consultas desde Google."
            className={`${CLASE_CAMPO} min-h-32 resize-y`}
          />
          <MensajeError id={id('mensaje-error')} texto={errores.mensaje} />
        </div>

        <div className="sm:col-span-2">
          {/* Toda la fila es el área táctil de la casilla (más de 44 px de alto). */}
          <label
            htmlFor={id('autorizacion')}
            className="-mx-3 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] leading-relaxed text-ink-soft transition-colors hover:bg-white/[0.03]"
          >
            {/* Casilla propia: la casilla real (invisible) mide 44 x 44 px; se ve un cuadro de 24 px. */}
            <span className="relative -mx-2.5 -my-2.5 flex h-11 w-11 shrink-0 items-center justify-center">
              <input
                {...ariaCampo('autorizacion')}
                type="checkbox"
                value="si"
                required
                className="peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none rounded-xl outline-none"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-md bg-surface-lowest text-on-primary ring-1 ring-white/25 transition-colors duration-200 ring-inset peer-checked:bg-primary-container peer-checked:ring-primary-container peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-aria-[invalid=true]:ring-2 peer-aria-[invalid=true]:ring-[#ffb4ab]/70 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
            </span>
            <span>
              Autorizo a {SITIO.nombre} ({FUNDADOR.nombre}) a usar mis datos para responder esta solicitud y preparar mi
              revisión digital gratuita, según la{' '}
              <a
                href={RUTA_PRIVACIDAD}
                target="_blank"
                rel="noopener"
                className="-my-2.5 inline-block py-2.5 font-medium text-primary underline underline-offset-4 hover:decoration-2"
              >
                Política de privacidad
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              . Puedo consultarlos, corregirlos o pedir que se borren escribiendo a {CONTACTO.correo}.
            </span>
          </label>
          <MensajeError id={id('autorizacion-error')} texto={errores.autorizacion} />
        </div>
      </div>

      {/* Honeypot: invisible para personas, tentador para robots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('_gotcha')}>No llene este campo</label>
        <input id={id('_gotcha')} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="pagina" defaultValue="" />

      <p aria-live="polite" className="sr-only">
        {resumen}
      </p>

      {estado === 'error' && (
        <div ref={avisoErrorRef} tabIndex={-1} role="alert" className="mt-8 rounded-xl bg-[#ffb4ab]/10 p-4 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5">
          <p className="flex items-start gap-2 text-base font-medium text-ink">
            <CircleAlert size={20} {...ICONO} className="mt-0.5 shrink-0 text-[#ffb4ab]" />
            No pudimos enviar su solicitud.
          </p>
          <p className="mt-1 pl-7 text-[0.9375rem] leading-relaxed text-ink-soft">
            {tipoError === 'red'
              ? 'Revise su conexión e intente de nuevo, o envíela por WhatsApp: el mensaje ya queda escrito con sus datos.'
              : 'Su solicitud no quedó registrada en este momento. Escríbanos por WhatsApp y le respondemos igual.'}
          </p>
          <a
            href={enlaceWhatsApp(mensajeWhatsApp(ultimosDatos))}
            target="_blank"
            rel="noopener noreferrer"
            className="boton boton-whatsapp mt-4 ml-7"
          >
            <IconoWhatsApp className="shrink-0" />
            Enviar por WhatsApp
            <span className="sr-only">{' (se abre en una pestaña nueva)'}</span>
          </a>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" aria-disabled={enviando || undefined} className="boton boton-primario w-full aria-disabled:cursor-wait aria-disabled:opacity-80 sm:w-auto">
          {enviando ? (
            <>
              <LoaderCircle size={18} {...ICONO} className="motion-safe:animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Send size={18} {...ICONO} />
              {textoBoton}
            </>
          )}
        </button>
        <p className="text-sm leading-snug text-ink-soft sm:max-w-[18rem] sm:text-right">{CONTACTO.respuestaHumana}</p>
      </div>
    </form>
  );
}
