import { toast } from "sonner";

/**
 * Registers an error for both developer and user.
 * @param userError - The error message to show to the user (less detailed).
 * @param devError - The error object or message for developer debugging (detailed).
 */
// export function registerError(userError: string, devError: unknown) {
//   // Log detailed error for developer
//   if (devError) {
//     // eslint-disable-next-line no-console
//     console.error("[DEV ERROR]", devError);
//   }
//   // Show user-friendly error using shadcn/sonner toast
//   toast.error (userError, { duration: 100000 }); // 100 seconds
// }


export class Logger {
  static logError(userError: string, devError: unknown, duration: number = 2000) {
    // Log detailed error for developer
    if (devError) {
      // eslint-disable-next-line no-console
      console.error("[DEV ERROR]", devError);``
    } 
    // Show user-friendly error using shadcn/sonner toast
    toast.error(userError, { duration: duration }); // 2 seconds
  }

  static logInfo(message: string, duration: number = 2000) {
    // Log informational message
    toast.info(message, { duration: duration });
  }

  static logSuccess(message: string, duration: number = 2000) {
    // Log success message
    toast.success(message, { duration: duration });
  }

  static logWarning(message: string, duration: number = 2000) {
    // Log warning message
    toast.warning(message, { duration: duration });
  }

  static logLoading(message: string, duration: number = 2000) {
    // Log loading message
    toast.loading(message, { duration: duration });
  }

  static registerLoading(message: string) : number | string {
    return toast.loading(message);
  }

  static clearLoading(id: number | string) {
    toast.dismiss(id);
  }
}