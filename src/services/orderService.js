/**
 * orderService.js
 * ---------------
 * Frontend utility that submits a completed order to the GoodVibe backend,
 * which in turn appends it to a Google Sheet.
 *
 * The backend URL is read from the VITE_API_URL environment variable so it
 * works in both local development and production without code changes:
 *
 *   Local dev:   VITE_API_URL=http://localhost:3001   (set in .env.local)
 *   Production:  VITE_API_URL=https://your-api.example.com
 *
 * If VITE_API_URL is not set the function logs a warning and resolves
 * successfully so that the checkout flow is never blocked solely because the
 * sheet integration is not yet configured.
 */

const API_URL = import.meta.env.VITE_API_URL

/**
 * Sends an order to the backend for recording in Google Sheets.
 *
 * The function is intentionally non-blocking from the user's perspective:
 * if the API call fails (network error, server error, etc.) we log the error
 * and resolve without throwing so the user can still reach the confirmation
 * page.  Operators are responsible for monitoring the backend logs.
 *
 * @param {Object} order  The order object built in Checkout.jsx
 * @returns {Promise<void>}
 */
export async function submitOrderToSheet(order) {
  if (!API_URL) {
    console.warn(
      '[orderService] VITE_API_URL is not set. ' +
        'Order will not be recorded in Google Sheets. ' +
        'Set VITE_API_URL in your .env.local file and restart the dev server.'
    )
    return
  }

  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      console.error(
        `[orderService] Server responded with ${response.status}:`,
        body.error || 'Unknown error'
      )
      return
    }

    const data = await response.json()
    console.log(`[orderService] Order ${data.orderId} successfully recorded in Google Sheets.`)
  } catch (err) {
    console.error('[orderService] Network error while submitting order:', err.message)
  }
}
