import { DefaultTheme } from "styled-components";
import { dark } from "./colors";

declare module "styled-components" {
  export interface DefaultTheme {
    name: string;
    colors: {
      [x: string]: string;
    };
    fontSize: {
      body: string;
      h1: string[];
      h2: string[];
      h3: string[];
      h4: string[];
      h5: string[];
      h6: string[];
    };
    fonts: {
      body: string;
      heading: string;
    };
    fontWeights: {
      body: number;
      heading: number;
    };
    lineHeights: {
      body: number;
      heading: number;
    };
    radii: {
      [x: string]: string;
    };
    breakpoints: string[];
    transition: string;
  }
}

const breakpoints = ["576px", "768px", "992px", "1200px", "1400px"];

const defaultThemeOption = {
  fontSize: {
    body: "0.875rem",
    h1: ["2.1875rem", "2.1875rem", "2.1875rem", "2.1875rem"],
    h2: ["1.75rem", "1.75rem", "1.75rem"],
    h3: ["1.53125rem", "1.53125rem"],
    h4: ["1.3125rem", "1.3125rem"],
    h5: ["1.09375rem", "1.09375rem"],
    h6: ["0.875rem", "0.875rem"],
  },
  fonts: {
    body: `'Open Sans', sans-serif`,
    heading: `'Open Sans', sans-serif`,
  },
  fontWeights: {
    body: 400,
    heading: 500,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  radii: {
    sm: "3px",
    md: "6px",
    lg: "8px",
    rounded: "4px",
    circle: "50%",
    pill: "500px",
  },
  breakpoints: [...breakpoints],
  transition: "all 0.4s ease 0s",
  anchor: {
    primary: {
      color: "white",
      bg: "red",
    },
  },
};


export const darkTheme: DefaultTheme = {
  name: "dark",
  colors: { ...dark },
  ...defaultThemeOption,
};
