#!/usr/bin/env node

/**
 * Claude Code PostToolUse Hook
 * Automatically formats and lints files via ESLint (--fix) and Prettier (--write) after Write or Edit tool executions.
 */

const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

const ESLINT_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'])
const PRETTIER_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.json',
  '.css',
  '.scss',
  '.less',
  '.md',
  '.yaml',
  '.yml',
  '.html'
])

try {
  const rawInput = fs.readFileSync(0, 'utf8')
  if (!rawInput.trim()) {
    process.exit(0)
  }

  const input = JSON.parse(rawInput)
  const toolInput = input.tool_input || {}
  const filePath = toolInput.file_path || toolInput.filePath

  if (filePath && fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase()

    const fileDir = path.dirname(filePath)

    // 1. Run ESLint auto-fix for JS/TS files
    if (ESLINT_EXTENSIONS.has(ext)) {
      try {
        execSync(`npx eslint --fix "${filePath}"`, { cwd: fileDir, stdio: 'ignore' })
      } catch {
        // Ignore if ESLint is not configured or fails
      }
    }

    // 2. Run Prettier format for supported file types
    if (PRETTIER_EXTENSIONS.has(ext)) {
      try {
        execSync(`npx prettier --write "${filePath}"`, { cwd: fileDir, stdio: 'ignore' })
      } catch {
        // Ignore if Prettier is not configured or fails
      }
    }
  }

  process.exit(0)
} catch {
  // Silent fail to avoid disrupting tool calls
  process.exit(0)
}
