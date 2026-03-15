# The Creative Operations System
## How Goodo Studios Runs Creative at Scale Without Letting Chaos Win

**Version 2.0** | The Creative Record | March 2026

---

## Introduction: Why Creative Operations Break Down

Creative agencies don't fail on quality. They fail on operations.

The output is good, but the brief is late. The brief is on time, but the client never responded to the last one. The client is happy, but the lead pipeline has been cold for 60 days while the team focused on delivery. The pipeline looks healthy, but half the deals have been sitting at "Proposal" for a month without a response and nobody's noticed.

These aren't creative failures. They're operations failures. And because creative agencies are naturally wired to prioritize the work over the work about the work, operations failures tend to compound quietly until they become crises.

The Goodo operations system is built around one principle: **prioritize by constraint, not by category**.

Not "handle sales, then production, then client management" in that order every morning. Instead: identify the single thing that, if unblocked, creates the most forward motion -- and do that first, every day.

This document is the complete Goodo operations system: the constraint-first prioritization framework, the morning brief structure, the pipeline hygiene process, the referral system, and the nightly consolidation that keeps everything from slipping through the cracks.

---

## The Foundation: Constraint-First Prioritization

### What a Constraint Is

A constraint is not a problem. It's the one thing that, if it were solved, would make everything else easier or irrelevant.

In manufacturing, a constraint is the bottleneck in the production line -- the step that all other steps are waiting on. Everything else can run at full capacity, but if the bottleneck is slow, the whole system is slow.

Creative agencies have the same dynamic. At any given time, the business has one primary limiting factor:

- **Lead flow:** The pipeline is thin. No new clients = no future revenue. Every hour not spent on lead generation is a compounding problem.
- **Production capacity:** The pipeline is full but delivery is slow. Revenue is at risk because clients are waiting.
- **Retention:** Existing clients are unhappy or disengaged. Churn is the most expensive cost in a service business.
- **Matthew's time:** The CEO is the bottleneck. Everything that doesn't require Matthew's personal involvement should be handled without him.

### How to Identify the Current Constraint

Read `memory/tacit-knowledge.md` before building any brief or setting any agenda.

The current constraint lives there: documented from Matthew's last answer to the daily constraint question.

**The daily constraint question** is mandatory -- asked every morning, answered every morning, updated in tacit-knowledge.md every day. The constraint shifts rapidly. A week ago it might have been production capacity. Today it might be lead flow because a deal closed. Tomorrow it might be retention because a client is going quiet.

Never optimize the wrong constraint. The best version of a production deadline doesn't matter if the business is about to lose its next three clients to a cold pipeline.

### How the Constraint Changes Prioritization

**Constraint: Lead flow**
Today's most important action is the one that moves a warm deal closer to closing. A proposal that's been sitting unreturned for 10 days beats any production deadline that isn't immediately at risk.

**Constraint: Production capacity**
Today's most important action is unblocking the bottleneck in production. An overdue deliverable that risks a client relationship beats any new lead follow-up.

**Constraint: Retention**
Today's most important action is addressing any signal that a client is disengaging. Silent clients (no task movement in 7 days) beat new deals still in early stages.

**Constraint: Matthew's time**
Today's most important action is anything that requires Matthew specifically. Everything else should be handled independently -- decisions made, drafts sent, files updated -- without interrupting him.

---

## The Morning Brief

### The One Rule

The Morning Brief is the ONE morning message Matthew receives. No follow-up check-ins. No "just wanted to flag." No "quick update." One message at 8 AM. That's the system.

The brief is not a status update. It's a prioritized action list for one person's morning. It should be scannable in 15 seconds and actionable without a follow-up question.

### The 5-Step Build Process

**Step 0: Read the constraint**
Before touching any pipeline data or task list, read `memory/tacit-knowledge.md` for the current business constraint. This determines the ORDER of everything that follows.

**Step 1: Read today's context**
Check `memory/daily/[TODAY].md` for anything that carried over from yesterday -- unresolved items, meetings, deadlines Matthew flagged.

**Step 1B: Draft the constraint question**
Write the question that will close the brief: "What's the biggest constraint today?"

This question is mandatory. Matthew's answer shapes tomorrow's brief. Without it, the system loses calibration.

**Step 2: Pull pipeline data**
Check Attio for:
- Deals with no activity in 7+ days
- Proposals stalled 10+ days without response
- Any deal that changed stage since yesterday (momentum signals)

