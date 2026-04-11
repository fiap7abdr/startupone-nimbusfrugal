import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar acao</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja executar esta acao? Ela nao pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="outline">Cancelar</Button>
          <Button>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const meta: Meta<typeof DialogDemo> = {
  title: "Components/Dialog",
  component: DialogDemo,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DialogDemo>;
export const Default: Story = {};
