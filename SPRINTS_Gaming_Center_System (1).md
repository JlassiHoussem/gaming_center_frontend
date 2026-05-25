# 🎮 Gaming Center System — Plan de Sprints

> **Stack :** Angular 17 + Tailwind CSS · Spring Boot 3.2 (port **8084**) · MySQL 8
> **Méthodologie :** Agile / Scrum — Sprints de 2 semaines
> **Ordre :** Frontend → Backend → Sécurité (dernier)

---

## 📋 Vue d'Ensemble des Sprints

| Sprint | Domaine | Focus | Durée |
|--------|---------|-------|-------|
| Sprint 1 | Frontend | Setup projet, Layout global, thème Gaming | 2 semaines |
| Sprint 2 | Frontend | Dashboard & Gestion des Appareils (UI) | 2 semaines |
| Sprint 3 | Frontend | Buffet, Dépenses & Shifts (UI) | 2 semaines |
| Sprint 4 | Frontend | Rapports, Analytics & Paramètres (UI) | 2 semaines |
| Sprint 5 | Backend | Setup projet, Modèle de données, API Appareils | 2 semaines |
| Sprint 6 | Backend | API Buffet, Dépenses & Sessions | 2 semaines |
| Sprint 7 | Backend | API Shifts & Rapports + Intégration Frontend | 2 semaines |
| Sprint 8 | Sécurité | Auth JWT, Spring Security, Rôles | 2 semaines |

---

## 🖥️ PHASE 1 — FRONTEND (Sprints 1–4)

---

### 🟣 Sprint 1 — Setup Frontend & Layout Gaming

**Objectif :** Initialiser le projet Angular, configurer Tailwind avec le thème gaming, créer le layout principal et les composants de base.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-F01 | Développeur | Initialiser un projet Angular 17 | `ng new` réussi, routing configuré, structure de dossiers clean |
| US-F02 | Développeur | Configurer Tailwind CSS avec thème gaming | Palette violet/indigo/cyan/noir fonctionnelle, classes custom disponibles |
| US-F03 | Utilisateur | Voir un layout avec sidebar de navigation | Sidebar avec icônes, liens vers toutes les pages, responsive |
| US-F04 | Utilisateur | Naviguer entre les pages sans rechargement | Angular Router configuré avec lazy loading |
| US-F05 | Développeur | Avoir des composants UI réutilisables | Card, Button, Badge, Modal, Spinner créés dans un SharedModule |

#### Tâches Techniques

- [ ] `ng new gaming-center-frontend --routing --style=css`
- [ ] Installer et configurer `tailwindcss`, `@tailwindcss/forms`
- [ ] Définir le thème gaming dans `tailwind.config.js` :
  ```js
  // Couleurs gaming
  colors: {
    gaming: {
      purple: '#7C3AED',
      indigo: '#4F46E5',
      dark: '#0F0A1E',
      darker: '#07040F',
      cyan: '#06B6D4',
      glow: '#8B5CF6',
    }
  }
  ```
- [ ] Créer la structure de dossiers :
  ```
  src/app/
  ├── core/          # Services, interceptors, guards
  ├── shared/        # Composants réutilisables, pipes
  ├── features/      # Modules fonctionnels
  │   ├── dashboard/
  │   ├── appareils/
  │   ├── buffet/
  │   ├── depenses/
  │   ├── rapports/
  │   └── parametres/
  └── layout/        # Sidebar, Topbar, Shell
  ```
- [ ] Créer `LayoutComponent` avec sidebar dark gaming
- [ ] Créer les routes principales (lazy loaded)
- [ ] Créer `SharedModule` avec : `CardComponent`, `ButtonComponent`, `BadgeComponent`, `ModalComponent`, `LoadingSpinnerComponent`
- [ ] Configurer `HttpClientModule` et service HTTP de base
- [ ] Configurer `environment.ts` : `apiUrl: 'http://localhost:8084/api'`
- [ ] Appliquer effets néon CSS (box-shadow glow) sur les éléments actifs

#### Livrables
- ✅ Projet Angular fonctionnel avec thème gaming
- ✅ Layout principal avec sidebar et navigation
- ✅ Bibliothèque de composants réutilisables
- ✅ Configuration Tailwind gaming complète

---

### 🟣 Sprint 2 — Dashboard & Gestion des Appareils (UI)

