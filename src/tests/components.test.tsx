import { render, screen } from "@testing-library/react";
import AnimatedCard from "../components/AnimatedCard";

test("AnimatedCard renders", () => {
  render(<AnimatedCard>Content</AnimatedCard>);
  expect(screen.getByText("Content")).toBeInTheDocument();
});
