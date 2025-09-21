import { test, expect } from '@playwright/test'

test('文字色の設定がキャンバスに反映される', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
  expect(response && response.ok()).toBeTruthy()

  await page.waitForSelector('textarea', { state: 'visible' })

  await page.locator('button[aria-label="色 #0ea5e9"]').first().click()

  await page.waitForFunction((expected) => {
    const stage = (window as { __todoStage?: { find: (selector: string) => unknown[] } }).__todoStage
    if (!stage) {
      return false
    }

    const textNode = stage.find('.todo-text-fill')[0] as { fill?: () => string } | undefined

    const fill = textNode?.fill?.()
    return typeof fill === 'string' && fill.toLowerCase() === String(expected).toLowerCase()
  }, '#0ea5e9')

  const fillColor = await page.evaluate(() => {
    const stage = (window as { __todoStage?: { find: (selector: string) => unknown[] } }).__todoStage
    const textNode = stage?.find('.todo-text-fill')[0] as { fill?: () => string } | undefined
    return textNode?.fill?.()
  })

  expect(fillColor?.toLowerCase()).toBe('#0ea5e9')
})
