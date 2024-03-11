import { createUser, findUserByEmail, UserModel } from '../../../src/models/authModel';

describe('auth model tests ', () => {
  const mockUser: any = {
    userName: 'test_user_1',
    email: 'john.doe@example.com',
    password: 'StrongPassword123@',
    image: 'profile.jpg',
  };

  const user = new UserModel({
    userName: 'test_user_1',
    email: 'john.doe@example.com',
    password: 'StrongPassword123@',
    image: 'profile.jpg',
  });

  test('should require userName field', async () => {
    user.userName = '';
    await expect(user.validate()).rejects.toThrow('User name is required.');
  });

  test('should be valid with correct input', async () => {
    user.userName = 'test_user_1';
    await expect(user.validate()).resolves.toBeUndefined();
  });

  test('should return an user by email', async () => {
    UserModel.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockUser) }));
    const result = await findUserByEmail('john.doe@example.com');
    expect(result).toEqual(mockUser);
  });

  test('should throw an error if an exception occurs', async () => {
    const mockError = new Error('Mocked error');
    UserModel.findOne = jest
      .fn()
      .mockImplementationOnce(() => ({ select: jest.fn().mockRejectedValueOnce(mockError) }));
    await expect(findUserByEmail('john.doe@example.com')).rejects.toThrow('Email not Found: Mocked error');
  });

  test('should create a new user', async () => {
    UserModel.create = jest.fn().mockResolvedValueOnce(mockUser);
    const result = await createUser(mockUser);
    expect(result).toEqual(mockUser);
  });
  test('should throw an error if an error occurs', async () => {
    const mockError = new Error('Mocked error');
    UserModel.create = jest.fn().mockRejectedValueOnce(mockError);
    await expect(createUser(mockUser)).rejects.toThrow('Error creating user: Mocked error');
  });
});
