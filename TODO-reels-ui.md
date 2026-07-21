# Reels UI: Instagram-style page updates

## Plan summary
- Update reels page UI to look like an Instagram Reel experience.
- Add a designable heading and description (editable in code for now).
- Keep the existing reel scrolling, video, and right-side actions.
- Improve layout, typography, spacing, gradients, and add subtle “Instagram-like” chrome.
- Optionally add a top overlay for heading/description that doesn’t interfere with reel interactions.

## Steps
1. Inspect current reels implementation (`pejah/app/reels/reels-client.tsx`).
2. Add a hero header + description overlay above the reels list.
3. Wrap reels in a centered container with Instagram-like feel (black background, soft gradients).
4. Add reel caption styling (username/handle look, text shadows, max width).
5. Add subtle top-left branding (or heading placeholder) and better mute button placement.
6. Verify responsiveness for mobile and desktop widths.
7. Run TypeScript check / lint (if available) and fix any issues.

