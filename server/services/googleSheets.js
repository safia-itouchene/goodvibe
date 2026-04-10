/**
 * Google Sheets Service
 * ---------------------
 * Handles all interactions with the Google Sheets API using a Service Account.
 *
 * SETUP GUIDE
 * ===========
 * 1. CREATE A GOOGLE SERVICE ACCOUNT
 *    - Go to https://console.cloud.google.com/
 *    - Create a new project (or select an existing one)
 *    - Navigate to "APIs & Services" → "Library"
 *    - Search for "Google Sheets API" and enable it
 *    - Navigate to "APIs & Services" → "Credentials"
 *    - Click "Create Credentials" → "Service Account"
 *    - Fill in the service account details and click "Create"
 *    - Click on the created service account → "Keys" tab → "Add Key" → "Create new key" → JSON
 *    - Download the JSON key file (keep it secret – never commit it!)
 *
 * 2. SET UP YOUR GOOGLE SHEET
 *    - Create a new Google Sheet at https://sheets.google.com
 *    - Copy the spreadsheet ID from the URL:
 *        https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
 *    - Share the sheet with your service account email (found in the JSON key file)
 *      and grant it "Editor" permission
 *    - Add a header row in the sheet (row 1):
 *        Order ID | Date | Customer Name | Phone | Wilaya | Address | Notes |
 *        Items | Subtotal (DA) | Shipping (DA) | Total (DA)
 *
 * 3. CONFIGURE ENVIRONMENT VARIABLES
 *    Copy the values from your downloaded JSON key file into the .env file:
 *      GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
 *      GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *      GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
 *      GOOGLE_SHEET_RANGE=Orders!A:K   (adjust to match your sheet name/columns)
 */

import { google } from 'googleapis'

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

/**
 * Creates an authenticated Google Sheets client using the service account
 * credentials stored in environment variables.
 *
 * @returns {import('googleapis').sheets_v4.Sheets} Authenticated Sheets client
 */
function getAuthenticatedClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_PRIVATE_KEY

  if (!email || !rawKey) {
    throw new Error(
      'Missing Google Sheets credentials. ' +
        'Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in your .env file.'
    )
  }

  // The private key is stored as a JSON string where newlines are escaped as \n.
  // We restore actual newlines so the PEM is valid.
  const privateKey = rawKey.replace(/\\n/g, '\n')

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

// ---------------------------------------------------------------------------
// Data formatting
// ---------------------------------------------------------------------------

/**
 * Formats an order object into a flat row array ready to be appended to the
 * Google Sheet.
 *
 * Column layout (must match your sheet headers):
 *   A  Order ID
 *   B  Date
 *   C  Customer Name
 *   D  Phone
 *   E  Wilaya
 *   F  Address
 *   G  Notes
 *   H  Items (human-readable summary)
 *   I  Subtotal (DA)
 *   J  Shipping (DA)
 *   K  Total (DA)
 *
 * @param {Object} order
 * @returns {Array<string|number>}
 */
function formatOrderRow(order) {
  const itemsSummary = (order.items || [])
    .map(item => `${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString()} DA)`)
    .join(' | ')

  const formattedDate = new Date(order.date).toLocaleString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return [
    order.id,
    formattedDate,
    order.fullName,
    order.phone,
    order.wilaya,
    order.address,
    order.notes || '',
    itemsSummary,
    order.subtotal,
    order.shipping,
    order.total,
  ]
}

// ---------------------------------------------------------------------------
// Sheet operations
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

/**
 * Appends a single order row to the configured Google Sheet.
 * Implements simple retry logic for transient API errors.
 *
 * @param {Object} order  The order object from the checkout form
 * @returns {Promise<void>}
 */
export async function appendOrderToSheet(order) {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  const range = process.env.GOOGLE_SHEET_RANGE || 'Orders!A:K'

  if (!spreadsheetId) {
    throw new Error(
      'Missing GOOGLE_SPREADSHEET_ID environment variable.'
    )
  }

  // Sanitize the order ID for safe use in log/error messages:
  // keep only alphanumeric characters and hyphens, cap at 32 chars.
  const safeOrderId = String(order.id).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 32)

  const row = formatOrderRow(order)
  let lastError

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const sheets = getAuthenticatedClient()

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      })

      console.log('[GoogleSheets] Order appended successfully:', { orderId: safeOrderId, attempt })
      return
    } catch (err) {
      lastError = err
      console.error('[GoogleSheets] Append attempt failed:', {
        orderId: safeOrderId,
        attempt,
        maxRetries: MAX_RETRIES,
        error: err.message,
      })

      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * attempt))
      }
    }
  }

  // All retries exhausted – propagate the error to the caller
  throw new Error(
    `Failed to append order ${safeOrderId} to Google Sheet after ${MAX_RETRIES} attempts: ${lastError?.message}`
  )
}
