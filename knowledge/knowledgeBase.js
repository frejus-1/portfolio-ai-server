// ==========================================
// BASE DE CONNAISSANCES LOCALE
// Portfolio de Fréjus Adjanohoun
// ==========================================

const knowledgeBase = {
    profile: {
        name: "Fréjus Adjanohoun",
        profession: "Développeur Full Stack Web & Mobile",
        field: "Système Informatique et Logiciel",
        level: "Deuxième année",
        mainDomain: "Développement Web et Mobile",

        description:
            "Fréjus Adjanohoun est étudiant en deuxième année en Système Informatique et Logiciel. Il développe progressivement son profil de développeur Full Stack Web & Mobile à travers des projets personnels et académiques.",

        specialties: [
            "Développement Web",
            "Développement Mobile",
            "Frontend",
            "Backend",
            "API REST",
            "Bases de données",
            "Architecture logicielle",
        ],
    },

    skills: {
        frontend: [
            "React",
            "JavaScript",
            "HTML",
            "CSS",
            "Vite",
        ],

        mobile: [
            "Flutter",
            "Dart",
        ],

        backend: [
            "Laravel",
            "Spring Boot",
            "Java",
        ],

        database: [
            "MySQL",
        ],

        tools: [
            "Git",
            "GitHub",
            "VS Code",
            "REST API",
            "JWT",
            "Maven",
            "npm",
        ],
    },

    projects: [
        {
            id: "portfolio",
            name: "Portfolio personnel",
            type: "Frontend",

            technologies: [
                "React",
                "Vite",
                "JavaScript",
                "CSS",
            ],

            description:
                "Portfolio personnel de Fréjus présentant son profil, son parcours, ses compétences, ses projets, ses coordonnées et son assistant IA.",

            features: [
                "Présentation du profil",
                "Parcours",
                "Compétences",
                "Projets",
                "Contact",
                "CV",
                "Réseaux professionnels",
                "Assistant IA",
            ],

            url:
                "https://portfolio-frejus.vercel.app/",
        },

        {
            id: "campuslib",
            name: "CampusLib",
            type: "Frontend",

            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
            ],

            description:
                "CampusLib est un projet de bibliothèque universitaire développé dans le cadre de la programmation Web.",

            features: [
                "Catalogue de livres",
                "Recherche de livres",
                "Filtrage",
                "Disponibilité des livres",
                "Gestion des comptes",
                "Connexion",
                "Inscription",
                "Emprunt de livres",
                "Mode sombre",
                "Interface responsive",
            ],

            github:
                "https://github.com/frejus-1/campuslib-site",

            url:
                "https://frejus-1.github.io/campuslib-site/",
        },

        {
            id: "programmation-web",
            name: "Programmation Web",
            type: "Frontend",

            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
            ],

            description:
                "Projet de développement Web réalisé dans le cadre de la programmation Web.",

            url:
                "https://programmation-web-five.vercel.app/",
        },

        {
            id: "orienter-education",
            name: "Orienter Education",
            type: "Full Stack",

            technologies: [
                "Spring Boot",
                "Java",
                "React",
                "MySQL",
                "JWT",
            ],

            description:
                "Orienter Education est une plateforme d'orientation destinée aux étudiants.",

            features: [
                "Création de comptes",
                "Authentification",
                "Test d'orientation",
                "Recommandations de filières",
                "Gestion des établissements",
                "Fonctionnalités administratives",
            ],
        },

        {
            id: "myinter",
            name: "MyInter",
            type: "Backend",

            technologies: [
                "Laravel",
                "PHP",
                "MySQL",
            ],

            description:
                "MyInter est un projet backend développé avec Laravel, PHP et MySQL.",
        },

        {
            id: "todo",
            name: "Application Todo",
            type: "Mobile",

            technologies: [
                "Flutter",
                "Dart",
            ],

            description:
                "Application Todo mobile développée avec Flutter et Dart.",
        },
    ],

    parcours: {
        current:
            "Fréjus est actuellement étudiant en deuxième année dans le domaine des Systèmes Informatiques et Logiciels.",

        areas: [
            "Développement Web",
            "Développement Mobile",
            "Programmation",
            "Bases de données",
            "Architectures logicielles",
            "Frontend",
            "Backend",
            "Création d'API",
            "Conception d'applications",
        ],

        progression:
            "Fréjus développe progressivement son profil de développeur Full Stack Web & Mobile grâce à des projets personnels, des projets académiques et la pratique de différentes technologies.",
    },

    goals: [
        "Développer ses compétences techniques",
        "Créer des applications concrètes",
        "Approfondir le développement Web",
        "Approfondir le développement Mobile",
        "Travailler sur des architectures frontend/backend",
        "Développer des API",
        "Apprendre de nouvelles technologies",
    ],

    contact: {
        email: "f2987319@gmail.com",

        whatsapp:
            "https://wa.me/2290152905310",

        github:
            "https://github.com/frejus-1/",

        linkedin:
            "https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/",

        facebook:
            "https://www.facebook.com/frejus.adjanohoun.5/",

        instagram:
            "https://www.instagram.com/adjanohounf/",

        portfolio:
            "https://portfolio-frejus.vercel.app/",
    },
};


