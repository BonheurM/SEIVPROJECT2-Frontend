# AC1 Visual Mockup Reference

## Course Search Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🏫 Course Listing System           [Course Search] [Logout] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  Search by Department Code (e.g., CS, MATH, ENG)  🔍 │  │
│  │                                                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Showing 3 results for "CS"                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  CS 101 - Introduction to Computer Science           │  │
│  │  [3 credits]  Instructor: Dr. Smith                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  CS 201 - Data Structures                           │  │
│  │  [4 credits]  Instructor: Dr. Johnson              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  CS 301 - Database Systems                          │  │
│  │  [3 credits]  Instructor: Dr. Chen                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Search Bar Component
- Vuetify `v-text-field` with search icon
- Accepts 2-4 character department codes
- Triggers search on Enter or button click
- Shows validation error for invalid input

### Course Card Component
- Clean card design using existing Vuetify theme
- Shows: Department + Number, Title, Credits, Instructor
- Expandable for future features (description, prerequisites)
- Hover effect using theme colors

### Loading State
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ⟳ Searching courses...                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   No courses found for "XYZ"                │
│                                                             │
│              Try searching for CS, MATH, or ENG             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Color Usage (OC Theme)
- Primary (#80162B): Search button, active states
- Secondary (#E1E1E1): Card backgrounds
- Accent (#47121D): Hover states, links
- Success: Positive actions
- Error: Validation messages

## Responsive Behavior
- Desktop: 3 columns of course cards
- Tablet: 2 columns
- Mobile: 1 column, full width cards