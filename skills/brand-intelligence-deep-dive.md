# The Brand Intelligence Deep Dive
## How Goodo Studios Builds the Strategic Foundation That Makes Every Ad Better

**Version 2.0** | The Creative Record | March 2026

---

## Introduction: Why Most Creative Strategy Starts Too Late

Most agencies start creative work when the brief lands. Goodo starts creative work three meetings and a full research cycle before the first concept gets written.

That difference produces briefs where every claim is sourced, every hook is rooted in documented customer psychology, and every creator profile describes a real person instead of a demographic. It also produces briefs where the QA layer has something to check against -- because without a complete brand intelligence document, there's no standard to hold the brief accountable to.

Brand intelligence is not a strategy deck. It's not a mood board. It's the operational document that every downstream creative process reads before writing anything. When it's complete, briefs take an hour. When it's missing elements, briefs are guesses.

This skill documents the complete Goodo brand intelligence system: the three-meeting onboarding structure, the quality gates that must pass before research begins, the full research prompt actually used in practice, the 7 Zaltman deep metaphors with implementation guidance, and the cross-check process that integrates field performance data.

---

## What Brand Intelligence Actually Is

Brand intelligence is a living document that answers four questions with specific, sourceable facts:

1. **Who is the customer and what are they actually experiencing?**
Not demographics. A person at a moment in time. Age range, what they're doing when the ad reaches them, what they've already tried, what they've given up on, what they're still hoping for.

2. **What makes this product worth switching to?**
Not "high quality" or "the best in its category." What does this product do that competitors can't claim? What proof exists? What makes the mechanism real?

3. **What's stopping the right customer from buying?**
Specific objections. The thing they say to themselves when they almost bought but didn't. "I already tried something like this" is an objection. "Price concerns" is a category placeholder.

4. **What emotional territory does this product live in?**
Not the brand's preferred emotional territory -- the customer's. The 7 Zaltman deep metaphors map the unconscious frames customers use to understand products before they can articulate why they want them. Getting this right determines whether an ad feels resonant or just informative.

---

## The Three-Meeting Onboarding Structure

### Meeting 1: Pre-Meeting (Internal -- Before First Client Call)

This meeting never happens with the client. It's internal.

Before you talk to any new client, do the following:

**Review the brand:**
- Walk through the website. Read product pages, not just the homepage.
- Understand what they sell, who they say their customers are, and how they talk about themselves.
- Pull their Meta ads (use Meta Ad Library). What are they running? What angles are they using? What's clearly working (running for 30+ days) vs. what's clearly testing?
- Note your initial observations: Is the positioning clear? Is there an obvious hook they're missing? Is there a competitor doing something they should know about?

**Build the question list:**
Before the client call, write out every question you have. The onboarding call has limited time. Questions you don't ask in Meeting 2 you'll have to go back and ask separately, which delays everything.

**Develop preliminary hypotheses:**
What do you think is going on with this brand based on your review? Not conclusions -- hypotheses. You're forming questions, not answers.

**Define expectations:**
What will you deliver and when? What do you need from the client to deliver it? Get clear on this before the call so you can confirm on the call.

### Meeting 2: Client Onboarding Call

This is the only meeting where you're asking the client directly.

**What to cover:**
- Goals: What does success look like in 90 days? In a year?
- Pain points: What's not working right now? What have they already tried?
- Products/SKUs: Which products are the focus? Which are priority for creative?
- Success definition: Is this acquisition, retention, awareness, or a mix?
- Monthly deliverable expectations: How many pieces? What formats?
- Specific angles or messaging they want to test
- Confirmation of target launch date
- Missing assets request: Do you have a review CSV? Brand guidelines? Product photography? Access to Meta Ads Manager?

**What to listen for:**
- Language. The exact words they use to describe their customers. These belong in the brief, not your translation of them.
- Assumptions. What does the client believe about their audience that might not be true?
- Red flags. Is the client expecting results a creative strategy alone can't deliver? Are their expectations misaligned with the timeline?
- Surprises. What do they say that you didn't expect from your pre-meeting review?