Don't dump the full pipeline. Find the ONE deal that most needs attention based on the current constraint.

**Step 3: Pull task data**
Check Coda task list. Categorize:
- **OVERDUE:** Due date past AND status not complete
- **DUE TODAY:** Due date is today AND not complete
- **STUCK:** Status "Client Review" for 3+ days
- **AT RISK:** Status "Assigned" or "Ready to Edit" AND due within 3 days

**Step 4: Pull meeting action items**
Check Fireflies for any meeting in the last 24 hours with assigned action items that haven't been logged.

**Step 5: Check for silent clients**
Active clients with zero task movement in 7+ days = potential churn risk. Flag if any exist.

### The Exact Output Format

```
[Day, Date] Morning Brief

🎯 [Single most important thing today -- weighted by current constraint. Client name + specific action needed.]

💼 [One pipeline deal: name, stage, days since last activity, one-line recommended action.]

⏰ [Most urgent production deadline within 48 hours -- ONLY if it requires Matthew's personal attention. Omit if nothing qualifies.]

📊 [Client flags: "🔴 X overdue | ⚠️ X stuck | 📌 X due today" -- specific client names for red/yellow flags.]

What's the biggest constraint today?
```

**Maximum 6 lines. No preamble. No sign-off. No motivational language. No "good morning." No "hope you're having a great day."**

If a line has nothing worth reporting, omit the line entirely rather than filling it with a placeholder.

### What Makes a Good Morning Brief

**Good:**
```
Monday, March 16 Morning Brief

🎯 Bearaby: Final video review due today -- Matthew needs to approve cut before production sends to client at 2pm.

💼 [Brand X]: Proposal stage, 12 days no response. Draft breakup email ready to send via Slack -- recommend sending before noon.

⏰ Bearaby cut approval (see above, same item).

📊 🔴 2 overdue: [Client A] UGC briefs, [Client B] static ad review | ⚠️ 1 stuck: [Client C] in Client Review 4 days.

What's the biggest constraint today?
```

**Why it works:**
- Opens with the thing that requires Matthew's action TODAY
- Pipeline item has specific context (days, stage, recommended action)
- Production flag is specific to the deliverable and the decision needed
- Client flags name specific clients -- not "some clients"
- Ends with the constraint question

**Bad:**
```
Good morning! Here's your daily update. The pipeline is looking active with several deals in various stages. There are some production items to be aware of. The team is working hard on deliverables. Let me know if you need anything!

What's the biggest constraint today?
```

**Why it fails:**
- Tells Matthew nothing he can act on
- "Various stages" is meaningless
- "Some production items" sends him hunting for specifics
- "Working hard on deliverables" is reassurance, not information
- The constraint question comes after a message that provided no constraints worth responding to

---

## Pipeline Intelligence: The Daily Process

### What Pipeline Intelligence Is Not

Pipeline intelligence is not a CRM report. It's not a list of all active deals sorted by stage. It's a daily decision: which ONE deal most needs attention today, and what specifically should happen?

Most agencies run pipeline reviews that produce reports. Goodo's pipeline intelligence produces a draft message ready to send.

### The 5-Step Pipeline Process

**Step 1: Pull all deals from Attio**
Full list of active deals with stage, days in stage, last activity date.

**Step 2: Read yesterday's snapshot**
Compare to `ops/sales/[YESTERDAY]-pipeline.md`. What changed? Which deals moved stages? Which ones were flagged yesterday and haven't moved?

**Step 3: Pipeline hygiene (Mondays only)**

This is the Monday-specific step that keeps the pipeline clean. A pipeline full of dead deals is worse than a short pipeline -- it provides false comfort and clutters the view of what's actually active.

**Close-out candidates:**

*Initial Reach Out, 45+ days, no response:*
Draft a breakup email. Recommend moving to Lost.

Formula: "[First name], I've reached out a couple times about working together. I don't want to be that person who keeps following up, so I'll leave it here. If creative strategy becomes a priority down the road, you know where to find us. -- Matthew"

*Lead, 60+ days, no activity:*
Flag for bulk close-out. These leads have cooled to the point where a breakup email is more appropriate than continued nurturing.

*Proposal, 30+ days, stalled:*
Flag for follow-up or move to Lost. A proposal that hasn't received a response in 30 days is either dead or paused. Find out which before investing more time.