// ==========================================
// NORMALISATION
// ==========================================

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[?!.,;:()[\]{}"'`]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ==========================================
// UTILITAIRES
// ==========================================

function hasAny(text, words) {
    return words.some((word) => text.includes(word));
}

function markdownLink(label, url) {
    return `[${label}](${url})`;
}


// ==========================================
// RÉPONSE PROFIL
// ==========================================

function getProfileResponse() {
    const { profile, skills, projects } = knowledgeBase;

    const mainSkills = [
        ...skills.frontend,
        ...skills.mobile,
        ...skills.backend,
    ];

    const importantProjects = projects
        .slice(0, 4)
        .map((project) => project.name)
        .join(", ");

    return `## Fréjus Adjanohoun

Fréjus est un **${profile.profession}**, actuellement étudiant en **${profile.level}** dans le domaine du **${profile.field}**.

Il se spécialise progressivement dans le **développement Web et Mobile**, avec des compétences en frontend, backend, bases de données et création d'API.

Ses principales technologies comprennent **${mainSkills.join(", ")}**.

Parmi ses projets figurent notamment **${importantProjects}**.`;
}


// ==========================================
// COMPÉTENCES
// ==========================================

function getSkillsResponse() {
    const { skills } = knowledgeBase;

    return `## Compétences techniques

### Frontend

${skills.frontend.map((item) => `- ${item}`).join("\n")}

### Mobile

${skills.mobile.map((item) => `- ${item}`).join("\n")}

### Backend

${skills.backend.map((item) => `- ${item}`).join("\n")}

### Bases de données

${skills.database.map((item) => `- ${item}`).join("\n")}

### Outils et technologies

${skills.tools.map((item) => `- ${item}`).join("\n")}`;
}


// ==========================================
// PROJETS
// ==========================================

function getProjectsResponse() {
    const { projects } = knowledgeBase;

    const content = projects
        .map((project) => {
            const features = project.features?.length
                ? `\n\n**Fonctionnalités :**\n${project.features
                      .map((feature) => `- ${feature}`)
                      .join("\n")}`
                : "";

            const links = [
                project.github
                    ? markdownLink("GitHub", project.github)
                    : null,

                project.url
                    ? markdownLink("Voir le projet", project.url)
                    : null,
            ]
                .filter(Boolean)
                .join(" · ");

            return `### ${project.name}

**Type :** ${project.type}

**Technologies :** ${project.technologies.join(", ")}

${project.description}${features}

${links}`;
        })
        .join("\n\n");

    return `## Projets de Fréjus

${content}`;
}


// ==========================================
// CONTACT
// ==========================================

function getContactResponse() {
    const { contact } = knowledgeBase;

    return `## Contacter Fréjus

- 📧 ${markdownLink(
        contact.email,
        `mailto:${contact.email}`
    )}
- 💬 ${markdownLink(
        "WhatsApp",
        contact.whatsapp
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


// ==========================================
// PARCOURS
// ==========================================

function getParcoursResponse() {
    const { parcours } = knowledgeBase;

    return `## Parcours

${parcours.current}

### Domaines étudiés

${parcours.areas
    .map((area) => `- ${area}`)
    .join("\n")}

${parcours.progression}`;
}


// ==========================================
// RECHERCHE LOCALE
// ==========================================

export function queryKnowledge(message) {
    const question = normalize(message);

    // ------------------------------------------
    // PROFIL / IDENTITÉ
    // ------------------------------------------

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


    // ------------------------------------------
    // FORMATION
    // ------------------------------------------

    if (
        hasAny(question, [
            "formation",
            "etude",
            "etudes",
            "niveau detude",
            "niveau scolaire",
            "ecole",
            "etudiant",
            "etudie",
        ])
    ) {
        const { profile } = knowledgeBase;

        return {
            found: true,

            reply: `## Formation

Fréjus est actuellement en **${profile.level}** dans le domaine des **${profile.field}**.

Sa formation couvre notamment :

- développement Web
- développement Mobile
- programmation
- bases de données
- architectures logicielles
- développement frontend
- développement backend
- création d'API
- conception d'applications`,
        };
    }


    // ------------------------------------------
    // COMPÉTENCES
    // ------------------------------------------

    if (
        hasAny(question, [
            "competence",
            "competences",
            "technologie",
            "technologies",
            "techno",
            "stack",
            "langage",
            "framework",
            "maitrise",
            "maitrises",
        ])
    ) {
        return {
            found: true,
            reply: getSkillsResponse(),
        };
    }


    // ------------------------------------------
    // PROJETS
    // ------------------------------------------

    if (
        hasAny(question, [
            "projet",
            "projets",
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


    // ------------------------------------------
    // PARCOURS
    // ------------------------------------------

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


    // ------------------------------------------
    // GITHUB
    // ------------------------------------------

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


    // ------------------------------------------
    // LINKEDIN
    // ------------------------------------------

    if (question.includes("linkedin")) {
        return {
            found: true,

            reply: markdownLink(
                "LinkedIn de Fréjus",
                knowledgeBase.contact.linkedin
            ),
        };
    }


    // ------------------------------------------
    // INSTAGRAM
    // ------------------------------------------

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


    // ------------------------------------------
    // FACEBOOK
    // ------------------------------------------

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


    // ------------------------------------------
    // WHATSAPP
    // ------------------------------------------

    if (question.includes("whatsapp")) {
        return {
            found: true,

            reply: markdownLink(
                "Contacter Fréjus sur WhatsApp",
                knowledgeBase.contact.whatsapp
            ),
        };
    }


    // ------------------------------------------
    // EMAIL
    // ------------------------------------------

    if (
        hasAny(question, [
            "email",
            "e mail",
            "mail",
            "adresse email",
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


    // ------------------------------------------
    // CONTACT
    // ------------------------------------------

    if (
        hasAny(question, [
            "contact",
            "contacter",
            "joindre",
            "contacter frejus",
            "comment contacter",
        ])
    ) {
        return {
            found: true,
            reply: getContactResponse(),
        };
    }


    // ------------------------------------------
    // PORTFOLIO
    // ------------------------------------------

    if (
        hasAny(question, [
            "portfolio",
            "site",
            "site web",
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


    // ------------------------------------------
    // OBJECTIFS
    // ------------------------------------------

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


    // ------------------------------------------
    // AUCUNE RÉPONSE LOCALE
    // ------------------------------------------

    return {
        found: false,
        reply: null,
    };
}


export default knowledgeBase;