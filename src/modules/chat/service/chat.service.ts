class ChatService {
  async sendMessage(senderId: string, receiverId: string, content: string) {
    // TODO: implement logic for 1-1 realtime websocket message
    return {};
  }

  async markAsSeen(messageId: string | string[], userId: string) {
    // TODO: implement logic to mark message as seen
    return {};
  }
}

export const chatService = new ChatService();
