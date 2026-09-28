import knowledgeBase from "./index.js";


/* =========================================================
   NORMALISATION
========================================================= */

function normalize(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[?!.,;:()[\]{}"'`]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================================================
   UTILITAIRES
========================================================= */

function hasAny(text, words) {
    return words.some((word) => text.includes(word));
}


function markdownLink(label, url) {
    return `[${label}](${url})`;
}


/* =========================================================
   DÉTECTION : QUESTION SUR FRÉJUS
========================================================= */

function refersToFrejus(question) {
    return hasAny(question, [
        "frejus",
        "frejus adjanohoun",
        "son",
        "sa",
        "ses",
        "lui",
        "il",
    ]);
}


/* =========================================================
   DÉTECTION : COMPÉTENCES
========================================================= */

function isSkillsQuestion(question) {
    const hasSkillWord = hasAny(question, [
        "competence",
        "competences",
        "compet",
        "technologie",
        "technologies",
        "techno",
        "stack",
        "langage",
        "langages",
        "framework",
        "frameworks",
        "maitrise",
        "maitrises",
        "savoir faire",
    ]);

    if (!hasSkillWord) {
        return false;
    }

    /*
     * Si la question parle explicitement de Fréjus,
     * c'est clairement une question locale.
     */
    if (refersToFrejus(question)) {
        return true;
    }

    /*
     * Certaines formulations sont naturellement
     * des questions sur le profil.
     */
    if (
        hasAny(question, [
            "quelles sont les competences",
            "quels sont les competences",
            "quelles sont ses competences",
            "quels sont ses competences",
            "quelles technologies utilise",
            "quelles technologies utilise frejus",
            "quelle stack utilise",
            "quelle est sa stack",
            "quelle stack",
            "quels langages utilise",
            "quels langages connait",
            "quels frameworks utilise",
            "avec quelles technologies travaille",
            "avec quoi travaille",
        ])
    ) {
        return true;
    }

    /*
     * Une simple mention de React, Java ou Spring Boot
     * ne doit PAS déclencher la base locale.
     *
     * Exemple :
     * "Pourquoi React et Spring Boot sont complémentaires ?"
     *
     * → Gemini
     */

    return false;
}


/* =========================================================
   DÉTECTION : CYBERSÉCURITÉ
========================================================= */

function isCybersecurityQuestion(question) {
    const cybersecurityKeywords = [
        "securite informatique",
        "securite info",
        "cybersecurite",
        "cyber securite",
        "cybersecurity",
        "cyber security",
        "securisation",
        "securiser",
        "protection des donnees",
        "securite des donnees",
        "protection des applications",
        "securite des applications",
        "securite des systemes",
        "securite des comptes",
        "securite reseau",
        "securite web",
        "securite logiciel",
        "information security",
        "application security",
        "system security",
        "data security",
        "network security",
    ];

    return hasAny(question, cybersecurityKeywords);
}


/* =========================================================
   DÉTECTION : APPRENTISSAGE CYBERSÉCURITÉ
========================================================= */

function isCybersecurityLearningQuestion(question) {
    return hasAny(question, [
        "apprend",
        "apprendre",
        "apprentissage",
        "etudie",
        "etude",
        "etudes",
        "formation",
        "cours",
        "apprendre la securite",
        "apprend la securite",
        "etudie la securite",
        "apprentissage securite",
        "learning",
        "learn",
        "study",
        "studies",
        "training",
    ]);
}


/* =========================================================
   DÉTECTION : OBJECTIF CYBERSÉCURITÉ
========================================================= */

function isCybersecurityObjectiveQuestion(question) {
    return hasAny(question, [
        "objectif",
        "objectifs",
        "avenir",
        "ambition",
        "ambitions",
        "veut",
        "veux",
        "souhaite",
        "souhait",
        "projet professionnel",
        "career",
        "goal",
        "goals",
        "future",
        "wants",
        "want",
    ]);
}


/* =========================================================
   RÉPONSE : CYBERSÉCURITÉ
========================================================= */

function getCybersecurityResponse(question) {
    const { cybersecurity } = knowledgeBase;

    if (!cybersecurity) {
        return null;
    }

    /*
     * Par défaut, on utilise la version française.
     * La base actuelle est principalement francophone.
     */
    let language = "fr";

    /*
     * Détection simple de l'anglais.
     */
    if (
        hasAny(question, [
            "cybersecurity",
            "cyber security",
            "computer security",
            "information security",
            "application security",
            "system security",
            "data security",
            "network security",
        ])
    ) {
        language = "en";
    }

    const data =
        cybersecurity[language] ||
        cybersecurity.fr;

    /*
     * Question sur l'apprentissage.
     *
     * Exemple :
     * "Est-ce que Fréjus apprend la cybersécurité ?"
     */
    if (
        isCybersecurityLearningQuestion(question)
    ) {
        return data.learning;
    }

    /*
     * Question sur les objectifs.
     *
     * Exemple :
     * "Est-ce que la cybersécurité fait partie
     * des objectifs de Fréjus ?"
     */
    if (
        isCybersecurityObjectiveQuestion(question)
    ) {
        return data.objective;
    }

    /*
     * Réponse générale.
     */
    return data.general;
}


/* =========================================================
   PROFIL
========================================================= */

function getProfileResponse() {
    const { profile } = knowledgeBase;

    const level =
        profile.education?.level ||
        profile.level ||
        "Deuxième année";

    const field =
        profile.education?.domain ||
        profile.field ||
        "Système Informatique et Logiciel";

    return `## Fréjus Adjanohoun

Fréjus est un **${profile.profession}**, actuellement étudiant en **${level}** dans le domaine du **${field}**.

Il développe progressivement son profil dans le **développement Web et Mobile**, avec un intérêt pour le frontend, le backend, les API, les bases de données et l'architecture logicielle.

Il travaille également sur différents projets personnels et académiques afin de développer son expérience pratique.`;
}


/* =========================================================
   FORMATION
========================================================= */

function getFormationResponse() {
    const { profile } = knowledgeBase;

    const level =
        profile.education?.level ||
        profile.level ||
        "Deuxième année";

    const domain =
        profile.education?.domain ||
        profile.field ||
        "Système Informatique et Logiciel";

    return `## Formation

Fréjus est actuellement en **${level}** dans le domaine des **${domain}**.

Sa formation couvre notamment :

- développement Web
- développement Mobile
- programmation
- bases de données
- architecture logicielle
- développement frontend
- développement backend
- création d'API
- conception d'applications`;
}


/* =========================================================
   COMPÉTENCES
========================================================= */

function getSkillsResponse() {
    const { skills } = knowledgeBase;

    return `## Compétences techniques

### Frontend

${skills.frontend
    .map((skill) => `- ${skill}`)
    .join("\n")}

### Mobile

${skills.mobile
    .map((skill) => `- ${skill}`)
    .join("\n")}

### Backend

${skills.backend
    .map((skill) => `- ${skill}`)
    .join("\n")}

### Base de données

${skills.database
    .map((skill) => `- ${skill}`)
    .join("\n")}

### Outils et technologies

${skills.tools
    .map((skill) => `- ${skill}`)
    .join("\n")}`;
}


/* =========================================================
   PROJETS
========================================================= */

function getProjectsResponse() {
    const { projects } = knowledgeBase;

    return `## Projets de Fréjus

${projects
    .map((project) => {
        const features = project.features?.length
            ? `

**Fonctionnalités :**

${project.features
    .map((feature) => `- ${feature}`)
    .join("\n")}`
            : "";

        const links = [
            project.github
                ? markdownLink(
                      "GitHub",
                      project.github
                  )
                : null,

            project.url
                ? markdownLink(
                      "Voir le projet",
                      project.url
                  )
                : null,
        ]
            .filter(Boolean)
            .join(" · ");

        return `### ${project.name}

**Type :** ${project.type}

**Technologies :** ${project.technologies.join(", ")}

${project.description}
${features}

${links}`;
    })
    .join("\n\n")}`;
}


/* =========================================================
   CONTACT
========================================================= */

function getContactResponse() {
    const { contact } = knowledgeBase;

    return `## Contacter Fréjus

- 📧 ${markdownLink(
        contact.email,
        `mailto:${contact.email}`
    )}

- 💬 ${markdownLink(
        "WhatsApp",
        contact.whatsapp ||
            "https://wa.me/2290152905310"
    )}

- 💻 ${markdownLink(
        "GitHub",
        contact.github
    )}

- 💼 ${markdownLink(
        "LinkedIn",
        contact.linkedin
    )}

- 📘 ${markdownLink(
        "Facebook",
        contact.facebook
    )}

- 📸 ${markdownLink(
        "Instagram",
        contact.instagram
    )}`;
}


/* =========================================================
   PARCOURS
========================================================= */

function getParcoursResponse() {
    const { parcours } = knowledgeBase;

    const current =
        parcours.currentEducation ||
        parcours.current ||
        "Fréjus est actuellement étudiant en deuxième année.";

    return `## Parcours

${current}

Son parcours se concentre notamment sur :

${parcours.areas
    .map((item) => `- ${item}`)
    .join("\n")}

${parcours.progression}`;
}


/* =========================================================
   QUERY KNOWLEDGE
========================================================= */

export function queryKnowledge(message) {
    const question = normalize(message);


    /* =====================================================
       PROTECTION
    ===================================================== */

    if (!question) {
        return {
            found: false,
            reply: null,
        };
    }


    /* =====================================================
       RÉSEAUX / CONTACT
       Priorité élevée pour éviter les conflits.
    ===================================================== */

    if (
        hasAny(question, [
            "github",
            "git hub",
        ])
    ) {
        return {
            found: true,

            reply: markdownLink(
                "GitHub de Fréjus",
                knowledgeBase.contact.github
            ),
        };
    }


    if (question.includes("linkedin")) {
        return {
            found: true,

            reply: markdownLink(
                "LinkedIn de Fréjus",
                knowledgeBase.contact.linkedin
            ),
        };
    }


    if (
        hasAny(question, [
            "instagram",
            "insta",
        ])
    ) {
        return {
            found: true,

            reply: markdownLink(
                "@adjanohounf",
                knowledgeBase.contact.instagram
            ),
        };
    }


    if (
        hasAny(question, [
            "facebook",
            "fb",
        ])
    ) {
        return {
            found: true,

            reply: markdownLink(
                "Facebook de Fréjus",
                knowledgeBase.contact.facebook
            ),
        };
    }


    if (question.includes("whatsapp")) {
        return {
            found: true,

            reply: markdownLink(
                "Contacter Fréjus sur WhatsApp",
                knowledgeBase.contact.whatsapp ||
                    "https://wa.me/2290152905310"
            ),
        };
    }


    if (
        hasAny(question, [
            "email",
            "e mail",
            "mail",
            "adresse email",
            "adresse mail",
        ])
    ) {
        return {
            found: true,

            reply: markdownLink(
                knowledgeBase.contact.email,
                `mailto:${knowledgeBase.contact.email}`
            ),
        };
    }


    /* =====================================================
       CYBERSÉCURITÉ
       Priorité avant les compétences générales.
    ===================================================== */

    if (isCybersecurityQuestion(question)) {
        return {
            found: true,
            reply: getCybersecurityResponse(question),
        };
    }


    /* =====================================================
       IDENTITÉ
    ===================================================== */

    if (
        hasAny(question, [
            "qui est frejus",
            "qui est frejus adjanohoun",
            "parle moi de frejus",
            "parle moi de frejus adjanohoun",
            "presente frejus",
            "presentation de frejus",
            "profil de frejus",
            "a propos de frejus",
            "apropos de frejus",
        ])
    ) {
        return {
            found: true,
            reply: getProfileResponse(),
        };
    }


    /* =====================================================
       FORMATION
    ===================================================== */

    if (
        hasAny(question, [
            "formation",
            "etude",
            "etudes",
            "niveau scolaire",
            "niveau detude",
            "ecole",
            "etudiant",
            "etudie",
        ])
    ) {
        return {
            found: true,
            reply: getFormationResponse(),
        };
    }


    /* =====================================================
       COMPÉTENCES
    ===================================================== */

    if (isSkillsQuestion(question)) {
        return {
            found: true,
            reply: getSkillsResponse(),
        };
    }


    /* =====================================================
       PROJETS
    ===================================================== */

    if (
        hasAny(question, [
            "projet",
            "projets",
            "project",
            "projects",
            "realisation",
            "realisations",
            "application",
            "applications",
            "travaux",
            "creation",
            "creations",
        ])
    ) {
        return {
            found: true,
            reply: getProjectsResponse(),
        };
    }


    /* =====================================================
       PARCOURS
    ===================================================== */

    if (
        hasAny(question, [
            "parcours",
            "evolution",
            "experience",
            "cheminement",
        ])
    ) {
        return {
            found: true,
            reply: getParcoursResponse(),
        };
    }


    /* =====================================================
       CONTACT
    ===================================================== */

    if (
        hasAny(question, [
            "contact",
            "contacter",
            "joindre",
            "comment contacter",
        ])
    ) {
        return {
            found: true,
            reply: getContactResponse(),
        };
    }


    /* =====================================================
       PORTFOLIO
    ===================================================== */

    if (
        hasAny(question, [
            "portfolio",
            "site de frejus",
            "site web de frejus",
            "site personnel",
            "voir le portfolio",
        ])
    ) {
        return {
            found: true,

            reply: `Voici le portfolio de Fréjus :

${markdownLink(
    "Voir le portfolio",
    knowledgeBase.contact.portfolio
)}`,
        };
    }


    /* =====================================================
       OBJECTIFS
    ===================================================== */

    if (
        hasAny(question, [
            "objectif",
            "objectifs",
            "but",
            "ambition",
            "avenir",
        ])
    ) {
        return {
            found: true,

            reply: `## Objectifs professionnels

Fréjus cherche notamment à :

${knowledgeBase.goals
    .map((goal) => `- ${goal}`)
    .join("\n")}`,
        };
    }


    /* =====================================================
       AUCUNE RÉPONSE LOCALE
    ===================================================== */

    return {
        found: false,
        reply: null,
    };
}


export default queryKnowledge;

