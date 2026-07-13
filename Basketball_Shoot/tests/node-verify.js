/* Optional headless verification helper. Browser users should open test-runner.html. */
global.window=global;
var memory={};
global.localStorage={getItem:function(k){return Object.prototype.hasOwnProperty.call(memory,k)?memory[k]:null;},setItem:function(k,v){memory[k]=String(v);},removeItem:function(k){delete memory[k];}};
global.document={documentElement:{},querySelectorAll:function(){return[];}};
var tests=[],suite='';
global.describe=function(name,fn){var old=suite;suite=name;fn();suite=old;};
global.it=function(name,fn){tests.push({suite:suite,name:name,fn:fn});};
global.assert=function(v,msg){if(!v)throw new Error(msg||'Assertion failed');};
global.assertEqual=function(a,b,msg){if(a!==b)throw new Error((msg||'Expected equality')+': '+a+' !== '+b);};
[
  '../js/utils/constants.js','../js/utils/math-utils.js','../js/core/physics.js','../js/core/state-manager.js','../js/core/save-manager.js','../js/data/settings-schema.js','../js/data/leaderboard-manager.js','../js/i18n/lang-zh.js','../js/i18n/lang-en.js','../js/i18n/lang-ja.js','../js/i18n/i18n-manager.js','../js/audio/sound-library.js','../js/audio/audio-manager.js','../js/ui/touch-controls.js',
  './unit/physics.test.js','./unit/state-manager.test.js','./unit/save-manager.test.js','./unit/i18n-manager.test.js','./unit/audio-manager.test.js','./unit/leaderboard-manager.test.js','./unit/touch-controls.test.js','./unit/settings-schema.test.js','./unit/arcade-mode.test.js'
].forEach(function(file){require(file);});
var failures=[];tests.forEach(function(t){try{t.fn();process.stdout.write('PASS '+t.suite+' > '+t.name+'\n');}catch(e){failures.push(t);process.stderr.write('FAIL '+t.suite+' > '+t.name+' — '+e.message+'\n');}});
process.stdout.write((tests.length-failures.length)+'/'+tests.length+' passed\n');
if(failures.length)process.exitCode=1;
