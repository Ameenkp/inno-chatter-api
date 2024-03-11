import {Utils} from "../../../src/utils/utils";

describe('Utils', () => {
    test('should save user image to filesystem', async () => {
        const image = [
            {
                originalFilename: 'test.jpg',
                filepath: '/path/test.jpg',
            },
        ];
        Utils.copyFileAsync = jest.fn().mockResolvedValue(null);
        await Utils.saveUserImage(image);
        expect(Utils.copyFileAsync).toHaveBeenCalledWith(image[0].filepath, expect.anything());
    });

    test('should throw an error if saving user image fails', async () => {
        const image = [
            {
                originalFilename: 'test.jpg',
            },
        ];
        Utils.copyFileAsync = jest.fn().mockRejectedValueOnce(null);
        await expect(Utils.saveUserImage(image)).rejects.toThrow(new Error('Failed to save user image'));
    });

    test('should save chat image messages to filesystem', async () => {
        const image = [
            {
                originalFilename: 'test.jpg',
                newFilename: 'test.jpg',
            },
        ];
        jest.mock('path', () => ({
            join: jest.fn(),
        }));
        Utils.copyFileAsync = jest.fn().mockResolvedValueOnce(null);
        await Utils.saveImage(image);
    });

    test('should throw an error if chat image save fails', async () => {
        const image = [
            {
                originalFilename: 'test.jpg',
                newFilename: 'test.jpg',
            },
        ];
        Utils.copyFileAsync = jest.fn().mockRejectedValueOnce(null);
        await expect(Utils.saveImage(image)).rejects.toThrow(new Error('Failed to save chat image'));
    });
});
