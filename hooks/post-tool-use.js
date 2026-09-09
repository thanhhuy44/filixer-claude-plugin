#!/usr/bin/env node

/**
 * Claude Code PostToolUse Hook
 * Automatically formats .ts / .tsx / .json files after Write or Edit tool executions.
 */

const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

try {
  const rawInput = fs.readFileSync(0, 'utf8')
  if (!rawInput.trim()) {
    process.exit(0)
  }

  const input = JSON.parse(rawInput)
  const toolInput = input.tool_input || {}
  const filePath = toolInput.file_path || toolInput.filePath

  if (filePath && (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json'))) {
    if (fs.existsSync(filePath)) {
      try {
        execSync(`npx prettier --write "${filePath}"`, { stdio: 'ignore' })
      } catch {
        // Ignore if prettier is not installed locally
      }
    }
  }

  process.exit(0)
} catch (err) {
  // Silent fail to avoid disrupting tool calls
  process.exit(0)
}
