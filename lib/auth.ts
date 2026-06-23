import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"Geburtstagskalender" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Passwort zurücksetzen – Geburtstagskalender",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#7c3aed">Passwort zurücksetzen</h2>
            <p>Hallo ${user.name},</p>
            <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
            <p>Klicke auf den folgenden Link, um ein neues Passwort zu vergeben:</p>
            <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
              Passwort zurücksetzen
            </a>
            <p style="color:#666;font-size:13px">Dieser Link ist 1 Stunde gültig. Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>
          </div>
        `,
      });
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
