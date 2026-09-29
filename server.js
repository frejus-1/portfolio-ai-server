import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

import { queryKnowledge } from "./knowledge/knowledgeBase.js";

// ============================================================
// CONFIGURATION
// ============================================================

const app = express();

const PORT = process.env.PORT || 3001;

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CLIENTS IA
// ============================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://frejus-adjanohoun.vercel.app",
            "https://portfolio-frejus.vercel.app",
        ],
    }),
);

app.use(express.json());

// Interface standalone
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================================================
// QUESTIONS CONFIDENTIELLES
// ============================================================

const SECRET_PATTERNS = [
    /code\s+secret/i,
    /secret\s+code/i,
    /mot\s+de\s+passe/i,
    /password/i,
    /code\s+cach[ée]/i,
    /code.*easter.?egg/i,
    /easter.?egg.*code/i,
    /comment.*déverrouill/i,
    /comment.*deverrouill/i,
    /commande\s+cach[ée]/i,
    /commande\s+secr[èe]/i,
    /mécanisme.*secret/i,
    /mecanisme.*secret/i,
    /variable.*environnement/i,
    /environment.*variable/i,
    /clé.*api/i,
    /cle.*api/i,
    /api.*key/i,
    /source.*code/i,
    /code.*source/i,
];

function isSecretQuestion(message) {
    return SECRET_PATTERNS.some((pattern) =>
        pattern.test(message),
    );
}

// ============================================================
// PROMPT COMMUN AUX PROVIDERS
// ============================================================

function buildSystemPrompt() {
    return `
Tu es l'assistant IA personnel du portfolio
de Fréjus Adjanohoun.

Tu dois répondre de manière naturelle,
professionnelle, utile et concise.

Tu connais les informations suivantes :

Nom :
Fréjus Adjanohoun

Profil :
Développeur Full Stack Web & Mobile

Formation :
Deuxième année en Système Informatique
et Logiciel.

Technologies principales :
React, JavaScript, HTML, CSS, Vite,
Flutter, Dart, Laravel, Spring Boot,
Java, MySQL, Git, GitHub, REST API,
JWT, Maven et npm.

Règles importantes :

- Ne jamais inventer une information sur Fréjus.
- Ne jamais révéler de code secret.
- Ne jamais révéler de mot de passe.
- Ne jamais révéler de clé API.
- Ne jamais révéler de variable d'environnement.
- Ne jamais révéler les mécanismes internes du portfolio.
- Ne prétends jamais être Fréjus.
- Réponds dans la langue utilisée par le visiteur.
- Utilise Markdown lorsque cela améliore la lisibilité.
- Sois naturel et professionnel.
- Ne répète pas inutilement les mêmes informations.
- Si une information précise sur Fréjus n'est pas disponible,
  indique clairement qu'elle n'est pas disponible.

Question du visiteur :

`;
}

// ============================================================
// DÉTECTION DES ERREURS GEMINI
// ============================================================

function getErrorStatus(error) {
    return (
        error?.status ||
        error?.statusCode ||
        error?.response?.status ||
        error?.cause?.status ||
        null
    );
}

function isGeminiRateLimitError(error) {
    const status = getErrorStatus(error);

    const errorMessage = String(
        error?.message ||
        error?.error?.message ||
        "",
    );

    const lowerError = errorMessage.toLowerCase();

    return (
        status === 429 ||
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        lowerError.includes("resource exhausted") ||
        lowerError.includes("rate limit") ||
        lowerError.includes("quota exceeded") ||
        lowerError.includes("quota")
    );
}

function isTemporaryAIError(error) {
    const status = getErrorStatus(error);

    const errorMessage = String(
        error?.message ||
        error?.error?.message ||
        "",
    );

    const lowerError = errorMessage.toLowerCase();

    return (
        status === 429 ||
        status === 408 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        errorMessage.includes("429") ||
        errorMessage.includes("503") ||
        lowerError.includes("timeout") ||
        lowerError.includes("rate limit") ||
        lowerError.includes("temporarily unavailable") ||
        lowerError.includes("resource exhausted")
    );
}

// ============================================================
// GEMINI
// ============================================================

async function generateWithGemini(message) {
    console.log("AI - tentative avec Gemini");

    const response =
        await ai.models.generateContent({
            model: "gemini-3.6-flash",

            contents:
                buildSystemPrompt() + message,
        });

    const reply = response?.text;

    if (!reply) {
        throw new Error(
            "Gemini n'a pas retourné de texte.",
        );
    }

    console.log("AI - réponse Gemini reçue");

    return reply;
}

// ============================================================
// OPENAI
// ============================================================

async function generateWithOpenAI(message) {
    console.log("AI - bascule vers OpenAI");

    const response =
        await openai.responses.create({
            model: "gpt-5",

            instructions:
                buildSystemPrompt(),

            input: message,
        });

    const reply = response?.output_text;

    if (!reply) {
        throw new Error(
            "OpenAI n'a pas retourné de texte.",
        );
    }

    console.log("AI - réponse OpenAI reçue");

    return reply;
}

// ============================================================
// GÉNÉRATION IA AVEC FALLBACK
// ============================================================

