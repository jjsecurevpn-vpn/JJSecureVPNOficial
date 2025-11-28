import { execSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync, existsSync, rmSync, statSync } from "fs";
import { join } from "path";
import { PurgeCSS } from "purgecss";

/*
  build-inline.ts (refactor optimizado)
  Objetivos:
  1. Usar manifest de Vite para identificar el entry correcto (evitar elegir un chunk intermedio).
  2. Permitir excluir chunks no esenciales (--exclude="maps-vendor,report" etc.).
  3. Concatenar sólo CSS vinculado al entry (manifest.css + imported css).
  4. Ofuscar crédito y limpiar comentarios largos innecesarios.
  5. Integración opcional de PurgeCSS real (--purge-css) para eliminar selectores no usados con base en el contenido TSX.
  6. Flag --inline-only-js para forzar inlining aunque haya css separado.
  7. Log compacto con tamaños.

  NOTA: Este script no reemplaza una solución formal de tree-shaking de CSS (usar Tailwind + purge built-in). El purge aquí es conservador.
*/

interface ManifestEntry {
  file: string;
  src?: string;
  css?: string[];
  isEntry?: boolean;
  imports?: string[];
}
type Manifest = Record<string, ManifestEntry>;

// ---------------------- CLI Flags ----------------------
const argv = process.argv.slice(2);
const hasFlag = (flag: string) => argv.some(a => a === flag || a.startsWith(flag + '='));
const getFlagValue = (flag: string): string | undefined => {
  const raw = argv.find(a => a.startsWith(flag + '='));
  return raw ? raw.split('=')[1] : undefined;
};

