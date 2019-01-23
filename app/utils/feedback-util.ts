import { Feedback, FeedbackShowOptions, FeedbackType } from "nativescript-feedback";

const feedback = new Feedback();

export function showInfo(title: string, message: string, icon?: string): void {
  showFeedback({
    title,
    message,
    type: FeedbackType.Info,
  });
}

function showFeedback(options: FeedbackShowOptions): void {
  options.icon = options.icon || "profile";
  options.duration = options.duration || 5000;
  feedback.show(options);
}
