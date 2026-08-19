---
title: Never let the model decide
description: Most enterprise AI pilots fail an internal review not because the answers are bad, but because nobody can say what the system is structurally incapable of doing. Here is the pattern that fixes it.
date: 2026-08-19
tags: Enterprise AI, AI Governance, Digital Transformation
---

There is a moment in every enterprise AI pilot where someone senior asks the question that
kills it.

Not *"is it accurate?"* — you will have an accuracy number ready. The question is:
**"what happens when it's wrong in front of a customer?"**

If your answer is "we've tested it extensively" or "we've told it not to do that in the
prompt," the pilot is over. You just do not know it yet. Because what you have described is
a system that is *usually* right, and the person asking is responsible for what happens in
the cases where usually is not good enough.

## Accuracy is the wrong thing to argue about

The instinct is to respond by improving the model. Better prompts, more context, a bigger
model, more examples. This is a treadmill, and it is the wrong race, because the objection
was never really about the error rate.

The objection is about **authority**. Who, or what, is making the decision that carries
consequences? If the answer is "a language model, probabilistically, at runtime," then no
amount of measured accuracy resolves the concern — because the reviewer cannot inspect the
decision, cannot version it, cannot sign it off, and cannot guarantee it will not change
tomorrow.

You are asking someone to accept accountability for a process they cannot audit. They are
right to refuse.

## Separate interpretation from decision

The pattern that works is to split the system into two things that most chatbot
architectures blur together.

**Interpretation** — turning what a person said into structured data — is genuinely hard,
genuinely valuable, and exactly what language models are extraordinary at. A customer saying
"we're getting inconsistent readings on thin film samples and I think it's the substrate"
contains real structure. Extracting it is worth a great deal.

**Decision** — determining what should be recommended, quoted, approved or actioned — is
something else entirely. It is a business rule. It has an owner. It has consequences. It
needs to be reviewable by the person accountable for it, and it needs to produce the same
output tomorrow that it produced today.

So: let the model interpret. Do not let it decide.

In the system I built for a technical exhibition, this means the model reads the visitor's
description and produces structured technical intent — nothing more. That structure goes to
a deterministic, version-controlled rule engine written and approved by the people who
actually know the instruments. The rule engine returns an authorised answer. Only then does
the model write the explanation, constrained to what was authorised.

The language model is on both ends of the pipeline and in the middle of none of it.

## The three things this unlocks

**A reviewer can inspect the rules.** Not the weights, not the prompt, not a benchmark — the
actual rules, in a file, in version control, with a change history. Someone can read them,
disagree, and correct them. That is what sign-off requires and it is what a prompt can never
provide.

**The failure mode becomes acceptable.** When the rules produce nothing, the honest output is
"I can't answer this — here is a specialist." That is not a system failure. That is the
system working. Designing that path deliberately, and early, removed more internal objections
than any improvement in answer quality.

**Behaviour becomes testable.** Once decisions live in rules rather than in model outputs,
you can write test cases against them and run those cases on every change. My system has 44,
running alongside the normal type, lint, unit, end-to-end, accessibility and security gates.
Change a prompt, a rule or the retrieval layer, and the suite tells you what moved. Model
behaviour stops being something you spot-check before a demo and becomes something you can
prove.

## Retrieval does not solve this on its own

A common counter-argument: *ground it in our documents and it can't hallucinate.*

Retrieval helps a great deal — with one condition that most implementations skip. Retrieval
is only as trustworthy as what it retrieves from. If your knowledge base is "everything we
crawled," you have not eliminated the risk, you have relocated it: now the system can
confidently cite a superseded datasheet, an internal draft, or a page describing a product
you no longer sell.

Which is why the ingestion pipeline needs a governance workflow — draft, review, approved —
and the retrieval layer needs to be structurally incapable of citing anything that has not
been approved. Not "unlikely to." Incapable.

That is unglamorous work. It is also the difference between a demo and something that gets
deployed.

## What this means for how we adopt AI

The pattern generalises well past chatbots. Any process where you are tempted to put a
language model — quotation, triage, routing, qualification, approval — has the same shape:
an interpretation problem wrapped around a decision problem. The interpretation is the part
that was previously impossible to automate. The decision is usually the part you already
have rules for, written down somewhere, or living in the head of someone who has been doing
the job for fifteen years.

The value is not in replacing that person's judgement with a probability distribution. It is
in **capturing their judgement as explicit rules**, and then using AI to remove the friction
of getting a real-world problem into a form those rules can act on.

That is a less exciting story than autonomous AI. It also survives contact with a risk
committee, which is the only kind of AI adoption that reaches production.

---

*I write about digital transformation, enterprise automation and applied AI. If you are
working through something similar, I am always up for the conversation —
[get in touch](/contact/).*
