---
title: From shared inboxes to a traceable lead lifecycle
slug: lead-management-transformation
summary: Replacing fragmented shared-mailbox enquiry handling with a centralised, automated lead workflow across Power Automate, SharePoint and Salesforce — and a lifecycle framework that finally connected a digital enquiry to its sales outcome.
tag: Automation & CRM
org: Enterprise B2B · Scientific instrumentation
period: 2025 — present
role: Process design, workflow architecture, CRM requirements, rollout
status: Operating
stack: Microsoft Power Automate, Microsoft 365, SharePoint, Excel, Salesforce
order: 3
featured: true
metrics:
  - value: "1"
    label: "lifecycle framework across Digital, Marketing and Sales"
  - value: "0"
    label: "enquiries relying on manual mailbox triage"
---

## The problem

Digital enquiries arrived into shared mailboxes and were handled by whoever opened them
first. There was no consistent qualification step, no defined routing logic, and no agreed
vocabulary for what a lead's status meant. Two people could describe the same enquiry
differently, and often did.

The consequence was not just inefficiency. It was that **nobody could answer the only
question leadership actually cared about**: of the enquiries digital generated, what
happened to them?

Marketing could report enquiry volume. Sales could report orders. Nothing connected the two,
which meant every conversation about digital's contribution was an argument about
attribution rather than a discussion about performance.

## What I built

A centralised digital lead-management workflow, assembled deliberately from tooling the
company already owned rather than a new platform purchase.

**Capture.** Website enquiries and shared-mailbox arrivals flow into a structured lead
master through Power Automate, so an enquiry becomes a record with fields rather than an
email in a thread.

**Qualification and routing.** Defined assignment logic distributes enquiries to the correct
business segment and owner — replacing the informal, mis-assignment-prone approach that
routinely sent an enquiry to someone with no context for it.

**Lifecycle.** A single status framework agreed across Digital Marketing, Marketing and
Sales:

> Pending → Qualified (Hot / Cold) → In Progress → Order Received / Dropped / Junk,
> with sub-statuses for lost opportunities.

The point of the framework is not the labels. It is that everyone uses the same ones, so a
status means the same thing in a dashboard as it does in a sales review.

**Reporting.** Salesforce reporting built on top: daily digital enquiries by business
segment, month-wise lead and opportunity status, owner-wise lead management views, lead
ageing and pipeline tracking, plus enquiry-source analysis.

## What it changed

Digital enquiries became traceable end to end. Business heads got visibility into their own
segment's pipeline without asking for it. Mis-assigned enquiries — previously discovered
weeks later, if at all — became visible immediately. And the conversation about digital
performance moved from attribution disputes to pipeline review.

## What I would carry forward

- **Agree the vocabulary before automating anything.** The lifecycle framework was harder to
  land than the technology, and mattered more. Automating an ambiguous process just produces
  ambiguity faster.
- **Use the licences you already have.** Power Automate, SharePoint and Salesforce were
  already paid for. A new platform would have needed a business case, a procurement cycle and
  a change programme to deliver the same outcome.
- **Instrument the before-state.** If I were starting again I would capture baseline
  response times and mis-assignment rates on day one, so the improvement could be stated as a
  number rather than described.