**Step 4: Find the ONE deal most worth attention today**

Priority order (apply constraint-first logic here too):
1. Proposals with no response in 10+ days
2. Leads with no activity in 3+ weeks (going cold)
3. Deals that changed stage since yesterday (momentum to capitalize on)
4. New leads needing first follow-up (first impressions are one-shot)

**Step 5: Research the priority deal**

Before drafting any outreach, use web_search for recent company news: product launch, funding announcement, job postings indicating growth or contraction, ad campaigns going live, press mentions, leadership changes.

The goal: find a reason to reach out that isn't "just following up."

The best outreach message is specific enough that the recipient wonders if you've been watching them. "I saw that you just launched the new SKU lineup" is specific. "Checking in to see if you had any questions about our proposal" is a template.

**Write the draft message:** Under 100 words. No templates. References the intel naturally.

### The Stress-Test Layer

Before any pipeline recommendation reaches Matthew, run the stress-test:

1. **Counter-evidence:** Is there anything arguing AGAINST this being the right deal to focus on today? Red flags? Signs the deal is dead?

2. **Better option:** Is there another deal in the pipeline with stronger signals right now?

3. **Draft quality:** Would the recipient think "how does this person know that?" (good) or "I've gotten this email five times this week" (bad)?

**Verdict:** CONFIRMED or CHALLENGED.
**Draft quality:** READY or NEEDS REVISION.

If CHALLENGED: explain why, name the better option. If NEEDS REVISION: rewrite the draft or flag the specific weakness.

The stress-test exists because the pipeline agent has a natural bias toward the most obvious choice. The stress-test forces the question: is the obvious choice actually the right one?

### Pipeline Output Format

Save to `ops/sales/[DATE]-pipeline.md`:

```
## Pipeline Intelligence -- [DATE]

### Movement Since Yesterday
[What changed from previous snapshot]

### Active Deals (Proposal + Sales Call)
[Table: deal name, stage, days in stage, last activity]

### Today's Priority Deal
**Deal:** [Name]
**Stage:** [Stage]
**Days since activity:** [X]
**Why today:** [Specific reason tied to constraint + priority logic]

**Intel found:** [What web_search surfaced]

**Draft message:**
[Under 100 words. References intel. No template language.]

### Pipeline Health
[Key metrics: deals by stage, total pipeline value, deals at risk]

---

## STRESS TEST

**Counter-evidence:** [What argues against this deal?]
**Better option?:** [Any stronger signal elsewhere?]
**Draft quality:** READY / NEEDS REVISION

**Verdict:** CONFIRMED / CHALLENGED
```

---

## The Weekly Referral System

### The One Rule

One referral ask per week. One client. Highest priority only.

Not a referral report. Not multiple candidates. Not a template to fill in. One fully personalized ask, ready to send, for the single most referral-ready client this week.

### Why One Ask Per Week

The failure mode in referral systems is over-asking. Clients who get multiple referral requests in quick succession -- even spaced across weeks -- start to feel like they're being used for business development rather than valued as partners. The relationship cools.

One ask per week keeps the frequency low enough that when you do ask, it still feels like the natural end of a good conversation rather than a CRM-triggered follow-up.

The second failure mode is asking with no hook. "Do you know anyone who might benefit from our services?" is a networking request. "The Bearaby campaign hit 7x while we scaled spend 3x -- I'd love to work with more brands in the sleep category. Do you know any founders in that space?" is a referral ask.

### The 6 Principles

**1. Lead with a specific, recent, real thing**
"That Cuddler campaign hitting 7x while we scaled spend 3x" not "the results have been great."
The specificity signals that you're paying attention and that the result is worth telling someone else about.

**2. Make the ask small and specific**
"Do you know any DTC food brands or outdoor gear founders hitting a ceiling with creative?" not "anyone in your network."
The small, specific ask is easier to act on. "Does anyone come to mind?" is a single yes/no decision. "Anyone in your network" is an overwhelming search of hundreds of contacts.

**3. Offer the easy path**
"If anyone comes to mind, I can reach out cold -- just need a name."
Remove the friction of the introduction. Most clients who want to help will stop because they feel obligated to manage the introduction. Offer to handle it.

**4. One topic per message**
The referral ask is never bundled with a status update, a renewal conversation, or a meeting request. It's its own message. One thing.

