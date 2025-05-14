Dashboard/
├── Dashboard.jsx # Main dashboard component
├── Sidebar/
│ ├── Sidebar.jsx # Main sidebar wrapper
│ ├── ProfileSection.jsx # Profile dropdown in sidebar
│ ├── SettingsRow.jsx # Language and theme switchers
│ ├── QuickActions.jsx # Action buttons section
│ └── BottomLinks.jsx # Settings and help links
├── MainContent/
│ ├── MainContent.jsx # Main content wrapper
│ ├── WelcomeSection.jsx # Welcome header with time-based greeting
│ ├── AISuggestions.jsx # AI suggestions panel
│ ├── StatsOverview/
│ │ ├── StatsOverview.jsx # Stats section wrapper
│ │ └── StatCard.jsx # Individual stat card
│ ├── RecentPlans/
│ │ ├── RecentPlans.jsx # Recent plans section wrapper
│ │ └── PlanCard.jsx # Individual plan card
│ ├── AIInsights/
│ │ ├── AIInsights.jsx # AI insights panel wrapper
│ │ └── InsightCard.jsx # Individual insight card
│ └── Timeline/
│ ├── Timeline.jsx # Timeline section wrapper
│ └── TimelineItem.jsx # Individual timeline item
└── styles/
└── dashboard.css # Dashboard-specific styles

# Dashboard Component System

A modern, modular dashboard system designed for First Darfy's business planning application with a futuristic aesthetic.

## Structure

The dashboard is organized into small, reusable components:

```
Dashboard/
├── Dashboard.jsx               # Main dashboard component
├── Sidebar/                    # Left sidebar components
├── MainContent/                # Main content area components
│   ├── StatsOverview/          # Stats cards components
│   ├── RecentPlans/            # Recent plans components
│   ├── AIInsights/             # AI insights components
│   └── Timeline/               # Timeline components
└── styles/                     # Dashboard-specific styles
```

## Features

-   **Responsive Design**: Adapts to different screen sizes
-   **Dark Mode Support**: Full compatibility with light/dark themes
-   **Modular Architecture**: Components can be reused elsewhere
-   **Interactive Elements**: Hover effects, animations, and transitions
-   **AI Integration**: Smart suggestions and insights features
-   **Clear Data Visualization**: Activity monitoring and metrics display

## Usage

Import the main Dashboard component:

```jsx
import Dashboard from "@/Dashboard";

export default function DashboardPage() {
    return <Dashboard />;
}
```

Or import individual components for custom layouts:

```jsx
import { StatsOverview, Timeline, AISuggestions } from "@/Dashboard";

export default function CustomPage() {
    return (
        <div>
            <StatsOverview />
            <AISuggestions />
            <Timeline />
        </div>
    );
}
```

## Styling

Dashboard components use:

-   Tailwind CSS for base styling
-   Custom CSS for animations and effects (in `dashboard.css`)
-   Consistent color schemes with brand colors

## Translations

All text strings use the `useTranslation` hook for i18n support. Ensure your translation files include keys for all dashboard components.

## Dependencies

-   React
-   React-i18next (for translations)
-   Tailwind CSS
-   Headless UI (for accessibility)
