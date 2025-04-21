# Project Overview

## Architectural Overview

This project is a React-based pivot table component designed to display and aggregate sales order data. The data is grouped by rows and columns selected by the user, with metrics (such as sales) displayed in the table cells. The component allows for flexible grouping of rows and columns, and it can compute totals for categories and subcategories as well as a grand total. The table is built to handle nested row groupings and dynamic metrics, supporting scalability.

### Key Features:

- **Dynamic Row Grouping**: Supports grouping by multiple row categories (e.g., `category`, `region`, etc.).
- **Dynamic Columns**: User-defined columns for displaying aggregated data.
- **Grand Totals & Category Totals**: Automatically computes totals for both categories and overall data.
- **Optimized for Performance**: Uses efficient data structures (e.g., maps) to store and access data.

### Future Improvements & Considerations:

- **Support for Multi-level Row Grouping**: The current implementation supports two levels of row grouping. Future improvements could involve extending this to support dynamic, n-level row groupings.
- **Customizable Aggregation Functions**: Currently, the pivot table only supports sum aggregation. There is potential to extend this feature to support other aggregation functions like average, count, min, max, etc.
- **Dynamic Metrics**: The table can currently handle one metric at a time, but there could be improvements to allow multiple metrics (e.g., sales and profit) to be shown together in the same table.
- **Responsive Design**: Enhancements to the table layout for better usability on mobile and smaller screens. Currently, the table might not perform optimally on smaller devices due to its wide data structure.
- **Enhanced Data Validation and Error Handling**: While the current version performs basic error handling, a more robust approach to validating and sanitizing incoming data could be implemented, especially in production environments.
- **Performance Optimizations**: For very large datasets, performance optimizations may be necessary, such as lazy loading, virtualization, or using a more efficient data structure for large-scale aggregations.
- **Data formating**: Format based on currency, time formats, etc.

---

## Project Setup and Running Instructions

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (version 16 or later recommended)
- [pnpm](https://pnpm.io/) (if not installed, run `npm install -g pnpm`)
- [Vite](https://vitejs.dev/) (should be installed as part of the project dependencies)

##### Core Dependencies:

- React, Vite, Tanstack, Vitest, React-Testing-Library

### Steps to Run the Project

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies:**

Use pnpm to install the project dependencies:

```bash
pnpm install
```

3. **Start the development server:**

After the dependencies are installed, start the Vite development server:

```bash
pnpm run dev
```

4. **Testing:**

Run test suites using:

```bash
pnpm test
```
