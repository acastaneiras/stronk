import * as React from "react";
import { useMediaQuery } from "@uidotdev/usehooks"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissable?: boolean;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissable = true,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    //Render as Dialog on Desktop
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          onInteractOutside={(e) => { if (!dismissable) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (!dismissable) e.preventDefault(); }}
          className={cn(!dismissable && "[&>button]:hidden")}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <Separator orientation="horizontal"/>
          <div>{children}</div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  //Render as Drawer on Mobile
  return (
    <Drawer open={open} onOpenChange={onOpenChange} dismissible={dismissable}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-3xl font-bold text-center">{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <Separator orientation="horizontal"/>
        <div className="p-4">{children}</div>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
