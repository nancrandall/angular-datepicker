//------------------------------------------------------------------------------
/*   Application Name: Angular date-range-picker
 *       Date Created: 02/20/2018
 *           Compiler: TypeScript 2.0
 *
 *     Change History:
 *      Date            Programmer      Description/Comments/DefectID
 */
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
/**
 * Helper methods for files and creating clientlib
 */
//------------------------------------------------------------------------------


const fs      = require('fs');
const path    = require('path')
const logging = false;

//------------------------------------- use log for debugging or verbose logging
var log = (something) => (logging)? console.log(something) : null;

//------------------------------------------------------------------------------
/**
 * get file names inside @param folder that match any entry of @param matchArr
 * @param dir       the relative folder path
 * @param matchArr  the array of obj{startsWith:'', endsWith''} 
 */
//------------------------------------------------------------------------------
var getFileNames = (dir , matchArr) =>
{
  // ---------------------------------------------------- if no directory, ERROR
  if(!dir)
  {
    console.error("no folder specified! cant get file names");
  }
  // --------------------------------------------------------- read files in dir
  var filesInDir = fs.readdirSync(dir);
  if(!matchArr)
  {
    log("no matching array, returning all files");
    return filesInDir;
  }
  // ---------------------- filter files to only ones that match any of matchArr
  var filteredFiles = filesInDir.filter(fileName =>
  {
    var match = false;
    // ------------------------------------------------------ loop over matchArr
    matchArr.forEach((matchEntry, index) =>
    {
      if(!matchEntry && !matchEntry.startsWith && !matchEntry.endsWith){
          console.error(`Could not find either or both properties: 
          'startsWith', 'endsWith' in matchArr[${index}]`)
      }
      // --------------------------- if no match found yet, check next file name
      match = (match)
        ? match
        : (fileName.startsWith(matchEntry.startsWith) 
           && fileName.endsWith(matchEntry.endsWith));
    });
    return match;
  });
  log(filteredFiles);
  return filteredFiles;
}

//------------------------------------------------------------------------------
/**
 * iIerates over fileAarr, returns two strings:
 * jsTxt: a newline-seperated string of all entries that end with "js"
 * cssTxt: a newline-seperated string of all entries that end with "css"
 * @param fileAarr  an arry of string file names
 * @returns {jsTxt: string , cssTxt: string}
 */
//------------------------------------------------------------------------------
var getClientlibTxt = (fileAarr) =>
{
  var jsString = "";
  var cssString = "";

  // -------------------------- order the array then loop over the ordered array
  _order(fileAarr).forEach(file =>
  {
    // ----------------------- if file ends with "js" then append it to jsString
    jsString = (file.endsWith("js"))
                ? jsString + "\n" + file
                : jsString;
    // --------------------- if file ends with "css" then append it to cssString
    cssString = (file.endsWith("css"))
                ? cssString + "\n" + file
                : cssString;
  });
  return {
    jsTxt: jsString,
    cssTxt: cssString
  };
}

//------------------------------------------------------------------------------
/**
 * Copies @param source file to @param dist
 * @param source source file path
 * @param dist   Destination directory
 */
//------------------------------------------------------------------------------
var copyFile = (source, dist) =>
{
  log(`Copying file from ${source} to ${dist} `);
  fs.writeFileSync(dist, fs.readFileSync(source));
}

//------------------------------------------------------------------------------
/**
 * Copies all files in @param fileNameArr from @param source file to @param dist
 * @param source       source file diretory
 * @param dist         Destination directory
 * @param fileNameArr  File names to find in source directory
 */
//------------------------------------------------------------------------------
var copyFiles = (rootPath, distPath, fileNameArr) =>
{
  if(!rootPath || !distPath || !fileNameArr){
    console.error
    (
      `Missing one or more argument/s:
      provider args:
        rootPath: ${rootPath}
        distPath: ${distPath}
        fileNameArr: ${fileNameArr}`
    );
  }
  fileNameArr.forEach(file =>
  {
    // ------------------------------------------ get source and dist file paths
    var sourceFilePath = rootPath + file;
    var distFilePath = distPath + file;
    // --------------------------------------------------------------- copy file
    copyFile(sourceFilePath, distFilePath);
  });
}

//------------------------------------------------------------------------------
/**
 * make directory @param dir if does not exist
 * @param dir   directory path to create
 */
//------------------------------------------------------------------------------
var mkdir = (dir) =>
{
  if (!fs.existsSync(dir))
  {
    fs.mkdirSync(dir);
  }
}

//------------------------------------------------------------------------------
/**
 * recursively copy a directory
 * @param src   source dir
 * @param dest  destination dir
 */
//------------------------------------------------------------------------------
copyDir = (src, dest) => {
  var stats = fs.statSync(src);
  var isDirectory = stats.isDirectory();
  var isFile = stats.isFile();
  if (isDirectory) {
    mkdir(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyDir(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else if(isFile) {
    copyFile(src, dest);
  }
};


//------------------------------------------------------------------------------
/** PRIVATE
 * order array @param fileAarr to match the order of "inline" then "vendor" then 
 * "main"
 * @param fileAarr string array of file names
 */
//------------------------------------------------------------------------------
var _order = (arr) =>
{
  // ----------------------- rder array, based on which the ordering will happen
  var orderArray = ["inline", "vendor", "main"];
  // ------------------------------------  clone the passed in array via slice(0)
  var arrCopy = arr.slice(0);
  // -------------------------------- placeholder for The resulting ordered array
  var ordered = [];
  // ---------------- check for matches of orderArray items and add them in order
  orderArray.forEach((item) => 
  {
    arrCopy.forEach((file, j) => 
    {
      if (file.toLowerCase().includes(item.toLowerCase())) 
      {
        // ------------ if a match is found push that match into the result array
        ordered.push(file);
        // remove the found match from the copy array, so we dont check against 
        // it again
        arrCopy.splice(j, 1);
      }
    });
  });
  // ------------------ return the ordered array first then append all other items
  return ordered.concat(arrCopy);
}


//--------------------------------------------------------------- module exports
exports.getFileNames = getFileNames;
exports.copyFile = copyFile;
exports.copyFiles = copyFiles;
exports.getClientlibTxt = getClientlibTxt;
exports.mkdir = mkdir;
exports.copyDir = copyDir;