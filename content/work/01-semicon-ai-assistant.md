---
title: An AI assistant that is not allowed to choose the product
slug: ai-technical-assistant
summary: A conversational assistant that turns a visitor's plain-language measurement problem into a cited, technically validated recommendation — with a deterministic rule engine, not the language model, holding all recommendation authority.
tag: Applied AI
org: HORIBA India
period: 2026
role: Solution design, architecture, build, evaluation
status: Built and test-gated; in internal approval and rehearsal
stack: Next.js, TypeScript, Claude API, Retrieval (RAG), SQLite, Playwright, Vitest
order: 1
featured: true
metrics:
  - value: "44"
    label: "automated AI safety and rule-correctness test cases"
  - value: "0"
    label: "product recommendations made by the language model"
---

## The problem

At a technical exhibition, the bottleneck is not footfall. It is that a visitor with a
genuine measurement problem has to wait for one of a small number of applications
specialists to be free, describe their problem, and hope the specialist happens to know
the right instrument for that exact application. Most visitors never get that
conversation. The ones who do get it late.

The obvious fix — put a chatbot on a screen — fails for a specific reason. In analytical
instrumentation, a confidently wrong recommendation is worse than no recommendation. A
language model that invents a product name, or attaches a specification to the wrong
instrument, does not merely give a bad answer. It damages technical credibility with
exactly the audience whose trust the business depends on.

So the design question was never "can an LLM answer this?" It was: **how do you get the
fluency of a language model without ever letting it decide anything that matters?**

## The design principle

The architecture separates two jobs that chatbots usually blur together.

> The language model interprets the visitor's words and explains a result.
> It never selects a product. A deterministic, version-controlled rule engine does that.

In practice, the flow is:

1. The visitor describes the problem in their own words, or follows a guided path.
2. The model extracts **structured technical intent** — sample type, measurement need,
   constraints — and nothing else. It produces data, not conclusions.
3. That structured intent goes into a rule engine: explicit, reviewable, version-controlled
   rules written and signed off by people who actually know the instruments.
4. The rule engine returns an authorised measurement approach — or honestly returns
   nothing, which is a valid and important outcome.
5. Only then does the model write the explanation, constrained to what the rule engine
   authorised, with supporting passages retrieved from approved content.
6. Any generated explanation naming an unauthorised product is discarded and replaced
   with an approved template.

The result is a system where the failure mode is *"I need to bring in a specialist"* rather
than *"here is a confident answer that happens to be wrong."*

## Content governance

Retrieval is only as trustworthy as what it retrieves from. The ingestion pipeline crawls a
curated source list and is content-hash idempotent, so re-running it is safe and produces no
duplicates. Every ingested passage moves through a **draft → review → approved** workflow.
Nothing that has not been explicitly approved can ever be cited back to a visitor.

This is the part that gets skipped in most enterprise AI pilots, and it is the part that
determines whether the thing can be signed off internally.

## Treating model behaviour as testable

The system ships with a 44-case evaluation suite covering AI behaviour and rule correctness,
run alongside the normal software gates — type checking, linting, unit and integration tests,
end-to-end browser journeys, accessibility, security and performance checks.

That matters more than it sounds. It means a change to a prompt, a rule or the retrieval
layer is regression-tested the same way a code change is. Model behaviour stops being a
thing you spot-check before a demo and becomes a thing you can prove.

## How it was built

I designed the architecture and the safety model, wrote the specifications, and drove the
implementation and test suite, working with AI coding agents under Git version control.

I am not going to claim this makes me a software engineer. What it does show is something
I think is more relevant to a transformation role: the distance between *"we should try AI
for this"* and *working, governed, test-gated software* is now short enough that one person
who understands the business problem can cross it. Knowing where that line sits — and where
it does not — is increasingly the job.

## What I would carry forward

- **Decide what the AI is not allowed to do before deciding what it is.** The guardrail is
  the architecture, not a paragraph in the prompt.
- **An honest "I don't know" is a feature.** Routing to a human is a successful outcome, and
  building that in early removed most of the internal objections.
- **Governance is what gets it approved.** The evaluation suite and the content approval
  workflow did more to make this deployable inside a technical enterprise than any
  improvement to answer quality.
