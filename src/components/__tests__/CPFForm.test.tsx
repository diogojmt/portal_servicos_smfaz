import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CPFForm from "../CPFForm";

describe("CPFForm", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("renders correctly", () => {
    render(<CPFForm onSearch={mockOnSearch} loading={false} />);

    expect(screen.getByLabelText(/CPF\/CNPJ/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /consultar pertences/i })
    ).toBeInTheDocument();
  });

  it("formats CPF input correctly", async () => {
    const user = userEvent.setup();
    render(<CPFForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByLabelText(/CPF\/CNPJ/i);
    await user.type(input, "12345678901");

    expect(input).toHaveValue("123.456.789-01");
  });

  it("formats CNPJ input correctly", async () => {
    const user = userEvent.setup();
    render(<CPFForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByLabelText(/CPF\/CNPJ/i);
    await user.type(input, "12345678000195");

    expect(input).toHaveValue("12.345.678/0001-95");
  });

  it("shows error for invalid CPF/CNPJ", async () => {
    const user = userEvent.setup();
    render(<CPFForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByLabelText(/CPF\/CNPJ/i);
    const button = screen.getByRole("button", { name: /consultar pertences/i });

    await user.type(input, "123");
    await user.click(button);

    expect(screen.getByText(/CPF\/CNPJ inválido/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch with valid CPF", async () => {
    const user = userEvent.setup();
    render(<CPFForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByLabelText(/CPF\/CNPJ/i);
    const button = screen.getByRole("button", { name: /consultar pertences/i });

    // CPF válido: 11144477735
    await user.type(input, "11144477735");
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith("11144477735");
  });

  it("disables form when loading", () => {
    render(<CPFForm onSearch={mockOnSearch} loading={true} />);

    const input = screen.getByLabelText(/CPF\/CNPJ/i);
    const button = screen.getByRole("button", { name: /consultando/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Consultando...");
  });

  it("prevents non-numeric characters except formatting", async () => {
    const user = userEvent.setup();
    render(<CPFForm onSearch={mockOnSearch} loading={false} />);

    const input = screen.getByLabelText(/CPF\/CNPJ/i);

    await user.type(input, "abc123def456");

    expect(input).toHaveValue("123.456");
  });
});
