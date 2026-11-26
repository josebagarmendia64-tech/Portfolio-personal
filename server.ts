import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_RECIPIENT = 'joseba.garmendia64@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CAPTCHA_SECRET =
  process.env.CAPTCHA_SECRET || crypto.randomBytes(32).toString('hex');

const CAPTCHA_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CAPTCHA_TTL_MS = 10 * 60 * 1000;

interface CaptchaPayload {
  nonce: string;
  answerHash: string;
  exp: number;
}

const usedNonces = new Map<string, number>();
const rateLimitMap = new Map<string, number[]>();

function getSafeRecipientEmail(): string {
  const configured = process.env.CONTACT_RECIPIENT_EMAIL?.trim();
  if (configured && EMAIL_REGEX.test(configured)) {
    return configured;
  }
  return DEFAULT_RECIPIENT;
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function resolveRefererOrigin(req: Request): string {
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

  if (process.env.APP_URL) {
    try {
      return new URL(process.env.APP_URL).origin;
    } catch {
      // Ignore invalid APP_URL
    }
  }

  const host = req.get('x-forwarded-host') || req.get('host');
  if (host) {
    const cleanHost = host.split(',')[0].trim();
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
    return `${proto}://${cleanHost}`;
  }

  return `http://localhost:${PORT}`;
}

function cleanupStores(): void {
  const now = Date.now();
  for (const [nonce, exp] of usedNonces.entries()) {
    if (exp < now) usedNonces.delete(nonce);
  }
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter((ts) => now - ts < 10 * 60 * 1000);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}

function generateCaptchaCode(length = 5): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    const idx = crypto.randomInt(0, CAPTCHA_ALPHABET.length);
    code += CAPTCHA_ALPHABET[idx];
  }
  return code;
}

function signPayload(payload: CaptchaPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): CaptchaPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  if (!encoded || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as CaptchaPayload;
    if (
      typeof parsed.nonce !== 'string' ||
      typeof parsed.answerHash !== 'string' ||
      typeof parsed.exp !== 'number'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function hashAnswer(answer: string, nonce: string): string {
  return crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(`${nonce}:${answer.trim().toUpperCase()}`)
    .digest('hex');
}

function buildCaptchaSvg(code: string): string {
  const width = 200;
  const height = 64;
  const chars = code.split('');

  const charElements = chars
    .map((ch, i) => {
      const x = 24 + i * 34 + crypto.randomInt(-3, 4);
      const y = 42 + crypto.randomInt(-5, 6);
      const rotate = crypto.randomInt(-16, 17);
      const colors = ['#0B1F3A', '#1E293B', '#2B5B84', '#13315C'];
      const color = colors[i % colors.length];
      return `<text x="${x}" y="${y}" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${ch}</text>`;
    })
    .join('');

  const lines = Array.from({ length: 5 }, () => {
    const x1 = crypto.randomInt(0, 40);
    const y1 = crypto.randomInt(8, height - 8);
    const x2 = crypto.randomInt(width - 40, width);
    const y2 = crypto.randomInt(8, height - 8);
    const cx = crypto.randomInt(60, width - 60);
    const cy = crypto.randomInt(4, height - 4);
    return `<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="#94A3B8" stroke-width="1.4" fill="none" opacity="0.65" />`;
  }).join('');

  const dots = Array.from({ length: 18 }, () => {
    const cx = crypto.randomInt(6, width - 6);
    const cy = crypto.randomInt(6, height - 6);
    const r = (crypto.randomInt(8, 18) / 10).toFixed(1);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#64748B" opacity="0.35" />`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Código de verificación CAPTCHA"><rect width="100%" height="100%" rx="8" fill="#F1F5F9" />${lines}${dots}${charElements}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/captcha', (_req: Request, res: Response) => {
    cleanupStores();
    const code = generateCaptchaCode(5);
    const nonce = crypto.randomBytes(12).toString('hex');
    const exp = Date.now() + CAPTCHA_TTL_MS;
    const answerHash = hashAnswer(code, nonce);
    const token = signPayload({ nonce, answerHash, exp });
    const imageData = buildCaptchaSvg(code);

    res.setHeader('Cache-Control', 'no-store');
    res.json({ token, imageData, expiresInSeconds: CAPTCHA_TTL_MS / 1000 });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    cleanupStores();
    const clientIp = req.ip || 'unknown';
    const now = Date.now();
    const timestamps = rateLimitMap.get(clientIp) || [];
    if (timestamps.length >= 5) {
      res.status(429).json({
        error:
          'Has realizado demasiados envíos en poco tiempo. Por favor, espera unos minutos antes de volver a intentarlo.',
      });
      return;
    }

    const body = (req.body || {}) as Record<string, unknown>;
    const honeypot = sanitizeText(body.website, 200);
    if (honeypot.length > 0) {
      res.status(400).json({ error: 'Solicitud no válida.' });
      return;
    }

    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 160);
    const subject =
      sanitizeText(body.subject, 140) || 'Consulta desde currículum web';
    const message = sanitizeText(body.message, 3000);
    const captchaToken = sanitizeText(body.captchaToken, 512);
    const captchaAnswer = sanitizeText(body.captchaAnswer, 16);

    if (name.length < 2) {
      res.status(400).json({
        error: 'Por favor, indica tu nombre completo (entre 2 y 100 caracteres).',
      });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({
        error: 'Introduce una dirección de correo electrónico válida.',
      });
      return;
    }

    if (message.length < 10) {
      res.status(400).json({
        error: 'El mensaje debe tener al menos 10 caracteres.',
      });
      return;
    }

    if (!captchaToken || !captchaAnswer) {
      res.status(400).json({
        error: 'Por favor, completa el código de verificación CAPTCHA.',
      });
      return;
    }

    const payload = verifyToken(captchaToken);
    if (!payload) {
      res.status(400).json({
        error:
          'El CAPTCHA ha caducado o no es válido. Actualiza el código e inténtalo de nuevo.',
      });
      return;
    }

    if (Date.now() > payload.exp) {
      res.status(400).json({
        error: 'El código CAPTCHA ha expirado. Solicita uno nuevo.',
      });
      return;
    }

    if (usedNonces.has(payload.nonce)) {
      res.status(400).json({
        error: 'Este código CAPTCHA ya ha sido utilizado. Solicita uno nuevo.',
      });
      return;
    }

    const candidateHash = hashAnswer(captchaAnswer, payload.nonce);
    const expectedBuf = Buffer.from(payload.answerHash, 'hex');
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    if (
      expectedBuf.length !== candidateBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, candidateBuf)
    ) {
      res.status(400).json({
        error: 'El código CAPTCHA introducido no coincide. Inténtalo de nuevo.',
      });
      return;
    }

    usedNonces.set(payload.nonce, payload.exp);
    timestamps.push(now);
    rateLimitMap.set(clientIp, timestamps);

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
        res.status(502).json({
          error:
            upstreamData.message ||
            `No se pudo enviar el correo a través de FormSubmit. Puedes escribir directamente a ${recipientEmail}.`,
        });
        return;
      }

      res.json({
        success: true,
        deliveryMode: 'formsubmit',
        recipient: recipientEmail,
        message: `Tu mensaje se ha enviado correctamente a ${recipientEmail}.`,
      });
    } catch (err) {
      console.error('Error forwarding to FormSubmit:', err);
      res.status(502).json({
        error: `No se pudo completar el envío en este momento. Puedes escribir directamente a ${recipientEmail}.`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

createApp();
