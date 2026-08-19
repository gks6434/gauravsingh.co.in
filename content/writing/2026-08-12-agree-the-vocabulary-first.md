---
title: Agree the vocabulary before you automate the process
description: The hardest part of a lead management transformation was not Power Automate or Salesforce. It was getting three teams to mean the same thing by the word "qualified".
date: 2026-08-12
tags: Process Automation, CRM, Digital Transformation
---

Every process automation project has a moment where you realise the tooling was never the
problem.

Mine came while mapping how digital enquiries moved from a shared mailbox to a sales
outcome. I had the flow diagrammed. Capture, qualify, route, report — clean, obvious, easy
to build in Power Automate. Then I asked four people what "qualified" meant.

I got four answers. All of them reasonable. None of them the same.

## Automating an ambiguous process just produces ambiguity faster

This is the part that transformation case studies skip. The technology in a workflow
automation project is rarely the constraint. Power Automate can move a record between states
all day. What it cannot do is tell you what the states mean, or make two departments agree.

And if you build before that agreement exists, you do not get an automated process. You get
an automated disagreement — running faster, at higher volume, with a dashboard on top
lending it a false air of precision. Now, instead of four people quietly using four
definitions, you have a chart that appears authoritative and means nothing, because the
number it displays is an aggregate of incompatible judgements.

The dashboard makes it worse, not better. Before, the ambiguity was visible in conversation.
After, it is buried under a percentage.

## The framework matters more than the labels

What actually unblocked the project was boring: a single lead lifecycle framework, agreed
across Digital Marketing, Marketing and Sales.

> Pending → Qualified (Hot / Cold) → In Progress → Order Received / Dropped / Junk,
> with sub-statuses for lost opportunities.

There is nothing clever about those labels. Any competent team could produce a similar list
in twenty minutes. The value was never in the taxonomy — it was in the fact that everybody
who touches a lead uses the same one, and that each status has a written definition someone
can be held to.

Once that existed, the automation became almost trivial. Structured capture into a lead
master, defined assignment logic, status management, reporting by segment and owner. A few
weeks of building on top of the harder several weeks of agreeing.

## How to get the agreement

Three things worked for me.

**Start from the disagreement, not the ideal.** Do not present a proposed framework. Present
the four different answers you collected, attributed to nobody, and let the room notice the
problem itself. People defend frameworks they helped resolve; they resist frameworks handed
to them.

**Make the cost concrete.** Abstract process debt persuades no one. "We cannot tell you what
happened to the enquiries digital generated last quarter" persuades everyone, because it is
the question leadership keeps asking and nobody can answer.

**Write the definitions down and make them visible.** Not in a slide. In the tool, in the
reporting, in the place where somebody sets the status. A definition that lives only in a
kick-off deck has a half-life of about six weeks.

## The thing I would do differently

I did not capture the before-state properly.

I know the process improved. Enquiries became traceable end to end, mis-assignment surfaced
immediately rather than weeks later, and business heads got segment visibility they had never
had. But I cannot put a number on the response time we removed, because I did not measure it
before I changed it.

That is the single most common mistake I see in process automation work, and I made it. The
baseline is available for free, exactly once, before you start. After that it is gone
permanently.

If you are about to automate something: **go and measure the current state this week**, even
crudely. Time from arrival to first response. Percentage assigned to the wrong owner.
Enquiries with no recorded outcome. It will take you a day, and it is the difference between
saying your work improved things and proving it.

---

*I write about digital transformation, enterprise automation and applied AI.
[Get in touch](/contact/) if you are working on something similar.*
