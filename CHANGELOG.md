# multilanguage-flashcard

## 1.1.0

### Minor Changes

- feat: apply consistent UX improvements across all flashcard components
  - Add card counter display (e.g., "3/7") to all flashcard variants
  - Implement unified keyboard navigation: ←↑ previous, →↓ next, N for new card
  - Fix history management to preserve forward navigation without truncation
  - Add touch gesture support with swipe detection for mobile users
  - Update button layouts with proper disabled states and visual feedback
  - Separate navigation from card generation for clearer user experience
  - Add context-aware help text (different for touch vs keyboard users)
  - Maintain component-specific features (verb modes, explanation modes)

  Breaking: Arrow keys no longer flip cards (use space/enter instead)

## 1.0.4

### Patch Changes

- docs: update about page ([`6f80e9905ffa39a41c5ae714380d69ff0215e9b8`](https://github.com/shinokada/multilanguage-flashcard/commit/6f80e9905ffa39a41c5ae714380d69ff0215e9b8))
  tests: add about page

## 1.0.3

### Patch Changes

- chore: dependencies update

## 1.0.2

### Patch Changes

- chore: dependencies update
  docs: update about page

## 1.0.1

### Patch Changes

- fix: add removeHyphensAndCapitalize to lib/utils
  chore: dependencies update
  chore: add changeset dependencies
