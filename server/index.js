/**
 * GoodVibe Order API Server
 * --------------------------
 * Lightweight Express server that exposes a single endpoint:
 *
 *   POST /api/orders
 *     – Receives order data from the React frontend checkout.
 *     – Appends the order to a Google Sheet via the Google Sheets API.
 *     – Returns JSON { success: true, orderId } on success.
 *
 * RUNNING THE SERVER
 * ==================
 * 1. Install dependencies:
 *      cd server && npm install
 *
 * 2. Copy the example env file and fill in your credentials:
 *      cp ../.env.example .env
 *      # Then edit .env with your Google Sheets credentials
 *
 * 3. Start the server:
 *      npm start          (production)
 *      npm run dev        (development – auto-restarts on changes)
 *
 * 4. The server runs on port 3001 by default.
 *    Update VITE_API_URL in the frontend .env to point to it:
 *      VITE_API_URL=http://localhost:3001
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { appendOrderToSheet } from './services/googleSheets.js'

const app = express()
const PORT = process.env.PORT || 3001

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Allow requests from the Vite dev server and the production frontend domain
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, methods: ['POST', 'OPTIONS'] }))
app.use(express.json({ limit: '1mb' }))

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ---------------------------------------------------------------------------
// Order submission endpoint
// ---------------------------------------------------------------------------

app.post('/api/orders', async (req, res) => {
  const order = req.body

  // Basic validation – the frontend already validates, but we guard here too
  const required = ['id', 'fullName', 'phone', 'wilaya', 'address', 'items', 'total']
  const missing = required.filter(field => !order[field])
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missing.join(', ')}`,
    })
  }

  try {
    await appendOrderToSheet(order)
    console.log(`[Server] Order ${order.id} processed successfully`)
    return res.status(201).json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('[Server] Failed to process order:', err.message)
    // Return 500 but don't expose internal error details to the client
    return res.status(500).json({
      success: false,
      error: 'Failed to record order. Please contact support.',
    })
  }
})

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[Server] GoodVibe order API listening on http://localhost:${PORT}`)
})
