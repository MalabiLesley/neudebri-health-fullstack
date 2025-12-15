# Design Guidelines: Sanitas-Inspired Healthcare Management System

## Design Approach

**Framework**: Material Design Healthcare Adaptation
- Healthcare applications demand trust, clarity, and accessibility
- Material Design provides excellent patterns for data-heavy interfaces and form-heavy workflows
- Customized with healthcare-specific component patterns and increased whitespace for medical data readability

## Typography System

**Font Stack**: 
- Primary: Inter (via Google Fonts CDN) - excellent for medical data and long-form content
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Type Scale**:
- Page Titles: text-3xl font-bold (patient names, dashboard headers)
- Section Headers: text-2xl font-semibold (appointment sections, medical records categories)
- Card Titles: text-lg font-semibold (appointment cards, prescription items)
- Body Text: text-base font-normal (medical notes, descriptions)
- Labels/Meta: text-sm font-medium (form labels, timestamps, status badges)
- Small Print: text-xs font-normal (disclaimers, technical details)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section margins: mb-8 to mb-12
- Card spacing: gap-4 to gap-6
- Form field spacing: space-y-4

**Grid System**:
- Dashboard: 12-column grid with 3-column sidebar (navigation) + 9-column main content
- Patient Portal: Full-width single column with max-w-7xl container
- Admin Tables: Full-width with responsive horizontal scroll for data tables
- Appointment Calendar: Weekly view in 7-column grid

**Container Strategy**:
- Authenticated Pages: Full viewport with fixed sidebar navigation
- Forms: max-w-2xl centered containers
- Data Tables: Full-width with inner padding
- Patient Cards: max-w-md for focused information display

## Component Library

### Navigation & Shell
**Primary Navigation (Sidebar)**:
- Fixed left sidebar (w-64) with logo, main nav items, user profile at bottom
- Nav items with icons (Heroicons) + labels, active state indication
- Collapsible on mobile (hamburger menu)

**Top Bar**:
- Global search, notifications icon, user avatar with dropdown
- Breadcrumb navigation for deep pages
- Height: h-16 with px-6 padding

### Dashboard Components
**Stat Cards**:
- Grid of 4 cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Each card: Icon + Number + Label + Trend indicator
- Padding: p-6, rounded-lg borders

**Appointment Cards**:
- Two-column layout on desktop (appointment details | patient/doctor info)
- Status badges (upcoming, completed, cancelled)
- Action buttons aligned to right
- Border-left accent for status indication

**Patient List Table**:
- Sortable columns: Name, ID, Last Visit, Next Appointment, Status
- Row actions: View Details, Message, Schedule
- Alternating row treatment for readability
- Sticky header on scroll

### Forms & Data Entry
**Form Structure**:
- Label above input (space-y-1 per field group)
- Helper text below inputs (text-sm)
- Required field indicators
- Inline validation messages
- Multi-step forms with progress indicator at top

**Input Types**:
- Text fields: Full-width with focus states
- Dropdowns: Custom styled selects with search for long lists (e.g., medications)
- Date pickers: Calendar popover interface
- File uploads: Drag-and-drop zone for medical documents
- Checkboxes/Radio: Properly spaced for medical consent forms

### Medical Records Display
**Record Cards**:
- Accordion-style sections (Medical History, Medications, Lab Results, Vitals)
- Each section expandable with icon rotation
- Timeline view for chronological events (vertical line with date markers)
- Data presented in definition list format for clarity

**Vital Signs Display**:
- Chart visualization using Chart.js for trends
- Current value prominently displayed with normal range indicator
- Historical data in table below chart

### Messaging Interface
**Conversation View**:
- Two-column: Contact list (w-80) + Message thread
- Messages aligned left (received) and right (sent)
- Timestamps, read receipts, attachment previews
- Composer at bottom with attachment button

### Calendar/Scheduling
**Weekly View**:
- Time slots in 30-minute increments
- Color-coded appointment types
- Click to schedule, drag to reschedule
- Today indicator (vertical line)
- Responsive: Switches to daily view on mobile

## Iconography

**Icon Library**: Heroicons (Outline for navigation, Solid for status indicators)
- Navigation: home, calendar, document-text, chat-bubble-left, user-circle
- Medical: heart, beaker, clipboard-document-list, shield-check
- Actions: plus, pencil, trash, arrow-right, x-mark
- Status: check-circle, exclamation-circle, clock, check-badge

## Accessibility

**WCAG 2.1 AA Compliance**:
- All interactive elements keyboard navigable (tab order logical)
- Form inputs with associated labels (htmlFor/id pairing)
- ARIA labels for icon-only buttons
- Focus indicators visible on all interactive elements (ring-2 ring-offset-2)
- Sufficient contrast ratios for all text
- Alt text for all images, especially patient photos and medical imagery
- Screen reader announcements for status changes (aria-live regions)

## Images

**Medical Imagery Strategy**:
- **No Hero Images**: Healthcare portals prioritize immediate utility over marketing
- **Profile Photos**: Circular avatars (rounded-full) for patients and doctors
- **Medical Documents**: Thumbnail previews with full-screen modal view
- **Placeholder Images**: Use avatar initials for users without photos
- **Icons**: Heroicons for all interface elements (no custom SVGs)

## Animations

**Minimal, Purposeful Motion**:
- Dropdown menus: Fade + slide (duration-200)
- Modal dialogs: Fade overlay + scale content (duration-300)
- Loading states: Subtle spinner (animate-spin) for async operations
- Success confirmations: Brief checkmark animation (duration-500)
- Avoid: Page transitions, scroll animations, decorative motion

## Responsive Breakpoints

**Mobile-First Approach**:
- Mobile (base): Single column, stacked navigation in drawer
- Tablet (md:): Two-column layouts, visible sidebar
- Desktop (lg:): Three-column layouts, full feature set
- Wide (xl:): Wider containers (max-w-7xl), more table columns visible

**Critical Mobile Considerations**:
- Bottom tab navigation for key actions on mobile
- Touch targets minimum 44x44px
- Swipe gestures for message deletion, appointment actions
- Simplified forms with native mobile inputs (date, time pickers)

## Data-Heavy Screen Patterns

**Medical Records Page**: Tabbed interface (Overview, Medications, Labs, Imaging, History) with each tab showing relevant data table or timeline
**Appointment History**: Filterable table with date range picker, export to PDF option
**Prescription List**: Card layout with medication name, dosage, refills remaining, pharmacy info
**Lab Results**: Comparative view showing current vs. previous results with trend indicators

## Trust & Professionalism Elements

- Security badges (HIPAA compliance, encrypted data) in footer
- Professional credentials displayed for all providers
- Clear privacy policy links
- Session timeout warnings
- Audit trail indicators ("Last updated by Dr. Smith on...")