const excludeList = (getFlagValue('--exclude') || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const inlineOnlyJs = hasFlag('--inline-only-js');
const purgeCss = hasFlag('--purge-css');
const legacyPurge = hasFlag('--legacy-purge');
const silent = hasFlag('--silent');
const hardExclude = hasFlag('--hard-exclude'); // Elimina físicamente archivos coincidentes con --exclude

const log = (...args: any[]) => { if (!silent) console.log(...args); };
const ROOT = process.cwd();
const fileSize = (p: string) => { try { return statSync(p).size; } catch { return 0; } };

// ---------------------- Helpers ----------------------
const runBuild = () => {
  log("🔧 Ejecutando build (npm run build)...");
  try {
    execSync("npm run build", { stdio: silent ? 'ignore' : 'inherit' });
  } catch (e) {
    console.error("❌ Error al compilar:", (e as any)?.message || e);
    process.exit(1);
  }
};

const loadManifest = (distDir: string): Manifest | null => {
  const manifestPath = join(distDir, 'manifest.json');
  if (!existsSync(manifestPath)) return null;
  try { return JSON.parse(readFileSync(manifestPath, 'utf8')); } catch { return null; }
};

const pickEntry = (manifest: Manifest | null): ManifestEntry | null => {
  if (!manifest) return null;
  // Priorizar src/main.tsx o similar
  const candidates = Object.entries(manifest)
    .filter(([, v]) => v.isEntry)
    .map(([k, v]) => ({ key: k, entry: v }));
  if (!candidates.length) return null;
  const prioritized = candidates.find(c => /main\.(t|j)sx?$/.test(c.key)) || candidates[0];
  return prioritized.entry;
};

const gatherCssFromEntry = (entry: ManifestEntry, manifest: Manifest): string[] => {
  const collected = new Set<string>();
  const visit = (e: ManifestEntry) => {
    e.css?.forEach(c => collected.add(c));
    e.imports?.forEach(imp => { const m = manifest[imp]; if (m) visit(m); });
  };
  visit(entry);
  return Array.from(collected);
};

const getAssets = (distDir: string) => {
  const assetsDir = join(distDir, 'assets');
  const files = existsSync(assetsDir) ? readdirSync(assetsDir) : [];
  const manifest = loadManifest(distDir);
  const entry = pickEntry(manifest);
  let jsFile: string | undefined;
  let cssFiles: string[] = [];
  if (entry) {
    jsFile = entry.file.startsWith('assets/') ? entry.file.replace('assets/', '') : entry.file;
    cssFiles = gatherCssFromEntry(entry, manifest!);
  } else {
    // Fallback: primer .js y .css (anterior comportamiento)
    jsFile = files.find(f => f.endsWith('.js'));
    const fallbackCss = files.filter(f => f.endsWith('.css'));
    cssFiles = fallbackCss.slice(0, 1); // mantener el comportamiento original simple
  }
  if (!jsFile) {
    console.error('❌ No se pudo determinar el archivo JS principal.');
    process.exit(1);
  }
  log(`🎯 Entry JS: ${jsFile}`);
  if (cssFiles.length) log(`🎯 CSS vinculado: ${cssFiles.join(', ')}`); else log('📦 Sin CSS separado (prob. embebido).');
  return { jsFile, cssFiles, assetsDir, allFiles: files, manifest };
};

const readAsset = (dir: string, file: string | undefined) => file ? readFileSync(join(dir, file), 'utf8') : '';

const obfuscateCredit = (jsCode: string): string => {
  const DEV_CREDIT_TEXT = 'Dev: @JHServices - Todos los derechos reservados';
  try {
    if (jsCode.includes(DEV_CREDIT_TEXT)) {
      const escaped = DEV_CREDIT_TEXT
        .split("")
        .map(c => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
      const safePattern = new RegExp(DEV_CREDIT_TEXT.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&"), "g");
      jsCode = jsCode.replace(safePattern, escaped);
      log("🛡️  Crédito ofuscado.");
    } else {
      log("ℹ️  Crédito no localizado (minificado / removido).");
    }
  } catch (e) {
    console.warn("⚠️ Ofuscación de crédito fallida:", e);
  }
  return jsCode;
};

// Eliminación heurística de comentarios largos y licencias redundantes
const stripLargeComments = (code: string) => code.replace(/\/\*!?[^]*?\*\//g, (m) => m.length > 160 ? '' : m);

// Purga CSS muy superficial (activar con --legacy-purge) para entornos donde no se pueda usar PurgeCSS real.
const heuristicCssPurge = (css: string): string => {
  if (!legacyPurge) return css;
  // Mantener siempre reglas @ y variables
  const lines = css.split(/}\n?/).map(l => l.trim()).filter(Boolean);
  const keep: string[] = [];
  for (const block of lines) {
    if (block.startsWith('@')) { keep.push(block + '}'); continue; }
    const [selectors, body] = block.split('{');
    if (!body) continue;
    const selList = selectors.split(',').map(s => s.trim());
    const filtered = selList.filter(s => /^(html|body|#root|\.btn|\.bg-|\.card-|:root)/.test(s));
    if (filtered.length) keep.push(filtered.join(',') + '{' + body + '}');
  }
  const result = keep.join('\n');
  const ratio = ((result.length / css.length) * 100).toFixed(1);
  log(`🧹 Purge CSS heurístico: ${ratio}% restante.`);
  return result;
};

const runAdvancedPurge = async (cssFiles: string[], assetsDir: string) => {
  if (!purgeCss || !cssFiles.length) return;
  const cssPaths = cssFiles.map(f => join(assetsDir, f));
  const beforeSizes = cssPaths.map(fileSize);
  log('🧼 Ejecutando PurgeCSS sobre archivos enlazados...');
  try {
    const purgeResults = await new PurgeCSS().purge({
      css: cssPaths,
      content: [
        join(ROOT, 'index.html'),
        join(ROOT, 'src/**/*.{ts,tsx,js,jsx,html}')
      ],
      safelist: [
        /^btn-/,
        /^badge-/,
        /^footer-/,
        /^surface/,
        /^input-/,
        /^focus-/,
        /^spinner-/,
        /^card-/,
        /^chip-/,
        /^alert-/,
        /^bg-/,
        /^text-/,
        'active'
      ],
    });
    purgeResults.forEach(result => {
      if (result.file) {
        writeFileSync(result.file, result.css, 'utf8');
      } else {
        cssPaths.forEach((filePath, idx) => {
          if (idx === 0) writeFileSync(filePath, result.css, 'utf8');
        });
      }
    });
    const afterSizes = cssPaths.map(fileSize);
    const totalBefore = beforeSizes.reduce((acc, curr) => acc + curr, 0);
    const totalAfter = afterSizes.reduce((acc, curr) => acc + curr, 0);
    const savedKB = ((totalBefore - totalAfter) / 1024).toFixed(2);
    log(`✅ PurgeCSS completado. Ahorro estimado: ${savedKB}KB`);
  } catch (error) {
    console.error('❌ PurgeCSS falló:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

// Excluir chunks mencionados (modo soft: solo log) si no hay hard-exclude
const applyJsExcludes = (code: string): string => {
  if (!excludeList.length || hardExclude) return code;
  excludeList.forEach(ex => {
    const regex = new RegExp(ex.replace(/[-/\\]/g, r => `\\${r}`), 'g');
    if (regex.test(code)) log(`ℹ️ Referencia a chunk '${ex}' detectada (soft exclude).`);
  });
  return code;
};

// Eliminación física de archivos en assets que coincidan parcialmente con excludeList
const physicallyRemoveExcluded = (assetsDir: string, allFiles: string[]): string[] => {
  if (!hardExclude || !excludeList.length) return [];
  const removed: string[] = [];
  for (const f of allFiles) {
    const base = f.toLowerCase();
    if (excludeList.some(ex => base.includes(ex.toLowerCase()))) {
      try {
        rmSync(join(assetsDir, f));
        removed.push(f);
        log(`🗑️  Eliminado: ${f}`);
      } catch (e) {
        console.warn(`⚠️ No se pudo eliminar ${f}:`, e);
      }
    }
  }
  return removed;
};

const buildInlineHtml = (css: string, js: string) => `<!DOCTYPE html>
<html lang="es-ES">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#2A0A3E" />
    <meta name="mobile-web-app-capable" content="yes" />
    <!-- Meta tags específicas para WebView Android -->
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-touch-fullscreen" content="yes" />
    <link rel="icon" href="data:,">
    <title>@JJSECURE_VPN @JHServices - JJSECURE VPN LAYOUT</title>
    ${css ? `<style>${css}</style>` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script>${js}</script>
  </body>
</html>`;

// ---------------------- Flujo principal ----------------------
const main = async () => {
  runBuild();
  const distPath = join(ROOT, 'dist');
  const { jsFile, cssFiles, assetsDir, allFiles, manifest } = getAssets(distPath);

  // Eliminación física de recursos excluidos (antes de leer contenidos)
  const removedFiles = physicallyRemoveExcluded(assetsDir, allFiles);
  await runAdvancedPurge(cssFiles, assetsDir);

  // Leer JS principal
  let jsContent = readAsset(assetsDir, jsFile);
  jsContent = stripLargeComments(jsContent);
  jsContent = obfuscateCredit(jsContent);
  jsContent = applyJsExcludes(jsContent);

  // Combinar CSS asociado (orden estable)
  let cssContent = cssFiles.map(f => readAsset(assetsDir, f)).join('\n');
  if (inlineOnlyJs) {
    log('⚠️ Flag --inline-only-js activo: CSS descartado para forzar inline mínimo.');
    cssContent = '';
  }
  cssContent = heuristicCssPurge(cssContent);

  // Métricas simples
  const sizeKB = (n: number) => (n / 1024).toFixed(2) + 'KB';
  log(`📏 Tamaño JS: ${sizeKB(jsContent.length)} | CSS: ${sizeKB(cssContent.length)}`);

  const finalHtml = buildInlineHtml(cssContent, jsContent);
  writeFileSync(join(distPath, 'index.html'), finalHtml);

  // Reporte JSON con métricas
  const report = {
    timestamp: new Date().toISOString(),
    entryJs: jsFile,
    cssFiles,
    removedFiles,
    excludeList,
    hardExclude,
    inlineOnlyJs,
    purgeCss,
    manifestUsed: !!manifest,
    sizes: {
      jsInlineBytes: jsContent.length,
      cssInlineBytes: cssContent.length,
      htmlBytes: finalHtml.length
    }
  };
  writeFileSync(join(distPath, 'inline-report.json'), JSON.stringify(report, null, 2));
  log('✅ index.html (inline) generado.');
  log('📝 Reporte generado: inline-report.json');
  log('ℹ️ Flags usados:', { excludeList, inlineOnlyJs, purgeCss, hardExclude, legacyPurge });
};

main().catch((error) => {
  console.error('❌ build-inline falló:', error instanceof Error ? error.message : error);
  process.exit(1);
});

// Ejecutar ejemplo:
// npx tsx build-inline.ts --exclude=maps-vendor --purge-css
// npx tsx build-inline.ts --exclude=maps-vendor --hard-exclude