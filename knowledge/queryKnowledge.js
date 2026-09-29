import knowledgeBase from "./index.js";

const normalize = (text = "") =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

const hasAny = (text, words = []) =>
    words.some((word) => text.includes(normalize(word)));

const markdownLink = (label, url) => `[${label}](${url})`;

function refersToFrejus(question) {
    return hasAny(question, [
        "frejus",
        "fréjus",
        "lui",
        "il",
        "son parcours",
        "ses competences",
        "ses compétences",
        "son profil",
        "son travail",
        "sa formation",
        "son experience",
        "son expérience",
        "ses projets",
        "ses objectifs",
    ]);
}

/* =========================================================
   COMPÉTENCES
========================================================= */

function isSkillsQuestion(question) {
    const normalized = normalize(question);

    const genericTechnologyQuestion =
        hasAny(normalized, [
            "pourquoi react et spring boot",
            "react et spring boot sont complementaires",
            "react et spring boot sont complémentaires",
            "pourquoi utiliser react et spring boot",
            "comment react et spring boot",
            "react spring boot ensemble",
        ]) && !refersToFrejus(normalized);

    if (genericTechnologyQuestion) {
        return false;
    }

    return hasAny(normalized, [
        "competence",
        "competences",
        "compétence",
        "compétences",
        "technologie",
        "technologies",
        "stack",
        "framework",
        "langage",
        "langages",
        "maitrise",
        "maitrises",
        "maîtrise",
        "maîtrises",
        "skills",
        "technologies utilisees",
        "technologies utilisées",
        "quelles technologies",
        "quels langages",
    ]);
}

function getSkillsResponse(question) {
    const isEnglish = hasAny(question, [
        "what skills",
        "what technologies",
        "which technologies",
        "what programming languages",
        "what frameworks",
        "english",
        "in english",
    ]);

    if (isEnglish) {
        return knowledgeBase.skills.en || knowledgeBase.skills.fr;
    }

    return knowledgeBase.skills.fr || knowledgeBase.skills.en;
}

/* =========================================================
   CYBERSÉCURITÉ
========================================================= */

function isCybersecurityExpertiseQuestion(question) {
    return hasAny(question, [
        "expert en cybersecurite",
        "experte en cybersecurite",
        "expert en securite informatique",
        "experte en securite informatique",
        "specialiste en cybersecurite",
        "specialiste en securite informatique",
        "specialise en cybersecurite",
        "specialise en securite informatique",
        "specialisee en cybersecurite",
        "specialisee en securite informatique",
        "maitrise la cybersecurite",
        "maitrise la securite informatique",
        "maitrise de la cybersecurite",
        "fort en cybersecurite",
        "fort en securite informatique",
        "competent en cybersecurite",
        "competent en securite informatique",
        "niveau en cybersecurite",
        "niveau en securite informatique",
        "son niveau en cybersecurite",
        "son niveau en securite informatique",
    ]);
}

function getCybersecurityExpertiseResponse(question) {
    const isEnglish = hasAny(question, [
        "cybersecurity expert",
        "expert in cybersecurity",
        "security expert",
        "specialist in cybersecurity",
        "cybersecurity specialist",
    ]);

    if (isEnglish) {
        return `## Fréjus and cybersecurity

Fréjus is **not currently a cybersecurity expert or specialist**.

His main area of study and professional development is **Web and Mobile development**, particularly Full Stack development.

However, he is interested in **computer security and cybersecurity** and wants to progressively develop his knowledge in this field.

Cybersecurity is therefore an **area of learning and professional development**, rather than an expertise he currently claims to have mastered.`;
    }

    return `## Fréjus et la cybersécurité

Fréjus **n'est pas actuellement spécialisé ni expert en cybersécurité**.

Son domaine principal de formation et de développement professionnel est le **développement Web et Mobile**, notamment le développement Full Stack.

Il s'intéresse cependant à la **sécurité informatique et à la cybersécurité** et souhaite progressivement développer ses connaissances dans ce domaine.

La cybersécurité représente donc pour lui un **axe d'apprentissage et d'évolution professionnelle**, et non une expertise qu'il revendique actuellement.`;
}

