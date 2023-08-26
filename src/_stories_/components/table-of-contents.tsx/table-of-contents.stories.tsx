import { Meta, StoryObj } from "@storybook/react";
import { Toc } from "~/components/table-of-contents";

const meta = {
  title: "Components/Toc",
  component: Toc,
  argTypes: {},
} satisfies Meta<typeof Toc>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
