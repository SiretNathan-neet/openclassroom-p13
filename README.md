Your Car Your Way - PoC Chat temps réel

PoC réalisé dans le cadre du projet "Définissez une solution fonctionnelle" (formation développeur full-stack, ORION). Il démontre la faisabilité d'un mécanisme de chat temps réel (client ↔ agent) via WebSocket/STOMP, avec persistance en base de données — sans authentification, hors périmètre volontairement exclu de cette itération.

récupérer une version en local via la commande "git clone https://github.com/SiretNathan-neet/openclassroom-p13.git"

# Backend

Java 21, Spring Boot 4.0.7, Maven

# Frontend

Angular 21 (LTS), composants standalone, signals — sans routing
SCSS, police Montserrat
@stomp/stompjs + sockjs-client pour la connexion WebSocket

# Structure du repository

openclassroom-p13/
├── backend/     API Spring Boot
└── frontend/    Application Angular

# Prérequis

Java 21
Node.js ≥ 24 et npm
MySQL (instance locale)
Un client SQL (DBeaver ou équivalent) pour exécuter le script de base de données

# Installation et mise en route

1. Base de données

Exécute le script SQL du PoC sur une instance MySQL locale

2. Mise en route du backend 

--bash--
cd backend
--    --

crée un fichier 'src/main/resources/application-local.properties' : 

spring.datasource.url=jdbc:mysql://localhost:3306/your_car_your_way_poc
spring.datasource.username=<ton_nom_utilisateur>
spring.datasource.password=<ton_mot_de_passe_mysql>

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

--bash-- 
./mvnw spring-boot:run
--    --

3. Mise en route du frontend

Installation de Numpy : 

--bash--
cd frontend
npm install
--    --

une fois l'installation effectué : 

--bash--
ng serve
--    --

Ouvrir 'http://localhost:4200'

Enjoy !