**5. Never use the word "referral"**
"Know anyone else?" not "Can you make a referral?"
"Referral" signals that the ask is business development. "Know anyone else?" sounds like a natural extension of the conversation.

**6. No follow-up on a referral ask that went unanswered**
If a client doesn't respond to the referral ask, don't ask again. Move to the next client next week. Come back to this client in 90 days.

Following up on an unanswered referral ask signals desperation. The client knows what they were asked. If they had someone in mind, they'd have responded.

### Selecting the Client This Week

The highest-priority client for a referral ask is the one with:
- A recent, specific, measurable win (within the last 30 days)
- An active relationship (recent communication, regular meetings)
- A network that overlaps with your ideal prospect profile

Do not repeat the same ask. If a client received a referral ask this month, they're off the list for at least 90 days.

### Output Format

```
REFERRAL ASK THIS WEEK: [Client Name]

Why now: [One sentence -- specific recent win, ROAS number, milestone within last 30 days]

Draft (ready to paste):
[2-3 sentences. Specific result. Small ask. Easy path. No "referral" language. No em dashes.]

Send via: [Email / Slack / end of call -- recommend based on communication pattern]
```

The draft should be specific enough that the client recognizes their own results in the first sentence.

**Example:**
```
REFERRAL ASK THIS WEEK: Bearaby

Why now: UGC campaign from February brief hit 3.2x ROAS at $40K spend -- best performing month this year.

Draft (ready to paste):
The February campaign came in at 3.2x while we were scaling spend -- wanted to say that result doesn't happen without you making good production calls. Quick question: do you know any DTC wellness founders dealing with the same creative plateau you were in six months ago? Happy to reach out cold, just need a name.

Send via: Slack (active channel, faster response than email for this client)
```

---

## Nightly Knowledge Consolidation

### What It Is

The nightly consolidation is the system's memory function. At end of day, the system reviews what happened, extracts what matters, updates the relevant files, and sets up tomorrow.

It runs completely silent -- no notification to Matthew -- unless something happened that requires his attention.

### The Extraction Filter

The consolidation reviews all sessions and conversations from the day. It extracts ONLY:

- **Decisions made:** Must be attributable -- who decided what, when
- **Tasks assigned or completed:** Who, what, when
- **Client updates:** Status changes, new feedback, deliverable completions
- **Corrections from Matthew:** Any preference, process, or direction change
- **Open issues or flags:** Things that didn't resolve and need to carry forward

**Everything else is ignored:** Casual conversation, exploratory discussions, troubleshooting where nothing was decided, system chatter.

The extraction filter is important because it's selective by design. Not everything that happened today belongs in the memory system. The memory system should hold decisions and commitments -- not everything that was discussed.

### The File Update Process

**Update today's daily note:**
Add "What Happened Today" and "Unresolved / Carry Forward" sections to `memory/daily/[TODAY].md`.

**Create tomorrow's daily note:**
Start `memory/daily/[TOMORROW].md` with carried-forward items and any known scheduled meetings or deadlines.

**Client status updates:**
If any session mentioned a new client, a churned client, or a significant status change: update `memory/goodo-clients.md`.

**File hygiene check:**
- Any .md files in workspace root that don't belong?
- Any files in wrong directories?
- Any files using underscores, spaces, or uppercase letters where they shouldn't?
Misplaced files are moved silently. Noted in daily note.

**Git commit and push all changes.**

### When to Notify Matthew

The consolidation is silent by default. Notifications go out ONLY for:
- A client churned or was added
- Matthew made a correction to a process or preference (confirm the update is logged)
- A critical deadline for tomorrow that wasn't on today's agenda

Everything else: silence. Matthew should be able to go to sleep knowing the system is running and wake up to a clean brief with everything in order.

---

## The Full Operations Calendar

### Daily (Weekdays)

**8:00 AM:** Morning Brief delivered to Telegram.
**Morning:** Pipeline intelligence + stress-test run, saved to ops/sales/.
**Throughout day:** Daily creative briefs for active clients (automated per-client).
**11:00 PM:** Nightly knowledge consolidation.

### Monday Additions

**Pipeline hygiene:** Review and close-out candidates for Initial Reach Out 45+ days, Leads 60+ days, Proposals 30+ days.

**Weekly referral:** One client, one ask. Draft ready to send.

### Sunday

**Brand Intelligence Guardian (7:00 AM):** Weekly audit of all active brand docs. Flags staleness, missing sections, Verdanote gaps. Telegram summary to Matthew.