function isCybersecurityLearningQuestion(question) {
    return hasAny(question, [
        "apprendre la cybersecurite",
        "apprendre la securite informatique",
        "veut apprendre la cybersecurite",
        "veut apprendre la securite informatique",
        "apprend la cybersecurite",
        "apprend la securite informatique",
        "etudier la cybersecurite",
        "étudier la cybersécurité",
        "se former en cybersecurite",
        "se former en securite informatique",
        "apprentissage cybersecurite",
        "apprentissage securite informatique",
        "learn cybersecurity",
        "learning cybersecurity",
        "study cybersecurity",
        "cybersecurity learning",
    ]);
}

function isCybersecurityObjectiveQuestion(question) {
    return hasAny(question, [
        "objectif cybersecurite",
        "objectifs cybersecurite",
        "objectif en cybersecurite",
        "objectifs en cybersecurite",
        "ambition cybersecurite",
        "ambitions cybersecurite",
        "avenir cybersecurite",
        "futur cybersecurite",
        "evolution cybersecurite",
        "evolution en cybersecurite",
        "veut faire de la cybersecurite",
        "souhaite faire de la cybersecurite",
        "interesse par la cybersecurite",
        "interesse par la securite informatique",
        "interessé par la cybersécurité",
        "interessé par la sécurité informatique",
        "cybersecurity goals",
        "cybersecurity objective",
        "cybersecurity future",
    ]);
}

function isCybersecurityQuestion(question) {
    return hasAny(question, [
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
    ]);
}

function getCybersecurityResponse(question) {
    const isEnglish = hasAny(question, [
        "cybersecurity",
        "cyber security",
        "information security",
        "application security",
        "system security",
        "data security",
        "network security",
        "learn cybersecurity",
        "cybersecurity goals",
    ]);

    const language = isEnglish
        ? knowledgeBase.cybersecurity.en
        : knowledgeBase.cybersecurity.fr;

    if (isCybersecurityLearningQuestion(question)) {
        return language.learning || language.general;
    }

    if (isCybersecurityObjectiveQuestion(question)) {
        return language.objective || language.general;
    }

    return language.general;
}

/* =========================================================
   OBJECTIFS
========================================================= */

function isGoalsQuestion(question) {
    return hasAny(question, [
        "objectif",
        "objectifs",
        "ambition",
        "ambitions",
        "but professionnel",
        "buts professionnels",
        "projet professionnel",
        "projets professionnels",
        "evolution professionnelle",
        "evolution de carriere",
        "evolution de carrière",
        "carriere",
        "carrière",
        "avenir professionnel",
        "avenir de frejus",
        "avenir de fréjus",
        "projets pour l avenir",
        "projets pour l'avenir",
        "future",
        "professional goal",
        "professional goals",
        "career goal",
        "career goals",
        "professional development",
        "future plans",
    ]);
}

function isDevelopmentGoalQuestion(question) {
    return hasAny(question, [
        "objectif developpement",
        "objectifs developpement",
        "objectif en developpement",
        "objectifs en developpement",
        "objectif developpeur",
        "objectifs developpeur",
        "objectif developpeur web",
        "objectif developpeur mobile",
        "evolution dans le developpement",
        "progresser en developpement",
        "progresser en programmation",
        "veut apprendre le backend",
        "veut apprendre le frontend",
        "veut progresser en backend",
        "veut progresser en frontend",
        "development goals",
        "developer goals",
    ]);
}

function isProfessionalGoalQuestion(question) {
    return hasAny(question, [
        "projet professionnel",
        "projets professionnels",
        "objectif professionnel",
        "objectifs professionnels",
        "carriere",
        "carrière",
        "avenir professionnel",
        "experience professionnelle",
        "expérience professionnelle",
        "stage",
        "emploi",
        "alternance",
        "freelance",
        "clients",
        "missions",
        "professional goals",
        "career goals",
        "professional project",
        "professional experience",
    ]);
}

