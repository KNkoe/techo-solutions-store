import { test, expect } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

test.describe('Sell Page UX Flow', () => {
  test('should verify number, fill details, and submit successfully', async ({ page }) => {
    // Navigate to /sell page
    await page.goto('http://localhost:3000/sell')
    
    // Check for simplified text
    await expect(page.locator('h2')).toContainText('Verify WhatsApp number')
    await expect(page.locator('p')).toContainText('Enter your WhatsApp number to get verified.')
    
    // Input phone number
    const testPhone = '26658123456'
    await page.fill('input[type="tel"]', testPhone)
    
    // Click button
    await page.click('button[type="submit"]')
    
    // Verify OTP input screen
    await expect(page.locator('h2')).toContainText('Enter verification code')
    await expect(page.locator('p')).toContainText(`Sent to +${testPhone}.`)
    
    // Get verification code from Payload
    const payload = await getPayload({ config })
    const logs = await payload.find({
      collection: 'notification-logs',
      limit: 1,
      sort: '-createdAt',
      where: {
        recipient: {
          equals: testPhone
        }
      }
    })
    
    expect(logs.docs.length).toBeGreaterThan(0)
    const message = logs.docs[0].message
    // Extract 6-digit code
    const codeMatch = message.match(/\d{6}/)
    expect(codeMatch).not.toBeNull()
    const code = codeMatch![0]
    
    // Enter verification code
    await page.fill('input[name="code"]', code)
    await page.click('button[type="submit"]')
    
    // Verify details form is shown and we have single unified details form
    await expect(page.locator('h2')).toContainText('Item details')
    
    // Form fields should be visible (not hidden by stages anymore)
    await expect(page.locator('h3').nth(0)).toContainText('1. Item Details')
    await expect(page.locator('h3').nth(1)).toContainText('2. Handover Details')
    await expect(page.locator('h3').nth(2)).toContainText('3. Photos')
    
    // Fill out the fields
    await page.fill('input[name="categoryLabel"]', 'Televisions')
    await page.fill('input[name="model"]', 'LG Smart TV 65')
    await page.selectOption('select[name="condition"]', 'excellent')
    await page.fill('input[name="askingPrice"]', '7500')
    
    await page.fill('input[name="sellerName"]', 'Test Seller')
    await page.fill('input[name="location"]', 'Maseru')
    await page.selectOption('select[name="handoverPreference"]', 'bring-to-store')
    
    // Set up a mock file upload
    const fileBuffer = Buffer.from('fake image content')
    await page.setInputFiles('input[name="photos"]', {
      name: 'test-tv.png',
      mimeType: 'image/png',
      buffer: fileBuffer,
    })
    
    // Optional details disclosure should be present
    const detailsDisclosure = page.locator('details.form-disclosure')
    await expect(detailsDisclosure).toBeVisible()
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Verify success state
    await expect(page.locator('h2')).toContainText('Your item is now in review.')
    await expect(page.locator('strong').first()).not.toBeEmpty() // reference number
  })
})
