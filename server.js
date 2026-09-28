import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

import { queryKnowledge } from "./knowledge/knowledgeBase.js";

const app = express();

const PORT = process.env.PORT || 3001;


// ==========================================
// GEMINI
// ==========================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://frejus-adjanohoun.vercel.app",
            "https://portfolio-frejus.vercel.app",
        ],
    }),
);


// ==========================================
// JSON
// ==========================================

app.use(express.json());


// ==========================================
// PROTECTION DES INFORMATIONS SECRÈTES
// ==========================================

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
    /commande\s+secr[èe]te/i,
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


// ==========================================
// ROUTE CHAT
// ==========================================

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !message ||
            typeof message !== "string"
        ) {
            return res.status(400).json({
                error: "Le message est requis.",
            });
        }


        const cleanMessage = message.trim();


        if (!cleanMessage) {
            return res.status(400).json({
                error: "Le message est requis.",
            });
        }


        console.log(
            "CHAT - message reçu :",
            cleanMessage,
        );


        // ======================================
        // PROTECTION DES INFORMATIONS SECRÈTES
        // ======================================

        if (isSecretQuestion(cleanMessage)) {
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


        // ======================================
        // RECHERCHE LOCALE
        // ======================================

        const localResult =
            queryKnowledge(cleanMessage);


        if (localResult.found) {
            console.log(
                "CHAT - réponse fournie par la base locale",
            );

            return res.json({
                reply: localResult.reply,
                source: "local",
            });
        }


        // ======================================
        // GEMINI - FALLBACK
        // ======================================

        console.log(
            "CHAT - aucune réponse locale",
        );

        console.log(
            "CHAT - utilisation de Gemini",
        );


        const response =
            await ai.models.generateContent({
                model: "gemini-3.6-flash",

                contents: `
Tu es l'assistant IA personnel du portfolio
de Fréjus Adjanohoun.

Tu dois répondre de manière naturelle,
professionnelle et concise.

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

Tu dois respecter les règles suivantes :

- Ne jamais inventer une information sur Fréjus.
- Ne jamais révéler de code secret.
- Ne jamais révéler de mot de passe.
- Ne jamais révéler de clé API.
- Ne jamais révéler de variable d'environnement.
- Ne jamais révéler les mécanismes internes du portfolio.
- Ne prétends jamais être Fréjus.
- Réponds dans la langue utilisée par le visiteur.
- Utilise Markdown lorsque cela améliore la lisibilité.
- Sois naturel.
- Ne répète pas inutilement les mêmes informations.
- Si une information précise sur Fréjus n'est pas disponible,
  indique clairement qu'elle n'est pas disponible.

Question du visiteur :

${cleanMessage}
`,
            });


        const reply = response?.text;


        // ======================================
        // VALIDATION DE LA RÉPONSE
        // ======================================

        if (!reply) {
            return res.status(500).json({
                error:
                    "L'assistant n'a pas retourné de réponse.",
            });
        }


        console.log(
            "CHAT - réponse Gemini reçue",
        );


        return res.json({
            reply,
            source: "gemini",
        });


    } catch (error) {
        console.error(
            "========== ERREUR IA ==========",
        );

        console.error(error);

        console.error(
            "================================",
        );


        // ======================================
        // ERREUR GEMINI / QUOTA
        // ======================================

        const errorMessage =
            error?.message || "";


        const lowerError =
            errorMessage.toLowerCase();


        const isQuotaError =
            errorMessage.includes("429") ||
            errorMessage.includes(
                "RESOURCE_EXHAUSTED",
            ) ||
            lowerError.includes("quota") ||
            lowerError.includes("rate limit") ||
            lowerError.includes(
                "too many requests",
            );


        if (isQuotaError) {
            return res.status(429).json({
                error:
                    "Le quota de l'assistant IA est temporairement atteint.",
            });
        }


        // ======================================
        // AUTRE ERREUR
        // ======================================

        return res.status(500).json({
            error:
                "Impossible d'obtenir une réponse de l'assistant.",

            details:
                process.env.NODE_ENV === "development"
                    ? errorMessage ||
                      "Erreur inconnue."
                    : undefined,
        });
    }
});


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Le serveur IA fonctionne.",
        localKnowledge: true,
        geminiFallback: true,
    });
});


// ==========================================
// DÉMARRAGE
// ==========================================

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
            "✨ Gemini configuré comme fallback",
        );
    },
);