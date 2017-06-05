/*
 * version.16.2017-06-05.search (15-6): hitp.16.2017-06-05.js
 * version.15.2016-10-27.any-machine (14-9): hitp.15.2016-10-27.js
 * version.14.2016-06-09.table-content-tree (13): hitp.14.2016-06-09.js
 * version.13.2016-06-07.preview (12-11): hitp.13.2016-06-07.js
 * version.12.2016-01-24.toc-icn-img (11.9): hitp.2016.01.24.12.js
 * version.11.2015-10-26.preferences: hitp.2015.10.26.11.js
 * version.10.2014-08-05.valuenames: hitp.2014.08.05.10.js
 * version.9.2014-08-02.no-jQuery: hitp.2014.08.02.9.js
 * version.8.2014-01-09.toc-on-hovering: hitp.2014.01.09.8.js
 * version.7.2013-11-06.tabs: hitp.2013.11.06.7.js
 * version.6.2013-08-21.site-structure: hitp.2013.08.21.6.js
 * version.previous: hitp.2013.07.15.js (toc-ul-specific, hitp-obj)
 * version.previous: /hitp/hitp.2013.06.29.js (hitp-dir)
 * version.previous: toc.2013.05.30.js (section id)
 * version.previous: toc.2013.04.19.js (JSLint ok)
 * version.previous: toc.2013.04.14.js (preview links)
 * version.previous: toc.2013.04.07.js (button expand|collapse)
 * version.previous: toc.2013.04.05.js (toc scrolls to highlited)
 * version.previous: toc.2013.04.04.js (goes click location)
 * version.previous: toc.2013.04.01.js (toc on any browser)
 * version.previous: 2010.12.06 (toc on chrome)
 *
 * hitp.js - html5.id.toc.preview webpage-format code.
 * This code is the result of the evolution of my
 * a) TableOfContents chrome extention (https://chrome.google.com/webstore/detail/tableofcontents/eeknhipceeelbgdbcmchicoaoalfdnhi)
 * and
 * b) synagonism-mw MediaWiki skin (http://synagonism-mw.sourceforge.net/)
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Kaseluris.Nikos.1959 (synagonism)
 * kaseluris.nikos@gmail.com
 * http://synagonism.net/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var oHitp = (function () {

  var oHitp = {
    /** config variables */
    nCfgTocWidth: 25, //% of window width
    /**
     * filSite-structure contains absolute urls, because we see it from many pages.
     * Then we must-know the-homepage of the-site and create different menus.
     */
    sCfgHomeLocal: '/dWstSgm/',

    bEdge: navigator.userAgent.indexOf('Edge/') > -1,
    bFirefox: navigator.userAgent.indexOf('Firefox/') > -1,
    //existance of site-structure menu
    bSite: false,

    oEltClicked: document.body,

    sQrAClk: 'idFoo',
    sQrAClkLast: '',
  };

  /**
   * Creates new containers and inserts them in the-body-element:
   * - Top-cnr for title and menus.
   * - Main-cnr for page-info and page-content.
   * - Width-cnr for managing the-width of page-info.
   * - Site-cnr for containing the-site-strucute.
   * - Preview-cnr to display link-previews.
   */
  oHitp.fContainersInsert = function () {
    var
      bServer = location.hostname !== '', //to display site-structure and homepage
      fEvtLink,
      fEvtPreview,
      fEvtClickContent,
      oEltBody = document.body,
      oEltCnrTopDiv = document.createElement('div'),
      //the page-content and page-info container
      oEltCnrMainDiv = document.createElement('div'),
      oEltCnrMainPgcntDiv = document.createElement('div'),
      oEltCnrMainPginfDiv = document.createElement('div'),
      oEltCnrWidthDiv = document.createElement('div'),
      oEltCnrSiteDiv = document.createElement('div'),
      oEltCnrPreviewDiv = document.createElement('div'),
      oEltTopSiteIcnI = document.createElement('i'),
      oEltTopTitleP = document.createElement('p'),
      oEltTopHomeIcnI = document.createElement('i'),
      oEltTopWidthIcnI = document.createElement('i'),
      oEltSiteTreeUl,
      //Page-info-cnr contains: PathP, TabNamesUl, TabCntDiv,
      oEltPginfPathP = document.createElement('p'),
      oEltPginfTabHeadersUl = document.createElement('ul'),
      //Tab-content contains: TabCntToc, TabCntSrc
      oEltPginfTabCntDiv = document.createElement('div'),
      oEltTabCntTocDiv = document.createElement('div'),
      oEltTabCntTocCpsBtn = document.createElement('input'),
      oEltTabCntTocExpBtn = document.createElement('input'),
      oEltTabCntTocPrfDiv = document.createElement('div'),
      oEltTabCntTocNotP = document.createElement('p'),
      oEltTabCntSrcDiv = document.createElement('div'),
      oEltTabCntSrcP = document.createElement('p'),
      oEltTabCntSrcIpt = document.createElement('input'),
      oEltTabCntSrcOl = document.createElement('ol'),
      sTabCntSrcOl =
        '<li>You can-search for a-structured-concept of Kaseluris.Nikos.1959 WORLDVIEW.</li>' +
        '<li>Today his online-worldview contains ABOUT 2,000 structured-concepts with 4,000 names.</li>' +
        '<li>The major concepts are-related to "javascript" and "blockchain-network".</li>' +
        '<li>Structured-concept-searching demonstrates THE-POWER of structured-concepts. Compare them with Google-WORD-search and Wikipedia-TEXT-entries.</li>' +
        '<li><a class="clsPreview" href="../../../#idAboutme">Kaseluris.Nikos.1959</a> works more than 30 years on structured-concepts. His offline-worldview contains more than 100,000 of them. <a class="clsPreview" href="../../../#idSupport">Support him</a> to continue publishing.</li>',
      oXHR = new XMLHttpRequest(),
      sPathSitemenu,
      sContentOriginal = oEltBody.innerHTML,
      sIdTabActive;

    oEltCnrTopDiv.id = 'idCnrTopDiv';
    oEltCnrMainDiv.id = 'idCnrMainDiv';

    //top-title-text
    oEltTopTitleP.innerHTML = document.getElementsByTagName('title')[0].innerHTML;
    oEltTopTitleP.id = 'idTopTitleP';
    //width
    oEltTopWidthIcnI.setAttribute('class', 'clsFa clsFaArrowsH clsTopIcn clsColorWhite clsFloatRight clsTtp clsPosRight');
    //to show a-tooltip on an-element:
    //- set clsTtp on element
    //- set tooltip (<span class="clsTtp">Width of Page-Info</span>) inside the-element
    //- on element click add clsClicked and clsTtpShow
    oEltTopWidthIcnI.innerHTML = '<span class="clsTtp">Width of Page-Info</span>';
    oEltTopWidthIcnI.addEventListener('click', function (oEvtIn) {
      if (oEltTopWidthIcnI.className.indexOf('clsClicked') > -1) {
        oEltCnrWidthDiv.style.display = 'block';
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
      } else {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
        oHitp.oEltClicked = oEltTopWidthIcnI;
        oEltTopWidthIcnI.classList.add('clsClicked', 'clsTtpShow');
      }
    });
    //width-content
    oEltCnrWidthDiv.id = 'idCnrWidthDiv';
    oEltCnrWidthDiv.innerHTML = '<p id="idWidthCntP" class="clsCenter">close <i class="clsFa clsFaClose clsFloatRight clsColorWhite clsTopIcn"></i></p>' +
      '<fieldset><legend>Page-Info-width:</legend>' +
      '<input type="radio" id="idRdbWidth0" name="nameRdbWidth">0 %<br>' +
      '<input type="radio" id="idRdbWidth10" name="nameRdbWidth">10 %<br>' +
      '<input type="radio" id="idRdbWidth20" name="nameRdbWidth">20 %<br>' +
      '<input type="radio" id="idRdbWidth25" name="nameRdbWidth" checked>25 % (default)<br>' +
      '<input type="radio" id="idRdbWidth30" name="nameRdbWidth">30 %<br>' +
      '<input type="radio" id="idRdbWidth40" name="nameRdbWidth">40 %<br>' +
      '<input type="radio" id="idRdbWidth50" name="nameRdbWidth">50 %<br>' +
      '<input type="radio" id="idRdbWidth100" name="nameRdbWidth">100 %<br>' +
      '</fieldset>';
    oEltCnrTopDiv.appendChild(oEltTopTitleP);
    oEltCnrTopDiv.appendChild(oEltTopWidthIcnI);
    oEltTopTitleP.addEventListener('click', function(oEvtIn) {
      oEltCnrPreviewDiv.style.display = 'none'; //remove popup-cnr
      oEltCnrSiteDiv.style.display = 'none'; //remove site-cnr
      oEltCnrWidthDiv.style.display = 'none'; //remove width-cnr
      oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked'); //remove tooltip clicks
    });

    oEltBody.innerHTML = '';
    oEltBody.appendChild(oEltCnrTopDiv);
    oEltBody.appendChild(oEltCnrMainDiv);
    oEltBody.appendChild(oEltCnrWidthDiv);
    document.getElementById('idWidthCntP').addEventListener('click', function(oEvtIn) {
      oEltCnrWidthDiv.style.display = 'none';
    });
    document.getElementById('idRdbWidth0').addEventListener('click', function(oEvtIn) {
      fWidthPginf(0);
      oHitp.nCfgTocWidth = 0;
    });
    document.getElementById('idRdbWidth10').addEventListener('click', function(oEvtIn) {
      fWidthPginf(10);
      oHitp.nCfgTocWidth = 10;
    });
    document.getElementById('idRdbWidth20').addEventListener('click', function(oEvtIn) {
      fWidthPginf(20);
      oHitp.nCfgTocWidth = 20;
    });
    document.getElementById('idRdbWidth25').addEventListener('click', function(oEvtIn) {
      fWidthPginf(25);
      oHitp.nCfgTocWidth = 25;
    });
    document.getElementById('idRdbWidth30').addEventListener('click', function(oEvtIn) {
      fWidthPginf(30);
      oHitp.nCfgTocWidth = 30;
    });
    document.getElementById('idRdbWidth40').addEventListener('click', function(oEvtIn) {
      fWidthPginf(40);
      oHitp.nCfgTocWidth = 40;
    });
    document.getElementById('idRdbWidth50').addEventListener('click', function(oEvtIn) {
      fWidthPginf(50);
      oHitp.nCfgTocWidth = 50;
    });
    document.getElementById('idRdbWidth100').addEventListener('click', function(oEvtIn) {
      fWidthPginf(100);
      oHitp.nCfgTocWidth = 100;
    });

    //adds click event on input link elements
    fEventLink = function(oEltIn) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault();

        if (oEltIn.className.indexOf('clsClicked') > -1) {
          oEltIn.classList.remove('clsClicked');
          location.href = oEltIn.href;
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
          oHitp.oEltClicked = oEltIn;
          oEltIn.classList.add('clsClicked');
          fEvtPreview(oEvtIn);
        }
      });
    };

    //site-structure menu
    if (bServer) {
      if (location.hostname === 'localhost') {
        sPathSitemenu = location.origin + oHitp.sCfgHomeLocal + 'filSite-structureLocal.html';
      } else {
        sPathSitemenu = location.origin + '/filSite-structure.html';
      }
      oXHR.open('GET', sPathSitemenu, true);
      oXHR.send(null);
      oXHR.onreadystatechange = function () {
        if (oXHR.readyState === 4 && oXHR.status === 200) { //DONE, OK
          oEltSiteTreeUl = (new DOMParser()).parseFromString(oXHR.responseText, 'text/html');
          oEltSiteTreeUl = oEltSiteTreeUl.querySelector('ul');
          oEltSiteTreeUl.setAttribute('id', 'idSiteTreeUl');

          //site-icn
          oEltTopSiteIcnI.setAttribute('class', 'clsFa clsFaMenu clsTopIcn clsColorWhite clsFloatLeft clsTtp');
          oEltTopSiteIcnI.innerHTML = '<span class="clsTtp">Site-structure</span>';
          oEltTopSiteIcnI.addEventListener('click', function (oEvtIn) {
            if (oEltTopSiteIcnI.className.indexOf('clsClicked') > -1) {
              oEltCnrSiteDiv.style.display = 'block';
              oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
            } else {
              oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
              oHitp.oEltClicked = oEltTopSiteIcnI;
              oEltTopSiteIcnI.classList.add('clsClicked', 'clsTtpShow');
            }
          });
          //home-icn
          oEltTopHomeIcnI.setAttribute('class', 'clsFa clsFaHome clsTopIcn clsColorWhite clsFloatLeft clsTtp');
          oEltTopHomeIcnI.innerHTML = '<span class="clsTtp">Home-webpage</span>';
          oEltTopHomeIcnI.addEventListener('click', function (oEvtIn) {
            if (oEltTopHomeIcnI.className.indexOf('clsClicked') > -1) {
              oEltTopHomeIcnI.classList.remove('clsClicked');
              oHitp.oEltClicked.classList.remove('clsTtpShow');
              if (bServer) {
                if (location.hostname === 'localhost') {
                  location.href = location.origin + oHitp.sCfgHomeLocal;
                } else {
                  location.href = location.origin;
                }
              }
            } else {
              oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
              oHitp.oEltClicked = oEltTopHomeIcnI;
              oEltTopHomeIcnI.classList.add('clsClicked', 'clsTtpShow');
            }
          });
          //site-content
          oEltCnrSiteDiv.id = 'idCnrSiteDiv';
          oEltCnrSiteDiv.innerHTML =
            '<p id="idSiteCntP1" class="clsCenter">close <i class="clsFa clsFaClose clsFloatRight clsColorWhite clsTopIcn"></i></p>' +
            '<p id="idSiteCntP2" class="clsCenter">Site-structure</p>';
          oEltCnrSiteDiv.appendChild(oEltSiteTreeUl);
          oEltCnrTopDiv.insertBefore(oEltTopHomeIcnI, oEltCnrTopDiv.firstChild);
          oEltCnrTopDiv.insertBefore(oEltTopSiteIcnI, oEltCnrTopDiv.firstChild);
          oEltBody.appendChild(oEltCnrSiteDiv);
          document.getElementById('idSiteCntP1').addEventListener('click', function(oEvtIn) {
            oEltCnrSiteDiv.style.display = 'none';
          });
          oHitp.oTreeUl.fTruCreate(oEltSiteTreeUl);
          oHitp.bSite = true;
          //on a-links, first highlight
          Array.prototype.slice.call(document.querySelectorAll('#idSiteTreeUl a')).forEach(function (oEltIn, nIndex, array) {
            fEventLink(oEltIn);
          });
          Array.prototype.slice.call(document.querySelectorAll('#idSiteTreeUl i')).forEach(function (oEltIn, nIndex, array) {
            oEltIn.classList.add('clsColorWhite');
          });
        }
      };
    }

    //set on page-content-cnr the original-body content
    oEltCnrMainPgcntDiv.id = 'idCnrMainPgcntDiv';
    oEltCnrMainPgcntDiv.innerHTML = sContentOriginal;
    oEltCnrMainDiv.appendChild(oEltCnrMainPgcntDiv);

    //insert page-info-cnr
    oEltCnrMainPginfDiv.id = 'idCnrMainPginfDiv';
    //insert content on TabCntToc
    oEltTabCntTocDiv.id = 'idTabCntTocDiv';
    oEltTabCntTocDiv.setAttribute('class', 'clsTabCnt');
    oEltTabCntTocDiv.innerHTML = oHitp.fTocTriCreate();
    //insert collaplse-button
    oEltTabCntTocCpsBtn.setAttribute('id', 'idBtnCollapse_All');
    oEltTabCntTocCpsBtn.setAttribute('type', 'button');
    oEltTabCntTocCpsBtn.setAttribute('value', 'Collapse-All');
    oEltTabCntTocCpsBtn.setAttribute('class', 'clsBtn');
    oEltTabCntTocCpsBtn.addEventListener('click', function (oEvtIn) {
      if (oEltTabCntTocCpsBtn.className.indexOf('clsClicked') > -1) {
        oHitp.oTreeUl.fTruCollapseAll();
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
      } else {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
        oHitp.oEltClicked = oEltTabCntTocCpsBtn;
        oEltTabCntTocCpsBtn.classList.add('clsClicked', 'clsTtpShow');
      }
    });
    oEltTabCntTocDiv.insertBefore(oEltTabCntTocCpsBtn, oEltTabCntTocDiv.firstChild);
    //insert expand-button
    oEltTabCntTocExpBtn.setAttribute('id', 'idBtnExp_All');
    oEltTabCntTocExpBtn.setAttribute('type', 'button');
    oEltTabCntTocExpBtn.setAttribute('value', 'Expand-All');
    oEltTabCntTocExpBtn.setAttribute('class', 'clsBtn');
    oEltTabCntTocExpBtn.addEventListener('click', function (oEvtIn) {
      if (oEltTabCntTocExpBtn.className.indexOf('clsClicked') > -1) {
        oHitp.oTreeUl.fTruExpandAll();
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
      } else {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
        oHitp.oEltClicked = oEltTabCntTocExpBtn;
        oEltTabCntTocExpBtn.classList.add('clsClicked', 'clsTtpShow');
      }
    });
    oEltTabCntTocDiv.insertBefore(oEltTabCntTocExpBtn, oEltTabCntTocDiv.firstChild);
    //TabCntToc: preferences
    oEltTabCntTocDiv.appendChild(document.createElement('p'));
    oEltTabCntTocPrfDiv.innerHTML = '<span class="clsColorGreen clsB">PREFERENCES</span>:<br>' +
      '<fieldset><legend><span class="clsColorGreen">Fonts</span>:</legend>' +
      '<input type="radio" id="idRdbFontMono" name="nameRdbFont" checked/>Mono (default)<br>' +
      '<input type="radio" id="idRdbFontSerif" name="nameRdbFont"/>Serif<br>' +
      '<input type="radio" id="idRdbFontSSerif" name="nameRdbFont"/>Sans-serif' +
      '</fieldset>';
    oEltTabCntTocDiv.appendChild(oEltTabCntTocPrfDiv);
    //TabCntToc: end-note
    oEltTabCntTocNotP.innerHTML = '<span class="clsColorGreen clsB">Notes</span>:<br>' +
      'a) Clicking on CONTENT, shows its position on ToC, the-links, the-address-link-icon <i class="clsFa clsFaLink clsImgLnkIcn"></i>, and removes ontop windows and highlights.<br>' +
      'b) Clicking on ADDRESS-LINK-ICON or on ToC, you see the-address of that text on address-bar.<br>' +
      'c) Clicking <span class="clsColorBlue">a-BLUE-LINK</span> shows a-preview.<br>' +
      'd) SECOND-CLICK, usually, does the-events attached to components in-order-to work well on touch-screens.';
    oEltTabCntTocDiv.appendChild(oEltTabCntTocNotP);
    //insert TabCntToc in TabCnt
    oEltPginfTabCntDiv.id = 'idTabCntDiv';
    oEltPginfTabCntDiv.appendChild(oEltTabCntTocDiv);
    //TabCntSrc
    oEltTabCntSrcDiv.id = 'idTabCntSrcDiv';
    oEltTabCntSrcDiv.setAttribute('class', 'clsTabCnt');
    oEltTabCntSrcP.id = 'idTabCntSrcP';
    oEltTabCntSrcP.innerHTML =
      'Type NAME of structured-concept-(mcs)';
    oEltTabCntSrcP.setAttribute('class', 'clsCenter');
    oEltTabCntSrcIpt.id = 'idTabCntSrcIpt';

    //on enter, go to concept
    oEltTabCntSrcIpt.addEventListener('keydown', function (oEvtIn) {
      var
        aLi, //list of elements of suggestion
        aLit, //arry of texts of elements
        sLoc = '';
      if (oEvtIn.keyCode === 13) { //enter key
        if (oEltTabCntSrcIpt.value.length > 0
         && oEltTabCntSrcIpt.value.endsWith(',')) {
          //a whole name is typed, go this location
          aLi = oEltTabCntSrcOl.getElementsByTagName('li');
          for (var n = 0; n < aLi.length; n++) {
            //<a class="clsPreviw" href="...">oEltTabCntSrcIpt.value</a>
            sLoc = aLi[n].innerHTML;
            if (sLoc.indexOf(oEltTabCntSrcIpt.value) !== -1) {
              sLoc = sLoc.substring(sLoc.indexOf('href="')+6,
                                    sLoc.lastIndexOf('"'));
              break;
            }
          }
          if (sLoc !== '') {
            location.href = sLoc;
          }
        }
      }
    });
    //on typing, suggest
    oEltTabCntSrcIpt.addEventListener('keyup', function (oEvtIn) {
      var iKeyCode = oEvtIn.keyCode;
      if (iKeyCode == 8 || iKeyCode == 46) {
        fSuggest(false); //no typeahead
      } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46)
             || (iKeyCode >= 112 && iKeyCode <= 123)) {
        //ignore
      } else {
        fSuggest(true); //typeahead
      }
      function fSuggest(bAheadIn) {
        var
          //the-letters of namidx.X.json files
          aIdx = ['A','B','C','D','E','F','G','H',
                  'I','J','K','L','M','N','O','P',
                  'Q','R','S','T','U','V','W','X','Y','Z'],
          aSuggestions,
          nL, //length on input-elt value
          sLi, //text of first suggestion
          sNamidx,
          sNamidxLast = '',
          sPathNames, //localhost or online
          sSuggestions = '',
          sIptvalue = oEltTabCntSrcIpt.value.toUpperCase(),
          sIdx = sIptvalue.charAt(0);

        if (sIptvalue.length > 0){
          if (location.hostname === 'localhost') {
            sPathNames = location.origin + oHitp.sCfgHomeLocal + 'dirMiwMcs/';
          } else {
            sPathNames = location.origin + '/dirMiwMcs/';
          }
          //if sIptvalue belongs a-z, then namidx.X.json
          //else namidx.ZZZ.json
          //when sIdx will become 2-letter
          //firs we will-check for 2-letters and then for 1 letter
          if (aIdx.includes(sIdx)) {
            sNamidx = 'namidx.' + sIdx + '.json';
          } else {
            sNamidx = 'namidx.ZZZ.json';
          }
          //IF sNamidx is different from last, get it
          if (sNamidx !== sNamidxLast) {
            oXHR = new XMLHttpRequest();
            oXHR.open('GET', sPathNames + sNamidx, true);
            oXHR.send(null);
            oXHR.onreadystatechange = function () {
              if (oXHR.readyState === 4 && oXHR.status === 200) {
                sNamidxLast = sNamidx;
                aSuggestions = JSON.parse(oXHR.responseText);
                //
                for (var i=0; i < aSuggestions.length; i++) {
                  var sName = aSuggestions[i][0].toUpperCase();
                  //add matching-suggestions
                  if (sName.indexOf(sIptvalue) == 0) {
                    sSuggestions = sSuggestions +
                      '<li><a class="clsPreview" href="' + sPathNames +
                      aSuggestions[i][1] + '">' +
                      aSuggestions[i][0] + '</li>';
                  }
                }
                oEltTabCntSrcOl.innerHTML = sSuggestions;
                if (bAheadIn) {
                  nL = oEltTabCntSrcIpt.value.length,
                  sLi = oEltTabCntSrcOl.getElementsByTagName('li')[0].innerHTML;
                  sLi = sLi.substring(sLi.indexOf('>')+1,sLi.lastIndexOf('<'));
                  oEltTabCntSrcIpt.value = sLi;
                  oEltTabCntSrcIpt.setSelectionRange(nL, sLi.length);
                }
                //Clicking on TabCntSrcOl-links, first highlight
                Array.prototype.slice.call(document.querySelectorAll('#idTabCntSrcOl a')).forEach(function (oEltIn, nIndex, array) {
                  fEventLink(oEltIn);
                });
              }
            }
          } else {
            sNamidxLast = sNamidx;
            for (var i=0; i < aSuggestions.length; i++) {
              var sName = aSuggestions[i][0].toUpperCase();
              //add matching-suggestions
              if (sName.indexOf(sIptvalue) == 0) {
                sSuggestions = sSuggestions +
                  '<li><a class="clsPreview" href="' + sPathNames +
                  aSuggestions[i][1] + '">' +
                  aSuggestions[i][0] + '</li>';
              }
            }
            oEltTabCntSrcOl.innerHTML = sSuggestions;
            if (bAheadIn) {
              nL = oEltTabCntSrcIpt.value.length,
              sLi = oEltTabCntSrcOl.getElementsByTagName('li')[0].innerHTML;
              sLi = sLi.substring(sLi.indexOf('>')+1,sLi.lastIndexOf('<'));
              oEltTabCntSrcIpt.value = sLi;
              oEltTabCntSrcIpt.setSelectionRange(nL, sLi.length);
            }
          }
        } else {
          //no input value, display this:
          oEltTabCntSrcOl.innerHTML = sTabCntSrcOl;
        }
        //Clicking on TabCntSrcOl-links, first highlight
        Array.prototype.slice.call(document.querySelectorAll('#idTabCntSrcOl a')).forEach(function (oEltIn, nIndex, array) {
          fEventLink(oEltIn);
        });
      }
    });
    oEltTabCntSrcOl.id = 'idTabCntSrcOl';
    oEltTabCntSrcOl.innerHTML = sTabCntSrcOl;
    oEltTabCntSrcDiv.appendChild(oEltTabCntSrcP);
    oEltTabCntSrcDiv.appendChild(oEltTabCntSrcIpt);
    oEltTabCntSrcDiv.appendChild(oEltTabCntSrcOl);
    oEltPginfTabCntDiv.appendChild(oEltTabCntSrcDiv);

    //insert tab-cnr IN page-info-cnr
    oEltCnrMainPginfDiv.appendChild(oEltPginfTabCntDiv);

    //insert TabHeaders IN page-info-cnr
    oEltPginfTabHeadersUl.id = 'idPginfTabHeadersUl';
    oEltPginfTabHeadersUl.innerHTML =
      '<li class="clsTabActive"><a href="#idTabCntTocDiv">Page-ToC</a></li>' +
      '<li><a href="#idTabCntSrcDiv">Search</a></li>';
    oEltCnrMainPginfDiv.insertBefore(oEltPginfTabHeadersUl, oEltCnrMainPginfDiv.firstChild);

    //insert page-path-elt IN page-info-cnr
    oEltPginfPathP.id = 'idPginfPathP';
    oEltPginfPathP.setAttribute('title', "© 2010-2017 Kaseluris.Nikos.1959"); //nnn
    if (!document.getElementById("idMetaWebpage_path")) {
      oEltPginfPathP.innerHTML = 'ToC: ' + document.title;
    } else {
      oEltPginfPathP.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    oEltCnrMainPginfDiv.insertBefore(oEltPginfPathP, oEltCnrMainPginfDiv.firstChild);

    //clicking on content-link first go to its location,
    //this way the backbutton goes where we clicked
    Array.prototype.slice.call(document.querySelectorAll('#idCnrMainPgcntDiv a')).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        var
          oEltScn = oEltIn,
          sIdScn;

        oEvtIn.preventDefault();

        function fGo_where_clicked() {
          //first, go to where you clicked
          while (!oEltScn.tagName.match(/^SECTION/i)) {
            sIdScn = oEltScn.id;
            if (sIdScn) {
              break;
            } else {
              oEltScn = oEltScn.parentNode;
            }
          }
          sIdScn = '#' + sIdScn;
          if (location.hash !== sIdScn) {
            location.href = sIdScn;
          }
        }

        if (oEltIn.className.indexOf('clsClicked') > -1) {
          oEltIn.classList.remove('clsClicked');
          fGo_where_clicked();
          location.href = oEltIn.href;
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
          oHitp.oEltClicked = oEltIn;
          oEltIn.classList.add('clsClicked');
          if (oEltIn.className.indexOf('clsPreview') > -1) {
            fEvtClickContent(oEvtIn);
            fEvtPreview(oEvtIn);
          }
        }
      });
    });

    //insert MainPginf-cnr in Main-cnr */
    oEltCnrMainDiv.insertBefore(oEltCnrMainPginfDiv, oEltCnrMainDiv.firstChild);

    //Sets width of MainPginf-cnr
    function fWidthPginf(nPercentIn) {
      var
        nWidthPgcnt,
        nWidthPginf;

      nWidthPginf = parseInt(window.outerWidth * (nPercentIn / 100));
      nWidthPgcnt = oEltCnrMainDiv.offsetWidth - nWidthPginf;
      oEltCnrMainPginfDiv.style.width = nWidthPginf + 'px';
      oEltCnrMainPgcntDiv.style.width = nWidthPgcnt + 'px';
      oEltCnrMainPgcntDiv.style.left = nWidthPginf + 'px';
    }
    fWidthPginf(oHitp.nCfgTocWidth);
    //needed for proper zoom
    window.addEventListener("resize", function () {
      fWidthPginf(oHitp.nCfgTocWidth);
    });

    //on MainPgcnt-cnr get-id, highlight toc, highlight links, remove popup, remove clicked link */
    fEvtClickContent = function (oEvtIn) {
      var sIdScn = '',
        oEltScn = oEvtIn.target;

      if (oEvtIn.target.nodeName !== 'A') {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow');
      }

      oEltCnrPreviewDiv.style.display = 'none'; //remove popup
      oEltCnrSiteDiv.style.display = 'none'; //remove site-content
      oEltCnrWidthDiv.style.display = 'none'; //remove width-content

      /* find id of enclosing SECTION, this is-stored on toc */
      sIdScn = '#' + oEltScn.id;
      while (oEltScn && !oEltScn.tagName.match(/^SECTION/i)) {
        oEltScn = oEltScn.parentNode;
        if (!oEltScn.tagName) {
          break;
        } else if (oEltScn.tagName.match(/^HEADER/i)
                || oEltScn.tagName.match(/^FOOTER/i)) {
          break;
        }
      }
      if (oEltScn.tagName) {
        if (oEltScn.tagName.match(/^HEADER/i)) {
          sIdScn = '#idHeader';
        } else if (oEltScn.tagName.match(/^FOOTER/i)) {
          sIdScn = '#idFooter';
        } else {
          sIdScn = '#' + oEltScn.id;
        }
      }

      /* on toc highlight the-found-id */
      Array.prototype.slice.call(document.querySelectorAll('#idTocTri a')).forEach(function (oEltAIn, nIndex, array) {
        if (oEltAIn.getAttribute('href') === sIdScn) {
          oHitp.oTreeUl.fTruExpandParent(oEltAIn);
          oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltAIn);
          if (oEltAIn.scrollIntoViewIfNeeded) {
            oEltAIn.scrollIntoViewIfNeeded(true)
          } else {
            oEltAIn.scrollIntoView(false);
          }
          document.getElementById("idCnrMainPginfDiv").scrollLeft = 0;
        }
      });

      // on found-id on a-elt add clsClickCnt
      oHitp.sQrAClkLast = oHitp.sQrAClk;
      var oElt = oEvtIn.target;
      oHitp.sQrAClk = '#' + oElt.id + ' a';
      while (oHitp.sQrAClk == '# a') {
        oElt = oElt.parentNode;
        oHitp.sQrAClk = '#' + oElt.id + ' a';
      }
      if (oHitp.sQrAClkLast !== oHitp.sQrAClk) {
        Array.prototype.slice.call(document.querySelectorAll(oHitp.sQrAClkLast)).forEach(function (oEltAIn, nIndex, array) {
          oEltAIn.classList.remove('clsClickCnt');
        });
        Array.prototype.slice.call(document.querySelectorAll(oHitp.sQrAClk)).forEach(function (oEltAIn, nIndex, array) {
          oEltAIn.classList.add('clsClickCnt');
        });
      }
    };
    //on MainPgcnt-cnr get id on mouseover and highlight toc
    fEvtMouseoverContent = function (oEvtIn) {
      var sIdScn = '',
        oEltScn = oEvtIn.target;

      //Find id of enclosing SECTION, this is-stored on toc
      sIdScn = '#' + oEltScn.id;
      while (oEltScn && !oEltScn.tagName.match(/^SECTION/i)) {
        oEltScn = oEltScn.parentNode;
        if (!oEltScn.tagName) {
          break;
        } else if (oEltScn.tagName.match(/^HEADER/i)
                || oEltScn.tagName.match(/^FOOTER/i)) {
          break;
        }
      }
      if (oEltScn.tagName) {
        if (oEltScn.tagName.match(/^HEADER/i)) {
          sIdScn = '#idHeader';
        } else if (oEltScn.tagName.match(/^FOOTER/i)) {
          sIdScn = '#idFooter';
        } else {
          sIdScn = '#' + oEltScn.id;
        }
      }

      //on toc highlight the-found-id
      Array.prototype.slice.call(document.querySelectorAll('#idTocTri a')).forEach(function (oEltAIn, nIndex, array) {
        if (oEltAIn.getAttribute('href') === sIdScn) {
          oHitp.oTreeUl.fTruExpandParent(oEltAIn);
          oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltAIn);
          if (oEltAIn.scrollIntoViewIfNeeded) {
            oEltAIn.scrollIntoViewIfNeeded(true)
          } else {
            oEltAIn.scrollIntoView(false);
          }
          document.getElementById("idCnrMainPginfDiv").scrollLeft = 0;
        }
      });
    };
    Array.prototype.slice.call(document.querySelectorAll('#idCnrMainPgcntDiv *[id]')).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', fEvtClickContent);
      oEltIn.addEventListener('mouseover', fEvtMouseoverContent);
    });

    //TAB-Headers Click Event
    Array.prototype.slice.call(document.querySelectorAll('ul#idPginfTabHeadersUl li')).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault();
        //Remove any "active" class
        document.querySelector('.clsTabActive').classList.remove('clsTabActive');
        //Add "active" class to selected tab
        oEltIn.classList.add('clsTabActive');
        //Hide all tab content
        Array.prototype.slice.call(document.getElementsByClassName('clsTabCnt')).forEach(function (oEltIn, nIndex, array) {
          oEltIn.style.display = 'none';
        });
        //Show content of active tab
        sIdTabActive = document.querySelector('.clsTabActive a').getAttribute('href').substring(1);
        document.getElementById(sIdTabActive).style.display = 'block';
        if (sIdTabActive === 'idTabCntSrcDiv') {
          oEltTabCntSrcIpt.focus();
        }
        //return false;
      });
    });

    //insert popup-container
    oEltCnrPreviewDiv.id = 'idCnrPreviewDiv';
    oEltBody.appendChild(oEltCnrPreviewDiv);

    //on clsPreview-links add this event-listener
    fEvtPreview = function (oEvtIn) {
      var sLoc, sId1, sId2,
        nPy, nPx, nWh, nWw,
        oDoc;
      oEvtIn.preventDefault();
      oEvtIn.stopPropagation();
      nPx = oEvtIn.pageX;
      nPy = oEvtIn.pageY;
      nWh = window.innerHeight;
      nWw = window.innerWidth;
      if (oEvtIn.target.nodeName === 'IMG') {
        //links on img-elements
        sId1 = oEvtIn.target.parentNode.href;
      } else {
        sId1 = oEvtIn.target.href;
      }
      if (sId1.indexOf('#') > 0) {
        sId2 = sId1.substring(sId1.indexOf("#") + 1);
        sId1 = sId1.substring(0, sId1.indexOf("#"));
      }
      sLoc = location.href;
      if (sLoc.indexOf('#') > 0) {
        sLoc = sLoc.substring(0, sLoc.indexOf("#"));
      }
      //internal-link
      if (sLoc === sId1) {
        oEltCnrPreviewDiv.innerHTML = '<section>' + document.getElementById(sId2).innerHTML + '</section>';
      } else {
        oEltCnrPreviewDiv.innerHTML = '';
        oXHR = new XMLHttpRequest();
        oXHR.open('GET', sId1, false);
        oXHR.send(null);
        if (oXHR.status === 200) {
          if (sId2) {
            //IF #fragment url, display only this element.
            oDoc = (new DOMParser()).parseFromString(oXHR.responseText, 'text/html');
            oEltCnrPreviewDiv.innerHTML = '<section>' + oDoc.getElementById(sId2).innerHTML + '</section>';
          } else {
            //IF link to a picture, display it, not its code.
            if (sId1.match(/(png|jpg|gif)$/)) {
              var oImg = new Image();
              var nIW, nIH, nPW, nPH;
              nPW = nWw / 2.2;
              nPH = nWh * 0.4;
              oImg.src = sId1;
              oImg.addEventListener('load', function() {
                nIW = oImg.width;
                nIH = oImg.height;
                if (nIH > nPH) {
                  nIW = (nIW * nPH) / nIH;
                  nIH = nPH;
                }
                oEltCnrPreviewDiv.innerHTML = '<p class="clsCenter"><img src="' + sId1
                  + '" width="' + nIW
                  + '" height="' + nIH + '" /></p>';
              });
            } else {
              document.getElementById('idCnrPreviewDiv').innerHTML = oXHR.responseText;
            }
          }
        }
      }

      oEltCnrPreviewDiv.style.top = (nWh / 2) - (nWh * 0.44 / 2)  + 'px'; //the height of popup is 44% of window
      if (nPx < nWw / 2) {
        oEltCnrPreviewDiv.style.left = (nWw / 2) + 9 + 'px';
      } else {
        oEltCnrPreviewDiv.style.left = 26 + 'px';
      }
      oEltCnrPreviewDiv.style.overflow = 'auto';
      oEltCnrPreviewDiv.style.display = 'block';
    };

    //change font
    document.getElementById('idRdbFontMono').addEventListener('click', function(oEvtIn) {
      oEltBody.style.fontFamily = 'fntUbuntuMonoRgr, "Courier New", "Lucida Console"';
    });
    document.getElementById('idRdbFontSerif').addEventListener('click', function(oEvtIn) {
      oEltBody.style.fontFamily = '"Times New Roman", Georgia';
    });
    document.getElementById('idRdbFontSSerif').addEventListener('click', function(oEvtIn) {
      oEltBody.style.fontFamily = 'Arial, Verdana';
    });

    // what to do on clicking a link in toc
    Array.prototype.slice.call(document.querySelectorAll("#idTocTri li > a")).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault();
        oHitp.oEltClicked.classList.remove('clsTtpShow');
        if (oEltIn.className.indexOf('clsPreview') > -1) {
          if (oEltIn.className.indexOf('clsClicked') > -1) {
            oEltIn.classList.remove('clsClicked');
            oEltCnrPreviewDiv.style.display = 'none';
            location.href = '#' + oEvtIn.target.href.split('#')[1];
            oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltIn);
          } else {
            oHitp.oEltClicked.classList.remove('clsClicked');
            oHitp.oEltClicked = oEltIn;
            oEltIn.classList.add('clsClicked');
            fEvtPreview(oEvtIn);
          }
        } else {
          oEltCnrPreviewDiv.style.display = 'none';
          location.href = '#' + oEvtIn.target.href.split('#')[1];
          oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltIn);
        }
      });
    });

    window.onhashchange = function(oEvtIn) {
      location.href = location.href;
    };

    // focus on right-div, Div can get the focus if it has tabindex attribute... on chrome
    document.getElementById('idCnrMainPgcntDiv').setAttribute('tabindex', -1);
    document.getElementById('idCnrMainPgcntDiv').focus();

    //Clicking on PginfPathP-links and TabCntSrcOl-links, first highlight
    Array.prototype.slice.call(document.querySelectorAll('#idPginfPathP a,#idTabCntSrcOl a')).forEach(function (oEltIn, nIndex, array) {
      fEventLink(oEltIn);
    });
  };

  /**
   * created: {2013-07-17}
   * Returns a string html-ul-element that holds the-toc-tree with the-headings of the-page.
   * ul id="idTocTri" class="clsTreeUl">
   *   <li><a class="clsPreview" href="#idHeader">SynAgonism</a>
   *     <ul>
   *       <li><a href="#heading">heading</a><li>
   *       <li><a href="#heading">heading</a><li>
   *     </ul>
   *   <li>
   * </ul>
   */
  oHitp.fTocTriCreate = function () {
    var
      aElm = document.body.getElementsByTagName('*'), aHdng = [],
      nLvlThis, nLvlNext, nLvlPrev = 0, nLvlToc = 0, n, nJ,
      rHdng = /h\d/i,
      sUl = '', sHcnt, sHid, sHlvl,
      oElt;

    for (n = 0; n < aElm.length; n += 1) {
      oElt = aElm[n];
      if (rHdng.test(oElt.nodeName)) {
        aHdng.push(oElt);
      }
      //and and the 'footer' element
      if (oElt.nodeName.match(/footer/i)) {
        aHdng.push(oElt);
      }
    }
    aElm = [];

    //the first heading is the title of doc
    sHcnt = aHdng[0].innerHTML;
    sHcnt = sHcnt.replace(/\n {4}<a class="clsHide" href=[^<]+<\/a>/, '');
    sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
    sUl = '<ul id="idTocTri" class="clsTreeUl"><li><a class="clsPreview" href="#idHeader">' + sHcnt + '</a>';

    for (n = 1; n < aHdng.length; n += 1) {
      oElt = aHdng[n];
      //special footer case;
      if (oElt.nodeName.match(/footer/i)) {
        nLvlThis = 1;
        nLvlToc = 1;
        sUl += '<li><a class="clsPreview" href="#idFooter">Footer</a></li>';
        nLvlPrev = 1;
        continue;
      }
      nLvlThis = oElt.nodeName.substr(1, 1);
      if (nLvlThis > nLvlPrev) {
        sUl += '<ul>'; //new list
        nLvlToc = 1 + parseInt(nLvlToc, 10);
      }
      sHid = oElt.id;
      sHlvl = sHid.charAt(sHid.length - 1);
      sHid = sHid.replace(/(\w*)H\d/, '$1');
      //removes from heading the "clsHide" content
      sHcnt = oElt.innerHTML;
      //jslint regexp: true
      sHcnt = sHcnt.replace(/\n {4}<a class="clsHide" href=[^<]+<\/a>/, '');
      sHcnt = sHcnt.replace(/<[^>]+>/g, '');
      //jslint regexp: false
      sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
      if (sHid === 'idComment') {
        sUl += '<li><a href="#' + sHid + '">' + sHcnt + '</a>';
      } else {
        sUl += '<li><a class="clsPreview" href="#' + sHid + '">' + sHcnt + '</a>';
      }
      if (aHdng[n + 1]) {
        nLvlNext = aHdng[n + 1].nodeName.substr(1, 1);
        if (aHdng[n + 1].nodeName.match(/footer/i)) {
          nLvlNext = 1;
        }
        if (nLvlThis > nLvlNext) {
          nLvlToc = nLvlToc - nLvlNext;
          for (nJ = 0; nJ < nLvlToc; nJ += 1) {
            sUl += '</li></ul></li>';
          }
          nLvlToc = nLvlNext;
        }
        if (nLvlThis === nLvlNext) {
          sUl += '</li>';
        }
      }
      nLvlPrev = nLvlThis;
    }
    sUl += '</li></ul></li></ul>';
    return sUl;
  };

  /**
   * Highlights ONE item in toc-list
   */
  oHitp.fTocTriHighlightNode = function (oEltCnrMainPginfDiv, oElm) {
    //removes existing highlighting
    var aTocTriA = oEltCnrMainPginfDiv.getElementsByTagName('a'),
      n;

    for (n = 0; n < aTocTriA.length; n += 1) {
      aTocTriA[n].classList.remove('clsTocTriHighlight');
    }
    oElm.classList.add('clsTocTriHighlight');
  };

  /**
   * Created: {2016-07-20}
   * Makes collapsible-trees, unordered-lists with clsTreeUl.
   */
  oHitp.oTreeUl = (function(){

    var oTreeUl = {};

    /**
     * Creates one-clsTreeUl-list tree.
     * If no input, creates ALL lists of the-doc, trees.
     */
    oTreeUl.fTruCreate = function(oUlIn){
      //find all clsTreeUl-lists
      var
        aLi,
        aUl,
        aUlSub,
        n, n2,
        oEltI;

      if (oUlIn) {
        aUl = [oUlIn];
      } else {
        aUl = document.querySelectorAll('.clsTreeUl');
      }

      for (n = 0; n < aUl.length; n++){
        //add the-clsTreeUl to the-sub-lists
        aSubul = aUl[n].getElementsByTagName('ul');
        for (n2 = 0; n2 < aSubul.length; n2++){
          aSubul[n2].className = 'clsTreeUl';
        }

        //on first li:
        //add node-image
        //add event-listener
        aLi = aUl[n].getElementsByTagName('li');
        for (n2 = 0; n2 < aLi.length; n2++){
          aUlSub = aLi[n2].getElementsByTagName('ul');
          oEltI = document.createElement('i');
          oEltI.setAttribute('class', 'clsFa clsFaCrcCol');
          if (aUlSub.length === 0) {
            oEltI.setAttribute('class', 'clsFa clsFaCrc');
          } else {
            oEltI.addEventListener('click', fTruListenerClickCreate(aLi[n2]));
          }
          aLi[n2].insertBefore(oEltI, aLi[n2].firstChild);

          //collapse the-lists within this listitem
          oTreeUl.fTruToggleLi(aLi[n2]);

          //first-level expand
          if (aLi[n2].parentNode.parentNode.nodeName !== 'LI') {
            oTreeUl.fTruToggleLi(aLi[n2]);
          }
        }
      }
    };

    /**
     * Expands or Collapses an-input-listitem.
     *
     * @input {object} oEltLiIn The-listitem to toggle
     */
    oTreeUl.fTruToggleLi = function(oEltLiIn){
      var
        aUl,
        //determine whether to expand or collaple
        bCollapsed = oEltLiIn.firstChild.className.indexOf('clsFaCrcExp') > -1,
        n,
        oEltLi;

      //find uls of input li
      aUl = oEltLiIn.getElementsByTagName('ul');
      for (n = 0; n < aUl.length; n++){
        //toggle display of first-level ul
        oEltLi = aUl[n];
        while (oEltLi.nodeName != 'LI') {
          oEltLi = oEltLi.parentNode;
        }
        if (oEltLi == oEltLiIn) {
          aUl[n].style.display = bCollapsed ? 'block' : 'none';
        }
      }

      if (aUl.length > 0){
        if (bCollapsed) {
          if (oEltLiIn.firstChild.tagName === 'I') {
            oEltLiIn.firstChild.classList.remove('clsFaCrcExp');
            oEltLiIn.firstChild.classList.add('clsFaCrcCol');
          }
        } else {
          if (oEltLiIn.firstChild.tagName === 'I') {
            oEltLiIn.firstChild.classList.remove('clsFaCrcCol');
            oEltLiIn.firstChild.classList.add('clsFaCrcExp');
          }
        }
      }
    };

    /** Makes the display-style: none. */
    oTreeUl.fTruCollapseAll = function () {
      var aSubnodes,
        aTocTriLI = document.getElementById('idTocTri').getElementsByTagName('li'),
        n;

      for (n = 0; n < aTocTriLI.length; n += 1) {
        aSubnodes = aTocTriLI[n].getElementsByTagName('ul');
        if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'block') {
          oHitp.oTreeUl.fTruToggleLi(aTocTriLI[n]);
        }
      }
    };

    /** Makes the display-style: block. */
    oTreeUl.fTruExpandAll = function () {
      var aSubnodes,
        aTocTriLI = document.getElementById('idTocTri').getElementsByTagName('li'),
        n;

      for (n = 0; n < aTocTriLI.length; n += 1) {
        aSubnodes = aTocTriLI[n].getElementsByTagName('ul');
        if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'none') {
          oHitp.oTreeUl.fTruToggleLi(aTocTriLI[n]);
        }
      }
    };

    /** Expands the first children. */
    oTreeUl.fTruExpandFirst = function () {
      var aTocTriLI, aSubnodes;

      aTocTriLI = document.getElementById('idTocTri').getElementsByTagName('li');
      /* expand the first ul-element */
      aSubnodes = aTocTriLI[0].getElementsByTagName('ul');
      if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'none') {
        oHitp.oTreeUl.fTruToggleLi(aTocTriLI[0]);
      }
    };

    /**
     * Expands all the parents ONLY, of an element with link to a heading.
     */
    oTreeUl.fTruExpandParent = function (oEltAIn) {
      var oEltI, oEltUl;

      oHitp.oTreeUl.fTruCollapseAll();
      //the parent of a-link-elm is li-elm with parent a ul-elm.
      oEltUl = oEltAIn.parentNode.parentNode;
      while (oEltUl.tagName === 'UL') {
        oEltUl.style.display = 'block';
        //the parent is li-elm, its first-child is img
        oEltI = oEltUl.parentNode.firstChild;
        if (oEltI.tagName === 'I' && oEltI.className.indexOf('clsFaCrcExp') > -1) {
          oEltI.classList.remove('clsFaCrcExp');
          oEltI.classList.add('clsFaCrcCol');
        }
        oEltUl = oEltUl.parentNode.parentNode;
      }
    };

    /**
     * Returns a-click-listener that toggles the input listitem.
     *
     * @input {object} oEltLiIn The-listitem to toggle
     */
    function fTruListenerClickCreate(oEltLiIn){
      return function(oEvtIn){
        var
          oEltI = oEvtIn.target,
          oEltLi = (oEvtIn.target.parentNode),
          sIcls = oEltI.className;

        if (sIcls.indexOf('clsTriClicked') > -1) {
          oHitp.oEltClicked.classList.remove('clsTriClicked');
          oEltI.classList.remove('clsTriClicked');
          if (oEltLi == oEltLiIn) oTreeUl.fTruToggleLi(oEltLiIn);
          if (sIcls.indexOf('clsFaCrcExp') > -1) {
            oEltI.classList.remove('clsFaCrcExp');
            oEltI.classList.add('clsFaCrcCol');
          } else if (sIcls.indexOf('clsFaCrcCol') > -1) {
            oEltI.classList.remove('clsFaCrcCol');
            oEltI.classList.add('clsFaCrcExp');
          }
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked');
          oHitp.oEltClicked = oEltI;
          oEltI.classList.add('clsTriClicked');
        }
      };
    }

    return oTreeUl;
  })();

  document.addEventListener('DOMContentLoaded', function () {
    oHitp.fContainersInsert();
    if (!oHitp.bSite) {
      oHitp.oTreeUl.fTruCreate();
    }
    //IF on idMetaWebpage_path paragraph we have and the clsTocExpand
    //then the toc expands-all
    if (document.getElementById("idMetaWebpage_path")) {
      if (document.getElementById("idMetaWebpage_path").getAttribute('class') === 'clsTocExpand') {
        oHitp.oTreeUl.fTruExpandAll();
      }
    }
  });

  return oHitp;
})();