/// <reference types="node" />
import { IFileSystem, Encoding, IFile, IDirent, IStats } from '@aurelia/aot';
import type { WriteFileOptions } from 'fs';
export declare class VirtualFileSystem implements IFileSystem {
    private readonly root;
    addFile(path: string, content: string): void;
    realpath(path: string): Promise<string>;
    realpathSync(path: string): string;
    readdir(path: string): Promise<readonly string[]>;
    readdir(path: string, withFileTypes: true): Promise<readonly IDirent[]>;
    readdirSync(path: string): readonly string[];
    readdirSync(path: string, withFileTypes: true): readonly IDirent[];
    mkdir(path: string): Promise<void>;
    mkdirSync(path: string): void;
    isReadable(path: string): Promise<boolean>;
    isReadableSync(path: string): boolean;
    fileExists(path: string): Promise<boolean>;
    fileExistsSync(path: string): boolean;
    stat(path: string): Promise<IStats>;
    statSync(path: string): IStats;
    lstat(path: string): Promise<IStats>;
    lstatSync(path: string): IStats;
    readFile(path: string, encoding: Encoding, cache?: boolean, force?: boolean): Promise<string>;
    readFileSync(path: string, encoding: Encoding, cache?: boolean, force?: boolean): string;
    ensureDir(path: string): Promise<void>;
    ensureDirSync(path: string): void;
    writeFile(path: string, content: string, encoding: Encoding): Promise<void>;
    writeFileSync(path: string, content: string, encoding: WriteFileOptions): void;
    rimraf(path: string): Promise<void>;
    getRealPath(path: string): Promise<string>;
    getRealPathSync(path: string): string;
    getChildren(path: string): Promise<readonly string[]>;
    getChildrenSync(path: string): readonly string[];
    getFiles(dir: string, loadContent?: boolean): Promise<readonly IFile[]>;
    getFilesSync(dir: string, loadContent?: boolean): readonly IFile[];
    private getParentDir;
}
//# sourceMappingURL=virtual-file-system.d.ts.map