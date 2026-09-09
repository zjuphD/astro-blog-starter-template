# Aiseeki Daily V2

Aiseeki Daily V2 narrows the automated briefing to high-signal life-science × AI research.

## Pipeline

1. Fetch the latest 5 days from Europe PMC.
2. Require both strong AI terminology and life-science relevance.
3. Reject bibliometric/editorial/weakly related records before ranking.
4. Score source quality, novelty, translational value, primary-research signals and evidence type.
5. Optionally use an OpenAI-compatible editor for a second publish/reject decision plus Chinese title, summary and significance.
6. Select at most 8 items with category/source/evidence diversity caps.
7. Preserve 21 days of automated history and 120 days of curated entries.
8. Open a review PR; only merged items are published.
9. After merge, capture source screenshots only for newly added items.

## Optional AI editor

Configure these repository Actions secrets to enable the second editorial pass:

- `BRIEFING_AI_URL`
- `BRIEFING_AI_KEY`
- `BRIEFING_AI_MODEL`

Without them, V2 still runs its stricter deterministic filter and ranking, but keeps the original English title/abstract excerpt instead of generating Chinese editorial copy.
