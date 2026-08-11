# Orchestrator architecture research — 2026-08

## Decision

Use a deterministic, manager-owned state machine with structured specialist artifacts. Do not begin with autonomous group chat.

For the current repository, the least costly practical implementation is:

- persistent workflow and event tables;
- JSON Schema validation at every boundary;
- a small job runner with leases, idempotency and scheduled wake-ups;
- explicit human approval records;
- OpenAI Agents SDK manager-style specialist calls and tracing if an agent runtime is introduced;
- later adoption of LangGraph or Temporal only if real durable-pause/recovery/concurrency needs exceed this simple runtime.

## OpenAI Agents SDK

Official guidance distinguishes handoffs, where a specialist takes ownership, from agents-as-tools, where a manager retains control. This system needs stable global workflow ownership, so manager-style bounded specialist calls fit better. The SDK also provides sessions, guardrails, resumable approvals and built-in traces across model calls, tools, guardrails and handoffs.

Sources:
- https://developers.openai.com/api/docs/guides/agents
- https://developers.openai.com/api/docs/guides/agents/orchestration
- https://developers.openai.com/api/docs/guides/agents/integrations-observability
- https://openai.github.io/openai-agents-python/human_in_the_loop/

## LangGraph

LangGraph supports explicit graphs, persistent checkpoints, cross-thread stores, fault tolerance and dynamic interrupts. It is strong when a workflow must pause and resume durably or mix deterministic and agentic nodes. Its own documentation warns that side effects before an interrupt must be idempotent. This directly informed the idempotency/reconciliation rules.

Sources:
- https://docs.langchain.com/oss/python/langgraph/overview
- https://docs.langchain.com/oss/python/langgraph/persistence
- https://docs.langchain.com/oss/python/langgraph/interrupts

## CrewAI

CrewAI Flows provides state, conditional routers, persistence and human-feedback gates. It can implement this graph, but Crew/task abstractions add little value while the current system is mostly a fixed pipeline with narrow specialist contracts. It remains a valid alternative, not the default.

Sources:
- https://docs.crewai.com/
- https://docs.crewai.com/v1.15.14/en/concepts/flows
- https://docs.crewai.com/v1.15.12/en/guides/flows/mastering-flow-state

## AutoGen and Microsoft Agent Framework

AutoGen provides teams, GraphFlow, state save/load and observability, but conversational team patterns are less suitable for a pipeline that must preserve one owner, controlled variables and explicit business approvals. Microsoft now documents migration from AutoGen to Microsoft Agent Framework, so a new implementation should evaluate the newer framework rather than commit to AutoGen by habit.

Sources:
- https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/state.html
- https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/
- https://www.microsoft.com/en-us/research/project/autogen/

## Temporal

Temporal provides durable workflow history, activities, retries, timers, signals and queries. It is the strongest option when workflows run for days, must survive process failure, wait for humans without losing approval, or coordinate many external side effects. It is not justified yet for this small business because it adds infrastructure and operational cost. The state/idempotency design keeps migration possible.

Sources:
- https://docs.temporal.io/
- https://learn.temporal.io/tutorials/ai/building-durable-ai-applications/human-in-the-loop/
- https://temporal.io/blog/what-is-durable-execution

## Architecture principles adopted

- Deterministic edges, agentic work inside bounded nodes.
- One current owner.
- Immutable versioned artifacts, not unstructured chat as memory.
- Schema validation before and after every handoff.
- Append-only audit trail.
- Optimistic concurrency and idempotent side effects.
- Human approval stored durably before execution.
- No automatic retry for logic, permission, commercial-fact or safety failures.
- Analytics recommends; Strategist decides.
- Shared knowledge is earned from completed evidence, not raw model memory.
