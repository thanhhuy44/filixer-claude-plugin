#!/usr/bin/env node

/**
 * Claude Code PreToolUse Hook
 * Intercepts dangerous bash commands before execution.
 */

const fs = require('fs')

try {
  const rawInput = fs.readFileSync(0, 'utf8')
  if (!rawInput.trim()) {
    process.exit(0)
  }

  const input = JSON.parse(rawInput)
  const toolName = input.tool_name || ''
  const toolInput = input.tool_input || {}

  if (toolName === 'Bash') {
    const command = toolInput.command || ''

    const DANGEROUS_PATTERNS = [
      /git\s+push\s+.*--force/i,
      /rm\s+-rf\s+\//i,
      /drop\s+database/i,
      /truncate\s+table/i,
    ]

    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        const reason = `[Hook Alert] Blocked dangerous command matching pattern: ${pattern}`
        const output = {
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason: reason,
          },
        }
        process.stdout.write(JSON.stringify(output))
        process.exit(2) // Exit 2 enforces blocking in Claude Code
      }
    }
  }

  process.exit(0)
} catch (err) {
  // If parsing fails, allow pass-through without breaking
  process.exit(0)
}