### Weekly (Timing Varies)

**Deep Analysis:** One client per week. Full 10-section report. Saved to ops/deep-analysis/.

---

## Implementation Guide: Starting From Zero

### Week 1: Build the Foundation

**Day 1:** Set up the constraint question. Ask Matthew: "What's the biggest constraint this week?" Document the answer in `memory/tacit-knowledge.md` under "Current Business Constraint." Everything else in Week 1 flows from this answer.

**Day 2:** Audit the pipeline. Pull every deal from the CRM. Sort by stage and days in stage. Flag anything that meets the close-out criteria. Don't close anything yet -- just identify.

**Day 3:** Build the brand doc checklist. For every active client, check whether the 5 required elements exist. Flag gaps. This sets the brief quality floor for the next week.

**Day 4:** Set up the morning brief template. Test it once with a real run-through of the 5-step process. Calibrate the format to match the current constraint.

**Day 5:** Run the first nightly consolidation manually. Review the week. What decisions were made? What needs to carry forward? What file hygiene is needed? Log it. Push to GitHub.

### Week 2: First Full Week

Run the complete system for one week. Morning brief every day. Pipeline intelligence every day. One referral ask on Monday. Nightly consolidation every day.

At the end of the week, review: Which parts required the most manual intervention? Which parts produced the lowest-quality output? Those are the first things to tune.

### Week 3: Calibration

The constraint will have shifted. Update tacit-knowledge.md. Rebuild the morning brief around the new constraint.

The biggest failure at the 3-week mark is treating the constraint as permanent. "We're constrained by lead flow, so we always prioritize pipeline" -- until the pipeline is full and the constraint is suddenly production capacity and the morning brief is still flagging pipeline items at the top.

Read the constraint question answer every day. Update it every day. The brief that's perfectly calibrated to last week's constraint is the wrong brief for this week.

---

## QA Self-Assessment Checklist

### Morning Brief
- [ ] Read current constraint from tacit-knowledge.md before building brief
- [ ] First item in brief weighted by constraint (not by category)
- [ ] Pipeline item cites specific deal + specific days + specific action
- [ ] Production deadline flag only if Matthew's personal action required
- [ ] Client flags name specific clients (not "some clients have items due")
- [ ] Constraint question present at end
- [ ] Maximum 6 lines
- [ ] No preamble, no sign-off, no motivational language

### Pipeline Intelligence
- [ ] Yesterday's snapshot read for comparison
- [ ] Monday pipeline hygiene complete (if Monday)
- [ ] ONE priority deal selected with justification
- [ ] Web_search run for recent company news on priority deal
- [ ] Draft message under 100 words and references intel
- [ ] Stress test run: counter-evidence, better option, draft quality
- [ ] Verdict: CONFIRMED or CHALLENGED with reasoning

### Weekly Referral
- [ ] One client selected (not multiple)
- [ ] Based on specific recent win (within 30 days)
- [ ] Draft leads with specific result (not generic praise)
- [ ] Ask is small and specific (not "anyone in your network")
- [ ] Easy path offered (reach out cold, just need a name)
- [ ] Zero uses of the word "referral"
- [ ] No bundling with other business topics
- [ ] Send channel recommended

### Nightly Consolidation
- [ ] Extraction filter applied (decisions, tasks, client updates, corrections, open issues only)
- [ ] Today's daily note updated
- [ ] Tomorrow's daily note created with carry-forwards
- [ ] goodo-clients.md updated if status changes occurred
- [ ] File hygiene check run
- [ ] Git commit and push complete
- [ ] Matthew notified ONLY if churn, correction, or critical deadline

### Constraint Management
- [ ] Constraint question asked every morning
- [ ] Answer updated in tacit-knowledge.md every day
- [ ] Morning brief priority reflects current constraint, not last week's
- [ ] All daily prioritization decisions traceable to current constraint

---

## One Last Thing

The operations system exists so that the creative work doesn't get interrupted by chaos.

The best brief in the world doesn't perform if the client relationship it's for is quietly dying because nobody noticed they'd gone quiet. The strongest hook formula is worthless if the strategist who writes it is also the person chasing down overdue invoice approvals because the pipeline process broke down.

Operations aren't the opposite of creative work. They're what makes creative work sustainable.

Prioritize by constraint. Ask the question every day. Update the answer. Let the system do the rest.
