const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');  // Assurez-vous que le modèle User est bien importé

const router = express.Router();

// Route POST pour créer un compte utilisateur (inscription)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le nouvel utilisateur
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }
});

// Route POST pour vérifier les informations de connexion (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trouver l'utilisateur par son email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Utilisateur non trouvé.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie.', user });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
});

module.exports = router;
