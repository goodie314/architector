import fs from 'fs';
import { writeFileSafe } from '../../src/util/file-util';

jest.mock('fs');
const fsMock = jest.mocked(fs);

describe('File util module', () => {
    describe('writeFileSafe', () => {
        test('calls mkDirSync when path to file does not exist', () => {
            fsMock.existsSync.mockReturnValue(false);
            writeFileSafe('/path/to/file.js', 'content');

            expect(fsMock.existsSync).toHaveBeenCalledWith('/path/to');
            expect(fsMock.mkdirSync).toHaveBeenCalledWith('/path/to', {
                recursive: true,
            });
            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                '/path/to/file.js',
                'content',
            );
        });

        test('does not call mkdirSync when path to file exists', () => {
            fsMock.existsSync.mockReturnValue(true);
            writeFileSafe('/path/to/file.js', 'content');

            expect(fsMock.existsSync).toHaveBeenCalledWith('/path/to');
            expect(fsMock.mkdirSync).not.toHaveBeenCalled();
            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                '/path/to/file.js',
                'content',
            );
        });
    });
});
