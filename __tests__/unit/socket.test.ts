import io from 'socket.io';
import http from 'http';
import { SocketServer } from '../../src/socket';
import { Server } from 'socket.io';

describe('SocketServer', () => {
  let mockServer: http.Server;
  let mockIo: Server;

  beforeEach(() => {
    mockServer = {} as http.Server;
    // @ts-ignore
    mockIo = {
      on: jest.fn(),
    } as Server;
  });

  it('should initialize socket events', () => {
    const socketServer = new SocketServer(mockServer);
    expect(socketServer).toBeDefined();
    expect(socketServer['io']).toBeDefined();
    // @ts-ignore
  });
  it('should add a user to the list', () => {
    const socketServer = new SocketServer(mockServer);
    // @ts-ignore
    socketServer.addUser('user123', 'socket123', { name: 'test user' });
    expect(socketServer['users']).toEqual([
      { userId: 'user123', socketId: 'socket123', userInfo: { name: 'test user' } },
    ]);
  });

  it('should remove a user from the list', () => {
    const socketServer = new SocketServer(mockServer);
    socketServer['users'] = [
      // @ts-ignore
      { userId: 'user1', socketId: 'socket1', userInfo: { name: 'User 1' } },
      // @ts-ignore
      { userId: 'user2', socketId: 'socket2', userInfo: { name: 'User 2' } },
    ];
    socketServer.userRemove('socket1');
    expect(socketServer['users']).toEqual([{ userId: 'user2', socketId: 'socket2', userInfo: { name: 'User 2' } }]);
  });

  it('should find a friend by ID', () => {
    const socketServer = new SocketServer(mockServer);
    socketServer['users'] = [
      // @ts-ignore
      { userId: 'user1', socketId: 'socket1', userInfo: { name: 'User 1' } },
      // @ts-ignore
      { userId: 'user2', socketId: 'socket2', userInfo: { name: 'User 2' } },
    ];
    const friend = socketServer.findFriend('user2');
    expect(friend).toEqual({ userId: 'user2', socketId: 'socket2', userInfo: { name: 'User 2' } });
  });
});
