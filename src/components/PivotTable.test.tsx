import { render, screen } from "@testing-library/react";
import PivotTable from "./PivotTable";
import { describe, it, expect, vi, beforeEach } from "vitest";

// 👇 Create a mock implementation
const mockUseSalesOrder = vi.fn();

vi.mock("../hooks/useSalesOrder", () => ({
  useSalesOrder: () => mockUseSalesOrder(),
}));

describe("PivotTable", () => {
  beforeEach(() => {
    mockUseSalesOrder.mockReset();
  });

  it("renders table headers correctly", async () => {
    mockUseSalesOrder.mockReturnValue({
      data: [
        {
          rowId: 1,
          orderId: "CA-2016-152156",
          orderDate: "2016-11-08",
          shipDate: "2016-11-11",
          shipMode: "Second Class",
          customerId: "CG-12520",
          customerName: "Claire Gute",
          segment: "Consumer",
          country: "United States",
          city: "Henderson",
          state: "Kentucky",
          postalCode: 42420,
          region: "South",
          productId: "FUR-BO-10001798",
          category: "Furniture",
          subCategory: "Bookcases",
          productName: "Bush Somerset Collection Bookcase",
          sales: 261.96,
          quantity: 2,
          discount: 0.0,
          profit: 41.9136,
        },
      ],
      isLoading: false,
      isError: false,
    });
    render(<PivotTable />);
    expect(screen.getByTestId("category-cell")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-cell")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseSalesOrder.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<PivotTable />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseSalesOrder.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<PivotTable />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });
});
