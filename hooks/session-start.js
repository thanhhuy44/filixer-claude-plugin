#!/usr/bin/env node

/**
 * Claude Code SessionStart Hook
 * Checks workspace readiness upon session initiation.
 */

const fs = require('fs')
const path = require('path')

const targetDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const hasPackageJson = fs.existsSync(path.join(targetDir, 'package.json'))
const hasNodeModules = fs.existsSync(path.join(targetDir, 'node_modules'))
const hasEnv = fs.existsSync(path.join(targetDir, '.env'))

if (hasPackageJson) {
  if (!hasNodeModules) {
    console.log('[Hook Warning] node_modules directory missing. You may need to run "bun install" or "npm install".')
  }
  if (!hasEnv) {
    console.log('[Hook Info] No .env file found in workspace root.')
  }
}

process.exit(0)
