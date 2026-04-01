---
title: "Claude Code Source Leaked: 12-Layer Harness Architecture Breakdown"
date: 2026-04-01T11:00:00+08:00
draft: false
tags: ["AI", "Claude Code", "Source Analysis", "Harness Engineering", "Anthropic"]
categories: ["AI Deep Dive"]
description: "On March 31, 2026, the complete internal source code of Anthropic's Claude Code was leaked. This article breaks down its 12-layer Harness architecture and analyzes the implications for developers and the AI industry."
---

## What Happened

On the night of March 31, 2026, the complete internal source code of Claude Code v2.1.88 was leaked to GitHub.

This wasn't a routine open-source release. While Claude Code is distributed via npm, the published package ships a single bundled `cli.js` (~12MB). The internal TypeScript source was never meant to be public. What leaked was the **fully unbundled source** — 40+ tool definitions, multi-agent coordination, memory systems, permission controls, and more.

Within 24 hours, **1,500+ related repositories** appeared on GitHub. The most popular collection repo gained 145 stars and 257 forks in a single day. Teams have already started Python rewrites based on the leaked code.

This is the largest source code leak in the AI coding tool space to date.

## What's Inside: The 12-Layer Harness Architecture

The real value of Claude Code isn't the model — it's the **Harness Engineering** built around it. The source reveals 12 progressive layers, each adding production-grade capabilities on top of the basic agent loop.

### Layer 1: Tool System

The source defines **40+ tools**, far more than publicly documented:

| Category | Tools | Purpose |
|----------|-------|---------|
| File Ops | FileRead/FileWrite/FileEdit | Basic file operations |
| Search | Grep/Glob/WebSearch/WebFetch | Local + web search |
| Execution | Bash/PowerShell/REPL | Command execution |
| Agent | AgentTool/TaskCreate/TaskStop | Sub-agent management |
| Team | TeamCreate/TeamDelete/SendMessage | Multi-agent collaboration |
| MCP | MCPTool/McpAuth/ListMcpResources | MCP protocol integration |
| Planning | EnterPlanMode/ExitPlanMode | Planning mode toggle |
| Skills | SkillTool/ToolSearch | Skill loading and search |

### Layer 2: Query Engine

`QueryEngine.ts` is the heart of the system — managing conversation history, tool dispatch, token tracking, cost accounting, and error recovery.

### Layer 3: Coordinator Mode

One of the most valuable discoveries. Claude Code has an internal **coordinator mode** that lets a primary agent orchestrate multiple sub-agents working in parallel, each with independent tool permissions and context.

### Layer 4: Memory System

A complete memory architecture:
- **memdir**: Directory-based memory storage (per-project and global)
- **extractMemories**: Automatic extraction of memorable information from conversations
- **findRelevantMemories**: Semantic search across stored memories
- **memoryAge**: Memory aging and cleanup
- **teamMemSync**: Team memory synchronization

### Layer 5: Context Compaction

Four compression strategies: autoCompact, microCompact, sessionMemoryCompact, and reactiveCompact (internal, unreleased).

### Layers 6-12: Advanced Features

Permission system, Skills framework, MCP integration, Voice mode (developed but unreleased), KAIROS autonomous mode (internal testing), remote control with kill switches, and telemetry.

## Key Discoveries

### Animal Codename System

Anthropic uses animal codenames internally: Capybara (Claude 3.5), Tengu (Claude 4), Fennec (Opus 4.6), and **Numbat** (next generation, in development). References to Opus 4.7 and Sonnet 4.8 were also found.

### Undercover Mode

The most controversial finding: Anthropic employees using Claude Code in public repositories automatically enter "undercover mode." The model is instructed to hide its AI identity and write code "as a human developer would."

### Remote Control

Claude Code polls Anthropic's servers hourly for settings updates. Anthropic can remotely switch model versions, enable/disable features, trigger kill switches, and modify permission policies. Rejecting dangerous setting changes **causes the app to exit**.

### KAIROS: Fully Autonomous Agent Mode

Codenamed **KAIROS** — a fully autonomous agent mode with heartbeat mechanisms, push notifications, and GitHub PR subscriptions. This is Anthropic's vision for a 24/7 AI developer.

## What This Means for Developers

**What you can learn**: The 12-layer architecture is a masterclass in agent system design. The memory system, context management, and tool permission patterns are directly applicable to any agent project.

**What's being built**: Clean-room Python rewrites are already underway. Expect usable open-source alternatives within 1-2 weeks.

**Legal risk**: The source is Anthropic's intellectual property. Learn the architecture, don't copy the code.

## Industry Impact

1. **Accelerated competition**: Chinese AI coding tools (GLM, Kimi, Trae, Mimo) now have a complete reference architecture
2. **Open source momentum**: The leak may push Anthropic to proactively open-source components
3. **Harness Engineering as a discipline**: It's not about who has the best model — it's about who builds the best harness
4. **Security wake-up call**: npm package decompilation yielded the full source, highlighting that JS/TS code protection is essentially zero

---

*This article is based on publicly available GitHub repository information and is intended for technical research and educational purposes only. Commercial use of leaked source code is not encouraged.*

*Published April 1, 2026 | [WPClawAI](https://wpclawai.com)*
