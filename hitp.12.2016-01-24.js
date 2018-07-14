/*
 * version.12.last.minor: hitp.js (2016.01.24.12)
 * version.12.last.minorNo (11.9): hitp.2016.01.24.12.js (toc-icn-img)
 * version.11.previous: hitp.2015.10.26.11.js (preferences)
 * version.10.previous: hitp.2014.08.05.10.js (valuenames)
 * version.9.previous: hitp.2014.08.02.9.js (NO jQuery, fixed popup)
 * version.8.previous: hitp.2014.01.09.8.js (toc on hovering)
 * version.7.previous: hitp.2013.11.06.7.js (tabs)
 * version.6.previous: hitp.2013.08.21.6.js (site-structure)
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
 * Copyright (c) 2016 Kaseluris.Nikos.1959 (synagonism)
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
  var sImgTocExp = 'http://synagonism.net/misc/img/imgToc1Exp17.png',
    sImgTocCol = 'http://synagonism.net/misc/img/imgToc2Col17.png',
    sImgTocLif = 'http://synagonism.net/misc/img/imgToc3Lif17.png';

  var oHitp = {
    /* config */ 
    nCfgPosSplitPrev: 272,
    /**
     * config: the hitmenu contains absolute urls, because we see it from many pages.
     * Then we must know the ROOT of the site and create different menus.
     */
    sCfgPathMenuLocal: '/dWstSgm/hitpmenuLocal.html',
    sCfgPathMenuOnline: '/hitpmenu.html',

    bFirefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,

    /* toc-tree li unique ids */
    nTocTriIdLi: 0,
  };

  /** Splits the-body and puts the-toc on the left. */
  oHitp.fTocCnrInsert = function () {
    var
      fEvtPreviewMouseover,
      fEvtPreviewMouseout,
      fEvtPreviewOn,
      fEvtPreviewOff,
      fEvtTocposition,
      fEvtTocpositionClick,
      fEvtTocpositionHover,
      oEltBody = document.body,
      oEltDivCnr = document.createElement('div'), /* the general container*/
      oEltDivCnrCnt = document.createElement('div'),
      oEltDivCnrToc = document.createElement('div'),
      oEltUlTabNames = document.createElement('ul'),
      oEltDivTabContentcnr = document.createElement('div'),
      oEltDivTab1Content = document.createElement('div'),
      //oEltDivTab2Content = document.createElement('div'),
      oEltBtnTocCollapseall = document.createElement('input'),
      oEltBtnTocExpandall = document.createElement('input'),
      oEltPPath = document.createElement('p'),
      oEltFrmPref = document.createElement('form'),
      oEltRdbPreviewOn,
      oEltRdbPreviewOff,
      oEltRdbTocpositionHover,
      oEltRdbTocpositionClick,
      oEltPNote = document.createElement('p'),
      oEltDivPopup = document.createElement('div'),
      oEltDivHitpmenu = document.createElement('div'),
      oXHR = new XMLHttpRequest(),
      sCfgPathMenu,
      sContentOriginal = document.body.innerHTML,
      sIdTabActive;

    /**
     * Inserts a splitter-bar which changes dynamically the-width of toc and content.
     * INPUT: the-div-container with 2 div children, the-toc-cnr and the-content-cnr.
     */
    fSplitDynamic = function (oEltIn) {
      var nPosSplitCurrent = oHitp.nCfgPosSplitPrev,
        oEltDivCnr = oEltIn,
        oEltDivCnrToc = oEltDivCnr.children[0], //toc-container
        oEltDivCnrCnt = oEltDivCnr.children[1], //content-container
        oEltDivCnrBar = document.createElement('div'),
        oEltDivCnrBarGhost, //we create it at startDraging
        oEltDivCnrBarBtn = document.createElement('div');

      function fEvtDragMousemove(oEvtIn) {
        var nIncr = oEvtIn.pageX;

        oEltDivCnrBarGhost.style.left = nIncr + 'px';
      }

      /* Perform actual splitting */
      function fTocSplit_to(nPos) {
        var nSizeB;

        oHitp.nCfgPosSplitPrev = nPosSplitCurrent;
        nPosSplitCurrent = nPos;
        nSizeB = oEltDivCnr.offsetWidth - nPos - 10 - 10; /* splitBar, padding */
        oEltDivCnrToc.style.width = nPos + 'px';
        oEltDivCnrBar.style.left = nPos + 'px';
        oEltDivCnrCnt.style.width = nSizeB + 'px';
        oEltDivCnrCnt.style.left = nPos + 10 + 'px';
        if (nPos === 0) {
          oEltDivCnrBarBtn.innerHTML = '<span><br />»</span>'; //»▸⇒
        } else {
          oEltDivCnrBarBtn.innerHTML = '<span><br />«</span>'; //sbl «◂‹⇐
        }
        oEltDivCnrBar.style.background = 'linear-gradient(to left, #aaaaaa, #dddddd 100%)';
        oEltDivCnr.style['-khtml-user-select'] = 'all';
        oEltDivCnr.style['-webkit-user-select'] = 'all';
        oEltDivCnr.style.MozUserSelect = 'text';
        oEltDivCnr.style.userSelect = 'all';
      }

      // end event
      function fEvtDragMouseup(oEvtIn) {
        var nLeft = oEltDivCnrBarGhost.offsetLeft;

        oEltDivCnrBarGhost.parentNode.removeChild(oEltDivCnrBarGhost);
        oEltDivCnrBarGhost = null;
        document.removeEventListener('mousemove', fEvtDragMousemove);
        document.removeEventListener('mouseup', fEvtDragMouseup);
        fTocSplit_to(nLeft);
      }

      // start event
      function fEvtDragMousedown(oEvtIn) {
        oEltDivCnrBarGhost = document.createElement('div');
        oEltDivCnrBarGhost.id = 'idDivCnrBarGhost';
        oEltDivCnrBarGhost.style.left = oEltDivCnrBar.style.left;
        oEltDivCnr.insertBefore(oEltDivCnrBarGhost, oEltDivCnrCnt);
        oEltDivCnr.style['-khtml-user-select'] = 'none';
        oEltDivCnr.style['-webkit-user-select'] = 'none';
        oEltDivCnr.style.MozUserSelect = 'none';
        oEltDivCnr.style.userSelect = 'none';
        document.addEventListener('mousemove', fEvtDragMousemove);
        document.addEventListener('mouseup', fEvtDragMouseup);
      }

      oEltDivCnr.insertBefore(oEltDivCnrBar, oEltDivCnrCnt);
      oEltDivCnrBar.id = 'idDivCnrBar';
      oEltDivCnrBar.style.height = '100%';
      oEltDivCnrBar.addEventListener('mousedown', fEvtDragMousedown);
      oEltDivCnrBar.addEventListener('mouseenter', function () {
        oEltDivCnrBar.style.background = 'green';
      });
      oEltDivCnrBar.addEventListener('mouseout', function () {
        oEltDivCnrBar.style.background = 'linear-gradient(to left, #aaaaaa, #dddddd 100%)';
      });

      oEltDivCnrBarBtn.id = 'idDivCnrBarBtn';
      oEltDivCnrBar.appendChild(oEltDivCnrBarBtn);
      oEltDivCnrBarBtn.addEventListener('mousedown', function (oEvtIn) {
        oEvtIn.stopPropagation();
        fTocSplit_to((nPosSplitCurrent === 0) ? oHitp.nCfgPosSplitPrev : 0);
        oEltDivCnrToc.scrollLeft = 0;
      });
      fTocSplit_to(nPosSplitCurrent);
      //needed for proper zoom
      window.addEventListener("resize", function () {
        fTocSplit_to(nPosSplitCurrent);
      });
    };

    oHitp.nTocTriIdLi = 0;
    oEltDivCnr.id = 'idDivCnr';
    /* remove from old-body its elements */
    oEltBody.innerHTML = '';
    oEltBody.appendChild(oEltDivCnr);

    /* set on right-splitter the old-body */
    oEltDivCnrCnt.id = 'idDivCnrCnt';
    oEltDivCnrCnt.innerHTML = sContentOriginal;
    oEltDivCnr.appendChild(oEltDivCnrCnt);

    /* insert toc */
    oEltDivCnrToc.id = 'idDivCnrToc';

    /* insert content on tab1 */
    oEltDivTab1Content.id = 'idDivTab1Content';
    oEltDivTab1Content.setAttribute('class', 'clsTabContent');
    oEltDivTab1Content.innerHTML = oHitp.fTocTriCreate();
    oEltDivTab1Content.getElementsByTagName("ul")[0].setAttribute('id', 'idTocTri');
    /* insert collaplse-button */
    oEltBtnTocCollapseall.setAttribute('id', 'idBtnCollapse_All');
    oEltBtnTocCollapseall.setAttribute('type', 'button');
    oEltBtnTocCollapseall.setAttribute('value', 'Collapse-All');
    oEltBtnTocCollapseall.setAttribute('class', 'clsBtn');
    oEltBtnTocCollapseall.addEventListener('click', function (oEvtIn) {
      oHitp.fTocTriCollapseAll();
    });
    oEltDivTab1Content.insertBefore(oEltBtnTocCollapseall, oEltDivTab1Content.firstChild);
    /* insert expand-button */
    oEltBtnTocExpandall.setAttribute('id', 'idBtnExp_All');
    oEltBtnTocExpandall.setAttribute('type', 'button');
    oEltBtnTocExpandall.setAttribute('value', 'Expand-All');
    oEltBtnTocExpandall.setAttribute('class', 'clsBtn');
    oEltBtnTocExpandall.addEventListener('click', function (oEvtIn) {
      oHitp.fTocTriExpandAll();
    });
    oEltDivTab1Content.insertBefore(oEltBtnTocExpandall, oEltDivTab1Content.firstChild);
    /* preferences */
    oEltDivTab1Content.appendChild(document.createElement('p'));
    oEltFrmPref.innerHTML = '<span class="clsColorGreen clsB">Preferences</span>:<br/>' +
      '&nbsp;&nbsp;1) <span class="clsU">Link-preview</span>:<br/>' +
      '<input type="radio" id="idRdbPreviewOn" name="nameRdbPreview" checked/>Preview On (default)<br/>' +
      '<input type="radio" id="idRdbPreviewOff" name="nameRdbPreview"/>Preview Off<br/>' +
      '<br/>' +
      '&nbsp;&nbsp;2) <span class="clsU">Show on ToC content-position by</span>:<br/>' +
      '<input type="radio" id="idRdbTocpositionHover" name="nameRdbPosition" checked/>Hovering content (default)<br/>' +
      '<input type="radio" id="idRdbTocpositionClick" name="nameRdbPosition"/>Clicking content';
    oEltDivTab1Content.appendChild(oEltFrmPref);
    /* toc: add note at the end */
    oEltPNote.innerHTML = '<span class="clsColorGreen clsB">Notes</span>:<br/>' +
      'a) Clicking on ¶ or on ToC, you see the address of that text on address-bar.<br/>' +
      'b) Hovering content (default) OR clicking content, you see its position on ToC.<br/>' +
      'c) Hovering a domain-link you see a preview (default).';
    oEltDivTab1Content.appendChild(oEltPNote);

    /* inset tab1 on tabcontainer */
    oEltDivTabContentcnr.id = 'idDivTabContentcontainer';

    oEltDivTabContentcnr.appendChild(oEltDivTab1Content);
    //oEltDivTab2Content.id = 'idTab2ContentDiv';
    //oEltDivTab2Content.setAttribute('class', 'clsTabContent');
    //oEltDivTabContentcnr.appendChild(oEltDivTab2Content);

    /* insert tabcontainer on spliterLeft */
    oEltDivCnrToc.appendChild(oEltDivTabContentcnr);

    /* insert tabnames */
    oEltUlTabNames.id = 'idTabNamesUl';
    oEltUlTabNames.innerHTML = '<li class="clsTabActive"><a href="#idTab1contentDiv">Page-structure</a></li>';
      //<li><a href="#idTab2contentDiv">Search</a></li>'
    oEltDivCnrToc.insertBefore(oEltUlTabNames, oEltDivCnrToc.firstChild);

    /* insert page-path--element */
    oEltPPath.id = 'idPpath';
    oEltPPath.setAttribute('title', "© 2010-2015 Kaseluris.Nikos.1959"); //nnn
    if (!document.getElementById("idMetaWebpage_path")) {
      oEltPPath.innerHTML = 'ToC: ' + document.title;
    } else {
      oEltPPath.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    oEltDivCnrToc.insertBefore(oEltPPath, oEltDivCnrToc.firstChild);

    /* insert site-structure menu */
    if (location.hostname !== '') {
      oEltDivHitpmenu.id = 'idHitpmenu';
      if (location.hostname === 'localhost') {
        sCfgPathMenu = oHitp.sCfgPathMenuLocal;
      } else {
        sCfgPathMenu = oHitp.sCfgPathMenuOnline;
      }
      oXHR.open('GET', location.origin + sCfgPathMenu, false);
      oXHR.send(null);
      if (oXHR.status === 200) {
        oEltDivHitpmenu.innerHTML = oXHR.responseText;
        oEltDivCnrToc.insertBefore(oEltDivHitpmenu, oEltDivCnrToc.firstChild);
        oEltDivHitpmenu.addEventListener('mouseover', function () {
          oHitp.nCfgPosSplitPrev = oEltDivCnrToc.offsetWidth;
          oEltDivCnrToc.style.width = window.innerWidth + 'px';
        });
        oEltDivHitpmenu.addEventListener('mouseout', function () {
          oEltDivCnrToc.style.width = oHitp.nCfgPosSplitPrev + 'px';
        });
      }
    }

    /* clicking on a content-link first go to its location, this way the backbutton goes where we clicked. */
    Array.prototype.slice.call(document.querySelectorAll('#idDivCnrCnt a')).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        var sID,
          oEltSec = oEltIn;

        oEvtIn.preventDefault();
        while (!oEltSec.tagName.match(/^SECTION/i)) {
          sID = oEltSec.id;
          if (sID) {
            break;
          } else {
            oEltSec = oEltSec.parentNode;
          }
        }
        sID = '#' + sID;
        if (location.hash !== sID) {
          location.href = sID;
        }
        location.href = oEvtIn.target.href;
      });
    });

    /* insert spliterLeft */
    oEltDivCnr.insertBefore(oEltDivCnrToc, oEltDivCnr.firstChild);
    fSplitDynamic(oEltDivCnr);

    /* on content get-id */
    oEltRdbTocpositionHover = document.getElementById('idRdbTocpositionHover');
    oEltRdbTocpositionClick = document.getElementById('idRdbTocpositionClick');
    fEvtTocposition = function (oEvtIn) {
      var sID = '',
        oEltSec = oEvtIn.target;

      oEvtIn.stopPropagation();

      /* find the id of closest header */
      /* first go where you click */
      sID = '#' + oEltSec.id;

      /* find  section's id */
      while (oEltSec && !oEltSec.tagName.match(/^SECTION/i)) {
        oEltSec = oEltSec.parentNode;
        if (!oEltSec.tagName) {
          break;
        } else if (oEltSec.tagName.match(/^HEADER/i)
                || oEltSec.tagName.match(/^FOOTER/i)) {
          break;
        }
      }
      if (oEltSec.tagName) {
        if (oEltSec.tagName.match(/^HEADER/i)) {
          sID = '#idHeader';
        } else if (oEltSec.tagName.match(/^FOOTER/i)) {
          sID = '#idFooter';
        } else {
          sID = '#' + oEltSec.id;
        }
      }

      Array.prototype.slice.call(document.querySelectorAll('#idTocTri a')).forEach(function (oEltAIn, nIndex, array) {
        if (oEltAIn.getAttribute('href') === sID) {
          oHitp.fTocTriCollapseAll();
          oHitp.fTocTriHighlightNode(oEltDivCnrToc, oEltAIn);
          oHitp.fTocTriExpandParent(oEltAIn);
          oEltAIn.scrollIntoViewIfNeeded(true);
          if (oHitp.bFirefox) {
            oEltAIn.scrollIntoView({block: "end", behavior: "smooth"});
          }
          document.getElementById("idDivCnrToc").scrollLeft = 0;
        }
      });
    };
    fEvtTocpositionClick = function (oEvtIn) {
      Array.prototype.slice.call(document.querySelectorAll('*[id]')).forEach(function (oEltIn, nIndex, array) {
        oEltIn.removeEventListener('mouseover', fEvtTocposition);
        oEltIn.addEventListener('click', fEvtTocposition);
      });
    };
    fEvtTocpositionHover = function (oEvtIn) {
      Array.prototype.slice.call(document.querySelectorAll('*[id]')).forEach(function (oEltIn, nIndex, array) {
        oEltIn.removeEventListener('click', fEvtTocposition);
        oEltIn.addEventListener('mouseover', fEvtTocposition);
      });
    };
    oEltRdbTocpositionClick.addEventListener('click', fEvtTocpositionClick);
    oEltRdbTocpositionHover.addEventListener('click', fEvtTocpositionHover);
    fEvtTocpositionHover();

    /* On TABS Click Event */
    Array.prototype.slice.call(document.querySelectorAll('ul#idTabNamesUl li')).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault();
        //Remove any "active" class
        document.querySelector('.clsTabActive').classList.remove('clsTabActive');
        //Add "active" class to selected tab
        oEltIn.classList.add('clsTabActive');
        //Hide all tab content
        Array.prototype.slice.call(document.getElementsByClassName('clsTabContent')).forEach(function (oEltIn, nIndex, array) {
          oEltIn.style.display = 'none';
        });
        //Show content of active tab
        sIdTabActive = document.querySelector('.clsTabActive a').getAttribute('href').substring(1);
        document.getElementById(sIdTabActive).style.display = 'block';
        //return false;
      });
    });

    /* on links with clsPreview add this function
     * first insert popup container */
    oEltRdbPreviewOn = document.getElementById('idRdbPreviewOn');
    oEltRdbPreviewOff = document.getElementById('idRdbPreviewOff');
    oEltDivPopup.id = 'idPopup';
    document.body.appendChild(oEltDivPopup);
    fEvtPreviewMouseover = function (oEvtIn) {
      var sLoc, sId1, sId2,
        nPy, nPx, nWh, nWw,
        oDoc;

      oEvtIn.preventDefault();
      oEvtIn.stopPropagation();
      nPx = oEvtIn.pageX;
      nPy = oEvtIn.pageY;
      nWh = window.innerHeight;
      nWw = window.innerWidth;
      sId1 = this.href;
      if (sId1.indexOf('#') > 0) {
        sId2 = sId1.substring(sId1.indexOf("#") + 1);
        sId1 = sId1.substring(0, sId1.indexOf("#"));
      }
      sLoc = location.href;
      if (sLoc.indexOf('#') > 0) {
        sLoc = sLoc.substring(0, sLoc.indexOf("#"));
      }
      /* internal-link */
      if (sLoc === sId1) {
        oEltDivPopup.innerHTML = '<section>' + document.getElementById(sId2).innerHTML + '</section>';
      } else {
        oEltDivPopup.innerHTML = '';
        oXHR = new XMLHttpRequest();
        oXHR.open('GET', sId1, false);
        oXHR.send(null);
        if (oXHR.status === 200) {
          if (sId2) {
            //IF #fragment url, display only this element.
            oDoc = (new DOMParser()).parseFromString(oXHR.responseText, 'text/html');
            oEltDivPopup.innerHTML = '<section>' + oDoc.getElementById(sId2).innerHTML + '</section>';
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
                oEltDivPopup.innerHTML = '<p class="clsCenter"><img src="' + sId1
                  + '" width="' + nIW
                  + '" height="' + nIH + '" /></p>';
              });
            } else {
              document.getElementById('idPopup').innerHTML = oXHR.responseText;
            }
          }
        }
      }

      oEltDivPopup.style.top = (nWh / 2) - (nWh * 0.44 / 2)  + 'px'; //the height of popup is 44% of window
      if (nPx < nWw / 2) {
        oEltDivPopup.style.left = (nWw / 2) + 9 + 'px';
      } else {
        oEltDivPopup.style.left = 26 + 'px';
      }
      oEltDivPopup.style.overflow = 'auto';
      oEltDivPopup.style.display = 'block';
    };
    fEvtPreviewMouseout = function (oEvtIn) {
      oEltDivPopup.style.display = 'none';
    };
    fEvtPreviewOn = function (oEvtIn) {
      Array.prototype.slice.call(document.querySelectorAll('a.popupTrigger, a.clsPreview')).forEach(function (oEltIn, nIndex, array) {
        oEltIn.addEventListener('mouseover', fEvtPreviewMouseover);
        oEltIn.addEventListener('mouseout', fEvtPreviewMouseout);
        //IF you prefer to close popup with click, instead of mouseout
        //oEltIn.onclick = function () {
          //oEltDivPopup.style.display = 'none';
        //};
      });
    };
    fEvtPreviewOff = function (oEvtIn) {
      Array.prototype.slice.call(document.querySelectorAll('a.popupTrigger, a.clsPreview')).forEach(function (oEltIn, nIndex, array) {
        oEltIn.removeEventListener('mouseover', fEvtPreviewMouseover);
        oEltIn.removeEventListener('mouseout', fEvtPreviewMouseout);
      });
    };
    fEvtPreviewOn();
    oEltRdbPreviewOn.addEventListener('click', fEvtPreviewOn);
    oEltRdbPreviewOff.addEventListener('click', fEvtPreviewOff);

    /* tree initialization */
    oHitp.fTocTriInit();

    /* what to do on clicking a link in toc */
    Array.prototype.slice.call(document.querySelectorAll("#idTocTri li > a")).forEach(function (oEltIn, nIndex, array) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault();
        location.href = '#' + oEvtIn.target.href.split('#')[1];
        oHitp.fTocTriHighlightNode(oEltDivCnrToc, oEltIn);
      });
    });

    oHitp.fTocTriExpandAll();
    oHitp.fTocTriCollapseAll();
    oHitp.fTocTriExpandFirst();
    /* IF on idMetaWebpage_path paragraph we have and the clsTocExpand
     * then the toc expands-all */
    if (document.getElementById("idMetaWebpage_path")) {
      if (document.getElementById("idMetaWebpage_path").getAttribute('class') === 'classTocExpand' ||
          document.getElementById("idMetaWebpage_path").getAttribute('class') === 'clsTocExpand') {
        oHitp.fTocTriExpandAll();
      }
    }

    window.onhashchange = function(oEvtIn) {
      location.href = location.href;
    };

    /* focus on right-div, Div can get the focus if it has tabindex attribute... on chrome */
    document.getElementById('idDivCnrCnt').setAttribute('tabindex', -1);
    document.getElementById('idDivCnrCnt').focus();
  };

  /** 2013.07.17
   * Returns a string html-ul-element that holds the-toc-tree with the-headings of the-page.
   * <ul>
   *   <li><a href="#heading">heading</a><li>
   *   <li><a href="#heading">heading</a>
   *     <ul>
   *       <li><a href="#heading">heading</a><li>
   *       <li><a href="#heading">heading</a><li>
   *     </ul>
   *   <li>
   * </ul>
   */
  oHitp.fTocTriCreate = function () {
    var aElm = document.body.getElementsByTagName('*'), aHdng = [],
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
    sHcnt = sHcnt.replace(/\n {4}<a class="clsHide" href="#\w*">¶<\/a>/, '');
    sHcnt = sHcnt.replace(/\n {4}<a class="hide" href="#\w*">¶<\/a>/, '');
    sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
    sUl = '<ul><li><a class="clsPreview" href="#idHeader">' + sHcnt + '</a>';

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
      /* removes from heading the "classHide" content */
      sHcnt = oElt.innerHTML;
      /*jslint regexp: true*/
      sHcnt = sHcnt.replace(/\n {4}<a class="clsHide" href=[^>]+>¶<\/a>/, '');
      sHcnt = sHcnt.replace(/\n {4}<a class="hide" href=[^>]+>¶<\/a>/, '');
      sHcnt = sHcnt.replace(/<[^>]+>/g, '');
      /*jslint regexp: false*/
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
    sUl += '</li></ul>';
    return sUl;
  };

  /** Makes the display-style: none. */
  oHitp.fTocTriCollapseAll = function () {
    var aSubnodes,
      aTocTriLIs = document.getElementById('idTocTri').getElementsByTagName('li'),
      n;

    for (n = 0; n < aTocTriLIs.length; n += 1) {
      aSubnodes = aTocTriLIs[n].getElementsByTagName('ul');
      if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'block') {
        oHitp.fTocTriEvtToggleNode(false, aTocTriLIs[n].id);
      }
    }
  };

  /**
   * Expands, collaples a-toc-tree node and puts the correct icon.
   * It is also an-event-listener for toc-tree-icons.
   *
   * To create the expandable-toctree I read code from
   * http://www.dhtmlgoodies.com/
   */
  oHitp.fTocTriEvtToggleNode = function (oEvtIn, sIdLiIn) {
    var oEltImg, oNodePnt;

    //<li id="idTocTriLi2">
    //  <img src="imgToc1Exp17" />
    //  <a href="#idDescription" class="clsTocTriHighlight">Description</a>
    //</li>
    if (sIdLiIn) {
      if (!document.getElementById(sIdLiIn)) {
        return;
      }
      oEltImg = document.getElementById(sIdLiIn).getElementsByTagName('img')[0];
    } else {
      //this function is also the event-listener of onclick in toc icons.
      //Then, 'this' is the img element.
      oEltImg = this;
    }
    oNodePnt = oEltImg.parentNode;/* ⊕⊝⊙▽△◇,⇧⇩⇨⇦∧∨⋁⋀⇑⇓↥↧,▼▲◆,∇∆ */
    if (oEltImg.src.indexOf(sImgTocExp) !== -1) {
      oEltImg.setAttribute('src', sImgTocCol);
      oEltImg.setAttribute('class', 'clsTocTriIcn');
      oNodePnt.getElementsByTagName('ul')[0].style.display = 'block';
    } else if (oEltImg.src.indexOf(sImgTocCol) !== -1) {
      oEltImg.setAttribute('src', sImgTocExp);
      oEltImg.setAttribute('class', 'clsTocTriIcn');
      oNodePnt.getElementsByTagName('ul')[0].style.display = 'none';
    }
    return false;
  };

  /** Highlights ONE item in toc-list */
  oHitp.fTocTriHighlightNode = function (oEltDivCnrToc, oElm) {
    /* removes existing highlighting */
    var aTocTriAs = oEltDivCnrToc.getElementsByTagName('a'),
      n;

    for (n = 0; n < aTocTriAs.length; n += 1) {
      aTocTriAs[n].removeAttribute('class');
    }
    oElm.setAttribute('class', 'clsTocTriHighlight');
  };

  /**
   * Inserts images with onclick events, before a-elements.
   * Sets ids on li-elements.
   */
  oHitp.fTocTriInit = function () {
    var aEltA, aSubnodes, aTocTriLIs,
      n,
      oEltImg, oTocTriUl;

    oTocTriUl = document.getElementById('idTocTri');
    aTocTriLIs = oTocTriUl.getElementsByTagName('li');
    for (n = 0; n < aTocTriLIs.length; n += 1) {
      oHitp.nTocTriIdLi += 1;
      aSubnodes = aTocTriLIs[n].getElementsByTagName('ul');
      oEltImg = document.createElement('img');
      oEltImg.setAttribute('src', sImgTocExp);
      oEltImg.setAttribute('class', 'clsTocTriIcn');
      if (aSubnodes.length === 0) {
        oEltImg.setAttribute('src', sImgTocLif);
        oEltImg.setAttribute('class', 'clsTocTriIcnLif');
      } else {
        oEltImg.addEventListener('click', oHitp.fTocTriEvtToggleNode);
      }
      aEltA = aTocTriLIs[n].getElementsByTagName('a')[0];
      aTocTriLIs[n].insertBefore(oEltImg, aEltA);
      if (!aTocTriLIs[n].id) {
        aTocTriLIs[n].id = 'idTocTriLi' + oHitp.nTocTriIdLi;
      }
    }
  };

  /** Makes the display-style: block. */
  oHitp.fTocTriExpandAll = function () {
    var aSubnodes,
      aTocTriLIs = document.getElementById('idTocTri').getElementsByTagName('li'),
      n;

    for (n = 0; n < aTocTriLIs.length; n += 1) {
      aSubnodes = aTocTriLIs[n].getElementsByTagName('ul');
      if (aSubnodes.length > 0 && aSubnodes[0].style.display !== 'block') {
        oHitp.fTocTriEvtToggleNode(false, aTocTriLIs[n].id);
      }
    }
  };

  /** Expands the first children. */
  oHitp.fTocTriExpandFirst = function () {
    var aTocTriLIs, aSubnodes;

    aTocTriLIs = document.getElementById('idTocTri').getElementsByTagName('li');
    /* expand the first ul-element */
    aSubnodes = aTocTriLIs[0].getElementsByTagName('ul');
    if (aSubnodes.length > 0 && aSubnodes[0].style.display !== 'block') {
      oHitp.fTocTriEvtToggleNode(false, aTocTriLIs[0].id);
    }
  };

  /** 
   * Expands all the parents ONLY, of an element with link to a heading.
   */
  oHitp.fTocTriExpandParent = function (oEltAIn) {
    var oEltImg, oEltUl;

    /** the parent of a-link-elm is li-elm with parent a ul-elm. */
    oEltUl = oEltAIn.parentNode.parentNode;
    while (oEltUl.tagName === 'UL') {
      oEltUl.style.display = 'block';
      /* the parent is li-elm, its first-child is img */
      oEltImg = oEltUl.parentNode.firstChild;
      if (oEltImg.tagName === 'IMG' && oEltImg.src.indexOf(sImgTocExp) !== -1) {
        oEltImg.setAttribute('src', sImgTocCol);
        oEltImg.setAttribute('class', 'clsTocTriIcn');
      }
      oEltUl = oEltUl.parentNode.parentNode;
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    oHitp.fTocCnrInsert();
  });

  return oHitp;
})();