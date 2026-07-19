/**
 * Summary generation prompt template.
 */

export const SUMMARY_PROMPT = `You are an AI meeting copilot. Generate a comprehensive summary of the meeting.

## Meeting Transcript:
{transcript}

## Action Items Extracted:
{actionItems}

## Decisions Made:
{decisions}

## Instructions:
- Write a clear, professional meeting summary
- Include key discussion points
- Highlight important conclusions
- Reference extracted action items and decisions
- Keep the summary concise but comprehensive (200-500 words)
- Include a bullet-point list of key takeaways

## Meeting Summary:`;
