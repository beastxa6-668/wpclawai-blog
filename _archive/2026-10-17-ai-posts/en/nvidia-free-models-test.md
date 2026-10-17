---
title: "NVIDIA Free AI Models Test: Only 3 Survive Peak Hours"
date: 2026-03-31
draft: false
categories: ["ai-tools"]
tags: ["NVIDIA", "free models", "AI", "benchmark"]
summary: "Tested 6 free NVIDIA AI models during peak hours. Result: mistral is fastest, nemotron is most stable, the rest are unusable."
---

## Background

NVIDIA offers free AI model APIs via integrate.api.nvidia.com. But are they reliable during peak hours? I ran two rounds of tests to find out.

## Test Method

- 3 calls per model, fixed prompt: "Reply OK only"
- 30-second timeout
- Tested at 2 AM (off-peak) and 5 PM (peak)

## Results

| Model | Off-peak | Peak | Avg Response | Verdict |
|-------|----------|------|-------------|---------|
| mistral-small-4-119b | 3/3 | 2/3 | 0.69s | ⭐ Fastest |
| nemotron-3-super-120b | 3/3 | 3/3 | 10.1s | ✅ Most stable |
| qwen3.5-122b | 3/3 | 2/3 | 6.9s | ✅ Usable |
| kimi-k2.5 | 2/3 | 0/3 | Timeout | ❌ Dead at peak |
| deepseek-v3.2 | 0/3 | 0/3 | Timeout | ❌ Always dead |
| glm-4.7 | 0/3 | 0/3 | 404 | ❌ Endpoint missing |

## Conclusion

Only 3 models survive peak hours:

1. **Mistral Small 4** — 0.69s response, blazing fast
2. **Nemotron 3 Super** — 100% success rate, but slow (7-14s), has reasoning
3. **Qwen 3.5** — Works but occasionally times out

The other three (Kimi, DeepSeek, GLM) are completely unusable during peak hours.