function isFutureQuestion(question) {
    return hasAny(question, [
        "avenir",
        "futur",
        "dans le futur",
        "pour l avenir",
        "pour l'avenir",
        "plus tard",
        "a long terme",
        "à long terme",
        "prochaines annees",
        "prochaines années",
        "future",
        "future plans",
        "in the future",
        "long term",
    ]);
}

function getGoalsResponse(question) {
    const isEnglish = hasAny(question, [
        "future",
        "future plans",
        "professional goal",
        "professional goals",
        "career",
        "career goals",
        "professional development",
        "developer goals",
        "development goals",
        "in the future",
    ]);

    const language = isEnglish
        ? knowledgeBase.goals.en
        : knowledgeBase.goals.fr;

    if (isDevelopmentGoalQuestion(question)) {
        return language.development || language.general;
    }

    if (isCybersecurityQuestion(question)) {
        return language.cybersecurity || language.general;
    }

    if (isProfessionalGoalQuestion(question)) {
        return language.professional || language.general;
    }

    if (isFutureQuestion(question)) {
        return language.future || language.general;
    }

    return language.general;
}

/* =========================================================
   PROFIL
========================================================= */

function getProfileResponse(question) {
    const isEnglish = hasAny(question, [
        "who is frejus",
        "who is fréjus",
        "tell me about frejus",
        "tell me about fréjus",
        "about frejus",
        "about fréjus",
        "profile",
        "in english",
    ]);

    if (isEnglish && knowledgeBase.profile.en) {
        return knowledgeBase.profile.en;
    }

    return knowledgeBase.profile.fr || knowledgeBase.profile.en;
}

/* =========================================================
   FORMATION
========================================================= */

function isFormationQuestion(question) {
    return hasAny(question, [
        "formation",
        "etudes",
        "études",
        "etudie",
        "étudie",
        "ecole",
        "école",
        "universite",
        "université",
        "iatf",
        "systeme informatique",
        "système informatique",
        "logiciel",
        "deuxieme annee",
        "deuxième année",
        "2e annee",
        "2e année",
        "student",
        "studies",
        "education",
    ]);
}

function getFormationResponse(question) {
    const isEnglish = hasAny(question, [
        "studies",
        "student",
        "education",
        "school",
        "university",
        "degree",
        "in english",
    ]);

    if (isEnglish && knowledgeBase.profile.formationEn) {
        return knowledgeBase.profile.formationEn;
    }

    if (knowledgeBase.profile.formationFr) {
        return knowledgeBase.profile.formationFr;
    }

    return knowledgeBase.profile.fr || knowledgeBase.profile.en;
}

/* =========================================================
   PROJETS
========================================================= */

function isProjectsQuestion(question) {
    return hasAny(question, [
        "projet",
        "projets",
        "project",
        "projects",
        "application",
        "applications",
        "realisation",
        "réalisation",
        "realisations",
        "réalisations",
        "portfolio",
        "campuslib",
        "myinter",
        "orienter education",
        "orienter éducation",
        "programmation web",
        "todo",
        "flutter",
    ]);
}

function getProjectsResponse(question) {
    const isEnglish = hasAny(question, [
        "projects",
        "project",
        "in english",
        "what has he built",
        "what did he build",
    ]);

    if (isEnglish && knowledgeBase.projects.en) {
        return knowledgeBase.projects.en;
    }

    return knowledgeBase.projects.fr || knowledgeBase.projects.en;
}

/* =========================================================
   PARCOURS
========================================================= */

function isParcoursQuestion(question) {
    return hasAny(question, [
        "parcours",
        "experience",
        "expérience",
        "timeline",
        "etapes",
        "étapes",
        "chemin",
        "evolution",
        "évolution",
        "career path",
        "background",
    ]);
}

function getParcoursResponse(question) {
    const isEnglish = hasAny(question, [
        "career path",
        "background",
        "timeline",
        "experience",
        "in english",
    ]);

    if (isEnglish && knowledgeBase.parcours.en) {
        return knowledgeBase.parcours.en;
    }

    return knowledgeBase.parcours.fr || knowledgeBase.parcours.en;
}

