# Plan: Refactor Donut Charts to Horizontal Bar Charts

## Objective
Replace the current cramped donut charts with horizontal bar charts to improve label readability and overall dashboard usability.

## Key Files & Context
- `admin-dashboard/src/components/DashboardContent.jsx`: Contains the chart rendering logic, legend generation, and chart layout.

## Implementation Steps
1.  **Refactor Chart Configuration**: Update `DashboardContent.jsx` to define a horizontal bar chart configuration using ApexCharts.
2.  **Remove Donut Logic**: Remove `getDonutOptions` and `renderLegend` functions.
3.  **Update Rendering**: Modify the "Donut Charts Section" (renaming to "Categorical Breakdown") to render two `Chart` components with the new horizontal bar configuration.
4.  **Layout Adjustments**: Update the grid structure to remove the side-by-side chart/legend split and instead make the bar charts span the full width of the container for maximum legibility.

## Verification & Testing
- Verify charts render correctly with real data.
- Check that all category labels are fully visible without truncation.
- Ensure the bar chart aesthetic (colors, typography) matches the existing brand design.
