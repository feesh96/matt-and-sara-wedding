# Wedding design library

Shared tokens live in `app/theme.css`, shared layout styles in `app/design-system.css`.
Use `PageIntro` for each interior page's title and introduction, and `SectionDivider`
between distinct sections. Page-specific CSS should describe the composition, not
create another title or body-copy scale.

| Role | Desktop | Mobile |
| --- | --- | --- |
| Page and section title, Milton One | 69–80px | 58–69px |
| Long date title, Milton One | 59–72px | 50–59px |
| Card subheading, Milton One | 45–52px | 43–50px |
| Body copy, Cormorant Garamond | 19–22px | 19px |
| FAQ question, italic Cormorant Garamond | 25–29px | 25px |
| Action label, Cormorant Garamond | 16–18px | 16px |

Interior pages begin 48–64px below the header on desktop and 56px on mobile.
Title-to-copy or title-to-content spacing is 32px on desktop and 28px on mobile.
Every section divider has equal space on both sides: 48–64px on desktop and 48px
on mobile. Sections should not add vertical padding beside a divider.

Content is capped at 1120px and reading columns at 820px, both with 10% gutters
on smaller screens. Titles and introductions are centered; FAQ questions and
answers align left for easier scanning. Hotel blocks remain one accommodations
section, with smaller subheadings. FAQ rows remain one section, separated by fine
rules. The home photo hero retains its own viewport-based composition; its
following sections use the same titles, copy scale, and dividers as the rest of
the site.

Keep the established paper (`#f4efe6`), ink (`#161411`), gold (`#b49755`), and sage
(`#405c59`) palette. Use the existing diamond-and-line gold divider everywhere.

The registry card is an intentional exception: preserve its original typography,
internal spacing, and centered alignment rather than applying the shared card
subheading and body-copy tokens.
