#!/usr/bin/env node

/**
 * Claude Code PreToolUse Hook
 * Intercepts dangerous bash commands before execution.
 */

try {
  const input = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}')
  const command = input.command || ''

  const DANGEROUS_PATTERNS = [
    /git\s+push\s+.*--force/i,
    /rm\s+-rf\s+\//i,
    /drop\s+database/i,
    /truncate\s+table/i
  ]

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      console.error(`[Hook Alert] Blocked dangerous command matching pattern: ${pattern}`)
      process.exit(1) // Reject tool execution
    }
  }
} catch (err) {
  // Pass through if parsing fails
}
