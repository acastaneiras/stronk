import { useSession } from "@/context/SessionContext";
import AppLayout from "@/layouts/AppLayout";
import AuthProtectedRoute from "@/router/AuthProtectedRoute";
import { useExercisesStore } from "@/stores/exerciseStore";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/exerciseDataLoader", () => ({
  loadData: vi.fn(),
}));

describe("AuthProtectedRoute for /training", () => {
  let sessionSpy: ReturnType<typeof vi.spyOn>;
  let storeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    sessionSpy = vi.spyOn({useSession}, "useSession");
    sessionSpy.mockReturnValue({ session: null });

    //Store not hydrated
    storeSpy = vi.spyOn({useExercisesStore}, "useExercisesStore");
    storeSpy.mockReturnValue({
      isHydrated: false,
      addExercises: vi.fn(),
      allExercises: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("redirects to /sign-in when there is no session", () => {
    render(
      <MemoryRouter initialEntries={["/training"]}>
        <Routes>
          <Route path="/sign-in" element={<div>Sign In Page</div>} />
          <Route
            path="/training"
            element={<AuthProtectedRoute />}
          >
            <Route element={<AppLayout />}>
              <Route path="" element={<div>Training Page</div>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign In Page/i)).toBeInTheDocument();
  });

  // no need to test if session since we do test the redirect on the SignIn.test.tsx
});
