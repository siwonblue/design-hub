import { Meta, StoryObj } from "@storybook/react";
import { Button } from "~/components/buttons";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {},
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

export default meta;

export const _Button: Story = {
  args: {},
};
