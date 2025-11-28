#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import depcheck from 'depcheck';

const ROOT = process.cwd();
const UNIMPORTED_BIN = path.join(ROOT, 'node_modules', 'unimported', 'dist', 'index.js');
const IGNORED_DIRS = new Set(['.git', 'dist', 'node_modules', '.idea', '.vscode', 'backup']);
const DUPLICATE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']);

const command = process.argv[2] || 'help';
const flags = new Set(process.argv.slice(3));

function sanitizeOutput(text) {
  if (!text) return '';
  return text
    .replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/[\u2800-\u28FF]/g, '')
    .replace(/\r/g, '')
    .trim();
}

function runUnimported(args, { allowFailure = false } = {}) {
  const result = spawnSync(process.execPath, [UNIMPORTED_BIN, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', CI: '1' },
  });
  const output = sanitizeOutput(`${result.stdout || ''}\n${result.stderr || ''}`);
  if (result.error) throw result.error;
  if (result.status && result.status !== 0 && !allowFailure) {
    throw new Error(output || `Fallo al ejecutar unimported ${args.join(' ')}`);
  }
  return { status: result.status ?? 0, output };
}

async function runDepcheck() {
  return new Promise((resolve, reject) => {
    depcheck(
      ROOT,
      { skipMissing: true },
      (result) => {
        if (!result) {
          reject(new Error('Depcheck no retornó resultados.'));
          return;
        }
        resolve(result);
      }
    );
  });
}

function extractCount(output, label) {
  const match = output.match(new RegExp(`(\\d+)\\s+${label}`, 'i'));
  return match ? Number(match[1]) : 0;
}

function formatDepcheck(result) {
  const unusedDeps = result.dependencies || [];
  const unusedDevDeps = result.devDependencies || [];
  const missing = Object.keys(result.missing || {});
  return [
    `Dependencias sin usar (${unusedDeps.length}): ${unusedDeps.length ? unusedDeps.join(', ') : 'ninguna'}`,
    `DevDependencies sin usar (${unusedDevDeps.length}): ${unusedDevDeps.length ? unusedDevDeps.join(', ') : 'ninguna'}`,
    `Imports faltantes (${missing.length}): ${missing.length ? missing.join(', ') : 'ninguno'}`,
  ].join('\n');
}

async function analyzeUnused({ writeReport = true } = {}) {
  const unimported = runUnimported(
    ['unimported', '--show-unused-files', '--show-unused-deps', '--show-unresolved-imports'],
    { allowFailure: true }
  );
  const depResult = await runDepcheck();
  const summary = {
    unimportedRaw: unimported.output,
    depcheckRaw: formatDepcheck(depResult),
    unimportedFiles: extractCount(unimported.output, 'unimported files'),
    unusedDeps: extractCount(unimported.output, 'unused dependencies'),
    unresolvedImports: extractCount(unimported.output, 'unresolved imports'),
    depcheckUnusedDeps: depResult.dependencies || [],
    depcheckUnusedDevDeps: depResult.devDependencies || [],
    depcheckMissing: Object.keys(depResult.missing || {}),
  };

  if (writeReport) {
    const reportLines = [
      '# 🔴 REPORTE DE SALUD DE CÓDIGO',
      '',
      `Generado automáticamente: ${new Date().toISOString()}`,
      '',
      '## Resultado de unimported',
      '',
      '```',
      summary.unimportedRaw || 'Sin salida disponible.',
      '```',
      '',
      '## Resultado de depcheck',
      '',
      '```',
      summary.depcheckRaw,
      '```',
      '',
      '## Próximos pasos sugeridos',
      '- Revisar archivos marcados como "unimported" y eliminarlos o reexportarlos.',
      '- Ejecutar "npm uninstall" sobre las dependencias listadas como no utilizadas si se confirma que no son necesarias.',
      '- Validar importaciones faltantes antes de build final.',
    ];
    await fs.writeFile(path.join(ROOT, 'ERRORES_ENCONTRADOS.md'), reportLines.join('\n'), 'utf8');
  }

  return summary;
}

async function walkDir(dir, visitor) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, visitor);
    } else {
      await visitor(fullPath);
    }
  }
}