**Objectif :** Développer le tableau de bord principal et les écrans de gestion des appareils avec données mockées.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-F06 | Gérant | Voir les KPIs du shift sur le dashboard | Cartes avec revenus totaux, appareils actifs, ventes buffet, bénéfice net |
| US-F07 | Gérant | Voir le statut de chaque appareil en temps réel | Grille d'appareils avec couleurs de statut (vert=libre, rouge=occupé, gris=maintenance) |
| US-F08 | Employé | Démarrer une session sur un appareil depuis le dashboard | Clic → modal de démarrage → chronomètre visible sur la carte |
| US-F09 | Employé | Arrêter une session et voir le montant dû | Bouton stop → affichage du calcul temps × tarif → confirmation |
| US-F10 | Admin | Ajouter un nouvel appareil | Formulaire : nom, type, tarif/heure → validation → ajout à la grille |
| US-F11 | Admin | Modifier ou supprimer un appareil | Actions via menu contextuel ou icônes sur la carte appareil |

#### Tâches Techniques

- [ ] `DashboardComponent` :
  - KPI Cards (revenus, appareils actifs, total buffet, bénéfice) avec animations de compteur
  - Grille responsive des appareils (card par appareil)
  - Indicateur de statut avec effet glow coloré
  - Chronomètre en temps réel via `setInterval` (données mockées)
- [ ] `AppareilsComponent` :
  - Liste/grille des appareils avec filtres (tous, actifs, libres, maintenance)
  - `AppareilCardComponent` : affichage nom, type, tarif, statut, durée session en cours
  - Bouton "Démarrer Session" / "Arrêter Session" conditionnel
- [ ] `AppareilFormComponent` (modal) :
  - Champs : Nom, Type (dropdown : PC, PS4, PS5, Xbox, Simulateur), Tarif horaire
  - Validation Angular Reactive Forms
- [ ] `SessionModalComponent` :
  - Démarrage : affichage de l'heure de début, chrono
  - Arrêt : calcul temps écoulé, montant à payer, bouton encaisser
- [ ] Service `AppareilService` avec méthodes retournant des données mockées (en-tête HTTP prêt pour API)
- [ ] Animations Tailwind : `transition`, `hover:scale-105`, glow sur hover des cards
- [ ] Tests unitaires des composants (jasmine)

#### Livrables
- ✅ Dashboard avec KPIs animés et grille d'appareils interactive
- ✅ Gestion complète des appareils (CRUD) avec modales
- ✅ Chronomètre de session fonctionnel (mode mock)

---

### 🟣 Sprint 3 — Buffet, Dépenses & Gestion des Shifts (UI)

**Objectif :** Développer les interfaces du buffet (caisse), des dépenses et de la gestion des shifts.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-F12 | Employé | Voir le catalogue des produits du buffet | Grille de produits avec photo, nom, prix, catégorie |
| US-F13 | Employé | Ajouter des produits à un panier de commande | Clic produit → ajout panier → compteur quantité, total mis à jour |
| US-F14 | Employé | Encaisser une commande buffet | Bouton "Encaisser" → confirmation → panier vidé, vente enregistrée |
| US-F15 | Admin | Gérer le catalogue (ajout/modif/suppression produits) | Formulaire produit : nom, catégorie, prix, image URL, statut actif |
| US-F16 | Gérant | Saisir une dépense pour le shift en cours | Formulaire : libellé + montant → ajout à la liste + mise à jour total |
| US-F17 | Gérant | Voir toutes les dépenses du shift avec le total | Tableau des dépenses avec total dynamique |
| US-F18 | Gérant | Fermer le shift avec résumé complet | Modal de fermeture avec récapitulatif : revenus, dépenses, bénéfice |
| US-F19 | Gérant | Ouvrir un nouveau shift | Action "Nouveau Shift" avec remise à zéro des compteurs |

#### Tâches Techniques

- [ ] `BuffetComponent` :
  - Panneau gauche : catalogue produits (grille avec cards)
  - Panneau droit : panier de commande en cours
  - Filtres par catégorie (boissons, snacks, repas...)
  - `ProduitCardComponent` avec bouton +/-
  - `PanierComponent` : liste items, quantités, sous-totaux, total global
  - `EncaissementModalComponent` : total à payer, confirmation
