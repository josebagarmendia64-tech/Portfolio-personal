import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';

interface CaptchaState {
  mode: 'server' | 'client';
  token: string;
  imageData: string;
  expectedCode?: string;
}

const TOPIC_PRESETS = [
  'Auxiliar administrativo',
  'Colaboración asociativa',
  'Consulta general',
];

const CAPTCHA_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function buildClientCaptcha(): CaptchaState {
  const randomBytes = new Uint8Array(5);
  crypto.getRandomValues(randomBytes);
  const chars = Array.from(
    randomBytes,
    (b) => CAPTCHA_ALPHABET[b % CAPTCHA_ALPHABET.length],
  );
  const code = chars.join('');

  const width = 200;
  const height = 64;
  const colors = ['#0B1F3A', '#1E293B', '#2B5B84', '#13315C'];

  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, width, height);

      // Subtle interference curves
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 4; i++) {
        const y1 = 10 + ((randomBytes[i % 5] * 13 + i * 17) % 44);
        const y2 = 10 + ((randomBytes[(i + 1) % 5] * 19 + i * 11) % 44);
        const cy = 6 + ((randomBytes[(i + 2) % 5] * 23) % 52);
        ctx.beginPath();
        ctx.moveTo(8, y1);
        ctx.quadraticCurveTo(width / 2, cy, width - 8, y2);
        ctx.stroke();
      }

      // Subtle noise dots
      ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
      for (let i = 0; i < 20; i++) {
        const dx = (randomBytes[i % 5] * 37 + i * 29) % (width - 12) + 6;
        const dy = (randomBytes[(i + 2) % 5] * 23 + i * 19) % (height - 12) + 6;
        ctx.beginPath();
        ctx.arc(dx, dy, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Characters with individual rotation & color
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = '700 28px system-ui, -apple-system, sans-serif';
      chars.forEach((ch, i) => {
        const x = 30 + i * 35;
        const y = 33 + ((randomBytes[i] % 7) - 3);
        const angle = (((randomBytes[i] % 25) - 12) * Math.PI) / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      });

      return {
        mode: 'client',
        token: 'client-local',
        imageData: canvas.toDataURL('image/png'),
        expectedCode: code,
      };
    }
  }

  // ASCII-only UTF-8 SVG fallback
  const charElements = chars
    .map((ch, i) => {
      const x = 24 + i * 34;
      const y = 42 + ((randomBytes[i] % 7) - 3);
      const rotate = (randomBytes[i] % 25) - 12;
      return `<text x="${x}" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="${colors[i % colors.length]}" transform="rotate(${rotate} ${x} ${y})">${ch}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="CAPTCHA"><rect width="100%" height="100%" rx="8" fill="#F1F5F9" /><path d="M 10 22 Q 100 48 190 18" stroke="#94A3B8" stroke-width="1.4" fill="none" opacity="0.65" /><path d="M 16 46 Q 105 14 186 44" stroke="#94A3B8" stroke-width="1.4" fill="none" opacity="0.65" />${charElements}</svg>`;
  const imageData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return {
    mode: 'client',
    token: 'client-local',
    imageData,
    expectedCode: code,
  };
}

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch('/api/captcha', { cache: 'no-store' });
      if (!res.ok) {
        setCaptcha(buildClientCaptcha());
        setCaptchaAnswer('');
        return;
      }
      const data = (await res.json()) as {
        token?: string;
        imageData?: string;
      };
      if (data.token && data.imageData) {
        setCaptcha({
          mode: 'server',
          token: data.token,
          imageData: data.imageData,
        });
      } else {
        setCaptcha(buildClientCaptcha());
      }
      setCaptchaAnswer('');
    } catch {
      setCaptcha(buildClientCaptcha());
      setCaptchaAnswer('');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCaptcha();
  }, [fetchCaptcha]);

  const sendDirectViaFormSubmit = async (payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(
      PERSONAL_INFO.email,
    )}`;
    const directRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        _subject: `[Web CV Joseba] ${payload.subject}`,
        subject: payload.subject,
        message: payload.message,
        _replyto: payload.email,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const directData = (await directRes.json().catch(() => ({}))) as {
      success?: boolean | string;
      message?: string;
    };

    const ok =
      directRes.ok &&
      (directData.success === true || directData.success === 'true');

    if (!ok) {
      throw new Error(
        directData.message ||
          `No se pudo enviar el mensaje. Utiliza el botón de respaldo para escribir a ${PERSONAL_INFO.email}.`,
      );
    }

    return `Tu mensaje se ha enviado correctamente a ${PERSONAL_INFO.email}.`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim() || 'Consulta desde currículum web';
    const cleanMessage = message.trim();

    if (website.trim().length > 0) {
      setErrorMsg('Solicitud no válida.');
      return;
    }

    if (cleanName.length < 2) {
      setErrorMsg(
        'Por favor, indica tu nombre completo (mínimo 2 caracteres).',
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Introduce una dirección de correo electrónico válida.');
      return;
    }

    if (cleanMessage.length < 10) {
      setErrorMsg('El mensaje debe tener al menos 10 caracteres.');
      return;
    }

    if (!captcha) {
      setErrorMsg('Espera a que cargue el código de verificación CAPTCHA.');
      return;
    }

    if (captcha.mode === 'client') {
      if (
        captchaAnswer.trim().toUpperCase() !==
        (captcha.expectedCode || '').toUpperCase()
      ) {
        setErrorMsg(
          'El código CAPTCHA introducido no coincide. Inténtalo de nuevo.',
        );
        setCaptcha(buildClientCaptcha());
        setCaptchaAnswer('');
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          website,
          captchaToken: captcha.token,
          captchaAnswer,
        }),
      });

      // Fallback to direct FormSubmit request if /api/contact is unavailable (404 on static hosting)
      if (res.status === 404) {
        const confirmation = await sendDirectViaFormSubmit({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        });
        setSuccessMsg(confirmation);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setCaptchaAnswer('');
        await fetchCaptcha();
        return;
      }

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.success) {
        setErrorMsg(
          data.error ||
            'No se ha podido enviar el mensaje. Revisa los datos e inténtalo de nuevo.',
        );
        await fetchCaptcha();
        return;
      }

      setSuccessMsg(
        data.message ||
          `Tu mensaje se ha enviado correctamente a ${PERSONAL_INFO.email}.`,
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setCaptchaAnswer('');
      await fetchCaptcha();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Error de conexión al enviar el formulario. Por favor, inténtalo de nuevo o usa el botón de respaldo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoFallback = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    subject || 'Contacto desde currículum web',
  )}`;

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-[#2B5B84] mb-2">
            Comunicación Directa
          </p>
          <h2
            id="contacto-heading"
            className="gsap-reveal text-balance font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]"
          >
            Contacto y{' '}
            <span className="italic font-semibold text-[#2B5B84]">
              Datos Personales
            </span>
          </h2>
          <p className="gsap-reveal mt-3 text-base text-slate-600 leading-relaxed">
            Disponible para consultas directas y funciones de auxiliar
            administrativo y similares.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Aside: Direct Contact Card */}
          <aside
            aria-label="Datos de contacto directo"
            className="gsap-reveal lg:col-span-5 rounded-2xl bg-[#0B1F3A] p-6 sm:p-8 text-white"
          >
            <h3 className="font-display text-xl font-bold text-white">
              {PERSONAL_INFO.fullName}
            </h3>
            <p className="mt-1 text-sm text-slate-300 italic">
              “Joseba” · {PERSONAL_INFO.postalCity}
            </p>

            <dl className="mt-7 space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-medium text-slate-400">
                    Dirección
                  </dt>
                  <dd className="mt-0.5 text-slate-100">
                    {PERSONAL_INFO.address}
                    <br />
                    {PERSONAL_INFO.postalCity}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-medium text-slate-400">
                    Teléfono
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={PERSONAL_INFO.phoneHref}
                      className="font-semibold text-white hover:underline tabular-nums"
                    >
                      {PERSONAL_INFO.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-medium text-slate-400">
                    Correo electrónico
                  </dt>
                  <dd className="mt-0.5 break-all">
                    <a
                      href={PERSONAL_INFO.emailHref}
                      className="font-semibold text-white hover:underline"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 pt-6 border-t border-white/15">
              <a
                href={PERSONAL_INFO.cvPdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Descargar Currículum (PDF)
              </a>
            </div>
          </aside>

          {/* Right: Original Functional Form with CAPTCHA & FormSubmit Fallback */}
          <div className="gsap-reveal lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5 border-b border-slate-100">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0B1F3A]">
                  Formulario de contacto directo
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los mensajes se dirigen a{' '}
                  <span className="font-medium text-slate-700">
                    {PERSONAL_INFO.email}
                  </span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2B5B84]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Protegido contra spam
              </span>
            </div>

            {/* Topic Quick Selectors */}
            <div className="mt-5">
              <span className="block text-xs font-medium text-slate-600 mb-2">
                Motivo rápido (opcional):
              </span>
              <div className="flex flex-wrap gap-2">
                {TOPIC_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSubject(preset)}
                    className={`min-h-[36px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      subject === preset
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
              {/* Honeypot anti-bot field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Sitio web</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Nombre y apellidos <span className="text-[#2B5B84]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B5B84] focus:outline-none focus:ring-2 focus:ring-[#2B5B84]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Correo electrónico <span className="text-[#2B5B84]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={160}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B5B84] focus:outline-none focus:ring-2 focus:ring-[#2B5B84]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Asunto
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  maxLength={140}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej. Auxiliar administrativo o consulta general"
                  className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B5B84] focus:outline-none focus:ring-2 focus:ring-[#2B5B84]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Mensaje <span className="text-[#2B5B84]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje con los detalles de tu consulta..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2B5B84] focus:outline-none focus:ring-2 focus:ring-[#2B5B84]/20"
                />
              </div>

              {/* Visual SVG CAPTCHA Challenge */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="contact-captcha"
                  className="block text-xs font-semibold text-[#0B1F3A] mb-2.5"
                >
                  Verificación de seguridad (CAPTCHA){' '}
                  <span className="text-[#2B5B84]">*</span>
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-16 w-[200px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                      {captcha?.imageData ? (
                        <img
                          src={captcha.imageData}
                          alt="Código CAPTCHA para verificar que eres una persona"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">
                          Cargando código...
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => void fetchCaptcha()}
                      disabled={captchaLoading}
                      aria-label="Generar un nuevo código CAPTCHA"
                      title="Generar nuevo código"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-[#0B1F3A] hover:text-[#0B1F3A] disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${captchaLoading ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="flex-1">
                    <input
                      id="contact-captcha"
                      name="captchaAnswer"
                      type="text"
                      required
                      maxLength={8}
                      autoComplete="off"
                      value={captchaAnswer}
                      onChange={(e) =>
                        setCaptchaAnswer(e.target.value.toUpperCase())
                      }
                      placeholder="Introduce los 5 caracteres"
                      className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold tracking-widest uppercase text-[#0B1F3A] placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:border-[#2B5B84] focus:outline-none focus:ring-2 focus:ring-[#2B5B84]/20"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                >
                  <div className="flex items-start gap-2 font-semibold">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span>{successMsg}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#13315C] disabled:opacity-60 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5B84]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {submitting ? 'Enviando mensaje...' : 'Enviar mensaje'}
                </button>

                <a
                  href={mailtoFallback}
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0B1F3A] hover:text-[#0B1F3A] whitespace-nowrap shrink-0"
                >
                  <Mail className="h-3.5 w-3.5 text-[#2B5B84]" aria-hidden="true" />
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
