import { createTheme } from "@mantine/core";


export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: 4,
  fontFamily: "var(--font-manrope), sans-serif",
  headings: {
    fontFamily: "var(--font-montserrat), sans-serif",
    fontWeight: "800",
  },
  colors: {
    // Green brand scale (light → dark, 10 shades)
    brand: [
      "#E8F5EE", // 0 — pale mint
      "#C8E8D4", // 1
      "#9DD4B3", // 2
      "#6DBF90", // 3
      "#3DA96E", // 4
      "#2E9E5B", // 5 — medium green
      "#1A6B3C", // 6 — primary ★
      "#145730", // 7
      "#0E4225", // 8
      "#082C19", // 9 — deepest
    ],
    ink: [
      "#E8EEE9",
      "#D0DDD1",
      "#B8CCB9",
      "#9FBB9F",
      "#6B9970",
      "#3D6B57",
      "#1A4030",
      "#142F22",
      "#0E2018",
      "#07100C",
    ],
  },
  defaultRadius: "md",
  components: {
    Button: { defaultProps: { radius: "xl" } },
    TextInput: { defaultProps: { radius: "md" } },
    Card: { defaultProps: { radius: "xl", withBorder: true } },
    Badge: { defaultProps: { radius: "xl" } },
  },
});