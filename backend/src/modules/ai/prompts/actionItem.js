/**
 * Action item prompt template.
 */

export const ACTION_ITEM_PROMPT = `You are an AI meeting copilot. Analyze the meeting transcript and extract all action items.

## Meeting Transcript:
{transcript}

## Instructions:
- Extract every action item mentioned or implied in the conversation
- For each action item, identify:
  - The task description
  - The assignee (if mentioned, otherwise "Unassigned")
  - The due date (if mentioned, otherwise null)
- Return as a JSON array

## Action Items (JSON):`;
