/**
 * Remove|Add the-names of files in name.txt on namidx.X.json
 *
 * Input: name.txt
 * Output: nameidx.X.json
 * run: node name.js
 *
 * modified: {2017-06-04}
 * created: {2017-06-01}
 */

var
  moFs = require('fs'),
  mfReadlines = require('n-readlines'), // npm install n-readlines
  oNextln,
  aFilesInComments = moFs.readFileSync('name.txt').toString().split('\n'),
  aFilesIn = [],
  //array to hold the-names of arrays-of-new-names
  aIdx = ['A','B','C','D','E','F','G','H','I','J','K','L',
    'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  //object to hold the-arrays with the-names of concepts.
  oIdx = {
    aA:[], aB:[], aC:[], aD:[], aE:[], aF:[], aG:[], aH:[],
    aI:[], aJ:[], aK:[], aL:[], aM:[], aN:[], aO:[], aP:[],
    aQ:[], aR:[], aS:[], aT:[], aU:[], aV:[], aW:[], aX:[],
    aY:[], aZ:[], aZZZ:[]
  },
  aIdxEll = ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ',
    'Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'];

/**
 * FIRST, find the-mcs-files to remove|add its names.
 * Put paths in aFilesIn.
 */
for (var n = 0; n < aFilesInComments.length; n++) {
  var
    sLn = aFilesInComments[n];

  // remove comments and empty-lines
  if (!sLn.startsWith('//') && sLn.length !== 0) {
    aFilesIn.push(sLn);
  }
}

/**
 * SECOND, for each file in aFilesIn,
 * REMOVE the-names linked to aFilesIn, from all namidx-files.
 */
for (var n = 0; n < aFilesIn.length; n++) {
  var
    sFilRmv = aFilesIn[n];

  for (var nI = 0; nI < aIdx.length; nI++) {
    var
      sFilIdx = 'namidx.' + aIdx[nI] + '.json',
      sLn;
    if (moFs.existsSync(sFilIdx)) {
      var
        aNew = [];
        aEx = JSON.parse(moFs.readFileSync(sFilIdx));
      for (var nE = 0; nE < aEx.length; nE++) {
        //the-link of a-name
        sLnk = aEx[nE][1];
        //add on aNew the-names without the-file to remove
        if (sLnk.indexOf(sFilRmv) === -1) {
          aNew.push(aEx[nE]);
        }
      }
      if (aNew.length > 0) {
        fWriteJsonSync(sFilIdx, aNew);
      } else {
        //delete file if empty
        moFs.unlinkSync(sFilIdx);
      }
    }
  }
}

/**
 * THIRD, For each file in aFilesIn
 * read the-file and add its new-names on oIdx in aIdx.
 */
for (var n = 0; n < aFilesIn.length; n++) {
  var
    sLn, sLnOrg, sLink;

  oReadlines = new mfReadlines(aFilesIn[n]);
  while (oNextln = oReadlines.next()) {
    sLnOrg = oNextln.toString();
    sLnLc = sLnOrg.toLowerCase();

    //process the-section and cpt lines
    if (sLnOrg.indexOf('section id="') > 0) {
      //first get the-id of the-section
      //names are-stored inside a-section
      sLink = sLnOrg.substring(sLnOrg.indexOf('"')+1,sLnOrg.lastIndexOf('"'));
      sLink = aFilesIn[n] + '#' + sLink;
    } else if (sLnLc.startsWith('    <br>* cpt.')) {
      //store names in arrays
      //Get the-14-char of line
      //if aIdx includes 14char
      //else put in oIdx['aZZZ']
      var
        sChar = sLnLc.charAt(14).toUpperCase(), //char at cpt.X
        a = [sLnOrg.substring(14, sLnOrg.indexOf(',')+1),sLink];
      if (aIdx.includes(sChar)) {
        oIdx['a'+sChar].push(a);
      } else {
        oIdx['aZZZ'].push(a);
      }
    }
  }
}

/**
 * FORTH, write the-non-empty-arrays with the-new-names in namidx-files.
 */
for (var n = 0; n < aIdx.length; n++) {
  //if array is-not empty
  var
    sNew = "a" + aIdx[n], //the-name of the-array with mcs-names
    aNew = oIdx[sNew], //the-array with mcs-names
    sFil = 'namidx.' + aIdx[n] + '.json'; //the-name of the-file with mcs-names
  if (aNew.length > 0) {
    aNew.sort();
    if (moFs.existsSync(sFil)) {
      var
        aEx = JSON.parse(moFs.readFileSync(sFil));
      for (var nN = 0; nN < aNew.length; nN++) {
        aEx.push(aNew[nN]); //add on existed-names the new names,
      }
      aEx = fArrayRemoveDupl(aEx); //remove duplicates
      aEx.sort();
      fWriteJsonSync(sFil, aEx);
    } else {
      fWriteJsonSync(sFil, aNew);
    }
  }
}
//we mist aZZZ
if (oIdx['aZZZ'].length > 0) {
  var
    aNew = oIdx['aZZZ'],
    aEx,
    sFil = 'namidx.ZZZ.json';
  aNew.sort();
  if (moFs.existsSync(sFil)) {
    var
      aEx = JSON.parse(moFs.readFileSync(sFil));
    for (var nN = 0; nN < aNew.length; nN++) {
      aEx.push(aNew[nN]); //add on existed-names the new names,
    }
    aEx = fArrayRemoveDupl(aEx); //remove duplicates
    aEx.sort();
    fWriteJsonSync(sFil, aEx);
  } else {
    fWriteJsonSync(sFil, aNew);
  }
}

/**
 * Remove duplicates of an-array.
 */
function fArrayRemoveDupl(aIn) {
  var
    oSeen = {},
    aOut = [];
  for(var n = 0; n < aIn.length; n++) {
    var
      oMember = aIn[n];
    if(oSeen[oMember] !== 1) {
      oSeen[oMember] = 1;
      aOut.push(oMember);
    }
  }
  return aOut;
}

/**
 * Create json-file from array.
 * Each element in the-array is another array
 * with name and link elements.
 */
function fWriteJsonSync(sFilIn, aIn) {
  var s = '[\n';
  for (var n = 0; n < aIn.length-1; n++) {
    s = s +'  ["' + aIn[n][0] + '","' + aIn[n][1] + '"],\n';
  }
  s = s + '  ["' + aIn[aIn.length-1][0] + '","' + aIn[aIn.length-1][1] + '"]\n';
  s = s + ']';
  moFs.writeFileSync(sFilIn, s);
}