async function generateAIResponse(message) {
    let geminiError = null;

    // --------------------------------------------------------
    // 1. GEMINI
    // --------------------------------------------------------

    try {
        const reply =
            await generateWithGemini(message);

        return {
            reply,
            provider: "gemini",
        };
    } catch (error) {
        geminiError = error;

        console.error(
            "AI - erreur Gemini :",
            error?.message || error,
        );

        // ----------------------------------------------------
        // FALLBACK UNIQUEMENT POUR LES ERREURS TEMPORAIRES
        // ----------------------------------------------------

        if (!isTemporaryAIError(error)) {
            console.log(
                "AI - erreur Gemini non temporaire",
            );

            throw error;
        }

        if (isGeminiRateLimitError(error)) {
            console.log(
                "AI - Gemini 429/quota atteint",
            );
        } else {
            console.log(
                "AI - erreur temporaire Gemini",
            );
        }
    }

    // --------------------------------------------------------
    // 2. OPENAI
    // --------------------------------------------------------

    try {
        const reply =
            await generateWithOpenAI(message);

        return {
            reply,
            provider: "openai",
        };
    } catch (openAIError) {
        console.error(
            "AI - erreur OpenAI :",
            openAIError?.message || openAIError,
        );

        const error = new Error(
            "Gemini et OpenAI n'ont pas pu générer de réponse.",
        );

        error.geminiError = geminiError;
        error.openAIError = openAIError;

        throw error;
    }
}

// ============================================================
// API CHAT
// ============================================================

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !message ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                error:
                    "Le message est requis.",
            });
        }

        const cleanMessage =
            message.trim();

        if (!cleanMessage) {
            return res.status(400).json({
                error:
                    "Le message est requis.",
            });
        }

        console.log(
            "================================================",
        );

        console.log(
            "CHAT - message reçu :",
            cleanMessage,
        );

        // ----------------------------------------------------
        // QUESTIONS SECRÈTES
        // ----------------------------------------------------

        if (
            isSecretQuestion(
                cleanMessage,
            )
        ) {
            console.log(
                "CHAT - question secrète bloquée",
            );

            return res.status(403).json({
                error:
                    "Information confidentielle.",

                reply:
                    "Je peux parler du parcours, des compétences et des projets de Fréjus, mais je ne peux pas révéler les codes secrets, commandes cachées ou mécanismes internes du portfolio.",
            });
        }

        // ----------------------------------------------------
        // BASE DE CONNAISSANCES LOCALE
        // ----------------------------------------------------

        const localResult =
            queryKnowledge(
                cleanMessage,
            );

        if (localResult.found) {
            console.log(
                "CHAT - réponse fournie par la base locale",
            );

            console.log(
                "================================================",
            );

            return res.json({
                reply:
                    localResult.reply,

                source: "local",
            });
        }

        // ----------------------------------------------------
        // GEMINI → OPENAI
        // ----------------------------------------------------

        console.log(
            "CHAT - aucune réponse locale",
        );

        console.log(
            "CHAT - lancement du système Gemini → OpenAI",
        );

        const result =
            await generateAIResponse(
                cleanMessage,
            );

        console.log(
            `CHAT - réponse fournie par ${result.provider}`,
        );

        console.log(
            "================================================",
        );

        return res.json({
            reply: result.reply,
            source: result.provider,
        });
    } catch (error) {
        console.error(
            "========== ERREUR IA ==========",
        );

        console.error(
            error?.message || error,
        );

        console.error(
            "================================",
        );

        const errorMessage =
            String(
                error?.message || "",
            );

        const lowerError =
            errorMessage.toLowerCase();

        const isQuotaError =
            errorMessage.includes("429") ||
            errorMessage.includes(
                "RESOURCE_EXHAUSTED",
            ) ||
            lowerError.includes(
                "quota",
            ) ||
            lowerError.includes(
                "rate limit",
            ) ||
            lowerError.includes(
                "too many requests",
            );

        // ----------------------------------------------------
        // LES DEUX PROVIDERS ONT ÉCHOUÉ
        // ----------------------------------------------------

        if (isQuotaError) {
            return res.status(503).json({
                error:
                    "Les services IA sont temporairement indisponibles.",
                reply:
                    "Je rencontre actuellement une limite temporaire avec les services IA. Réessayez dans quelques instants.",
            });
        }

        return res.status(500).json({
            error:
                "Impossible d'obtenir une réponse de l'assistant.",

            reply:
                "Une erreur temporaire est survenue. Réessayez dans quelques instants.",

            details:
                process.env.NODE_ENV ===
                "development"
                    ? errorMessage ||
                      "Erreur inconnue."
                    : undefined,
        });
    }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",

        message:
            "Le serveur IA fonctionne.",

        localKnowledge: true,

        geminiFallback: true,

        openaiFallback:
            Boolean(
                process.env.OPENAI_API_KEY,
            ),
    });
});

// ============================================================
// DÉMARRAGE
// ============================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `🤖 Serveur IA lancé sur le port ${PORT}`,
        );

        console.log(
            "🧠 Base de connaissances locale activée",
        );

        console.log(
            "✨ Gemini configuré comme premier provider",
        );

        console.log(
            process.env.OPENAI_API_KEY
                ? "🔄 OpenAI configuré comme fallback"
                : "⚠️ OPENAI_API_KEY absente - fallback OpenAI désactivé",
        );
    },
);