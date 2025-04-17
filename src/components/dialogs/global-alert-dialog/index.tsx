"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useGlobalAlertDialogStore } from "./store";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

export const GlobalAlertDialog = () => {
  const { isOpen, content, closeDialog, onConfirm } =
    useGlobalAlertDialogStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle></AlertDialogTitle>
        </AlertDialogHeader>
        {content}
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
