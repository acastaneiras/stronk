import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignIn from "@/pages/auth/SignIn";
import * as authUtils from "@/utils/authUtils";

// Mock handleGoogleSignIn and handleSignIn functions
vi.spyOn(authUtils, "handleGoogleSignIn").mockResolvedValue();
vi.spyOn(authUtils, "handleSignIn").mockResolvedValue(true);

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // useNavigate mock
  };
});

describe("SignIn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the SignIn component", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/to continue to Stronk/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("shows an error message if `state.oauthError` exists", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/",
            state: {
              oauthError: "OAuth Error",
              oauthErrorDescription: "Invalid credentials",
            },
          },
        ]}
      >
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByText(/OAuth Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  it("calls handleGoogleSignIn when the Google Sign-In button is clicked", async () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const googleButton = screen.getByText(/Continue with Google/i);
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(authUtils.handleGoogleSignIn).toHaveBeenCalled();
    });
  });

  it("submits the form and calls handleSignIn", async () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(authUtils.handleSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        expect.any(Function)
      );
    });
  });

  it("navigates to /training if sign-in is successful", async () => {
    vi.spyOn(authUtils, "handleSignIn").mockResolvedValue(true);

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole("button", { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/training");
    });
  });

  it("shows an error message if the password is invalid", async () => {
    vi.spyOn(authUtils, "handleSignIn").mockImplementation(async (_email, password, setErrorMessage) => {
      if (password === "123") {
        setErrorMessage("Invalid login credentials");
        return false;
      }
      setErrorMessage(null);
      return true;
    });
  
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
  
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole("button", { name: /Sign in/i });
  
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } }); //Simulates an invalid password

    fireEvent.click(signInButton);
  
    //Verifies that the error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/Invalid login credentials/i)
      ).toBeInTheDocument();
    });

    //Verifies that the error message is removed after a successful login
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/training");
    });
  
  });
});