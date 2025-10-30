import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { config } from 'dotenv';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

config();

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api', routes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs on http://localhost:${PORT}/api-docs`);
});
