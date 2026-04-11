import type { Meta, StoryObj } from "@storybook/react";
import { TrialBanner } from "@/components/paywall/trial-banner";

const meta: Meta<typeof TrialBanner> = {
  title: "Components/TrialBanner",
  component: TrialBanner,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof TrialBanner>;

export const ManyDaysLeft: Story = { args: { daysLeft: 78 } };
export const FewDaysLeft: Story = { args: { daysLeft: 5 } };
export const LastDay: Story = { args: { daysLeft: 1 } };
export const Expired: Story = { args: { daysLeft: 0 } };
