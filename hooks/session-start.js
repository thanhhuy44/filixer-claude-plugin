#!/usr/bin/env node

/**
 * Claude Code SessionStart Hook
 * Checks workspace readiness upon session initiation.
 */

const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'))
const hasNodeModules = fs.existsSync(path.join(cwd, 'node_modules'))
const hasEnv = fs.existsSync(path.join(cwd, '.env'))

if (hasPackageJson) {
  if (!hasNodeModules) {
    console.log('[Hook Warning] node_modules directory missing. You may need to run "npm install".')
  }
  if (!hasEnv) {
    console.log('[Hook Info] No .env file found in workspace root.')
  }
}
