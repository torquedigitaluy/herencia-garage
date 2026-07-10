"use client";

import { useRef, useState } from "react";
import { Upload, X, ChevronLeft, CircleCheck, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_FOTOS = 5;
const MAX_MB = 10;
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const PASOS = ["Datos del vehículo", "Fotos", "Contacto"] as const;

const inputClass =
  "w-full border border-metal-oscuro bg-carbon px-4 py-3 text-sm text-crema placeholder:text-metal-oscuro focus:border-amarillo focus:outline-none";

export function CotizacionForm() {
  const [paso, setPaso] = useState(0);

  // Datos del formulario
  const [vehiculo, setVehiculo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [aceptaSoloChapa, setAceptaSoloChapa] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pasoValido =
    (paso === 0 && vehiculo.trim() !== "" && descripcion.trim() !== "") ||
    paso === 1 || // las fotos son opcionales
    (paso === 2 && nombre.trim() !== "" && telefono.trim() !== "" && aceptaSoloChapa);

  function agregarFotos(nuevas: FileList | null) {
    if (!nuevas) return;
    setError(null);
    const aceptadas: File[] = [];
    for (const file of Array.from(nuevas)) {
      if (!TIPOS_PERMITIDOS.includes(file.type)) {
        setError(`"${file.name}" no es una imagen compatible (JPG, PNG, WEBP o HEIC).`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`"${file.name}" supera los ${MAX_MB} MB.`);
        continue;
      }
      aceptadas.push(file);
    }
    setFotos((prev) => [...prev, ...aceptadas].slice(0, MAX_FOTOS));
  }

  async function enviar() {
    setEnviando(true);
    setError(null);
    try {
      const supabase = createClient();
      const leadId = crypto.randomUUID();

      // 1) Subir las fotos al bucket privado, bajo cotizaciones/<leadId>/
      const paths: string[] = [];
      for (const [i, foto] of fotos.entries()) {
        const ext = foto.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `cotizaciones/${leadId}/${i + 1}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("media").upload(path, foto);
        if (uploadError) throw new Error(`No se pudo subir "${foto.name}": ${uploadError.message}`);
        paths.push(path);
      }

      // 2) Insertar el lead
      const { error: insertError } = await supabase.from("leads_cotizacion").insert({
        id: leadId,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim() || null,
        vehiculo: vehiculo.trim(),
        descripcion: descripcion.trim(),
        fotos_urls: paths,
        acepta_solo_chapa: aceptaSoloChapa,
      });
      if (insertError) throw new Error(insertError.message);

      setEnviado(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error inesperado. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-4 border border-metal-oscuro bg-negro p-8 py-16 text-center">
        <CircleCheck className="h-12 w-12 text-amarillo" strokeWidth={1.5} />
        <h3 className="font-display text-2xl font-bold uppercase">Solicitud recibida</h3>
        <p className="max-w-sm text-sm leading-relaxed text-metal">
          Gracias, {nombre.trim().split(" ")[0]}. Vamos a revisar el estado de tu{" "}
          {vehiculo.trim()} y te contactamos por WhatsApp para coordinar la cotización.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 border border-metal-oscuro bg-negro p-8"
      aria-label="Formulario de cotización"
      onSubmit={(e) => {
        e.preventDefault();
        if (!pasoValido || enviando) return;
        if (paso < PASOS.length - 1) setPaso(paso + 1);
        else enviar();
      }}
    >
      <div className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-metal">
        <span className="text-amarillo">Paso {paso + 1}</span> / {PASOS.length} · {PASOS[paso]}
      </div>

      {paso === 0 && (
        <>
          <Field label="Vehículo">
            <input
              type="text"
              placeholder="Marca, modelo y año"
              className={inputClass}
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
              required
            />
          </Field>
          <Field label="Descripción del trabajo">
            <textarea
              rows={4}
              placeholder="Contanos qué necesita tu auto: estado de la chapa, óxido, golpes, pintura…"
              className={inputClass}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Field>
        </>
      )}

      {paso === 1 && (
        <div>
          <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
            Fotos del vehículo <span className="text-metal-oscuro">(opcional · hasta {MAX_FOTOS})</span>
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept={TIPOS_PERMITIDOS.join(",")}
            multiple
            hidden
            onChange={(e) => {
              agregarFotos(e.target.files);
              e.target.value = "";
            }}
          />

          {fotos.length < MAX_FOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                agregarFotos(e.dataTransfer.files);
              }}
              className="flex w-full flex-col items-center justify-center gap-2 border border-dashed border-metal-oscuro bg-carbon px-4 py-8 text-center text-metal transition-colors hover:border-amarillo"
            >
              <Upload className="h-6 w-6 text-amarillo" strokeWidth={1.5} />
              <span className="text-sm">Arrastrá tus imágenes o seleccioná archivos</span>
              <span className="text-xs text-metal-oscuro">
                JPG · PNG · WEBP · HEIC — máx. {MAX_MB} MB c/u
              </span>
            </button>
          )}

          {fotos.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {fotos.map((foto, i) => (
                <li key={`${foto.name}-${i}`} className="group relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(foto)}
                    alt={foto.name}
                    className="h-full w-full border border-metal-oscuro object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Quitar ${foto.name}`}
                    onClick={() => setFotos(fotos.filter((_, j) => j !== i))}
                    className="absolute -right-2 -top-2 border border-metal-oscuro bg-negro p-1 text-metal transition-colors hover:border-amarillo hover:text-crema"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {paso === 2 && (
        <>
          <Field label="Nombre">
            <input
              type="text"
              placeholder="Tu nombre"
              className={inputClass}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Field>
          <Field label="WhatsApp">
            <input
              type="tel"
              placeholder="Ej: 099 123 456"
              className={inputClass}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </Field>
          <Field label="Email (opcional)">
            <input
              type="email"
              placeholder="tu@email.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <label className="flex cursor-pointer items-start gap-3 border border-amarillo/40 bg-amarillo/5 p-4">
            <input
              type="checkbox"
              checked={aceptaSoloChapa}
              onChange={(e) => setAceptaSoloChapa(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-amarillo"
              required
            />
            <span className="text-sm leading-relaxed text-metal">
              Entiendo que Herencia Garage trabaja{" "}
              <span className="font-display uppercase tracking-wide text-crema">
                exclusivamente chapa y pintura
              </span>{" "}
              y no realiza trabajos de mecánica.
            </span>
          </label>
        </>
      )}

      {error && (
        <p role="alert" className="border border-amarillo/40 bg-amarillo/5 p-3 text-sm text-crema">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {paso > 0 && (
          <button
            type="button"
            onClick={() => setPaso(paso - 1)}
            disabled={enviando}
            className="flex items-center gap-1 border border-metal-oscuro px-5 py-4 font-display text-sm uppercase tracking-widest text-metal transition-colors hover:border-metal hover:text-crema disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Atrás
          </button>
        )}
        <button
          type="submit"
          disabled={!pasoValido || enviando}
          className="flex w-full items-center justify-center gap-2 border border-amarillo bg-amarillo px-6 py-4 font-display text-sm uppercase tracking-widest text-negro transition-colors hover:border-amarillo-claro hover:bg-amarillo-claro disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {enviando ? "Enviando…" : paso < PASOS.length - 1 ? "Continuar" : "Enviar solicitud"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-xs uppercase tracking-widest text-metal">
        {label}
      </span>
      {children}
    </label>
  );
}
