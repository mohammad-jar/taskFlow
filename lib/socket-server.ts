import type { Server as IOServer } from "socket.io";

declare global {
  var _io: IOServer | undefined;
}

export function emitNotificationToUser(userId: string, notification: unknown) {
  const io = globalThis._io;

  if (!io) return;

  io.to(`user:${userId}`).emit("notification:new", notification);
}
