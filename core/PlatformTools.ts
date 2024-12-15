import fs from "fs";
import Path from "path";

/**
 * @description Quick and dirty helper. Just accepts a single extension, doesn't recurse. Just needed something for now.
 * @author Justin Stroud
 */

export default class PlatformTools{

    /**
     * @description Simply retrieves all the filenames in a directory with a given extension.
     * @param fromRoot What directory to start from
     * @param withExtension The file extension we want to pick up
     * @param recurse Whether we want to walk the whole directory tree
     */
    static getAllFilePaths(fromRoot : string, withExtension : string, recurse : Boolean) : string[] {
        const allFilePaths : string[] = [];
        fs.readdirSync(target, {withFileTypes: true})
        .filter(item => !item.isDirectory() && item.name.endsWith(withExtension))
        .forEach(item => {
            const full_path = path.join(item.path,item.name);
            allFilePaths.push(full_path);
        });    
    }
}

