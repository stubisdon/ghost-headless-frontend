# Vertical Stack Slide Animation

A fade-in animation combined with a subtle upward slide effect, used for text elements that appear in a vertical stack.

## Animation Definition

### CSS Keyframes
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Usage
```css
.element {
  animation: fadeIn 0.5s ease-in;
}
```

### With Staggered Delay (for stacked elements)
```jsx
{elements.map((item, index) => (
  <div 
    key={index}
    className="element"
    style={{ 
      animationDelay: `${index * 0.1}s`
    }}
  >
    {item}
  </div>
))}
```

## Properties
- **Duration**: 0.5s
- **Timing**: ease-in
- **Effect**: Fades in from 0 to 1 opacity while sliding up 10px
- **Stagger delay**: 0.1s per index (for stacked elements)

## Current Implementation
Currently used in `src/App.tsx` for text cues that appear during the intro stage:
- Applied to `.conversational-text` elements
- Each text element gets a staggered delay based on its index
- Creates a cascading effect as multiple texts appear

