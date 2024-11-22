const express = require('express');
const http = require('http'); // Nécessaire pour lier HTTP et WebSocket
const WebSocket = require('ws'); // Import de la bibliothèque WebSocket
const mongoose = require('./db'); // Votre fichier de connexion MongoDB
const productRoutes = require('./routes/products');
const config = require('./config');

const app = express();
const server = http.createServer(app); // Crée un serveur HTTP pour Express

// Configurer le serveur WebSocket
const wss = new WebSocket.Server({ server });

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
  console.log('Client connecté via WebSocket');

  ws.on('close', () => {
    console.log('Client déconnecté');
  });
});

// Fonction pour diffuser les mises à jour aux clients connectés
function broadcastUpdate(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data)); // Diffuser les données en JSON
    }
  });
}

// Rendre la fonction `broadcastUpdate` disponible pour les autres fichiers
app.set('broadcastUpdate', broadcastUpdate);

// Middleware
app.use(express.json());
app.use('/api/products', productRoutes);

// Démarrage du serveur
server.listen(config.PORT, () => {
  console.log(`Serveur démarré sur le port ${config.PORT}`);
});
