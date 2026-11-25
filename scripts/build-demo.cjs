// Render the existing budget screens against a fictional household's monthly ledger.
const fs = require('node:fs/promises');
const path = require('node:path');
const ejs = require('ejs');
const { parseHTML } = require('linkedom');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'demo-dist');
const categories = ['Mission', 'Logement', 'Courses'].map((nom, i) => ({ id: i + 1, nom, date: '2026-11-01' }));
const transactions = [
  { categorie: categories[0], type: 'Revenu', prix: 7500, note: 'Mission de novembre' },
  { categorie: categories[1], type: 'Dépense', prix: 2400, note: 'Loyer' },
  { categorie: categories[2], type: 'Dépense', prix: 620, note: 'Courses du mois' },
].map((item, i) => ({ ...item, id: i + 1, date: '2026-11-0' + (i + 1) }));
const pages = { dashboard: 'dashboard', transactions: 'transactions/index', budgets: 'budgets/index', categories: 'categories/index', objectifs: 'objectifs/index' };
const allowed = new Set(['/', ...Object.keys(pages).map(p => '/' + p)]);
const model = {
  utilisateur: { prenom: 'Sam', nom: 'Démo', devise: 'MAD' },
  notifications: [], toutTransactions: transactions, allCategories: categories,
  toutBudgets: [{ id: 1, nom: 'Courses du mois', description: 'Enveloppe mensuelle', montant: 900, categorie: categories[2] }],
  toutObjectifs: [{ id: 1, titre: 'Réserve logement', montantObjectif: 7200, categorie: categories[1] }],
  totalRevenus: 7500, totalFrais: 3020, soldeNet: 4480,
  sommeParCategorie: { Mission: 7500, Logement: 2400, Courses: 620 },
  depensesParCategorie: { Logement: 2400, Courses: 620 },
};

async function build() {
  await fs.mkdir(path.join(output, 'assets'), { recursive: true });
  for (const file of ['favicon-32x32.png', 'WealthWave-logo-normal.png']) {
    await fs.copyFile(path.join(root, 'assets', file), path.join(output, 'assets', file));
  }
  await fs.copyFile(path.join(root, 'public/styles.css'), path.join(output, 'styles.css'));
  await fs.copyFile(path.join(root, 'node_modules/chart.js/dist/chart.umd.js'), path.join(output, 'chart.js'));
  for (const [route, view] of Object.entries(pages)) {
    const html = await ejs.renderFile(path.join(root, 'views', view + '.ejs'), { ...model, title: 'WealthWave · ' + route });
    const { document } = parseHTML(html);
    for (const form of document.querySelectorAll('form')) form.remove();
    for (const link of document.querySelectorAll('a[href]')) {
      if (!allowed.has(link.getAttribute('href'))) link.remove();
    }
    for (const script of document.querySelectorAll('script[src*="chart.js"]')) script.setAttribute('src', '/chart.js');
    for (const table of document.querySelectorAll('table')) {
      if (table.querySelector('th:last-child')?.textContent.trim().toLowerCase() === 'actions') {
        for (const row of table.querySelectorAll('tr')) row.lastElementChild?.remove();
      }
    }
    const notice = document.createElement('p');
    notice.className = 'badge';
    notice.textContent = 'Démonstration en lecture seule · Budget fictif de novembre';
    document.body.prepend(notice);
    if (!document.querySelector('meta[charset]')) {
      const encoding = document.createElement('meta');
      encoding.setAttribute('charset', 'utf-8');
      document.head.prepend(encoding);
    }
    document.documentElement.lang = 'fr';
    await fs.writeFile(path.join(output, route + '.html'), document.toString());
    if (route === 'dashboard') await fs.writeFile(path.join(output, 'index.html'), document.toString());
  }
}
build().catch(error => { console.error(error); process.exitCode = 1; });