async function scanForDuplicates({ minNormalizedLength = 200 } = {}) {
  const groups = new Map();
  await walkDir(path.join(ROOT, 'src'), async (file) => {
    const ext = path.extname(file);
    if (!DUPLICATE_EXTENSIONS.has(ext)) return;
    const content = await fs.readFile(file, 'utf8');
    const normalized = content.replace(/\s+/g, '');
    if (normalized.length < minNormalizedLength) return;
    const hash = crypto.createHash('sha1').update(normalized).digest('hex');
    if (!groups.has(hash)) groups.set(hash, []);
    groups.get(hash).push(path.relative(ROOT, file));
  }).catch(() => {});
  const duplicates = [];
  for (const [hash, files] of groups.entries()) {
    if (files.length > 1) duplicates.push({ hash, files });
  }
  duplicates.sort((a, b) => b.files.length - a.files.length);
  return duplicates;
}

async function collectBundleStats() {
  const target = path.join(ROOT, 'dist', 'assets');
  try {
    await fs.access(target);
  } catch {
    return { files: [], totalBytes: 0 };
  }
  const files = [];
  async function walk(folder) {
    const entries = await fs.readdir(folder, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        const stat = await fs.stat(fullPath);
        files.push({ file: path.relative(ROOT, fullPath).replace(/\\/g, '/'), bytes: stat.size });
      }
    }
  }
  await walk(target);
  files.sort((a, b) => b.bytes - a.bytes);
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  return { files, totalBytes };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** idx;
  return `${value.toFixed(2)} ${units[idx]}`;
}

async function generateAnalysisReport() {
  const [analysis, duplicates, bundles] = await Promise.all([
    analyzeUnused({ writeReport: true }),
    scanForDuplicates({ minNormalizedLength: 300 }),
    collectBundleStats(),
  ]);

  const duplicateSection = duplicates.length
    ? duplicates
        .slice(0, 5)
        .map(
          (group) =>
            `- ${group.files.length} archivos comparten contenido similar (hash ${group.hash.slice(0, 7)}): ${group.files.join(', ')}`
        )
        .join('\n')
    : '- Sin duplicados significativos (>300 caracteres).';

  const bundleSection = bundles.files.length
    ? bundles.files
        .slice(0, 5)
        .map((file) => `- ${file.file}: ${formatBytes(file.bytes)}`)
        .join('\n')
    : '- Ejecuta `npm run build` para generar artefactos y medir tamaños.';

  const analysisLines = [
    '# 📋 Análisis Automatizado - JJSecure VPN-N',
    '',
    `Generado: ${new Date().toLocaleString('es-MX')}`,
    '',
    '## Estado General',
    `- Archivos no usados detectados: ${analysis.unimportedFiles}`,
    `- Dependencias sin uso (depcheck): ${analysis.depcheckUnusedDeps.length}`,
    `- DevDependencies sin uso: ${analysis.depcheckUnusedDevDeps.length}`,
    `- Imports faltantes reportados: ${analysis.depcheckMissing.length}`,
    '',
    '## Duplicidad de Código',
    duplicateSection,
    '',
    '## Peso de bundles (sin React.lazy)',
    bundleSection,
    `- Peso total aproximado: ${formatBytes(bundles.totalBytes)}`,
    '',
    '## Estrategia sin lazy loading',
    '- Se mantiene el WebView como un bundle completo, usando la política de manual chunks definida en src/vite.config.ts (react-vendor, icons-vendor, maps-vendor, map-core, modals).',
    '- La división prioriza dominios funcionales (mapas, modales, vendor) para aprovechar caché sin depender de React.lazy.',
    '- Controla el peso de cada chunk ejecutando `npm run analyze:bundle` cuando se agreguen librerías pesadas.',
    '',
    '## Recomendaciones inmediatas',
    '1. Ejecutar `npm run analyze:unused` y remover los archivos listados si siguen sin usarse.',
    '2. Revisar los grupos duplicados y mover lógica compartida a hooks/utilidades.',
    '3. Mantener el build con chunks manuales y vigilar que ningún archivo minificado supere 600 KB.',
    '4. Repetir este reporte antes de cada release para detectar regresiones.',
  ];

  await fs.writeFile(path.join(ROOT, 'ANALISIS_CODIGO_2025.md'), analysisLines.join('\n'), 'utf8');
}

async function handleCleanupDeps({ apply = false } = {}) {
  const analysis = await analyzeUnused({ writeReport: false });
  if (!analysis.depcheckUnusedDeps.length && !analysis.depcheckUnusedDevDeps.length) {
    console.log('✅ No hay dependencias sin usar según depcheck.');
    return;
  }
  console.log('Dependencias sin usar:', analysis.depcheckUnusedDeps.join(', ') || 'ninguna');
  console.log('DevDependencies sin usar:', analysis.depcheckUnusedDevDeps.join(', ') || 'ninguna');
  if (apply) {
    const dependencies = [...analysis.depcheckUnusedDeps, ...analysis.depcheckUnusedDevDeps];
    if (!dependencies.length) {
      console.log('No hay paquetes para eliminar.');
      return;
    }
    const result = spawnSync('npm', ['uninstall', ...dependencies], { cwd: ROOT, stdio: 'inherit' });
    if (result.status !== 0) {
      throw new Error('npm uninstall falló.');
    }
  } else {
    console.log('Modo solo lectura. Ejecuta con --apply para desinstalar automáticamente.');
  }
}