**What to record:**
Take verbatim notes on language. You'll use these phrases in ad copy later. "We help busy parents find 30 extra minutes in their morning" -- that sentence lives in the brief, not a paraphrase.

### Meeting 3: Follow-Up (Internal -- After Client Call)

Second internal meeting. Review the call recording or notes together.

**Cover:**
- Key takeaways: What changed from your pre-meeting hypotheses?
- Surprises: What did the client say that you didn't expect?
- Red flags: Anything that suggests a strategic or relationship problem?
- Opportunities: What did the client mention that suggests a creative angle worth exploring?
- Responsibilities: Who on your team owns what?
- Deadlines: Confirmed for strategy presentation?

**Produce:**
A Coda card documenting: brand name, URL, product focus areas, client goals, monthly deliverable expectations, specific angles/ideas mentioned, target launch date.

### Quality Gate: Before Research Begins

Before you spend any time on the deep dive research, this gate must pass.

- [ ] You know exactly which products/SKUs to focus on
- [ ] You have (or have formally requested) the review CSV
- [ ] You understand the client's primary business goal
- [ ] You know the deadline for the strategy presentation
- [ ] All brand assets are downloaded and organized
- [ ] Follow-up meeting is complete and next steps are clear

If any of these are unchecked: stop. Get what's missing. Starting research before this gate passes produces a brand intelligence document that has to be partially rebuilt when the missing information arrives.

---

## The Full Research Prompt

This is the primary Claude prompt Goodo uses to build the brand intelligence document. It's reproduced here in full because the structure of the prompt determines the quality of the output.

```
You are an expert creative strategist and copywriter specializing in e-commerce advertising. You've been hired by [BRAND NAME] ([WEBSITE URL]) to build a strategic foundation for Meta advertising campaigns.

About the Brand:
[BRIEF DESCRIPTION OF WHAT THE BRAND SELLS AND WHO THEY SERVE]

Your Task -- Create a comprehensive brand intelligence document that includes:

1. Company Analysis: Full product catalog, brand positioning, all value propositions, all customer segments, pricing strategy, unique selling propositions.

2. Competitive Landscape: All major competitors in a table format: | Competitor | Website | USP | What they're doing better | What we can exploit |

3. Why [BRAND NAME] Is Unique: What differentiates them that competitors cannot easily claim.

4. SWOT Analysis: Strengths, Weaknesses, Opportunities, Threats. Minimum 3 items per quadrant.

5. Target Customer Profile: Full demographics, psychographics, all customer segments, motivations, day-in-the-life scenarios.

6. Reasons to Buy: Compelling motivations and benefits -- specific, not generic. "High quality" is not a reason to buy.

7. Hesitations to Buy: Every barrier, concern, and objection. Minimum 3 specific hesitations. "Price concerns" and "effectiveness doubts" are not hesitations -- they're placeholders.

8. Objection Handling: For each hesitation, a 2-3 sentence response framed for ad copy use.

9. Deep Metaphor Analysis through the Goodo Studios Reference Points Framework (7 metaphors: Balance, Transformation, Journey, Container, Connection, Resource, Control). For each metaphor: how it applies to this brand, what feelings it evokes, what visuals would represent it, what ad angles could come from it, what format best communicates it. Identify the 2-3 strongest metaphors for this brand.

10. Brand Voice Profile: Tone spectrum (formal-casual-playful), personality traits (3-5 adjectives), language style, what brand would never say, 5 example phrases.

11. Content Themes: 10 themes/angles with description and sample hook for each.

12. Competitor Ad Analysis: What angles competitors are using, what formats they're running, what appears to be working, what gaps they're leaving.

13. Messaging Recommendations: 3-4 core messaging pillars, a universal hook formula for this brand, 5-6 specific headline concepts.

Additional Context:
- Customer review data: [PASTE REVIEWS OR REVIEW THEMES FROM CSV]
- Top-performing existing ads: [DESCRIBE WHAT'S WORKING IF KNOWN]
- What the client told us: [KEY QUOTES FROM ONBOARDING CALL]

Tone: Write like a strategist talking to a colleague -- warm, direct, specific. Not like a consulting deck.
```

