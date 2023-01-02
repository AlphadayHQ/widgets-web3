import {
  createGlobalStyle,
  css,
  keyframes,
  ThemeProvider,
  DefaultTheme,
} from "styled-components";
import { darkTheme } from "./theme";

export const breakpoints = [400, 576, 768, 992, 1200, 1400];

export const device = {
  tiny: `@media (max-width: ${breakpoints[0]}px)`,
  small: `@media screen and (min-width: ${breakpoints[1]}px)`,
  medium: `@media screen and (min-width: ${breakpoints[2]}px)`,
  large: `@media screen and (min-width: ${breakpoints[3]}px)`,
  xlarge: `@media screen and (min-width: ${breakpoints[4]}px)`,
  xxlarge: `@media screen and (min-width: ${breakpoints[5]}px)`,
  mdToLg: `@media (min-width: 768px) and (max-width: 991px)`,
  lgToXl: `@media (min-width: 992px) and (max-width: 1199px)`,
};

const themes: { [x: string]: DefaultTheme } = {
  dark: darkTheme,
};

export { createGlobalStyle, css, keyframes, ThemeProvider, darkTheme, themes };