/* =========================================================
   CONTACT / RÉSEAUX SOCIAUX
========================================================= */

function isContactQuestion(question) {
    return hasAny(question, [
        "contact",
        "contacter",
        "contacter frejus",
        "contacter fréjus",
        "joindre",
        "joindre frejus",
        "email",
        "mail",
        "adresse mail",
        "telephone",
        "téléphone",
        "numero",
        "numéro",
        "whatsapp",
        "linkedin",
        "github",
        "instagram",
        "facebook",
        "social",
        "reseaux sociaux",
        "réseaux sociaux",
    ]);
}

function getContactResponse(question) {
    const normalized = normalize(question);
    const contact = knowledgeBase.contact;

    if (hasAny(normalized, ["github"])) {
        return `### GitHub

Tu peux retrouver les projets et le code de Fréjus sur son profil GitHub :

${markdownLink(
    "GitHub de Fréjus",
    contact.github || "https://github.com/frejus-1/"
)}`;
    }

    if (hasAny(normalized, ["linkedin"])) {
        return `### LinkedIn

Tu peux retrouver le profil professionnel de Fréjus sur LinkedIn :

${markdownLink(
    "LinkedIn de Fréjus",
    contact.linkedin ||
        "https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/"
)}`;
    }

    if (hasAny(normalized, ["instagram"])) {
        if (contact.instagram) {
            return `### Instagram

${markdownLink("Instagram de Fréjus", contact.instagram)}`;
        }

        return `### Instagram

Le lien Instagram de Fréjus n'est pas encore renseigné dans la base de connaissances.`;
    }

    if (hasAny(normalized, ["facebook"])) {
        if (contact.facebook) {
            return `### Facebook

${markdownLink("Facebook de Fréjus", contact.facebook)}`;
        }

        return `### Facebook

Le lien Facebook de Fréjus n'est pas encore renseigné dans la base de connaissances.`;
    }

    if (hasAny(normalized, ["whatsapp"])) {
        if (contact.whatsapp) {
            return `### WhatsApp

Tu peux contacter Fréjus directement sur WhatsApp :

${markdownLink("Contacter Fréjus sur WhatsApp", contact.whatsapp)}`;
        }

        return `### WhatsApp

Le lien WhatsApp de Fréjus n'est pas encore renseigné dans la base de connaissances.`;
    }

    if (hasAny(normalized, ["email", "mail", "adresse mail"])) {
        if (contact.email) {
            return `### Email

Tu peux contacter Fréjus par email :

${markdownLink("Envoyer un email à Fréjus", `mailto:${contact.email}`)}`;
        }

        return `### Email

L'adresse email de contact de Fréjus n'est pas encore renseignée dans la base de connaissances.`;
    }

    if (contact.fr) {
        return contact.fr;
    }

    return contact.en;
}

/* =========================================================
   PORTFOLIO
========================================================= */

function isPortfolioQuestion(question) {
    return hasAny(question, [
        "portfolio",
        "site",
        "site web",
        "website",
        "portfolio de frejus",
        "portfolio de fréjus",
        "son portfolio",
        "lien du portfolio",
        "url du portfolio",
    ]);
}

function getPortfolioResponse(question) {
    const isEnglish = hasAny(question, [
        "website",
        "portfolio",
        "portfolio link",
        "portfolio url",
        "in english",
    ]);

    if (isEnglish) {
        return `## Fréjus' portfolio

You are currently viewing Fréjus' personal portfolio.

It presents his profile, skills, projects, professional journey and contact information.`;
    }

    return `## Portfolio de Fréjus

Tu es actuellement sur le portfolio personnel de Fréjus.

Il présente notamment son profil, ses compétences, ses projets, son parcours et ses informations de contact.`;
}

/* =========================================================
   OBJECTIFS SIMPLES
========================================================= */

function isSimpleGoalsQuestion(question) {
    return hasAny(question, [
        "que veut faire frejus",
        "que veut faire fréjus",
        "que souhaite faire frejus",
        "que souhaite faire fréjus",
        "que veut devenir frejus",
        "que veut devenir fréjus",
        "que souhaite devenir frejus",
        "que souhaite devenir fréjus",
        "quels sont les projets de frejus",
        "quels sont les projets de fréjus",
        "quels sont ses objectifs",
        "quel est son objectif",
        "quelles sont ses ambitions",
        "quelle est son ambition",
    ]);
}

