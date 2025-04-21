import { useSalesOrder } from "../hooks/useSalesOrder";
import { useEffect, useState } from "react";
import "./styles/PivotTable.css";

type SalesOrder = {
  rowId: number;
  orderId: string;
  orderDate: string;
  shipDate: string;
  shipMode: string;
  customerId: string;
  customerName: string;
  segment: string;
  country: string;
  city: string;
  state: string;
  postalCode: number;
  region: string;
  productId: string;
  category: string;
  subCategory: string;
  productName: string;
  sales: number;
  quantity: number;
  discount: number;
  profit: number;
};
const salesOrderLabels: Partial<Record<keyof SalesOrder, string>> = {
  orderId: "Order ID",
  orderDate: "Order Date",
  shipDate: "Ship Date",
  shipMode: "Ship Mode",
  customerId: "Customer ID",
  customerName: "Customer Name",
  segment: "Segment",
  country: "Country",
  city: "City",
  state: "State",
  postalCode: "Postal Code",
  region: "Region",
  productId: "Product ID",
  category: "Category",
  subCategory: "Sub-category",
  productName: "Product Name",
  sales: "Sales",
  quantity: "Quantity",
  discount: "Discount",
  profit: "Profit",
};

type SalesOrderData = SalesOrder[];

const PivotTable = () => {
  const [selectedRows] = useState<(keyof SalesOrder)[]>([
    "category",
    "subCategory",
  ]);
  const [selectedColumns] = useState<(keyof SalesOrder)[]>(["country"]);
  const [selectedMetrics] = useState<(keyof SalesOrder)[]>(["sales"]);
  const [cellData, setCellData] = useState<Map<string, number>>(new Map());

  const { data, isLoading, isError } = useSalesOrder();
  const salesOrderData = data as SalesOrderData;

  const aggregateFn = (a: number, b: number) => a + b;

  useEffect(() => {
    if (!data) return;

    const newCellData = new Map<string, number>();

    data.forEach((order: SalesOrder) => {
      const rowKey = selectedRows.map((row) => order[row]).join("-");
      const colKey = selectedColumns.map((col) => order[col]).join("-");
      const key = `${rowKey}|||${colKey}`;
      const value = order[selectedMetrics[0]];

      if (typeof value !== "number") return;

      newCellData.set(key, aggregateFn(newCellData.get(key) || 0, value));
    });

    setCellData(newCellData);
  }, [data, selectedRows, selectedColumns, selectedMetrics]);

  // Build unique keys for each column based on selected columns. Ensures every column is represented
  // even if it has no data.
  const getUniqueColumnKeys = (): string[] => {
    if (!salesOrderData) return [];
    const set = new Set<string>();
    salesOrderData.forEach((order: SalesOrder) => {
      const colKey = selectedColumns.map((col) => order[col]).join("-");
      set.add(colKey);
    });
    return Array.from(set).sort();
  };

  const buildRowGroupMap = (): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    if (!salesOrderData || selectedRows.length === 0) return result;

    salesOrderData.forEach((order) => {
      let path = "";
      selectedRows.forEach((dimension) => {
        const value = String(order[dimension]);
        const parentKey = path;

        if (parentKey !== "") {
          if (!result[parentKey]) {
            result[parentKey] = [];
          }
          if (!result[parentKey].includes(value)) {
            result[parentKey].push(value);
          }
        }

        path = path ? `${path}:::${value}` : value;
      });
    });

    return result;
  };

  // Note: This only supports 2 levels of row grouping. We can extend this later if needed.
  const renderTable = () => {
    const columns = getUniqueColumnKeys();
    const groupedRows = buildRowGroupMap();
    const rows = [];

    // By the time we get to this point, we should have a map of all the rows and their subcategories.
    let grandTotals: number[] = new Array(columns.length).fill(0);

    // Note: If we had more than 2 levels of grouping, we would need to adjust this logic, maybe recursively to account for N-levels of grouping.
    Object.entries(groupedRows).forEach(([category, subCategories]) => {
      let categoryTotals: number[] = new Array(columns.length).fill(0);

      subCategories.forEach((subCategory, subIndex) => {
        const rowKey = `${category}-${subCategory}`;

        // This is rendering the first two columns of the table for category and subcategory.
        const row = selectedRows.map((_, i) => {
          if (i === 0 && subIndex === 0) {
            return (
              // This is to account for grouping the cells in the first column
              <td
                key={i}
                data-testid="category-cell"
                rowSpan={subCategories.length}
              >
                {category}
              </td>
            );
          }
          if (i === 1) {
            return (
              <td key={i} data-testid="subcategory-cell">
                {subCategory}
              </td>
            );
          }
          return null;
        });

        const metricCells = columns.map((colKey, colIndex) => {
          const key = `${rowKey}|||${colKey}`;
          const val = cellData.get(key) ?? 0;
          categoryTotals[colIndex] += val;
          grandTotals[colIndex] += val;
          return <td key={colKey}>{val.toFixed(2)}</td>;
        });

        rows.push(
          <tr key={`${category}-${subCategory}`}>{[...row, ...metricCells]}</tr>
        );
      });

      // Category total row
      rows.push(
        <tr key={`total-${category}`}>
          <td colSpan={selectedRows.length}>
            <strong>Total for {category}</strong>
          </td>
          {categoryTotals.map((total, i) => (
            <td key={i}>
              <strong>{total.toFixed(2)}</strong>
            </td>
          ))}
        </tr>
      );
    });

    // Grand total row
    rows.push(
      <tr key="grand-total">
        <td colSpan={selectedRows.length}>
          <strong>Grand Total</strong>
        </td>
        {grandTotals.map((total, i) => (
          <td key={i}>
            <strong>{total.toFixed(2)}</strong>
          </td>
        ))}
      </tr>
    );

    return (
      <table>
        <caption>
          Pivot table used to quickly summarize large amounts of data.
        </caption>
        <thead>
          <tr>
            {selectedRows.map((row) => (
              <th key={row}>{salesOrderLabels[row] || row}</th>
            ))}

            {columns.map((col) => (
              // Note: If we use multiple Columns we would need to lookup the label based on the columna index.
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  if (isLoading) return <p data-testid="loading">Loading...</p>;
  if (isError) return <p data-testid="error">Error loading data</p>;
  if (!salesOrderData) return <p>No data available</p>;

  return <div className="pivot-table">{renderTable()}</div>;
};

export default PivotTable;
