import type { Preview } from "@storybook/react";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "nimbus-light",
      values: [
        { name: "nimbus-light", value: "#F1F5F9" },
        { name: "nimbus-dark", value: "#1E3A8A" },
        { name: "card", value: "#FFFFFF" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
