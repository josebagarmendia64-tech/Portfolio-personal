import type { IncomingMessage, ServerResponse } from 'node:http';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
}

const DEFAULT_RECIPIENT = 'joseba.garmendia64@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function getSafeRecipientEmail(): string {
  const configured = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  if (configured && EMAIL_REGEX.test(configured)) {
    return configured;
  }
  return DEFAULT_RECIPIENT;
}

function resolveRefererOrigin(req: VercelRequest): string {
  const originHeader = req.headers.origin;
  if (typeof originHeader === 'string') {
    try {
      const parsed = new URL(originHeader);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.origin;
      }
    } catch {
      // Ignore malformed origin
    }
  }

  const refererHeader = req.headers.referer;
  if (typeof refererHeader === 'string') {
    try {
      const parsed = new URL(refererHeader);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.origin;
      }
    } catch {
      // Ignore malformed referer
    }
  }

  const host =
    (typeof req.headers['x-forwarded-host'] === 'string' &&
      req.headers['x-forwarded-host']) ||
    (typeof req.headers.host === 'string' && req.headers.host) ||
    process.env.VERCEL_URL ||
    '';

  if (host) {
    const cleanHost = host.replace(/^https?:\/\//, '').split(',')[0].trim();
    const proto =
      req.headers['x-forwarded-proto'] === 'http' ? 'http' : 'https';
    return `${proto}://${cleanHost}`;
  }

  if (process.env.APP_URL) {
    try {
      return new URL(process.env.APP_URL).origin;
    } catch {
      // Ignore invalid APP_URL
    }
  }

  return 'https://vercel.app';
}

async function readJsonBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body as Record<string, unknown>;
  }

  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body) as unknown;
      return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > 16 * 1024) {
      throw new Error('Payload too large');
    }
    chunks.push(buf);
  }

  if (chunks.length === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function sendJson(res: VercelResponse, statusCode: number, data: unknown): void {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    const response = res.status(statusCode);
    if (typeof response.json === 'function') {
      response.json(data);
      return;
    }
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Método no permitido. Utiliza POST.' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 413, { error: 'La solicitud excede el tamaño permitido.' });
    return;
  }

  const honeypot = sanitizeText(body.website, 200);
  if (honeypot.length > 0) {
    sendJson(res, 400, { error: 'Solicitud no válida.' });
    return;
  }

  const name = sanitizeText(body.name, 100);
  const email = sanitizeText(body.email, 160);
  const subject =
    sanitizeText(body.subject, 140) || 'Consulta desde currículum web';
  const message = sanitizeText(body.message, 3000);

  if (name.length < 2) {
    sendJson(res, 400, {
      error: 'Por favor, indica tu nombre completo (mínimo 2 caracteres).',
    });
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    sendJson(res, 400, {
      error: 'Introduce una dirección de correo electrónico válida.',
    });
    return;
  }

  if (message.length < 10) {
    sendJson(res, 400, {
      error: 'El mensaje debe tener al menos 10 caracteres.',
    });
    return;
  }

  const recipientEmail = getSafeRecipientEmail();
  const refererOrigin = resolveRefererOrigin(req);
  const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(
    recipientEmail,
  )}`;

  try {
    const upstreamRes = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: refererOrigin,
      },
      body: JSON.stringify({
        name,
        email,
        _subject: `[Web CV Joseba] ${subject}`,
        subject,
        message,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const upstreamData = (await upstreamRes.json().catch(() => ({}))) as {
      success?: boolean | string;
      message?: string;
    };

    const isSuccess =
      upstreamRes.ok &&
      (upstreamData.success === true || upstreamData.success === 'true');

    if (!isSuccess) {
      sendJson(res, 502, {
        error:
          upstreamData.message ||
          `No se pudo reenviar el mensaje. Puedes escribir directamente a ${recipientEmail}.`,
      });
      return;
    }

    sendJson(res, 200, {
      success: true,
      deliveryMode: 'formsubmit',
      recipient: recipientEmail,
      message: `Tu mensaje se ha enviado correctamente a ${recipientEmail}.`,
    });
  } catch (err) {
    console.error('FormSubmit forward error:', err);
    sendJson(res, 502, {
      error: `Error al conectar con el servicio de correo. Puedes escribir directamente a ${recipientEmail}.`,
    });
  }
}
