/**
 * pnpm does not install devDependencies of dependencies, but `npm audit
 * signatures` still reads those specs from package.json. An npm alias whose
 * name collides with a different package already on disk is then looked up at
 * the wrong version. magicast declares `"source-map": "npm:source-map-js@latest"`
 * and npm requests source-map-js@0.6.1, which was never published.
 *
 * Remove those uninstalled alias specs before the audit. Production
 * dependencies are left untouched.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const pnpmStore = path.join(process.cwd(), 'node_modules', '.pnpm')

function walk(dir, visit) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.isSymbolicLink() || entry.name === '.bin') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, visit)
    } else if (entry.name === 'package.json') {
      visit(full)
    }
  }
}

function stripAliasDevDependencies(pkgPath) {
  let pkg
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  } catch {
    return []
  }

  const devDependencies = pkg.devDependencies
  if (!devDependencies || typeof devDependencies !== 'object') return []

  const removed = []
  for (const [name, spec] of Object.entries(devDependencies)) {
    if (typeof spec === 'string' && spec.startsWith('npm:')) {
      delete devDependencies[name]
      removed.push(`${name}@${spec}`)
    }
  }

  if (removed.length === 0) return []
  if (Object.keys(devDependencies).length === 0) delete pkg.devDependencies
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  return removed
}

const removedByPackage = []
walk(pnpmStore, (pkgPath) => {
  const removed = stripAliasDevDependencies(pkgPath)
  if (removed.length > 0) {
    removedByPackage.push({ pkgPath, removed })
  }
})

for (const { pkgPath, removed } of removedByPackage) {
  console.warn(`${path.relative(process.cwd(), pkgPath)}: ${removed.join(', ')}`)
}
console.warn(
  `Removed ${removedByPackage.reduce((sum, item) => sum + item.removed.length, 0)} uninstalled npm alias devDependencies`,
)
