# Study Chatbot - Technical Documentation

## Overview

In-app AI-powered study assistant that answers academic doubts with context awareness.

## Architecture

### Components

- **StudyChatbot.jsx** - React UI component (floating chat widget)
- **chatbotService.js** - AI logic and context injection

### Data Flow

```
User Question → Context Injection → OpenAI API → AI Response → UI Display
```

## Features

### 1. Chat UI

- Floating button (bottom-right)
- Expandable chat window
- Message history display
- User/AI message distinction
- Clear chat functionality

### 2. Context Injection

Pass context object to personalize responses:

```jsx
<StudyChatbot
  context={{
    subject: "Data Structures",
    marks: 75,
    grade: "B+",
    prediction: "A",
    weakAreas: ["Trees", "Graphs"],
    examType: "Mid-term",
    additionalInfo: "Struggling with recursion",
  }}
/>
```

### 3. AI Behavior

- Simple explanations by default
- Step-by-step problem solving
- Exam-oriented advice
- Context-aware responses
- No hallucination policy

## API Integration

### OpenAI Setup

1. Get API key from https://platform.openai.com/api-keys
2. Go to Settings in app
3. Enter API key
4. Key stored in localStorage (never sent anywhere except OpenAI)

### Configuration

- Model: `gpt-3.5-turbo`
- Temperature: `0.7`
- Max tokens: `800`

## Usage Examples

### Basic Usage (No Context)

```jsx
import StudyChatbot from "./components/StudyChatbot";

function App() {
  return (
    <div>
      <StudyChatbot />
    </div>
  );
}
```

### With Subject Context

```jsx
<StudyChatbot
  context={{
    subject: "Operating Systems",
    examType: "Final",
  }}
/>
```

### With Full Context

```jsx
const context = {
  subject: subjectName,
  marks: currentMarks,
  grade: currentGrade,
  prediction: predictedGrade,
  weakAreas: identifiedWeakAreas,
  examType: "Mid-term",
};

<StudyChatbot context={context} />;
```

## System Prompt Structure

The AI receives a dynamically built prompt:

1. **Base Behavior** - Study assistant role, tone, style
2. **Injected Context** - Only provided data (no assumptions)
3. **Constraints** - No hallucination, no irrelevant info

Example:

```
You are a calm, friendly study assistant...

CONTEXT PROVIDED BY USER:
- Subject: Data Structures
- Current Marks: 75
- Weak Areas: Trees, Graphs

Use this context intelligently...
```

## Security

### API Key Storage

- Stored: `localStorage` (client-side only)
- Never logged or transmitted except to OpenAI
- User can clear via Settings

### Privacy

- No chat history saved permanently
- No data sent to external services
- All processing client-side

### Key Functions

```javascript
saveApiKey(apiKey); // Save to localStorage
getApiKey(); // Retrieve from localStorage
clearApiKey(); // Remove from localStorage
validateApiKey(key); // Test if key works
```

## Customization

### Modify AI Behavior

Edit `buildSystemPrompt()` in `chatbotService.js`:

```javascript
const buildSystemPrompt = (context) => {
  let basePrompt = `Your custom instructions...`;
  // Add context injection logic
  return basePrompt;
};
```

### Change Model

Edit `chatbotService.js`:

```javascript
const MODEL = "gpt-4"; // or any OpenAI model
```

### Adjust Response Length

```javascript
max_tokens: 1200; // Increase for longer responses
```

## Error Handling

### No API Key

Response: "Please set your OpenAI API key first..."

### API Error

Response: "Sorry, I couldn't process your question. Please try again."

### Network Issues

Caught and displayed as error message

## Styling

### Theme Support

- Light/Dark mode compatible
- Uses Tailwind classes
- Respects app theme

### Customization

Modify classes in `StudyChatbot.jsx`:

- Widget button: `.fixed.bottom-6.right-6`
- Chat window: `.w-96.h-[600px]`
- Messages: `.max-w-[80%]`

## Performance

### Optimizations

- Messages scroll to bottom on new message
- Loading state during API call
- Disabled input while loading
- No persistent storage (lightweight)

## Integration Checklist

- [x] Install no additional dependencies (uses native fetch)
- [x] Add StudyChatbot component
- [x] Add API key input in Settings
- [x] Import in App.jsx
- [x] Place `<StudyChatbot />` in component tree
- [x] (Optional) Pass context object

## Troubleshooting

### Chatbot not responding

1. Check API key is set (Settings)
2. Check browser console for errors
3. Verify API key is valid
4. Check internet connection

### Wrong answers

- Ensure context is accurate
- Check system prompt in `chatbotService.js`
- Verify model configuration

### UI issues

- Check Tailwind classes
- Verify z-index (should be 50)
- Check dark mode compatibility

## Future Enhancements

Possible additions (not implemented):

- Chat history persistence
- Multiple conversation threads
- Voice input/output
- Code syntax highlighting
- LaTeX math rendering
- Export conversation
- Multi-turn context retention

## Files Created

1. `/src/components/StudyChatbot.jsx` - UI component
2. `/src/utils/chatbotService.js` - AI service layer
3. Updated `/src/App.jsx` - Integration + API key settings

## Cost Considerations

### OpenAI Pricing (as of 2026)

- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Average question: ~500 tokens
- Cost per question: ~$0.001

### Optimization Tips

- Use shorter prompts when possible
- Reduce max_tokens if brief answers sufficient
- Consider caching common responses (not implemented)

## License & Credits

Built for Academic Tracker app by Arham.
Uses OpenAI API for AI responses.
