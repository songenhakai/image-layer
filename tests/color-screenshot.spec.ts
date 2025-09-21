import { test, expect } from '@playwright/test'

test('キャンバスの文字色変更後のスクリーンショット', async ({ page }) => {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
  expect(response && response.ok()).toBeTruthy()

  await page.waitForSelector('textarea', { state: 'visible' })

  await page.locator('button[aria-label="色 #ef4444"]').first().click()

  await page.waitForFunction((expected) => {
    const stage = (window as { __todoStage?: { find: (selector: string) => unknown[] } }).__todoStage
    if (!stage) {
      return false
    }

    const textNode = stage.find('.todo-text-fill')[0] as { fill?: () => string } | undefined
    const fill = textNode?.fill?.()
    return typeof fill === 'string' && fill.toLowerCase() === String(expected).toLowerCase()
  }, '#ef4444')

  const screenshotPath = test.info().outputPath('canvas-text-color.png')
  await page.locator('canvas').first().screenshot({ path: screenshotPath })
  await test.info().attach('canvas-text-color', { path: screenshotPath, contentType: 'image/png' })
})
