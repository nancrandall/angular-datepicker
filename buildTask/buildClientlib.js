/* jshint undef: true, unused: true, esversion:6, node: true */
//-----------------------------------------------------------------------------
/**
 * NodeJs script to generate AEM clientlib, it will run as part of 
 * an npm script in ../package.json
 */
//-----------------------------------------------------------------------------
// ------------------------------------------------------------------- Constans
const helper   = require('./helper/buildHelper');
const NodeTask = require('./helper/nodeTask');
const rimraf   = require('rimraf');
const fs       = require('fs');

//---------- flag for logging stuff, for debugging. used in log function below.
const logging = false;

//------------------------------- basically console.log based on global boolean
var log = (something) => (logging)? console.log(something) : null;

//-------------------------------------------------------------------- Constans

//------------------------------------------------------------- file extensions
const EXT  = { JS: 'js', CSS : 'css', MAP :'map' };

//--------- bundle name constants. Those are bundles that angular cli generates
const BUNDLE =
{
  INLINE:   'inline',
  STYLES:   'styles',
  MAIN:     'main',
  VENDOR:   'vendor',
  POLYFILLS:'polyfills'
};

//-----------------------------------------------------------------------------
/**
 *                                   MAIN
 * Create doctors-locatiosn clientlib from build generated js, css and map
 * and move to ui.apps clientlib directory
 */
//-----------------------------------------------------------------------------
// ---------------------------------------------------------- The build options
const options =
{
  // comma seperated string of clientlib catigories
  catigories: 'doctors-locations.all',
  // the path to the xml template for cientlib
  xmlTemplatePath: 'buildTask/template/.content.xml',
  // the place holder to replce `catigories` option with
  placeholder: '$catigories$',
  // where the clientlib will be copied
  destination: '../ui.apps/src/main/content/jcr_root/etc/designs/kporg/doctors-locations/clientlib/',
  // copy sourcemap files to `destination` also
  copySourceMapFiles: true,
  // the fileNames that need to be copied to `destination` and added to clientlib css.txt and js.txt
  // ORDER IS IMPORTANT
  fileNames: 
  [
    { startsWith: BUNDLE.INLINE,    endsWith: EXT.JS  },
    { startsWith: BUNDLE.POLYFILLS, endsWith: EXT.JS  },
    { startsWith: BUNDLE.STYLES,    endsWith: EXT.CSS },
    { startsWith: BUNDLE.STYLES,    endsWith: EXT.JS  },
    { startsWith: BUNDLE.VENDOR,    endsWith: EXT.JS  },
    { startsWith: BUNDLE.MAIN,      endsWith: EXT.JS  }
  ]
};

//-------------------------------------- global variables, shared across steps.
var clientLibCodeFiles,
sourceMapFiles,
clientlibTxt;
//------------------------------------------------------------------------ TASK
var ClientLibTask = new NodeTask.Task('Build Doctors-locations Clientlib');

//------------------------------------------------------------------------ step
ClientLibTask.step(`Get generated file names in 'dist'`, ()=>{
    clientLibCodeFiles = helper.getFileNames('dist', options.fileNames);
    var sourceMapFileNames = options.fileNames
    .map(fileObj => {return {startsWith:fileObj.startsWith,endsWith: EXT.MAP}; });
    sourceMapFiles = helper.getFileNames('dist', sourceMapFileNames);
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`Clean clientlib directory in ui.apps`, ()=>{
  log(`removing dir: ${options.destination}`);
  rimraf.sync(options.destination);
  log(`making dir: ${options.destination}`);
  helper.mkdir(options.destination);
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`Create js.txt and css.txt files in clientlib folder`,
  ()=>{
    var orderedNames = options.fileNames.map(fileObj => fileObj.startsWith);
    var orderedFiles = helper.order(clientLibCodeFiles, orderedNames);
    clientlibTxt = helper.getClientlibTxt(orderedFiles);
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`add catigories to .content.xml then copy to ui.apps`,
  ()=>{
    //--------------------------- read .content.xml template and add catigories
    var contentTemplate = fs.readFileSync(options.xmlTemplatePath, { encoding: "utf8" })
    .replace(options.placeholder, options.catigories);
    //------------------------------- write content.xml to clientlib in ui.apps
    fs.writeFileSync(options.destination + ".content.xml", contentTemplate);
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`Add catigories to .content.xml then copy to ui.apps`,
  ()=>{
    //----------------------------------- write css.txt and js.txt  to clientlib
    fs.writeFileSync(options.destination + "js.txt", clientlibTxt.jsTxt);
    fs.writeFileSync(options.destination + "css.txt", clientlibTxt.cssTxt);
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`Copy js/css files to clientlib`, ()=>{
    helper.copyFiles('dist/', options.destination, clientLibCodeFiles);
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`Copy js/css files to clientlib`, ()=>{
    helper.copyFiles('dist/', options.destination, clientLibCodeFiles);
});
//-------------------------------------- weather or not to copy  sourceMapFiles
if(options.copySourceMapFiles){
  ClientLibTask.step(`Copy map files to clientlib`, ()=>{
    helper.copyFiles('dist/', options.destination, sourceMapFiles);
  });
}
//------------------------------------------------------------------------ step
ClientLibTask.step(`copy asset files under /assets to clientlib`, ()=>{
  fs.readdirSync('dist').forEach(file =>{
    var dontCopy = false;
    ['.js','.css','.map','.gz','.png','.jpg','.svg','.html','assets'].forEach(name => 
      dontCopy = (dontCopy)? dontCopy : file.endsWith(name));
    if(!dontCopy)
    {
      var src = 'dist/' + file;
      var dist = options.destination + file;
      helper.copyFile(src, dist);
    }
  });
});

//------------------------------------------------------------------------ step
ClientLibTask.step(`copy image files under dist/assets/images to clientlib`, ()=>{
  helper.mkdir(options.destination + "assets");
  helper.copyDir("dist/assets/images/", options.destination + "assets/images/");
});

ClientLibTask.done();