import { Meta, StoryObj } from "@storybook/react";
import { Quill } from "~/components/editors/quill";

const meta = {
  title: "Components/editors/quill",
  component: Quill,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
} satisfies Meta<typeof Quill>;

export default meta;

type Story = StoryObj<typeof Quill>;

export const Normal: Story = {
  args: {},
};
