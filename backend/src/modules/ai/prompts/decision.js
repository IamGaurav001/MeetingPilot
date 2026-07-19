/**
 * Decision detection prompt template.
 */

export const DECISION_PROMPT = `You are an AI meeting copilot. Analyze the meeting transcript and identify all decisions that were made.

## Meeting Transcript:
{transcript}

## Instructions:
- Identify all explicit and implicit decisions made during the meeting
- For each decision, capture:
  - The decision text
  - Context or reasoning behind it
  - Who made or championed the decision (if identifiable)
- Return as a JSON array

## Decisions (JSON):`;
