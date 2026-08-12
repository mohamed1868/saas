import { TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Product } from "@/features/private/products/types/products"

type DeleteProductDialogProps = {
  product: Product
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProductDialog({ product, onConfirm, onClose }: DeleteProductDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <TriangleAlert className="size-4" />
            </span>
            {t("deleteProduct")}
          </DialogTitle>
          <DialogDescription>{t("deleteProductBody", { name: product.name })}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