- [ ] `ProduitFormComponent` :
  - Reactive Form : nom, catégorie, prix, imageUrl, actif (toggle)
  - Preview de l'image en temps réel
- [ ] `DepensesComponent` :
  - Formulaire rapide d'ajout (libellé + montant)
  - Tableau des dépenses avec actions (supprimer)
  - Total en bas de tableau avec fond coloré
- [ ] `ShiftComponent` :
  - Barre de statut du shift en cours (heure d'ouverture, durée)
  - `FermerShiftModalComponent` : tableau de bord de clôture
  - Bouton "Nouveau Shift" avec dialogue de confirmation
- [ ] Services mockés : `BuffetService`, `DepenseService`, `ShiftService`
- [ ] Gestion d'état locale avec `BehaviorSubject` pour panier et totaux

#### Livrables
- ✅ Interface caisse buffet complète et fonctionnelle (mode mock)
- ✅ Gestion des dépenses avec calcul en temps réel
- ✅ Workflow complet ouverture/fermeture de shift

---

### 🟣 Sprint 4 — Rapports, Analytics & Paramètres (UI)

**Objectif :** Développer les écrans de reporting avec graphiques et l'écran de paramètres.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-F20 | Gérant | Voir un rapport hebdomadaire | Sélection "7 jours" → graphiques + tableau synthétique |
| US-F21 | Gérant | Voir un rapport mensuel et annuel | Boutons de période → données correspondantes affichées |
| US-F22 | Gérant | Voir les heures d'utilisation par appareil | Graphique barre ou donut : heures totales par appareil |
| US-F23 | Gérant | Voir le top des produits buffet vendus | Graphique + tableau trié par quantité vendue |
| US-F24 | Admin | Configurer les paramètres de l'application | Page settings : nom du gaming center, devises, tarifs par défaut |
| US-F25 | Gérant | Imprimer ou exporter un rapport | Bouton "Imprimer" déclenchant `window.print()` avec CSS print adapté |

#### Tâches Techniques

- [ ] Installer `Chart.js` + `ng2-charts` ou `ngx-charts`
- [ ] `RapportsComponent` :
  - Onglets / boutons de période : Semaine, Mois, Année
  - KPI cards : Total ventes, Total dépenses, Bénéfice net
  - `GraphiqueRevenusComponent` : graphique linéaire revenus dans le temps
  - `GraphiqueAppareilsComponent` : graphique barres heures d'utilisation
  - `GraphiqueBuffetComponent` : donut / camembert répartition ventes buffet
  - Tableau "Top Produits" avec rang et quantité
  - Tableau "Historique des Shifts"
- [ ] `ParametresComponent` :
  - Formulaire : Nom de l'établissement, Devise, Fuseau horaire
  - Section gestion des types d'appareils
  - Section gestion des catégories buffet
  - Bouton "Sauvegarder les paramètres"
- [ ] CSS `@media print` pour impression propre des rapports
- [ ] Service `RapportService` avec données mockées réalistes
- [ ] Résumé de shift avec graphique mini intégré

#### Livrables
- ✅ Rapports hebdo/mensuel/annuel avec graphiques
- ✅ Analytics détaillés appareils et buffet
- ✅ Page de paramètres opérationnelle
- ✅ Impression des rapports

---

## ⚙️ PHASE 2 — BACKEND (Sprints 5–7)

---

### 🟡 Sprint 5 — Setup Backend & API Appareils

**Objectif :** Initialiser le projet Spring Boot sur le port 8084, configurer MySQL, créer le modèle de données et les premiers endpoints.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-B01 | Développeur | Avoir un projet Spring Boot configuré | Application démarrée sur port 8084, connexion MySQL OK |
| US-B02 | Développeur | Avoir toutes les entités JPA créées | Tables auto-créées dans MySQL via Hibernate |
| US-B03 | Frontend | Récupérer la liste des appareils via API | GET /api/devices → JSON array |
| US-B04 | Frontend | Créer / modifier / supprimer un appareil | POST/PUT/DELETE /api/devices fonctionnels |
| US-B05 | Frontend | Démarrer et arrêter une session | POST /api/sessions/start et /stop avec calcul automatique du montant |

#### Tâches Techniques

- [ ] `spring initializr` : Spring Web, Spring Data JPA, MySQL Driver, Lombok, Validation
- [ ] `application.properties` :
  ```properties
  server.port=8084
  spring.datasource.url=jdbc:mysql://localhost:3306/gaming_center
  spring.datasource.username=root
  spring.datasource.password=password
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  ```
- [ ] Entités JPA : `Device`, `Session`, `Product`, `OrderItem`, `Order`, `Expense`, `Shift`
- [ ] Repositories JPA étendant `JpaRepository`
- [ ] Configuration CORS pour `http://localhost:4200`
- [ ] `DeviceController` : CRUD complet `/api/devices`
- [ ] `DeviceService` avec validation métier
- [ ] `SessionController` : `/api/sessions/start/{deviceId}`, `/api/sessions/stop/{sessionId}`
- [ ] `SessionService` : calcul `duree = dateFin - dateDebut`, `montant = duree * tarifHoraire`
- [ ] DTOs (`DeviceDTO`, `SessionDTO`) avec MapStruct ou conversion manuelle
- [ ] Gestion des exceptions avec `@ControllerAdvice`
- [ ] Tests unitaires des services avec Mockito
- [ ] Tests d'intégration des endpoints avec MockMvc

#### Structure du Projet
```
src/main/java/com/gamingcenter/
├── config/          # CORS, Web config
├── controller/      # REST Controllers
├── service/         # Business logic
├── repository/      # JPA Repositories
├── entity/          # JPA Entities
├── dto/             # Data Transfer Objects
└── exception/       # Custom exceptions, handler
```

#### Livrables
- ✅ API Spring Boot opérationnelle sur port 8084
- ✅ Base de données MySQL avec toutes les tables
- ✅ CRUD Appareils + Sessions fonctionnel
- ✅ CORS configuré pour Angular

---

### 🟡 Sprint 6 — API Buffet, Dépenses & Sessions

**Objectif :** Développer les endpoints pour le buffet et les dépenses, puis connecter le frontend Angular aux vraies APIs.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-B06 | Frontend | CRUD des produits buffet | GET/POST/PUT/DELETE /api/products fonctionnels |
| US-B07 | Frontend | Enregistrer une commande buffet | POST /api/orders avec items → calcul total automatique |
| US-B08 | Frontend | CRUD des dépenses | GET/POST/DELETE /api/expenses avec association au shift |
| US-B09 | Frontend | Remplacer les mocks par les vrais appels API | Services Angular connectés au backend réel |
| US-B10 | Développeur | Avoir des données de test initiales | DataInitializer avec 5-10 appareils et produits de test |

#### Tâches Techniques

- [ ] `ProductController` : `/api/products` — CRUD complet
- [ ] `OrderController` : `/api/orders` — création commande avec items
- [ ] `OrderService` : calcul total commande, association au shift actif
- [ ] `ExpenseController` : `/api/expenses` — CRUD avec filtre par shift
- [ ] `ExpenseService` : association automatique au shift en cours
- [ ] `DataInitializer` (`@Component` + `CommandLineRunner`) avec jeu de données de test
- [ ] **Intégration Frontend** :
  - Remplacer les données mockées dans les services Angular par `HttpClient`
  - `AppareilService.getAll()` → `GET /api/devices`
  - `BuffetService.getProducts()` → `GET /api/products`
  - `BuffetService.createOrder()` → `POST /api/orders`
  - `DepenseService.getByShift()` → `GET /api/expenses/shift/{id}`
  - Gestion des erreurs HTTP avec interceptor Angular
  - `LoadingInterceptor` pour afficher le spinner pendant les appels
- [ ] Tests des endpoints avec Postman / tests d'intégration JUnit

#### Livrables
- ✅ API Buffet, Commandes, Dépenses complètes
- ✅ Frontend Angular connecté au backend réel
- ✅ Application end-to-end fonctionnelle (sans auth)

---

### 🟡 Sprint 7 — API Shifts, Rapports & Finalisation

**Objectif :** Compléter les APIs de gestion des shifts et des rapports, finaliser l'intégration et les tests.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-B11 | Gérant | Ouvrir et fermer un shift via API | POST /api/shifts/open et /api/shifts/close fonctionnels |
| US-B12 | Frontend | Récupérer les données du shift actuel | GET /api/shifts/current retourne le shift ouvert |
| US-B13 | Gérant | Obtenir un rapport hebdomadaire via API | GET /api/reports/weekly retourne JSON avec tous les KPIs |
| US-B14 | Gérant | Obtenir des rapports mensuel et annuel | GET /api/reports/monthly et /annual fonctionnels |
| US-B15 | Développeur | Avoir l'application testée et stable | Couverture tests > 70%, zéro erreur critique |

#### Tâches Techniques

- [ ] `ShiftController` :
  - `POST /api/shifts/open` — ouvrir un nouveau shift
  - `GET /api/shifts/current` — shift en cours
  - `POST /api/shifts/close` — fermer le shift (calcul total revenus + dépenses)
  - `GET /api/shifts` — historique des shifts
- [ ] `ShiftService` : logique de clôture (agréger sessions + commandes − dépenses)
- [ ] `ReportController` :
  - `GET /api/reports/weekly` — 7 derniers jours
  - `GET /api/reports/monthly` — 30 derniers jours
  - `GET /api/reports/annual` — 365 derniers jours
- [ ] `ReportService` : requêtes JPA avec `@Query` pour agréger données sur période
- [ ] **DTOs Rapports** : `ReportDTO` avec champs revenus, dépenses, bénéfice, top produits, heures appareils
- [ ] **Intégration Frontend** :
  - `ShiftService` Angular → APIs shift
  - `RapportService` Angular → APIs rapports
  - Graphiques Chart.js alimentés par vraies données
- [ ] Tests d'intégration end-to-end
- [ ] Documentation Swagger/OpenAPI : `springdoc-openapi`
- [ ] Revue du code, nettoyage, optimisation des requêtes N+1

#### Livrables
- ✅ API Shifts et Rapports complètes
- ✅ Application fully integrated et testée
- ✅ Documentation API Swagger disponible sur `http://localhost:8084/swagger-ui.html`

---

## 🔐 PHASE 3 — SÉCURITÉ (Sprint 8)

---

### 🔴 Sprint 8 — Authentification JWT & Gestion des Rôles

**Objectif :** Sécuriser l'application avec Spring Security + JWT, créer la page de connexion et protéger toutes les routes.

**Durée :** 2 semaines

#### User Stories

| ID | En tant que | Je veux | Critère d'acceptation |
|----|-------------|---------|----------------------|
| US-S01 | Utilisateur | Me connecter avec email et mot de passe | POST /api/auth/login retourne un token JWT valide |
| US-S02 | Système | Que toutes les APIs soient protégées | Appel sans token → 401 Unauthorized |
| US-S03 | Admin | Créer des comptes utilisateurs avec rôles | POST /api/auth/register avec rôle ADMIN/GERANT/EMPLOYE |
| US-S04 | Frontend | Voir une page de connexion gaming | Page login avec design gaming, formulaire email + mot de passe |
| US-S05 | Système | Que le token soit envoyé automatiquement | Interceptor Angular injecte le token dans chaque requête HTTP |
| US-S06 | Système | Que les routes Angular soient protégées | Guard Angular redirige vers login si non authentifié |
| US-S07 | Admin | Avoir des accès différents selon le rôle | Employé ne voit pas paramètres, Admin voit tout |

#### Tâches Techniques

**Backend :**
- [ ] Dépendances Maven : `spring-security`, `jjwt-api`, `jjwt-impl`, `jjwt-jackson`
- [ ] `User` entity : id, email, password (BCrypt), role (enum), actif
- [ ] `UserRepository` avec `findByEmail`
- [ ] `JwtService` : génération, validation, extraction du token (expiration 24h)
- [ ] `SecurityConfig` (`@Configuration`) :
  - Désactiver CSRF
  - Autoriser `/api/auth/**` sans token
  - Protéger toutes les autres routes
  - `JwtAuthenticationFilter` comme filtre Spring
- [ ] `AuthController` :
  - `POST /api/auth/login` → `LoginRequest` → JWT + infos user
  - `POST /api/auth/register` → création compte (admin seulement)
  - `POST /api/auth/logout` (optionnel, blacklist token)
- [ ] `AuthService` : vérification credentials, génération token
- [ ] `@PreAuthorize` sur les endpoints sensibles (ex : DELETE appareils → ADMIN seulement)
- [ ] Créer un compte admin par défaut dans `DataInitializer`

**Frontend :**
- [ ] `ConnexionComponent` : formulaire email + mot de passe, design gaming (fond sombre, néon)
- [ ] `AuthService` Angular : login, logout, stockage token, getUserInfo
- [ ] `JwtInterceptor` : ajouter `Authorization: Bearer <token>` à chaque requête HTTP
- [ ] `AuthGuard` : protéger toutes les routes sauf `/connexion`
- [ ] `RoleGuard` : protéger routes admin (ex: `/parametres` → ADMIN uniquement)
- [ ] Gestion de la déconnexion (suppression token, redirection)
- [ ] Affichage conditionnel des menus selon le rôle
- [ ] Gestion expiration token : interceptor → redirection vers login

#### Matrice des Rôles

| Fonctionnalité | Employé | Gérant | Admin |
|---------------|---------|--------|-------|
| Voir dashboard | ✅ | ✅ | ✅ |
| Démarrer/arrêter sessions | ✅ | ✅ | ✅ |
| Gérer buffet (caisse) | ✅ | ✅ | ✅ |
| Saisir dépenses | ❌ | ✅ | ✅ |
| Ouvrir/fermer shift | ❌ | ✅ | ✅ |
| Voir rapports | ❌ | ✅ | ✅ |
| CRUD appareils | ❌ | ❌ | ✅ |
| CRUD produits buffet | ❌ | ❌ | ✅ |
| Paramètres système | ❌ | ❌ | ✅ |
| Gestion utilisateurs | ❌ | ❌ | ✅ |

#### Livrables
- ✅ Authentification JWT complète et sécurisée
- ✅ Page de connexion avec design gaming
- ✅ Toutes les routes protégées (frontend + backend)
- ✅ Gestion des rôles ADMIN / GERANT / EMPLOYE

---

## 📊 Récapitulatif & Planning

```
Semaine  1-2   : Sprint 1 — Setup Frontend + Thème Gaming
Semaine  3-4   : Sprint 2 — Dashboard & Appareils (UI)
Semaine  5-6   : Sprint 3 — Buffet, Dépenses & Shifts (UI)
Semaine  7-8   : Sprint 4 — Rapports & Paramètres (UI)
Semaine  9-10  : Sprint 5 — Setup Backend + API Appareils
Semaine 11-12  : Sprint 6 — API Buffet, Dépenses + Intégration
Semaine 13-14  : Sprint 7 — API Shifts & Rapports + Finalisation
Semaine 15-16  : Sprint 8 — Sécurité JWT & Rôles
```

**Durée totale estimée : 16 semaines (4 mois)**

---

## 🗂️ Structure Finale du Projet

```
gaming-center/
├── frontend/                      # Angular 17
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── services/          # auth.service, api.service
│   │   │   ├── interceptors/      # jwt.interceptor, loading.interceptor
│   │   │   └── guards/            # auth.guard, role.guard
│   │   ├── shared/
│   │   │   └── components/        # card, button, badge, modal, spinner
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── appareils/
│   │   │   ├── buffet/
│   │   │   ├── depenses/
│   │   │   ├── rapports/
│   │   │   ├── parametres/
│   │   │   └── connexion/
│   │   └── layout/
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                       # Spring Boot 3.2 — Port 8084
    └── src/main/java/com/gamingcenter/
        ├── config/                # SecurityConfig, CorsConfig, SwaggerConfig
        ├── controller/            # Device, Session, Product, Order, Expense, Shift, Report, Auth
        ├── service/               # Logique métier
        ├── repository/            # JPA Repositories
        ├── entity/                # Device, Session, Product, Order, Expense, Shift, User
        ├── dto/                   # DTOs + Response objects
        ├── security/              # JwtService, JwtFilter, UserDetailsServiceImpl
        └── exception/             # GlobalExceptionHandler
```

---

## ✅ Définition of Done (DoD)

Chaque sprint est considéré terminé si :

- [ ] Toutes les User Stories du sprint sont implémentées
- [ ] Les tests unitaires passent (couverture ≥ 70%)
- [ ] Aucun bug bloquant ou critique
- [ ] Code reviewé et mergé sur la branche principale
- [ ] Interface testée sur Chrome, Firefox et mobile
- [ ] Documentation à jour (README, commentaires)

---

*Document généré pour Gaming Center System v1.0 — Mai 2026*
