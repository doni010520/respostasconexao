const puppeteer = require('puppeteer');
const { buildHTML } = require('./templateBuilder');

let browser = null;

// Inicializar browser (reutilizável)
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ]
    });
  }
  return browser;
}

// Fechar browser (cleanup)
async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

// Gerar PDF
async function generatePDF(data) {
  let page = null;
  
  try {
    // Montar HTML
    const html = await buildHTML(data);
    
    // Obter browser
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();
    
    // Configurar viewport
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    });
    
    // Carregar HTML
    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000
    });
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

// Cleanup on process exit
process.on('exit', () => {
  if (browser) {
    browser.close();
  }
});

module.exports = {
  generatePDF,
  closeBrowser
};
