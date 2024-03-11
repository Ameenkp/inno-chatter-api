import { getAllMessage, getLastMessage, IMessage, insertMessage, MessageModel } from '../../../src/models/messageModel';

describe('messageModel tests', () => {
  const mockMessage: IMessage = {
    senderId: 'userId1',
    senderName: 'User One',
    reseverId: 'userId2',
    message: { text: 'Hello!', image: '' },
    status: 'seen',
  };
  test('should return the last message between two users', async () => {
    MessageModel.findOne = jest
      .fn()
      .mockImplementationOnce(() => ({ sort: jest.fn().mockResolvedValueOnce(mockMessage) }));
    const result = await getLastMessage('userId1', 'userId2');

    expect(MessageModel.findOne).toHaveBeenCalledWith({
      $or: [
        {
          $and: [{ senderId: { $eq: 'userId1' } }, { reseverId: { $eq: 'userId2' } }],
        },
        {
          $and: [{ senderId: { $eq: 'userId2' } }, { reseverId: { $eq: 'userId1' } }],
        },
      ],
    });
    expect(result).toEqual(mockMessage);
  });

  test('should throw an error if an error occurs', async () => {
    const mockError = new Error('Mocked error');
    MessageModel.findOne = jest
      .fn()
      .mockImplementationOnce(() => ({ sort: jest.fn().mockRejectedValueOnce(mockError) }));
    await expect(getLastMessage('userId1', 'userId2')).rejects.toThrow('Error getting last message: Mocked error');
  });

  test('should return all the messages for a given userID', async () => {
    MessageModel.find = jest.fn().mockResolvedValueOnce([mockMessage, mockMessage]);
    const result = await getAllMessage('userId1', 'userId2');
    expect(result).toEqual([mockMessage, mockMessage]);
  });

  test('should throw an error if an error occurs on retrieving all the messages for an given id', async () => {
    const mockError = new Error('Mocked error');
    MessageModel.find = jest.fn().mockRejectedValueOnce(mockError);
    await expect(getAllMessage('userId1', 'userId2')).rejects.toThrow('Error getting all messages: Mocked error');
  });

  test('should insert a message into DB', async () => {
    MessageModel.create = jest.fn().mockResolvedValueOnce(mockMessage);
    const result = await insertMessage('userId1', 'User One', 'userId2', '');
    expect(result).toEqual(mockMessage);
  });

  test('should throw an error if an error occurs on inserting a message', async () => {
    const mockError = new Error('Mocked error');
    MessageModel.create = jest.fn().mockRejectedValueOnce(mockError);
    await expect(insertMessage('userId1', 'User One', 'userId2', '')).rejects.toThrow(
      'Error inserting message: Mocked error'
    );
  });
});