### How to Use the Research Prompt

**Input quality determines output quality.** The more specific the "About the Brand" description and the "Additional Context" section, the more grounded the document will be. Pasting 50 customer reviews is worth 100% more than "customers have responded positively."

**Review CSV is essential.** Customer language from reviews is the most valuable raw material in brand intelligence. Customers explain the product in their own words, describe the objections they had before buying, and articulate the transformation in language that no copywriter would generate from thin air.

**The prompt is a starting point, not the finish line.** Claude's output from this prompt needs human review and editing. The strategist reading it should be asking: "Is this specific enough? Is this actually true? Does this match what the client told us in the onboarding call?"

---

## The 7 Deep Metaphors: Complete Implementation Guide

This is Goodo's most distinctive strategic tool. The 7 Zaltman deep metaphors map the unconscious frames that customers use to understand, want, and justify purchases. Competitors ask "what's the pain point?" Goodo asks "what deep metaphor is this customer living in?"

The answer determines the emotional register of every ad -- not just the message, but the feeling.

### Metaphor 1: Balance

**Core Concept:** Restoring equilibrium to a system that's out of balance.

**Customer Language Signals:** "Finally feels right," "back to normal," "I can breathe again," "something was just off," "I feel like myself again."

**What It Evokes:** Relief. Return. Wholeness. The sense of something clicking back into place.

**Best For:** Sleep products, supplements, health and wellness, gut health, stress and anxiety, anything that addresses a dysregulation the customer didn't know had a name.

**Visual Territory:**
- Before: Chaos, fragments, contrast between light/dark or loud/quiet
- After: Stillness, integration, harmony, soft transitions
- Transition: A visual "click" -- the moment equilibrium returns

**Ad Angles for Balance:**
- "I didn't know I was out of balance until I was back"
- "Your body knows something is off. Here's how to fix it."
- "Three years of bad sleep. Fixed."
- The product as the restoration, not the treatment
- Naming the specific imbalance before offering the solution

**Format:** Balance works best in medium-length formats (30-45 seconds) that can show both states. The before needs space. Static ads struggle with Balance unless they can visually contrast the two states.

**The Bearaby Example:** Bearaby lives primarily in Balance. The weighted blanket doesn't add anything -- it restores the body's natural ability to relax. Ads built in Balance language talk about what was lost ("three blankets in the closet by March"), what the body already knows how to do, and what the product enables -- not causes.

---

### Metaphor 2: Transformation

**Core Concept:** Complete shift in identity or state. Not improvement -- becoming.

**Customer Language Signals:** "Changed everything," "like a different person," "I don't even recognize my old life," "before and after," "the moment I realized."

**What It Evokes:** Before/after tension. Identity shift. The irreversibility of having changed.

**Best For:** Weight loss, fitness, beauty, skincare, personal development, education, anything where the product enables identity change rather than maintenance.

**Visual Territory:**
- Before/After split (physical or metaphorical)
- The transition moment as the visual centerpiece
- The "new self" revealed, not just shown

