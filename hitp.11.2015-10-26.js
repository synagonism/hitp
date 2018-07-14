/*
 * version.11.last.minor: hitp.js (2015.10.26.11)
 * version.11.last.minorNo: hitp.2015.10.26.11.js (preferences)
 * version.10.previous: hitp.2014.08.05.10.js (valuenames)
 * version.9.previous: hitp.2014.08.02.9.js (NO jQuery, fixed popup)
 * version.8.previous.minor: hitp.js (2014.01.09.8 minor 2014.07.29.8.12)
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
 * Copyright (c) 2015 Kaseluris.Nikos.1959 (synagonism)
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
    bFirefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    /** toc-tree variables */
    nTocIdTreeLi: 0,
    nPosSplitPrevious: 0,
    /* setting: the hitmenu contains absolute urls, because we see it from many pages.
     * Then we must know the ROOT of the site and create different menus.
     */
    sPathMenuLocal: '/WebsiteSgm/hitpmenuLocal.html',
    sPathMenuOnline: '/hitpmenu.html'
  };

  /**
   * splitter related code.
   * INPUT: element-object with 2 div children.
   */
  oHitp.fSplit = function (oHmlEltIn) {
    var nPosSplitCurrent = 222, /* setting */
      oHmlEltDivSpliter = oHmlEltIn,
      oHmlEltDivSpliterLeft = oHmlEltDivSpliter.children[0],
      oHmlEltDivSpliterRight = oHmlEltDivSpliter.children[1],
      oHmlEltDivSpliterBar = document.createElement('div'),
      oHmlEltDivSpliterBarGhost, //we create it at startDraging
      oHmlEltDivSpliterBarButon = document.createElement('div');

    function fEvtDragMousemove(oEventIn) {
      var nIncr = oEventIn.pageX;

      oHmlEltDivSpliterBarGhost.style.left = nIncr + 'px';
    }

    /* Perform actual splitting */
    function fTocSplit_to(nPos) {
      var nSizeB;

      oHitp.nPosSplitPrevious = nPosSplitCurrent;
      nPosSplitCurrent = nPos;
      nSizeB = oHmlEltDivSpliter.offsetWidth - nPos - 10 - 10; /* setting splitBar, padding */
      oHmlEltDivSpliterLeft.style.width = nPos + 'px';
      oHmlEltDivSpliterBar.style.left = nPos + 'px';
      oHmlEltDivSpliterRight.style.width = nSizeB + 'px';
      oHmlEltDivSpliterRight.style.left = nPos + 10 + 'px';
      if (nPos === 0) {
        oHmlEltDivSpliterBarButon.innerHTML = '<span><br />»</span>'; //»▸⇒
      } else {
        oHmlEltDivSpliterBarButon.innerHTML = '<span><br />«</span>'; //sbl «◂‹⇐
      }
      oHmlEltDivSpliterBar.style.background = 'linear-gradient(to left, #aaaaaa, #dddddd 100%)';
      oHmlEltDivSpliter.style['-khtml-user-select'] = 'all';
      oHmlEltDivSpliter.style['-webkit-user-select'] = 'all';
      oHmlEltDivSpliter.style.MozUserSelect = 'text';
      oHmlEltDivSpliter.style.userSelect = 'all';
    }

    // end event
    function fEvtDragMouseup(oEventIn) {
      var nLeft = oHmlEltDivSpliterBarGhost.offsetLeft;

      oHmlEltDivSpliterBarGhost.parentNode.removeChild(oHmlEltDivSpliterBarGhost);
      oHmlEltDivSpliterBarGhost = null;
      document.removeEventListener('mousemove', fEvtDragMousemove);
      document.removeEventListener('mouseup', fEvtDragMouseup);
      fTocSplit_to(nLeft);
    }

    // start event
    function fEvtDragMousedown(oEventIn) {
      oHmlEltDivSpliterBarGhost = document.createElement('div');
      oHmlEltDivSpliterBarGhost.id = 'idDivSpliterBarGhost';
      oHmlEltDivSpliterBarGhost.style.left = oHmlEltDivSpliterBar.style.left;
      oHmlEltDivSpliter.insertBefore(oHmlEltDivSpliterBarGhost, oHmlEltDivSpliterRight);
      oHmlEltDivSpliter.style['-khtml-user-select'] = 'none';
      oHmlEltDivSpliter.style['-webkit-user-select'] = 'none';
      oHmlEltDivSpliter.style.MozUserSelect = 'none';
      oHmlEltDivSpliter.style.userSelect = 'none';
      document.addEventListener('mousemove', fEvtDragMousemove);
      document.addEventListener('mouseup', fEvtDragMouseup);
    }

    oHmlEltDivSpliter.insertBefore(oHmlEltDivSpliterBar, oHmlEltDivSpliterRight);
    oHmlEltDivSpliterBar.id = 'idDivSpliterBar';
    oHmlEltDivSpliterBar.style.height = '100%';
    oHmlEltDivSpliterBar.addEventListener('mousedown', fEvtDragMousedown);
    oHmlEltDivSpliterBar.addEventListener('mouseenter', function () {
      oHmlEltDivSpliterBar.style.background = 'green';
    });
    oHmlEltDivSpliterBar.addEventListener('mouseout', function () {
      oHmlEltDivSpliterBar.style.background = 'linear-gradient(to left, #aaaaaa, #dddddd 100%)';
    });

    oHmlEltDivSpliterBarButon.id = 'idDivSpliterBarButon';
    oHmlEltDivSpliterBar.appendChild(oHmlEltDivSpliterBarButon);
    oHmlEltDivSpliterBarButon.addEventListener('mousedown', function (oEventIn) {
      oEventIn.stopPropagation();
      fTocSplit_to((nPosSplitCurrent === 0) ? oHitp.nPosSplitPrevious : 0);
      oHmlEltDivSpliterLeft.scrollLeft = 0;
    });
    fTocSplit_to(nPosSplitCurrent);
    //needed for proper zoom
    window.addEventListener("resize", function () {
      fTocSplit_to(nPosSplitCurrent);
    });
  };

  /** 2013.07.17
   * Returns an html-ul-element that holds the outline.
   * <ul>
   *   <li id="idTocTreeLI1">
   *   ...
   *   </li>
   * </ul>
   */
  oHitp.fCreateUl_with_headings = function () {
    var aElm = document.body.getElementsByTagName('*'), aHdng = [],
      nLvlThis, nLvlNext, nLvlPrev = 0, nLvlToc = 0, n, nJ,
      rHdng = /h\d/i,
      sUl = '', sHcnt, sHid, sHlvl,
      oHmlElt;

    for (n = 0; n < aElm.length; n += 1) {
      oHmlElt = aElm[n];
      if (rHdng.test(oHmlElt.nodeName)) {
        aHdng.push(oHmlElt);
      }
      //and and the 'footer' element
      if (oHmlElt.nodeName.match(/footer/i)) {
        aHdng.push(oHmlElt);
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
      oHmlElt = aHdng[n];
      //special footer case;
      if (oHmlElt.nodeName.match(/footer/i)) {
        nLvlThis = 1;
        nLvlToc = 1;
        sUl += '<li><a class="clsPreview" href="#idFooter">Footer</a></li>';
        nLvlPrev = 1;
        continue;
      }
      nLvlThis = oHmlElt.nodeName.substr(1, 1);
      if (nLvlThis > nLvlPrev) {
        sUl += '<ul>'; //new list
        nLvlToc = 1 + parseInt(nLvlToc, 10);
      }
      sHid = oHmlElt.id;
      sHlvl = sHid.charAt(sHid.length - 1);
      sHid = sHid.replace(/(\w*)H\d/, '$1');
      /* removes from heading the "classHide" content */
      sHcnt = oHmlElt.innerHTML;
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

  /**
   * Expands, collaples a treenode of the toc and puts the correct icon.
   *
   * To create the expandable-toctree I read code from
   * http://www.dhtmlgoodies.com/
   */
  oHitp.fToctreeToggleNode = function (oEventIn, sIdIn) {
    var oNodeThis, oNodeParent;

    if (sIdIn) {
      if (!document.getElementById(sIdIn)) {
        return;
      }
      oNodeThis = document.getElementById(sIdIn).getElementsByTagName('span')[0];
    } else {
      //this function is also the handler of onclick in toc icons.
      //Then, 'this' is the span element that contains the icons.
      oNodeThis = this;
    }
    oNodeParent = oNodeThis.parentNode;/* ⊕⊝⊙▽△◇,⇧⇩⇨⇦∧∨⋁⋀⇑⇓↥↧,▼▲◆,∇∆, sbl */
    if (oNodeThis.innerHTML.indexOf('⇩') !== -1) {
      oNodeThis.innerHTML = '';
      oNodeThis.setAttribute('class', 'clsSpanListIcon clsIconCollapse');
      oNodeThis.innerHTML = '⇧';
      oNodeParent.getElementsByTagName('ul')[0].style.display = 'block';
    } else if (oNodeThis.innerHTML.indexOf('⇧') !== -1) {
      oNodeThis.innerHTML = '';
      oNodeThis.setAttribute('class', 'clsSpanListIcon');
      oNodeThis.innerHTML = '⇩';
      oNodeParent.getElementsByTagName('ul')[0].style.display = 'none';
    }
    return false;
  };

  /** Makes the display-style: none. */
  oHitp.fToctreeCollapseAll = function (sIdToctree) {
    var aSubnodes,
      aToctreeLIs = document.getElementById(sIdToctree).getElementsByTagName('li'),
      n;

    for (n = 0; n < aToctreeLIs.length; n += 1) {
      aSubnodes = aToctreeLIs[n].getElementsByTagName('ul');
      if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'block') {
        oHitp.fToctreeToggleNode(false, aToctreeLIs[n].id);
      }
    }
  };

  /**
   * Inserts images with onclick events, before a-elements.
   * Sets id on li-elements.
   */
  oHitp.fToctreeInit = function () {
    var aEltA, aSubnodes, aToctreeLIs,
      n,
      oHmlEltSpan, oToctreeUl;

    oToctreeUl = document.getElementById('idTocTree');
    aToctreeLIs = oToctreeUl.getElementsByTagName('li'); /* Get an array of all menu items */
    for (n = 0; n < aToctreeLIs.length; n += 1) {
      oHitp.nTocIdTreeLi += 1;
      aSubnodes = aToctreeLIs[n].getElementsByTagName('ul');
      oHmlEltSpan = document.createElement('span');
      oHmlEltSpan.innerHTML = '⇩';
      oHmlEltSpan.addEventListener('click', oHitp.fToctreeToggleNode);
      oHmlEltSpan.setAttribute('class', 'clsSpanListIcon');
      if (aSubnodes.length === 0) {
        oHmlEltSpan.innerHTML = '◇';
        oHmlEltSpan.removeAttribute('class');
        oHmlEltSpan.setAttribute('class', 'clsDiamond');
      }
      aEltA = aToctreeLIs[n].getElementsByTagName('a')[0];
      aToctreeLIs[n].insertBefore(oHmlEltSpan, aEltA);
      if (!aToctreeLIs[n].id) {
        aToctreeLIs[n].id = 'idTocTreeLI' + oHitp.nTocIdTreeLi;
      }
    }
  };

  /** Highlights ONE item in toc-list */
  oHitp.fToctreeHighlightNode = function (oHmlEltDivSpliterLeft, oElm) {
    /* removes existing highlighting */
    var aToctreeAs = oHmlEltDivSpliterLeft.getElementsByTagName('a'),
      n;

    for (n = 0; n < aToctreeAs.length; n += 1) {
      aToctreeAs[n].removeAttribute('class');
    }
    oElm.setAttribute('class', 'clsTocTreeHighlight');
  };

  /** Makes the display-style: block. */
  oHitp.fToctreeExpandAll = function (sIdToctree) {
    var aSubnodes,
      aToctreeLIs = document.getElementById(sIdToctree).getElementsByTagName('li'),
      n;

    for (n = 0; n < aToctreeLIs.length; n += 1) {
      aSubnodes = aToctreeLIs[n].getElementsByTagName('ul');
      if (aSubnodes.length > 0 && aSubnodes[0].style.display !== 'block') {
        oHitp.fToctreeToggleNode(false, aToctreeLIs[n].id);
      }
    }
  };

  /** Expands the first children. */
  oHitp.fToctreeExpandFirst = function (sIdToctree) {
    var aToctreeLIs, aSubnodes;

    aToctreeLIs = document.getElementById(sIdToctree).getElementsByTagName('li');
    /* expand the first ul-element */
    aSubnodes = aToctreeLIs[0].getElementsByTagName('ul');
    if (aSubnodes.length > 0 && aSubnodes[0].style.display !== 'block') {
      oHitp.fToctreeToggleNode(false, aToctreeLIs[0].id);
    }
  };

  /** expands all the parents only, of an element */
  oHitp.fToctreeExpandParent = function (oHmlEltIn) {
    var oHmlEltSpan, oHmlEltUl;

    /** the parent of a-elm is li-elm with parent a ul-elm. */
    oHmlEltUl = oHmlEltIn.parentNode.parentNode;
    while (oHmlEltUl.tagName === 'UL') {
      oHmlEltUl.style.display = 'block';
      /* the parent is li-elm, its first-child is img */
      oHmlEltSpan = oHmlEltUl.parentNode.firstChild;
      if (oHmlEltSpan.tagName === 'SPAN' && oHmlEltSpan.innerHTML.indexOf('⇩') !== -1) {
        oHmlEltSpan.innerHTML = '⇧';
        oHmlEltSpan.setAttribute('class', 'clsSpanListIcon clsIconCollapse');
      }
      oHmlEltUl = oHmlEltUl.parentNode.parentNode;
    }
  };

  /** this function puts on the page the toc by splitting it. */
  oHitp.fMakeToc = function () {
    var
      fEvtPreviewMouseover,
      fEvtPreviewMouseout,
      fEvtPreviewOn,
      fEvtPreviewOff,
      fEvtTocposition,
      fEvtTocpositionClick,
      fEvtTocpositionHover,
      oHmlEltBody = document.body,
      oHmlEltDivSpliter = document.createElement('div'), /* the general container*/
      oHmlEltDivSpliterRight = document.createElement('div'),
      oHmlEltDivSpliterLeft = document.createElement('div'),
      oHmlEltUlTabNames = document.createElement('ul'),
      oHmlEltDivTabContentcnr = document.createElement('div'),
      oHmlEltDivTab1Content = document.createElement('div'),
      //oHmlEltDivTab2Content = document.createElement('div'),
      oHmlEltBtnTocCollapseall = document.createElement('input'),
      oHmlEltBtnTocExpandall = document.createElement('input'),
      oHmlEltPPath = document.createElement('p'),
      oHmlEltFrmPref = document.createElement('form'),
      oHmlEltRdbPreviewOn,
      oHmlEltRdbPreviewOff,
      oHmlEltRdbTocpositionHover,
      oHmlEltRdbTocpositionClick,
      oHmlEltPNote = document.createElement('p'),
      oHmlEltDivPopup = document.createElement('div'),
      oHmlEltDivHitpmenu = document.createElement('div'),
      oXHR = new XMLHttpRequest(),
      sContentOriginal = document.body.innerHTML, sIdTabActive, sPathMenu;

    oHitp.nTocIdTreeLi = 0;
    oHmlEltDivSpliter.id = 'idDivSpliter';
    /* remove from old-body its elements */
    oHmlEltBody.innerHTML = '';
    oHmlEltBody.appendChild(oHmlEltDivSpliter);

    /* set on right-splitter the old-body */
    oHmlEltDivSpliterRight.id = 'idDivSpliterRight';
    oHmlEltDivSpliterRight.innerHTML = sContentOriginal;
    oHmlEltDivSpliter.appendChild(oHmlEltDivSpliterRight);

    /* insert toc */
    oHmlEltDivSpliterLeft.id = 'idDivSpliterLeft';

    /* insert content on tab1 */
    oHmlEltDivTab1Content.id = 'idDivTab1Content';
    oHmlEltDivTab1Content.setAttribute('class', 'clsTabContent');
    oHmlEltDivTab1Content.innerHTML = oHitp.fCreateUl_with_headings();
    oHmlEltDivTab1Content.getElementsByTagName("ul")[0].setAttribute('id', 'idTocTree');
    /* insert collaplse-button */
    oHmlEltBtnTocCollapseall.setAttribute('id', 'idBtnCollapse_All');
    oHmlEltBtnTocCollapseall.setAttribute('type', 'button');
    oHmlEltBtnTocCollapseall.setAttribute('value', '⇧');
    oHmlEltBtnTocCollapseall.setAttribute('title', 'Collapse-All');
    oHmlEltBtnTocCollapseall.setAttribute('class', 'clsBtn');
    oHmlEltBtnTocCollapseall.addEventListener('click', function (oEventIn) {
      oHitp.fToctreeCollapseAll('idTocTree');
    });
    oHmlEltDivTab1Content.insertBefore(oHmlEltBtnTocCollapseall, oHmlEltDivTab1Content.firstChild);
    /* insert expand-button */
    oHmlEltBtnTocExpandall.setAttribute('id', 'idBtnExp_All');
    oHmlEltBtnTocExpandall.setAttribute('type', 'button');
    oHmlEltBtnTocExpandall.setAttribute('value', '⇩');
    oHmlEltBtnTocExpandall.setAttribute('title', 'Expand-All');
    oHmlEltBtnTocExpandall.setAttribute('class', 'clsBtn');
    oHmlEltBtnTocExpandall.addEventListener('click', function (oEventIn) {
      oHitp.fToctreeExpandAll('idTocTree');
    });
    oHmlEltDivTab1Content.insertBefore(oHmlEltBtnTocExpandall, oHmlEltDivTab1Content.firstChild);
    /* preferences */
    oHmlEltDivTab1Content.appendChild(document.createElement('p'));
    oHmlEltFrmPref.innerHTML = '<span class="clsColorGreen clsB">Preferences</span>:<br/>' +
      '&nbsp;&nbsp;1) <span class="clsU">Link-preview</span>:<br/>' +
      '<input type="radio" id="idRdbPreviewOn" name="nameRdbPreview" checked/>Preview On (default)<br/>' +
      '<input type="radio" id="idRdbPreviewOff" name="nameRdbPreview"/>Preview Off<br/>' +
      '<br/>' +
      '&nbsp;&nbsp;2) <span class="clsU">Show on ToC content-position by</span>:<br/>' +
      '<input type="radio" id="idRdbTocpositionHover" name="nameRdbPosition" checked/>Hovering content (default)<br/>' +
      '<input type="radio" id="idRdbTocpositionClick" name="nameRdbPosition"/>Clicking content';
    oHmlEltDivTab1Content.appendChild(oHmlEltFrmPref);
    /* toc: add note at the end */
    oHmlEltPNote.innerHTML = '<span class="clsColorGreen clsB">Notes</span>:<br/>' +
      'a) Clicking on ¶ or on ToC, you see the address of that text on address-bar.<br/>' +
      'b) Hovering content (default) OR clicking content, you see its position on ToC.<br/>' +
      'c) Hovering a domain-link you see a preview (default).<br/>' +
      'd) CHROME since version-46 stopped functioning well on hitp pages (tip: preview a link on "page-path" to scroll), FIREFOX works fine.';
    oHmlEltDivTab1Content.appendChild(oHmlEltPNote);

    /* inset tab1 on tabcontainer */
    oHmlEltDivTabContentcnr.id = 'idDivTabContentcontainer';

    oHmlEltDivTabContentcnr.appendChild(oHmlEltDivTab1Content);
    //oHmlEltDivTab2Content.id = 'idTab2ContentDiv';
    //oHmlEltDivTab2Content.setAttribute('class', 'clsTabContent');
    //oHmlEltDivTabContentcnr.appendChild(oHmlEltDivTab2Content);

    /* insert tabcontainer on spliterLeft */
    oHmlEltDivSpliterLeft.appendChild(oHmlEltDivTabContentcnr);

    /* insert tabnames */
    oHmlEltUlTabNames.id = 'idTabNamesUl';
    oHmlEltUlTabNames.innerHTML = '<li class="clsTabActive"><a href="#idTab1contentDiv">Page-structure</a></li>';
      //<li><a href="#idTab2contentDiv">Search</a></li>'
    oHmlEltDivSpliterLeft.insertBefore(oHmlEltUlTabNames, oHmlEltDivSpliterLeft.firstChild);

    /* insert page-path--element */
    oHmlEltPPath.id = 'idPpath';
    oHmlEltPPath.setAttribute('title', "© 2010-2015 Kaseluris.Nikos.1959"); //nnn
    if (!document.getElementById("idMetaWebpage_path")) {
      oHmlEltPPath.innerHTML = 'ToC: ' + document.title;
    } else {
      oHmlEltPPath.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    oHmlEltDivSpliterLeft.insertBefore(oHmlEltPPath, oHmlEltDivSpliterLeft.firstChild);

    /* insert site-structure menu */
    if (location.hostname !== '') {
      oHmlEltDivHitpmenu.id = 'idHitpmenu';
      if (location.hostname === 'localhost') {
        sPathMenu = oHitp.sPathMenuLocal;
      } else {
        sPathMenu = oHitp.sPathMenuOnline;
      }
      oXHR.open('GET', location.origin + sPathMenu, false);
      oXHR.send(null);
      if (oXHR.status === 200) {
        oHmlEltDivHitpmenu.innerHTML = oXHR.responseText;
        oHmlEltDivSpliterLeft.insertBefore(oHmlEltDivHitpmenu, oHmlEltDivSpliterLeft.firstChild);
        oHmlEltDivHitpmenu.addEventListener('mouseover', function () {
          oHitp.nPosSplitPrevious = oHmlEltDivSpliterLeft.offsetWidth;
          oHmlEltDivSpliterLeft.style.width = window.innerWidth + 'px';
        });
        oHmlEltDivHitpmenu.addEventListener('mouseout', function () {
          oHmlEltDivSpliterLeft.style.width = oHitp.nPosSplitPrevious + 'px';
        });
      }
    }

    /* clicking on a content-link first go to its location, this way the backbutton goes where we clicked. */
    [].slice.call(document.querySelectorAll('#idDivSpliterRight a')).forEach(function (oHmlEltIn, nIndex, array) {
      oHmlEltIn.addEventListener('click', function (oEventIn) {
        var sID,
          oHmlEltSec = oHmlEltIn;

        while (!oHmlEltSec.tagName.match(/^SECTION/i)) {
          sID = oHmlEltSec.id;
          if (sID) {
            break;
          } else {
            oHmlEltSec = oHmlEltSec.parentNode;
          }
        }
        sID = '#' + sID;
        if (location.hash !== sID) {
          location.href = sID;
        }
      });
    });

    /* insert spliterLeft */
    oHmlEltDivSpliter.insertBefore(oHmlEltDivSpliterLeft, oHmlEltDivSpliter.firstChild);
    oHitp.fSplit(oHmlEltDivSpliter);

    /* on content get-id */
    oHmlEltRdbTocpositionHover = document.getElementById('idRdbTocpositionHover');
    oHmlEltRdbTocpositionClick = document.getElementById('idRdbTocpositionClick');
    fEvtTocposition = function (oEventIn) {
      var sID = '',
        oHmlEltSec = oEventIn.target;

      oEventIn.stopPropagation();

      /* find the id of closest header */
      /* first go where you click */
      sID = '#' + oHmlEltSec.id;

      /* find  section's id */
      while (oHmlEltSec && !oHmlEltSec.tagName.match(/^SECTION/i)) {
        oHmlEltSec = oHmlEltSec.parentNode;
        if (!oHmlEltSec.tagName) {
          break;
        } else if (oHmlEltSec.tagName.match(/^HEADER/i)
                || oHmlEltSec.tagName.match(/^FOOTER/i)) {
          break;
        }
      }
      if (oHmlEltSec.tagName) {
        if (oHmlEltSec.tagName.match(/^HEADER/i)) {
          sID = '#idHeader';
        } else if (oHmlEltSec.tagName.match(/^FOOTER/i)) {
          sID = '#idFooter';
        } else {
          sID = '#' + oHmlEltSec.id;
        }
      }

      [].slice.call(document.querySelectorAll('#idTocTree a')).forEach(function (oHmlEltIn, nIndex, array) {
        if (oHmlEltIn.getAttribute('href') === sID) {
          oHitp.fToctreeCollapseAll('idTocTree');
          oHitp.fToctreeHighlightNode(oHmlEltDivSpliterLeft, oHmlEltIn);
          oHitp.fToctreeExpandParent(oHmlEltIn);
          oHmlEltIn.scrollIntoViewIfNeeded(true);
          if (oHitp.bFirefox) {
            oHmlEltIn.scrollIntoView({block: "end", behavior: "smooth"});
          }
          document.getElementById("idDivSpliterLeft").scrollLeft = 0;
        }
      });
    };
    fEvtTocpositionClick = function (oEventIn) {
      [].slice.call(document.querySelectorAll('*[id]')).forEach(function (oHmlEltIn, nIndex, array) {
        oHmlEltIn.removeEventListener('mouseenter', fEvtTocposition); 
        oHmlEltIn.addEventListener('click', fEvtTocposition); 
      });
    };
    fEvtTocpositionHover = function (oEventIn) {
      [].slice.call(document.querySelectorAll('*[id]')).forEach(function (oHmlEltIn, nIndex, array) {
        oHmlEltIn.removeEventListener('click', fEvtTocposition); 
        oHmlEltIn.addEventListener('mouseenter', fEvtTocposition); 
      });
    };
    oHmlEltRdbTocpositionClick.addEventListener('click', fEvtTocpositionClick);
    oHmlEltRdbTocpositionHover.addEventListener('click', fEvtTocpositionHover);
    fEvtTocpositionHover();

    /* On TABS Click Event */
    [].slice.call(document.querySelectorAll('ul#idTabNamesUl li')).forEach(function (oHmlEltIn, nIndex, array) {
      oHmlEltIn.addEventListener('click', function () {
        //Remove any "active" class
        document.querySelector('.clsTabActive').classList.remove('clsTabActive');
        //Add "active" class to selected tab
        oHmlEltIn.classList.add('clsTabActive');
        //Hide all tab content
        [].slice.call(document.getElementsByClassName('clsTabContent')).forEach(function (oHmlEltIn, nIndex, array) {
          oHmlEltIn.style.display = 'none';
        });
        //Show content of active tab
        sIdTabActive = document.querySelector('.clsTabActive a').getAttribute('href').substring(1);
        document.getElementById(sIdTabActive).style.display = 'block';
        return false;
      });
    });

    /* on links with clsPreview add this function
     * first insert popup container */
    oHmlEltRdbPreviewOn = document.getElementById('idRdbPreviewOn');
    oHmlEltRdbPreviewOff = document.getElementById('idRdbPreviewOff');
    oHmlEltDivPopup.id = 'idPopup';
    document.body.appendChild(oHmlEltDivPopup);
    fEvtPreviewMouseover = function (oEventIn) {
      var sLoc, sId1, sId2,
        nPy, nPx, nWh, nWw,
        oDoc;

      oEventIn.stopPropagation();
      nPx = oEventIn.pageX;
      nPy = oEventIn.pageY;
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
        oHmlEltDivPopup.innerHTML = '<section>' + document.getElementById(sId2).innerHTML + '</section>';
      } else {
        oHmlEltDivPopup.innerHTML = '';
        oXHR = new XMLHttpRequest();
        oXHR.open('GET', sId1, false);
        oXHR.send(null);
        if (oXHR.status === 200) {
          if (sId2) {
            //IF #fragment url, display only this element.
            oDoc = (new DOMParser()).parseFromString(oXHR.responseText, 'text/html');
            oHmlEltDivPopup.innerHTML = '<section>' + oDoc.getElementById(sId2).innerHTML + '</section>';
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
                oHmlEltDivPopup.innerHTML = '<p class="clsCenter"><img src="' + sId1
                  + '" width="' + nIW
                  + '" height="' + nIH + '" /></p>';
              });
            } else {
              document.getElementById('idPopup').innerHTML = oXHR.responseText;
            }
          }
        }
      }
      
      oHmlEltDivPopup.style.top = (nWh / 2) - (nWh * 0.44 / 2)  + 'px'; //the height of popup is 44% of window
      if (nPx < nWw / 2) {
        oHmlEltDivPopup.style.left = (nWw / 2) + 9 + 'px';
      } else {
        oHmlEltDivPopup.style.left = 26 + 'px';
      }
      oHmlEltDivPopup.style.overflow = 'auto';
      oHmlEltDivPopup.style.display = 'block';
    };
    fEvtPreviewMouseout = function (oEventIn) {
      oHmlEltDivPopup.style.display = 'none';
    };
    fEvtPreviewOn = function (oEventIn) {
      [].slice.call(document.querySelectorAll('a.popupTrigger, a.clsPreview')).forEach(function (oHmlEltIn, nIndex, array) {
        oHmlEltIn.addEventListener('mouseenter', fEvtPreviewMouseover);
        oHmlEltIn.addEventListener('mouseout', fEvtPreviewMouseout);
        //IF you prefer to close popup with click, instead of mouseout
        //oHmlEltIn.onclick = function () {
          //oHmlEltDivPopup.style.display = 'none';
        //};
      });
    };
    fEvtPreviewOff = function (oEventIn) {
      [].slice.call(document.querySelectorAll('a.popupTrigger, a.clsPreview')).forEach(function (oHmlEltIn, nIndex, array) {
        oHmlEltIn.removeEventListener('mouseenter', fEvtPreviewMouseover);
        oHmlEltIn.removeEventListener('mouseout', fEvtPreviewMouseout);
      });
    };
    fEvtPreviewOn();
    oHmlEltRdbPreviewOn.addEventListener('click', fEvtPreviewOn);
    oHmlEltRdbPreviewOff.addEventListener('click', fEvtPreviewOff);

    /* tree initialization */
    oHitp.fToctreeInit();

    /* what to do on clicking a link in toc */
    [].slice.call(document.querySelectorAll("#idTocTree li > a")).forEach(function (oHmlEltIn, nIndex, array) {
      oHmlEltIn.addEventListener('click', function (oEventIn) {
        location.href = '#' + oEventIn.target.href.split('#')[1];
        oHitp.fToctreeHighlightNode(oHmlEltDivSpliterLeft, oHmlEltIn);
        return false;
      });
    });

    oHitp.fToctreeExpandAll('idTocTree');
    oHitp.fToctreeCollapseAll('idTocTree');
    oHitp.fToctreeExpandFirst('idTocTree');
    /* IF on idMetaWebpage_path paragraph we have and the clsTocExpand
     * then the toc expands-all */
    if (document.getElementById("idMetaWebpage_path")) {
      if (document.getElementById("idMetaWebpage_path").getAttribute('class') === 'classTocExpand' ||
          document.getElementById("idMetaWebpage_path").getAttribute('class') === 'clsTocExpand') {
        oHitp.fToctreeExpandAll('idTocTree');
      }
    }

    if(oHitp.bFirefox) {
      window.onhashchange = function(event) {
        location.href = event.newURL;
      };
    }

    /* focus on right-div, Div can get the focus if it has tabindex attribute... on chrome */
    document.getElementById('idDivSpliterRight').setAttribute('tabindex', -1);
    document.getElementById('idDivSpliterRight').focus();
  };

  document.addEventListener('DOMContentLoaded', function () {
    oHitp.fMakeToc();
  });

  return oHitp;
})();