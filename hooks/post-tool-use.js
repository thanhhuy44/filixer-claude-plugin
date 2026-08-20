#!/usr/bin/env node

/**
 * Claude Code PostToolUse Hook
 * Automatically formats .ts / .tsx files after Write or Edit tool executions.
 */

const { execSync } = require('child_process')
const path = require('path')

try {
  // Read input from stdin provided by Claude Code
  const input = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}')
  const filePath = input.file_path || input.filePath

  if (filePath && (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json'))) {
    console.log(`[Hook] Formatted file: ${path.basename(filePath)}`)
    try {
      execSync(`npx prettier --write "${filePath}"`, { stdio: 'ignore' })
    } catch {
      // Ignore if prettier is not installed locally
    }
  }
} catch (err) {
  // Silent fail to avoid disrupting tool calls
}
