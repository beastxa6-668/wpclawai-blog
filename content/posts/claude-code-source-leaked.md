---
title: "Claude Code 源码泄露全解析：12 层 Harness 架构拆解"
date: 2026-04-01T11:00:00+08:00
draft: false
tags: ["AI", "Claude Code", "源码分析", "Harness Engineering", "Anthropic"]
categories: ["AI 深度分析"]
description: "2026年3月31日，Anthropic 旗下 AI 编程工具 Claude Code 的完整内部源码被泄露。本文深度拆解其 12 层 Harness 架构，分析对开发者和 AI 行业的影响。"
---

## 发生了什么

2026 年 3 月 31 日深夜，Claude Code v2.1.88 的完整内部源码被泄露到 GitHub。

这不是普通的开源——Claude Code 虽然通过 npm 发布，但发布的是打包后的单文件 `cli.js`（约 12MB），内部 TypeScript 源码从未公开。这次泄露的是**解包后的完整源码**，包含 40+ 工具定义、多 Agent 协作架构、记忆系统、权限控制等核心实现。

泄露后 24 小时内，GitHub 上出现了 **1500+ 个相关仓库**，最热的 collection 仓库一天内获得 145 星 257 fork。已经有团队开始基于泄露源码做 Python 重写版。

这是 AI 编程工具领域迄今为止最大规模的源码泄露事件。

## 源码里有什么：12 层 Harness 架构

Claude Code 的核心不是模型本身，而是围绕模型构建的 **Harness（线束）工程**。源码揭示了 12 层递进式架构，每一层都在基础 Agent 循环之上叠加生产级能力：

### 第 1 层：工具系统（Tool System）

源码中定义了 **40+ 工具**，远超公开文档：

| 工具类别 | 包含 | 说明 |
|---------|------|------|
| 文件操作 | FileRead/FileWrite/FileEdit | 基础读写编辑 |
| 搜索 | Grep/Glob/WebSearch/WebFetch | 本地+网络搜索 |
| 执行 | Bash/PowerShell/REPL | 命令执行 |
| Agent | AgentTool/TaskCreate/TaskStop | 子 Agent 管理 |
| 团队 | TeamCreate/TeamDelete/SendMessage | 多 Agent 协作 |
| MCP | MCPTool/McpAuth/ListMcpResources | MCP 协议集成 |
| 计划 | EnterPlanMode/ExitPlanMode | 规划模式切换 |
| 技能 | SkillTool/ToolSearch | 技能加载和搜索 |

每个工具都有完整的权限控制、输入校验和错误处理。

### 第 2 层：查询引擎（QueryEngine）

`QueryEngine.ts` 是整个系统的心脏。它负责：
- 管理对话历史和上下文窗口
- 调度工具调用和结果处理
- 跟踪 token 消耗和成本
- 处理中断、重试和错误恢复

### 第 3 层：Coordinator 模式

这是最有价值的发现之一。Claude Code 内部有一个 **coordinator 模式**，可以让一个主 Agent 调度多个子 Agent 并行工作：

```
主 Agent（Coordinator）
├── 子 Agent 1：负责代码修改
├── 子 Agent 2：负责测试验证
└── 子 Agent 3：负责文档更新
```

子 Agent 有独立的工具权限和上下文，通过 `SendMessage` 工具通信。这就是 Anthropic 内部的多 Agent 协作方案。

### 第 4 层：记忆系统（Memory）

源码中有完整的记忆架构：

- **memdir**：记忆目录系统，支持按项目/全局存储记忆
- **extractMemories**：自动从对话中提取值得记住的信息
- **findRelevantMemories**：语义搜索相关记忆
- **memoryAge**：记忆老化和清理机制
- **teamMemSync**：团队记忆同步

这套系统比大多数开源方案都成熟。

### 第 5 层：上下文压缩（Compact）

Claude Code 有 **4 种压缩策略**：

