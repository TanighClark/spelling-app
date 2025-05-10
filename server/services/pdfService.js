// server/services/pdfService.js
import ejs from 'ejs';
import path from 'path';
import puppeteer from 'puppeteer';
import { getCache, setCache } from '../utils/cache.js';

/**
 * Generate PDF based on activity type
 * @param {Object} template - Template data
 * @returns {Promise<Buffer>}
 */
export async function generatePDF(template) {
  const cacheKey = `pdf:${template._id}`;
  let pdfBuffer = await getCache(cacheKey);

  if (!pdfBuffer) {
    const { activityType } = template;
    const templateFile = `${activityType}.ejs`;

    const templatePath = path.join(
      process.cwd(),
      'server',
      'templates',
      'custom',
      templateFile,
    );

    try {
      const html = await ejs.renderFile(templatePath, { template });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();

      await setCache(cacheKey, pdfBuffer, 3600);
    } catch (err) {
      throw new Error(
        `Template rendering failed for ${activityType}: ${err.message}`,
      );
    }
  }

  return pdfBuffer;
}
