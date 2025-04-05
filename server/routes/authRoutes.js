import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

export default router; 