async function runCleanupAll() {
  await analyzeUnused({ writeReport: true });
  const duplicates = await scanForDuplicates({ minNormalizedLength: 300 });
  if (duplicates.length) {
    console.log('Posibles duplicados detectados:');
    duplicates.slice(0, 5).forEach((group) => {
      console.log(`- ${group.files.length} archivos: ${group.files.join(', ')}`);
    });
  } else {
    console.log('Sin duplicados significativos.');
  }
}

async function analyzeHeavy() {
  const bundles = await collectBundleStats();
  if (!bundles.files.length) {
    console.log('No se encontró dist/assets. Ejecuta "npm run build" primero.');
    return;
  }
  console.log('Top de archivos más pesados en dist/assets:');
  bundles.files.slice(0, 5).forEach((file) => {
    console.log(`- ${file.file}: ${formatBytes(file.bytes)}`);
  });
  console.log(`Peso total aproximado: ${formatBytes(bundles.totalBytes)}`);
}

async function scanDuplicatesCommand() {
  const duplicates = await scanForDuplicates({ minNormalizedLength: 300 });
  if (!duplicates.length) {
    console.log('✅ No se detectaron bloques duplicados significativos.');
    return duplicates;
  }
  console.log('Duplicados encontrados:');
  duplicates.slice(0, 10).forEach((group) => {
    console.log(`- ${group.files.length} archivos comparten hash ${group.hash.slice(0, 7)}:`);
    group.files.forEach((file) => console.log(`    • ${file}`));
  });
  return duplicates;
}

function showHelp() {
  console.log(
    `Uso: node scripts/code-health.js <comando> [opciones]\n\n` +
      `Comandos disponibles:\n` +
      `  analyze-unused      Genera ERRORES_ENCONTRADOS.md con unimported + depcheck\n` +
      `  clean-unused        Alias de analyze-unused (con --apply eliminaría archivos manualmente)\n` +
      `  cleanup-deps        Detecta dependencias sin uso (usar --apply para desinstalar)\n` +
      `  cleanup-all         Ejecuta análisis de archivos + duplicados\n` +
      `  scan-duplicates     Busca contenido duplicado en src/\n` +
      `  analyze-heavy       Lista los bundles más pesados en dist/assets\n` +
      `  plan-optimize       Genera ANALISIS_CODIGO_2025.md actualizado\n` +
      `  optimize-phase1     Ejecuta cleanup-all y plan-optimize (sin lazy loading)\n` +
      `  optimize-advanced   Ejecuta scan-duplicates y analyze-heavy\n` +
      `  analyze-complete    Ejecuta analyze-heavy + plan-optimize\n` +
      `  report-final        Alias de plan-optimize\n`
  );
}

async function main() {
  try {
    switch (command) {
      case 'analyze-unused':
        await analyzeUnused({ writeReport: true });
        console.log('Reporte actualizado en ERRORES_ENCONTRADOS.md');
        break;
      case 'clean-unused':
        await analyzeUnused({ writeReport: true });
        console.log('Revisa ERRORES_ENCONTRADOS.md y elimina manualmente los archivos listados.');
        break;
      case 'cleanup-deps':
        await handleCleanupDeps({ apply: flags.has('--apply') });
        break;
      case 'cleanup-files':
      case 'cleanup-files:safe':
        await analyzeUnused({ writeReport: true });
        console.log('Modo seguro: se generó el reporte, elimina archivos manualmente si corresponde.');
        break;
      case 'cleanup-all':
        await runCleanupAll();
        break;
      case 'scan-duplicates':
        await scanDuplicatesCommand();
        break;
      case 'analyze-heavy':
        await analyzeHeavy();
        break;
      case 'plan-optimize':
      case 'report-final':
        await generateAnalysisReport();
        console.log('Plan actualizado en ANALISIS_CODIGO_2025.md');
        break;
      case 'analyze-complete':
        await analyzeHeavy();
        await generateAnalysisReport();
        break;
      case 'optimize-phase1':
        await runCleanupAll();
        await generateAnalysisReport();
        break;
      case 'optimize-advanced':
        await scanDuplicatesCommand();
        await analyzeHeavy();
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Error en code-health:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
