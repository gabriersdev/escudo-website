import {readdir} from 'fs/promises';
import path from 'path';
import {ignoreList} from './ignore-list.js';

export async function* getFiles(dir) {
  const dirents = await readdir(dir, {withFileTypes: true});
  
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    
    if (dirent.isDirectory()) {
      if (!ignoreList.includes(dirent.name)) {
        yield* getFiles(res);
      }
    } else {
      yield res;
    }
  }
}

export function renderText(text) {
  if (typeof text !== "string") return text;
  
  return text.split(/(\/)/).map((part, index) =>
    part === "/" ? (
      <span
        key={index}
        style={{ fontSize: "inherit", fontFamily: "Arial, sans-serif" }}
      >
        /
      </span>
    ) : (
      part
    )
  );
}