**Ad Angles for Transformation:**
- The specific before state (named precisely, not generically)
- The turning point (what made the change happen)
- The "new normal" (what the after state actually feels like)
- The irreversibility ("I can't go back to who I was")
- The unexpected transformation (change happened in an area the customer didn't expect)

**Format:** Transformation works best in testimonial formats (video and UGC) where a real person can embody both states. Static ads with before/after imagery. Transformation requires duration to feel earned -- quick cuts don't work.

**Warning:** Transformation is overused and therefore requires specificity to land. "Transforming skincare" is meaningless. "Skin I stopped trying to hide by September" is transformation.

---

### Metaphor 3: Journey

**Core Concept:** Movement from State A to State B. Progress, not arrival.

**Customer Language Signals:** "On my way to," "getting closer," "step by step," "I'm not there yet, but," "I can see the difference."

**What It Evokes:** Progress. Momentum. Hope with evidence. The sense that the distance between here and there is closing.

**Best For:** Fitness, weight loss, skill-building, learning, anything where the outcome takes time and the customer needs to feel that the process is working.

**Visual Territory:**
- Movement -- walking, running, growing, climbing
- Checkmarks, progress indicators, milestones
- Evidence of change (not arrival)
- The road, the path, the direction

**Ad Angles for Journey:**
- Meeting the customer where they currently are (not at the beginning)
- Evidence that progress is happening
- The moment of belief -- "that's when I knew it was working"
- The comparison point (vs. 30 days ago, not vs. where they want to be)
- Reducing the perceived distance to the goal

**Format:** Journey works well in serialized content -- multiple ads that build on each other. Single ads need to compress the journey visibly. UGC is strong for Journey because creators can stand in for the customer at various points along the path.

---

### Metaphor 4: Container

**Core Concept:** Keeping good things in, bad things out. Protecting what matters.

**Customer Language Signals:** "Protect," "shield," "safe from," "keeps out," "locks in," "I don't want X anywhere near Y."

**What It Evokes:** Security. Boundary. Protection. The peace of knowing something is contained.

**Best For:** Sunscreen, baby products, food storage, supplements, anything that creates a barrier or a protected space.

**Visual Territory:**
- Barriers, bubbles, shells, enclosures
- The protected thing (usually something precious -- skin, a baby, food)
- The threat being kept out (visualized abstractly or literally)
- The boundary itself as the product

**Ad Angles for Container:**
- What are you protecting? (Name it specifically)
- What's trying to get in? (Name the threat with precision)
- What happens if the boundary fails? (Brief, not alarmist)
- The peace of knowing the container holds

**Format:** Container works best in static (clear visual of the protected thing + the barrier) and short video (showing the threat being stopped). UGC can work when the creator is protecting something specific.

---

### Metaphor 5: Connection

**Core Concept:** Relationships, closing distance, belonging.

**Customer Language Signals:** "Finally connected," "feels like belonging," "I feel understood," "we're closer now," "it brought us together."

**What It Evokes:** Belonging. Warmth. The feeling of being known. Closing a distance that felt permanent.

**Best For:** Family products, pet products, gifts, social products, anything where the product mediates or enables human (or human-animal) connection.

**Visual Territory:**
- People together (not posed -- actually together)
- Eye contact, touch, laughter
- The product as the bridge or the facilitator
- Shared experience, not solo experience

**Ad Angles for Connection:**
- The product as a connector (not the center of attention)
- The specific relationship the product serves
- The moment of connection as the payoff
- What was preventing the connection before

**Format:** Connection lives in video and UGC. Still images can hold Connection, but they need to show a specific moment rather than a generic "family together" stock photo.

---

### Metaphor 6: Resource

**Core Concept:** Having what's needed to succeed. Capability, equipment, readiness.

**Customer Language Signals:** "Now I have what I need," "equipped," "ready for anything," "I have everything I need to," "it gives me what I need to."

**What It Evokes:** Competence. Readiness. The confidence of having the right tools.

**Best For:** Productivity tools, outdoor gear, professional development, coaching, anything where the product increases capability.

**Visual Territory:**
- The equipped person vs. the unequipped person
- The gear laid out -- preparation for what's coming
- The specific task being accomplished with the right tool
- The "before the mission" energy

**Ad Angles for Resource:**
- What couldn't you do without this?
- What's now possible that wasn't before?
- The specific challenge this resource addresses
- The competition between equipped and unequipped

**Format:** Resource works well in problem-solution formats. Video can show the resource enabling the task. Static ads can lay out what you now have. UGC from people actively using the resource in real contexts is strong.

---

### Metaphor 7: Control

**Core Concept:** Ownership, mastery, self-determination.

**Customer Language Signals:** "Finally in control," "I decide now," "on my terms," "I stopped waiting," "I took back."

**What It Evokes:** Agency. Authority. The satisfaction of mastery. The end of helplessness.

**Best For:** Health tech, financial products, weight management, anything where the customer previously felt powerless and the product returns control to them.

**Visual Territory:**
- The person acting, not reacting
- Dashboards, metrics, progress shown
- The satisfied posture of mastery
- Contrast with the helpless state (before)

**Ad Angles for Control:**
- What were you at the mercy of before?
- What are you now in charge of?
- The specific decision this product enables
- The relief of agency (it doesn't feel like work -- it feels like freedom)

**Format:** Control works well in testimonial formats where the transformation from powerless to empowered is real and specific. Static ads can show the control state clearly. Voiceover ads where the narration IS the voice of control work well.

---

### Applying the Deep Metaphors: The Practical Process

**Step 1: Document all 7 for every brand**
Don't skip any. Some metaphors you'll dismiss quickly (Connection is clearly not the primary frame for a productivity app), but the exercise of considering each one prevents you from defaulting to the obvious frame without testing the alternatives.

**Step 2: Identify the primary metaphor**
Which metaphor does the customer experience most strongly when they think about why they want this product? Not why YOU want them to want it -- why THEY want it.

**Step 3: Identify 1-2 secondary metaphors**
Most products touch 2-3 metaphors. Bearaby is primarily Balance, secondarily Container (protecting sleep from intrusion) and Control (taking active control of sleep rather than hoping it happens). The secondary metaphors generate secondary angles for different ad concepts.

**Step 4: Write 5 hooks for each strong metaphor**
These hooks don't all go in the brief -- they inform the brief. They're the creative material you draw from when the time comes.

**Step 5: Cross-check with field data**
Which metaphors appear in top-performing ads? If the Verdanote data shows that Control-framed ads consistently outperform Balance-framed ads, the primary metaphor hypothesis is wrong and needs updating.

---

## Cross-Checking with Field Performance Data

The brand intelligence document is not the final word. Creative performance in the field reveals what the document can't.

**The Verdanote cross-check process:**

1. Pull the top 3 creatives by spend for the account
2. Analyze the hook and angle of each top performer: What deep metaphor does it live in? What Schwartz awareness stage is it targeting? What positioning angle is it using?
3. Check whether these angles and metaphors are documented in the brand intelligence doc

**If a top performer uses an angle not in the brand doc:** Flag this as "discovered-in-field knowledge gap." The brand intelligence doc must be updated to include what's working in the field, or future briefs will ignore the most productive angles.

**If the top performers consistently cluster around one metaphor:** The primary metaphor designation in the brand doc may need to be updated.

**The rule:** Brand intelligence documents must reflect both research AND field performance. One without the other is incomplete.

---

## Building the Full Brand Intelligence Document

### Section 1: Company Analysis

What to include:
- Full product catalog (every SKU or product line)
- Brand positioning statement (how they want to be seen)
- All value propositions (be exhaustive -- you'll edit down later)
- All customer segments with distinct profiles
- Pricing strategy and implications
- Unique selling propositions that competitors can't match

Quality standard: After completing this section, you can explain the business to a stranger without notes.

### Section 2: Competitive Landscape

Required table format:

| Competitor | Website | USP | What They Do Better | What They Miss | Gap to Exploit |
|-----------|---------|-----|--------------------|--------------------|---------------|

Minimum 5 competitors. Include direct AND indirect (products that compete for the same dollar, even if they're not in the same category).

Competitor ad analysis is separate: What angles are they running? What formats? What appears to be working (running 30+ days)? What's missing from their creative -- what objections or segments are they ignoring?

Quality standard: You can articulate what makes your client different from every competitor in one sentence per competitor.

### Section 3: Target Customer Profile

Full demographics are table stakes. What matters:

**Day-in-the-life scenarios:** Not "she's a busy mom." "It's 6:30 AM. She's unloading the dishwasher while her oldest is still asleep and the youngest is asking for something. Her phone is on the counter. The ad will reach her in approximately 45 seconds if she picks it up to check the weather."

**What they've already tried:** The purchase history and failure history shapes the hesitation map. Customers who've tried multiple solutions are Solution-Aware. Customers who've never bought in this category are Problem-Aware or Unaware.

**What they say to themselves:** Extract exact language from reviews. "I can't believe it took me this long to try this" -- that's the customer's before-state experience in their own words. Put it in the document.

### Section 4: Hesitation Map

Three sections:

**Hesitations (full list):** Every objection, barrier, and concern. Source as many as possible from reviews ("I almost didn't buy because..."). Minimum 3 specific hesitations -- not categories.

**Objection handling:** For each hesitation, a 2-3 sentence response framed for ad copy. This is not customer service copy -- it's how the ad addresses the objection before the customer can finish thinking it.

**Prioritized:** Which hesitations appear most often in reviews? Which, if removed, would most directly affect purchase intent? Those are the ones to build concepts around.

### Section 5: Proof Points

Types of proof (rank by specificity -- more specific = more persuasive):

1. Third-party statistics (the gold standard)
2. Customer testimonials with specific claims ("I lost 12 pounds in 60 days")
3. Social proof numbers ("Used by 50,000 customers")
4. Endorsements (specific person/publication, not "as featured in")
5. Trial/guarantee data ("97% of customers keep it past day 30")
6. Awards or recognition (specific, not vague)

Quality standard: Every proof point has a number or a quote. "Customers love it" is not a proof point.

### Section 6: Product Mechanism

Two questions to answer:

**What does it do?** The claim.

**How does it work?** The mechanism -- the specific chain of causation between using the product and experiencing the result.

The mechanism makes the claim believable. "It helps you sleep better" is a claim. "The even pressure distribution activates deep pressure receptors, triggering parasympathetic nervous system response" is a mechanism. The mechanism appears in ads as the "unique mechanism" positioning angle.

### Section 7: What It's NOT

Critical for preventing wasted production:

- Misconceptions the brand gets asked about
- Comparisons that make the brand look bad
- Claims that creatively seem appealing but are legally or strategically problematic
- Category associations the brand wants to avoid

This section saves money. Ads that inadvertently invoke the wrong comparison require reshoots.

### Section 8: Deep Metaphor Analysis

For each of the 7 metaphors: documented fully (see implementation guide above). Top 2-3 metaphors flagged. 5 hooks written for each strong metaphor.

### Section 9: Brand Voice Profile

- Tone spectrum: Where on the formal-casual-playful axis does this brand live?
- Personality traits: 3-5 adjectives that would describe the brand at a dinner party
- Language style: How does the brand talk?
- What brand would never say: The brand's blind spots and forbidden phrases
- 5 example phrases in the brand's voice

This section is for brief writers to check their copy against. "Would Bearaby ever say 'unlock the power of' anything?" -- no. That's important to know.

### Section 10: Messaging Recommendations

- 3-4 core messaging pillars (the through-lines across all creative)
- Universal hook formula for this brand (the structure that keeps working)
- 5-6 specific headline concepts ready to test

---

## Quality Gates for Research Completion

Before the brand intelligence document leaves research phase:

- [ ] 5+ competitors identified (direct and indirect)
- [ ] Competitor Meta ads reviewed
- [ ] Can articulate what makes client different from every competitor in one sentence each
- [ ] 2+ gaps competitors aren't exploiting
- [ ] Customer reviews imported and analyzed -- minimum 3 non-obvious insights
- [ ] SWOT complete with 3+ items per quadrant
- [ ] Hesitation list has 3+ specific objections (not categories)
- [ ] Each hesitation has an objection-handling response
- [ ] All 7 deep metaphors documented
- [ ] Top 2-3 metaphors identified with 5+ hooks each
- [ ] Verdanote cross-check complete (or noted as "data not yet available")
- [ ] Brand voice profile includes 5 example phrases

---

## How Often Brand Docs Need to Be Updated

Brand intelligence is not a one-time project. It needs maintenance.

**Staleness threshold: 30 days.** Any brand doc not updated in 30 days should be flagged for review.

**Triggers for immediate update:**
- Product launch or SKU addition
- Pricing change
- New high-performing creative discovered in field (update with the winning angle)
- Client call that surfaces new objections or customer language
- Review volume spike (positive or negative)

**The Guardian process:** Goodo runs a weekly brand intelligence audit every Sunday at 7 AM. The audit checks staleness, required section completeness, and Verdanote cross-check for every active client. Gaps trigger alerts before the week's briefs are generated.

---

## Implementation Guide: Building Your First Brand Intelligence Document

### Week 1: Three Meetings

Run the three-meeting onboarding structure above. Don't skip the internal meetings -- they're where the strategic thinking happens that shapes every question you ask the client.

By end of Week 1: Coda card complete, review CSV in hand, all quality gate elements confirmed.

### Week 2: Deep Dive Research

Run the full research prompt with the brand description populated from your onboarding meetings. Feed in customer reviews. Feed in what the client told you.

Read the output critically: Is it specific? Does it match what the client said? Is there anything in here that's confidently wrong based on your review of their Meta ads?

Edit. The research prompt output is a draft, not the document.

### Week 3: Deep Metaphor Session

This step is separate because it requires a different kind of thinking. You're not analyzing the brand -- you're mapping what the customer experiences at an emotional level.

Work through all 7 metaphors. Write the hooks. Identify the primary and secondary frames.

Then do the Verdanote cross-check if you have access to creative data.

### Week 4: QA and Handoff

Before any brief is written:
- Run through the quality gate checklist
- Have a second person read the document and ask: "Is anything here too vague to act on?"
- Confirm the document is filed at `clients/[SLUG]-brand-intelligence.md`

From this point forward, every brief writer starts here before opening a concept.

---

## QA Checklist

### Company Analysis
- [ ] Full product catalog documented
- [ ] At least 3 distinct value propositions
- [ ] Customer segments have day-in-the-life descriptions (not just demographics)
- [ ] Pricing strategy documented with implications for creative

### Competitive Landscape
- [ ] 5+ competitors with completed table
- [ ] Competitor Meta ads analyzed
- [ ] 2+ exploitable gaps identified
- [ ] Can differentiate client from every competitor in one sentence

### Customer Intelligence
- [ ] Day-in-the-life scenarios for primary segment(s)
- [ ] Customer language extracted from reviews (verbatim quotes)
- [ ] 3+ specific hesitations (not "price concerns")
- [ ] Objection-handling responses for each hesitation
- [ ] Purchase/failure history documented

### Proof Points
- [ ] At least 1 proof point with a specific number
- [ ] No proof points that are just "customers love it"
- [ ] Source documented for each proof point

### Product Mechanism
- [ ] HOW it works documented (not just what it claims)
- [ ] "What it's NOT" section complete
- [ ] Misconceptions documented

### Deep Metaphors
- [ ] All 7 metaphors documented
- [ ] Top 2-3 identified with justification
- [ ] 5+ hooks written for each strong metaphor
- [ ] Verdanote cross-check complete or noted

### Brand Voice
- [ ] Tone spectrum defined
- [ ] 3-5 personality traits
- [ ] 5 example phrases
- [ ] "Would never say" list

### Messaging
- [ ] 3-4 core messaging pillars
- [ ] Universal hook formula
- [ ] 5-6 headline concepts ready to test

### Maintenance
- [ ] Document dated
- [ ] Review cadence noted
- [ ] Verdanote cross-check scheduled
- [ ] Field performance updates incorporated