/* =========================================================
   ROUTEUR PRINCIPAL
========================================================= */

export function queryKnowledge(message) {
    const question = normalize(message);

    if (!question) {
        return {
            found: false,
            reply: null,
        };
    }

    /* -----------------------------------------------------
       CONTACT / RÉSEAUX
       Priorité élevée pour éviter les mauvaises détections.
    ----------------------------------------------------- */

    if (isContactQuestion(question)) {
        return {
            found: true,
            reply: getContactResponse(question),
        };
    }

    /* -----------------------------------------------------
       EXPERTISE CYBERSÉCURITÉ
       Doit passer avant la réponse générale cybersécurité.
    ----------------------------------------------------- */

    if (isCybersecurityExpertiseQuestion(question)) {
        return {
            found: true,
            reply: getCybersecurityExpertiseResponse(question),
        };
    }

    /* -----------------------------------------------------
       CYBERSÉCURITÉ
    ----------------------------------------------------- */

    if (isCybersecurityQuestion(question)) {
        return {
            found: true,
            reply: getCybersecurityResponse(question),
        };
    }

    /* -----------------------------------------------------
       OBJECTIFS
    ----------------------------------------------------- */

    if (isSimpleGoalsQuestion(question)) {
        return {
            found: true,
            reply: getGoalsResponse(question),
        };
    }

    if (isGoalsQuestion(question)) {
        return {
            found: true,
            reply: getGoalsResponse(question),
        };
    }

    /* -----------------------------------------------------
       IDENTITÉ / PROFIL
    ----------------------------------------------------- */

    if (
        hasAny(question, [
            "qui est frejus",
            "qui est fréjus",
            "qui es frejus",
            "qui es fréjus",
            "parle moi de frejus",
            "parle moi de fréjus",
            "presente frejus",
            "présente fréjus",
            "présente frejus",
            "profil de frejus",
            "profil de fréjus",
            "a propos de frejus",
            "à propos de fréjus",
            "about frejus",
            "about fréjus",
        ])
    ) {
        return {
            found: true,
            reply: getProfileResponse(question),
        };
    }

    /* -----------------------------------------------------
       FORMATION
    ----------------------------------------------------- */

    if (isFormationQuestion(question)) {
        return {
            found: true,
            reply: getFormationResponse(question),
        };
    }

    /* -----------------------------------------------------
       COMPÉTENCES
    ----------------------------------------------------- */

    if (isSkillsQuestion(question)) {
        return {
            found: true,
            reply: getSkillsResponse(question),
        };
    }

    /* -----------------------------------------------------
       PROJETS
    ----------------------------------------------------- */

    if (isProjectsQuestion(question)) {
        return {
            found: true,
            reply: getProjectsResponse(question),
        };
    }

    /* -----------------------------------------------------
       PARCOURS
    ----------------------------------------------------- */

    if (isParcoursQuestion(question)) {
        return {
            found: true,
            reply: getParcoursResponse(question),
        };
    }

    /* -----------------------------------------------------
       PORTFOLIO
    ----------------------------------------------------- */

    if (isPortfolioQuestion(question)) {
        return {
            found: true,
            reply: getPortfolioResponse(question),
        };
    }

    /* -----------------------------------------------------
       BUTS / OBJECTIFS GÉNÉRAUX
    ----------------------------------------------------- */

    if (
        hasAny(question, [
            "but",
            "buts",
            "objectif",
            "objectifs",
            "ambition",
            "ambitions",
            "avenir",
        ])
    ) {
        return {
            found: true,
            reply: getGoalsResponse(question),
        };
    }

    /* -----------------------------------------------------
       AUCUNE CONNAISSANCE LOCALE
    ----------------------------------------------------- */

    return {
        found: false,
        reply: null,
    };
}

export default queryKnowledge;

