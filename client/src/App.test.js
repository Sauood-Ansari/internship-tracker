import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
    Link: ({ children }) => <span>{children}</span>,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: "/" }),
  }),
  { virtual: true }
);

import App from "./App";

test("renders the login page heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
});
