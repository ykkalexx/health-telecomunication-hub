import { HubConnection } from "@microsoft/signalr";

let connections: HubConnection[] = [];

export const clearSignalRConnections = () => {
  connections.forEach((connection) => connection.stop());
  connections = [];
};
