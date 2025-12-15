import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Search, 
  ArrowLeft,
  Paperclip,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageListItem } from "@/components/message-list-item";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MessageWithSender, User } from "@shared/schema";

function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<MessageWithSender | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [newRecipient, setNewRecipient] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newPriority, setNewPriority] = useState("normal");

  const { data: messages, isLoading } = useQuery<MessageWithSender[]>({
    queryKey: ["/api/messages"],
  });

  const { data: contacts } = useQuery<User[]>({
    queryKey: ["/api/users/contacts"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setIsComposeOpen(false);
      setNewRecipient("");
      setNewSubject("");
      setNewContent("");
      setNewPriority("normal");
      toast({
        title: "Message Sent",
        description: "Your message has been delivered.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/messages/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const handleSelectMessage = (message: MessageWithSender) => {
    setSelectedMessage(message);
    if (!message.isRead && message.receiverId === user?.id) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleSendMessage = () => {
    if (!newRecipient || !newContent) {
      toast({
        title: "Missing Information",
        description: "Please select a recipient and write a message.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      senderId: user?.id,
      receiverId: newRecipient,
      subject: newSubject || "No Subject",
      content: newContent,
      sentAt: new Date().toISOString(),
      priority: newPriority,
    });
  };

  const handleReply = () => {
    if (!replyContent || !selectedMessage) return;

    const recipientId = selectedMessage.senderId === user?.id 
      ? selectedMessage.receiverId 
      : selectedMessage.senderId;

    sendMessageMutation.mutate({
      senderId: user?.id,
      receiverId: recipientId,
      subject: `Re: ${selectedMessage.subject || "No Subject"}`,
      content: replyContent,
      sentAt: new Date().toISOString(),
      priority: "normal",
    });

    setReplyContent("");
  };

  const filteredMessages = messages?.filter((m) => {
    const otherUser = m.senderId === user?.id ? m.receiver : m.sender;
    const searchText = `${otherUser?.firstName} ${otherUser?.lastName} ${m.subject} ${m.content}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  }) || [];

  const unreadCount = messages?.filter((m) => !m.isRead && m.receiverId === user?.id).length || 0;

  const selectedOtherUser = selectedMessage 
    ? (selectedMessage.senderId === user?.id ? selectedMessage.receiver : selectedMessage.sender)
    : null;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6" data-testid="messages-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Secure messaging with your healthcare team
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} data-testid="button-compose">
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <Card className={`flex flex-col ${selectedMessage ? "hidden md:flex" : ""} w-full md:w-80 lg:w-96`}>
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-messages"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="p-4">
                  <MessagesSkeleton />
                </div>
              ) : filteredMessages.length > 0 ? (
                <div className="flex flex-col">
                  {filteredMessages.map((message) => (
                    <MessageListItem
                      key={message.id}
                      message={message}
                      isSelected={selectedMessage?.id === message.id}
                      onClick={() => handleSelectMessage(message)}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No messages</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery ? "No messages match your search" : "Start a conversation with your care team"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className={`flex flex-1 flex-col ${!selectedMessage ? "hidden md:flex" : ""}`}>
          {selectedMessage ? (
            <>
              <CardHeader className="flex flex-row items-center gap-4 border-b p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedMessage(null)}
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {selectedOtherUser
                      ? `${selectedOtherUser.firstName?.[0]}${selectedOtherUser.lastName?.[0]}`
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">
                    {selectedOtherUser
                      ? `${selectedOtherUser.firstName} ${selectedOtherUser.lastName}`
                      : "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedOtherUser?.role}
                    {selectedOtherUser?.specialty && ` - ${selectedOtherUser.specialty}`}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                  <div className="flex flex-col gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{selectedMessage.subject || "No Subject"}</h3>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {format(parseISO(selectedMessage.sentAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{selectedMessage.content}</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-20 resize-none"
                    data-testid="input-reply"
                  />
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    onClick={handleReply}
                    disabled={!replyContent || sendMessageMutation.isPending}
                    data-testid="button-send-reply"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex flex-1 flex-col items-center justify-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Select a message</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a conversation to view the messages
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a secure message to your healthcare provider.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">To</Label>
              <Select value={newRecipient} onValueChange={setNewRecipient}>
                <SelectTrigger id="recipient" data-testid="select-recipient">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {contacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                      {contact.specialty && ` - ${contact.specialty}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Message subject..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                data-testid="input-subject"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={newPriority} onValueChange={setNewPriority}>
                <SelectTrigger id="priority" data-testid="select-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                placeholder="Write your message..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-32 resize-none"
                data-testid="input-content"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