| 策略 | 触发条件 | 方式 |
|------|---------|------|
| autoCompact | 上下文接近上限 | 自动摘要压缩 |
| microCompact | 单轮对话过长 | 局部压缩 |
| sessionMemoryCompact | 会话记忆过多 | 记忆层压缩 |
| reactiveCompact | 实时监控 | 动态压缩（内部未发布） |

### 第 6 层：权限控制（Permission）

分级权限系统：
- 文件读取：默认允许
- 文件写入：需要确认
- 命令执行：需要审批
- 网络请求：受限
- 子 Agent：继承父级权限

### 第 7-12 层：高级特性

| 层 | 功能 | 状态 |
|---|------|------|
| 7 | 技能系统（Skills） | 已发布 |
| 8 | MCP 协议集成 | 已发布 |
| 9 | 语音模式（Voice） | 已开发，未发布 |
| 10 | KAIROS 自主模式 | 内部测试 |
| 11 | 远程控制和 Kill Switch | 已部署 |
| 12 | 遥测和分析 | 已部署 |

## 核心发现：你不知道的 Claude Code

### 动物代号系统

Anthropic 内部用动物代号标记模型版本：
- **Capybara**（水豚）= Claude 3.5 系列
- **Tengu**（天狗）= Claude 4 系列
- **Fennec**（耳廓狐）= Opus 4.6
- **Numbat**（袋食蚁兽）= 下一代（开发中）

源码中还发现 **Opus 4.7** 和 **Sonnet 4.8** 的引用，说明下一代模型已在开发。

### 卧底模式（Undercover Mode）

最具争议的发现：Anthropic 员工在公开仓库使用 Claude Code 时，会自动进入"卧底模式"。模型被指示：

> "Do not blow your cover"——不要暴露你的 AI 身份，像人类开发者一样写代码和提交。

这意味着开源社区中可能存在大量由 AI 生成但伪装成人类贡献的代码。

### 远程控制能力

Claude Code 每小时轮询 Anthropic 服务器获取设置更新。Anthropic 可以远程：
- 切换用户的模型版本
- 启用/禁用功能
- 触发紧急停止（Kill Switch）
- 修改权限策略

如果用户拒绝危险设置变更，**应用会直接退出**。

### KAIROS：全自主 Agent 模式

源码中发现了代号 **KAIROS** 的全自主 Agent 模式：
- 带有 `<tick>` 心跳机制，Agent 可以持续运行
- 支持推送通知
- 可以订阅 GitHub PR 并自动处理
- 这是 Anthropic 对"24/7 AI 开发者"的愿景

## 对开发者意味着什么

### 能学到什么

1. **Harness 架构设计**：12 层递进式架构是教科书级的 Agent 系统设计
2. **工具系统设计**：每个工具的权限控制、输入校验、错误处理都值得参考
3. **记忆系统**：extractMemories + memdir 的组合方案非常实用
4. **上下文管理**：4 种压缩策略的设计思路可以直接借鉴

### 能复刻什么

已经有团队在做：
- **claw-code**：Python 重写版，专注核心 Harness 架构
- 各种变体项目正在 GitHub 上涌现
- 预计 1-2 周内会出现可用的开源替代品

### 法律风险

- 源码属于 Anthropic 知识产权，直接使用有侵权风险
- 但"学习架构思路 + 自己重写"是合法的（clean-room 重写）
- Anthropic 大概率会发 DMCA 删除原始泄露仓库
- 建议：**学思路，不抄代码**

## 对 AI 行业的影响

1. **加速竞品开发**：GLM、Kimi、Trae、小米 Mimo 等国产 AI 编程工具现在有了完整的参考架构
2. **开源趋势不可逆**：泄露反而可能推动 Anthropic 主动开源部分组件
3. **Harness Engineering 成为新赛道**：不是谁的模型好，而是谁的 Harness 做得好
4. **安全警示**：npm 包反编译就能拿到源码，说明 JavaScript/TypeScript 项目的代码保护几乎为零

---

*本文基于公开可获取的 GitHub 仓库信息撰写，仅供技术研究和学习交流。不鼓励任何商业使用泄露源码的行为。*

*发布于 2026 年 4 月 1 日 | [WPClawAI](https://wpclawai.com)*
