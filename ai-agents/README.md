# AI Agents Skills Library

## Creating Intelligence that Acts

The **AI Agents Skills Library** is the definitive reference for building autonomous systems. It moves beyond simple "prompt engineering" into the engineering discipline of creating agents that can perceive, reason, and act in the world.

## Core Skills

### 🧠 Agent Architecture

* **[Context Engineering](./context-engineering/context-engineering.yaml)**: Managing the finite resource of LLM attention. Strategies for caching, pruning, and optimizing context windows to prevent "lost-in-the-middle" failures.
* **[Multi-Agent Orchestration](./multi-agent-orchestration/multi-agent-orchestration.yaml)**: Patterns for coordinating swarms of agents. From simple handoffs to complex supervisor hierarchies and blackboard systems.
* **[Agent Evaluation](./agent-evaluation/agent-evaluation.yaml)**: The science of testing non-deterministic systems. Frameworks for trajectory analysis, LLM-as-a-Judge, and simulation-based testing.

### 🔌 Capabilities

* **[Voice Agents](./voice-agents/voice-agents.yaml)**: Building conversational agents with <500ms latency. Covers Vapi, OpenAI Realtime API, and custom STT/LLM/TTS pipelines.
* **[Computer Use Agents](./computer-use-agents/computer-use-agents.yaml)**: Agents that control desktops and browsers. Security sandboxing, vision-action loops, and reliable DOM interaction.

## Using This Library

Each skill folder contains files prefixed with the skill name:

* `[skill-name].yaml`: The definitive source of truth for patterns, stack choices, and implementation guides.
* `[skill-name]-sharp-edges.yaml`: A "failure mode handbook" documenting specific ways these technologies break in production.
* `[skill-name]-validations.yaml`: Checklists and tests to verify your implementation is sound.
* `[skill-name]-collaboration.yaml` (Optional): Rules for how this agent interacts with others.

## Maintenance

* **Source of Truth**: The `Agincourt_Vault` is the canonical location for these skills.
* **Updates**: New patterns should be audited against `sharp-edges.yaml` before inclusion.
