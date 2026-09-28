import profile from "./profile.js";
import skills from "./skills.js";
import projects from "./projects.js";
import contact from "./contact.js";
import parcours from "./parcours.js";
import cybersecurity from "./cybersecurity.js";

/* =========================================================
   BASE DE CONNAISSANCES
========================================================= */

const knowledgeBase = {
    profile,
    skills,
    projects,
    contact,
    parcours,
    cybersecurity,

    /*
     * Les objectifs sont conservés directement
     * dans la base si ton fichier index.js actuel
     * les définit déjà ici.
     */
    goals: [
        "Développer ses compétences en développement Web et Mobile",
        "Approfondir ses connaissances en développement backend et en architecture logicielle",
        "Créer des applications modernes, utiles et sécurisées",
        "Développer progressivement ses connaissances en sécurité informatique et en cybersécurité",
        "Continuer à apprendre et à acquérir de l'expérience à travers des projets concrets",
        "Évoluer professionnellement dans le domaine de l'informatique",
    ],
};

export default knowledgeBase;
