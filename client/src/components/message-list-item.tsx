import { format, parseISO, isToday, isYesterday } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { MessageWithSender } from "@shared/schema";

interface MessageListItemProps {
  message: MessageWithSender;
  isSelected?: boolean;
  onClick?: () => void;
  currentUserId?: string;
}

function formatMessageTime(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MMM d");
}

export function MessageListItem({ message, isSelected, onClick, currentUserId }: MessageListItemProps) {
  const otherUser = message.senderId === currentUserId ? message.receiver : message.sender;
  const initials = otherUser ? `${otherUser.firstName?.[0] || ""}${otherUser.lastName?.[0] || ""}` : "?";
  const isUnread = !message.isRead && message.receiverId === currentUserId;

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover-elevate active-elevate-2 ${
        isSelected ? "bg-accent" : ""
      }`}
      data-testid={`message-item-${message.id}`}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={`text-sm ${isUnread ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className={`truncate text-sm ${isUnread ? "font-semibold" : "font-medium"}`}>
            {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown"}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatMessageTime(message.sentAt)}
          </span>
        </div>
        {message.subject && (
          <span className={`truncate text-sm ${isUnread ? "font-medium" : "text-muted-foreground"}`}>
            {message.subject}
          </span>
        )}
        <span className="truncate text-xs text-muted-foreground">
          {message.content}
        </span>
        <div className="mt-1 flex items-center gap-2">
          {otherUser?.role && (
            <Badge variant="outline" className="text-xs capitalize">
              {otherUser.role}
            </Badge>
          )}
          {message.priority === "urgent" && (
            <Badge variant="destructive" className="text-xs">Urgent</Badge>
          )}
          {message.priority === "high" && (
            <Badge variant="secondary" className="text-xs">High Priority</Badge>
          )}
        </div>
      </div>
      {isUnread && (
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}
