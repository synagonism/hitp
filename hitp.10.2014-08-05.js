/*
 * version.10.last.minor: hitp.js (2014.08.05.10 minor 2014.08.05.10.1)
 * version.10.last: hitp.2014.08.05.10.js (valuenames)
 * version.9.last: hitp.2014.08.02.9.js (NO jQuery, fixed popup)
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
 * LGPLv3 license
 * Copyright (C) 2010-2014 Kaseluris.Nikos.1959,
 * kaseluris.nikos@gmail.com
 * http://synagonism.net/
 *
 *** DHTMLgoodies ***
 * To create the expandable-toctree I modified code from
 * http://www.dhtmlgoodies.com/
 */

var oHitp = (function () {

  var oHitp = {
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
  oHitp.fSplit = function (oElt) {
    var nPosSplitCurrent = 222, /* setting */
      oEltSpliterDiv = oElt,
      oEltSpliterLeftDiv = oEltSpliterDiv.children[0],
      oEltSpliterRightDiv = oEltSpliterDiv.children[1],
      oEltSpliterBarDiv = document.createElement('div'),
      oEltSpliterBarDivGhost, //we create it at startDraging
      oEltSpliterBarButonDiv = document.createElement('div');

    function fDragPerform(event) {
      var nIncr = event.pageX;

      oEltSpliterBarDivGhost.style.left = nIncr + 'px';
    }

    /* Perform actual splitting */
    function fTocSplit_to(nPos) {
      var nSizeB;

      oHitp.nPosSplitPrevious = nPosSplitCurrent;
      nPosSplitCurrent = nPos;
      nSizeB = oEltSpliterDiv.offsetWidth - nPos - 10 - 10; /* setting splitBar, padding */
      oEltSpliterLeftDiv.style.width = nPos + 'px';
      oEltSpliterBarDiv.style.left = nPos + 'px';
      oEltSpliterRightDiv.style.width = nSizeB + 'px';
      oEltSpliterRightDiv.style.left = nPos + 10 + 'px';
      if (nPos === 0) {
        oEltSpliterBarButonDiv.innerHTML = '<span><br />»</span>';
      } else {
        oEltSpliterBarButonDiv.innerHTML = '<span><br />«</span>';
      }
      oEltSpliterBarDiv.style.background = 'linear-gradient(to left, #aaaaaa, #dddddd 100%)';
      oEltSpliterDiv.style['-khtml-user-select'] = 'all';
      oEltSpliterDiv.style.MozUserSelect = 'text';
      oEltSpliterDiv.style['-webkit-user-select'] = 'all';
    }

    function fDragEnd(event) {
      var nLeft = oEltSpliterBarDivGhost.offsetLeft;

      oEltSpliterBarDivGhost.parentNode.removeChild(oEltSpliterBarDivGhost);
      oEltSpliterBarDivGhost = null;
      document.removeEventListener("mousemove", fDragPerform);
      document.removeEventListener("mouseup", fDragEnd);
      fTocSplit_to(nLeft);
    }

    function fDragStart(evt) {
      oEltSpliterBarDivGhost = document.createElement('div');
      oEltSpliterBarDivGhost.id = 'idSpliterBarDivGhost';
      oEltSpliterBarDivGhost.style.left = oEltSpliterBarDiv.style.left;
      oEltSpliterDiv.insertBefore(oEltSpliterBarDivGhost, oEltSpliterRightDiv);
      oEltSpliterDiv.style['-khtml-user-select'] = 'none';
      oEltSpliterDiv.style['-webkit-user-select'] = 'none';
      oEltSpliterDiv.style.MozUserSelect = 'none';
      document.addEventListener("mousemove", fDragPerform);
      document.addEventListener("mouseup", fDragEnd);
    }

    oEltSpliterDiv.insertBefore(oEltSpliterBarDiv, oEltSpliterRightDiv);
    oEltSpliterBarDiv.id = 'idSpliterBarDiv';
    oEltSpliterBarDiv.style.height = '100%';
    oEltSpliterBarDiv.addEventListener("mousedown", fDragStart);
    oEltSpliterBarDiv.onmouseover = function () {
      oEltSpliterBarDiv.style.background = '#cccccc';
    };
    oEltSpliterBarDiv.onmouseout = function () {
      oEltSpliterBarDiv.style.background = 'linear-gradient(to left, #aaaaaa, #dddddd 100%)';
    };

    oEltSpliterBarButonDiv.id = 'idSpliterBarButonDiv';
    oEltSpliterBarDiv.appendChild(oEltSpliterBarButonDiv);
    oEltSpliterBarButonDiv.addEventListener('mousedown', function (event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      fTocSplit_to((nPosSplitCurrent === 0) ? oHitp.nPosSplitPrevious : 0);
      oEltSpliterLeftDiv.scrollLeft = 0;
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
    sHcnt = sHcnt.replace(/\n {4}<a class="hide" href="#\w*">¶<\/a>/, '');
    sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
    sUl = '<ul><li><a href="#idHeader">' + sHcnt + '</a>';

    for (n = 1; n < aHdng.length; n += 1) {
      oElt = aHdng[n];
      //special footer case;
      if (oElt.nodeName.match(/footer/i)) {
        nLvlThis = 1;
        nLvlToc = 1;
        sUl += '<li><a href="#idFooter">Footer</a></li>';
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
      sHcnt = sHcnt.replace(/\n {4}<a class="hide" href=[^>]+>¶<\/a>/, '');
      sHcnt = sHcnt.replace(/<[^>]+>/g, '');
      /*jslint regexp: false*/
      sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
      sUl += '<li><a href="#' + sHid + '">' + sHcnt + '</a>';
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

  /** Expands, collaples a treenode of the toc and puts the correct icon. */
  oHitp.fToctreeToggleNode = function (event, sIdInput) {
    var oNodeThis, oNodeParent;

    if (sIdInput) {
      if (!document.getElementById(sIdInput)) {
        return;
      }
      oNodeThis = document.getElementById(sIdInput).getElementsByTagName('span')[0];
    } else {
      //this function is also the handler of onclick in toc icons.
      //Then, 'this' is the span element that contains the icons.
      oNodeThis = this;
    }
    oNodeParent = oNodeThis.parentNode;/* ▽△◇,⋁⋀,▼▲◆,∇∆, */
    if (oNodeThis.innerHTML === '▽') {
      oNodeThis.innerHTML = '△';
      oNodeThis.setAttribute('class', 'clsSpanListIcon clsIconCollapse');
      oNodeParent.getElementsByTagName('ul')[0].style.display = 'block';
    } else if (oNodeThis.innerHTML === '△') {
      oNodeThis.innerHTML = '▽';
      oNodeThis.setAttribute('class', 'clsSpanListIcon');
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
      oEltSpan, oToctreeUl;

    oToctreeUl = document.getElementById('idTocTree');
    aToctreeLIs = oToctreeUl.getElementsByTagName('li'); /* Get an array of all menu items */
    for (n = 0; n < aToctreeLIs.length; n += 1) {
      oHitp.nTocIdTreeLi += 1;
      aSubnodes = aToctreeLIs[n].getElementsByTagName('ul');
      oEltSpan = document.createElement('span');
      oEltSpan.innerHTML = '▽';
      oEltSpan.onclick = oHitp.fToctreeToggleNode;
      oEltSpan.setAttribute('class', 'clsSpanListIcon');
      if (aSubnodes.length === 0) {
        oEltSpan.innerHTML = '◇';
        oEltSpan.removeAttribute('class');
        oEltSpan.setAttribute('class', 'clsDiamond');
      }
      aEltA = aToctreeLIs[n].getElementsByTagName('a')[0];
      aToctreeLIs[n].insertBefore(oEltSpan, aEltA);
      if (!aToctreeLIs[n].id) {
        aToctreeLIs[n].id = 'idTocTreeLI' + oHitp.nTocIdTreeLi;
      }
    }
  };

  /** Highlights ONE item in toc-list */
  oHitp.fToctreeHighlightNode = function (oEltSpliterLeftDiv, oElm) {
    /* removes existing highlighting */
    var aToctreeAs = oEltSpliterLeftDiv.getElementsByTagName('a'),
      n;

    for (n = 0; n < aToctreeAs.length; n += 1) {
      aToctreeAs[n].removeAttribute('class');
    }
    oElm.setAttribute('class', 'clsTocTreeHighlight');
  };

  /** Makes the display-style: block. */
  oHitp.fToctreeExpandAll = function (sIdToctree) {
    var aSubnodes, aToctreeLIs = document.getElementById(sIdToctree).getElementsByTagName('li'),
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
  oHitp.fToctreeExpandParent = function (oElt) {
    var oEltSpan, oEltUl;

    /** the parent of a-elm is li-elm with parent a ul-elm. */
    oEltUl = oElt.parentNode.parentNode;
    while (oEltUl.tagName === 'UL') {
      oEltUl.style.display = 'block';
      /* the parent is li-elm, its first-child is img */
      oEltSpan = oEltUl.parentNode.firstChild;
      if (oEltSpan.tagName === 'SPAN' && oEltSpan.innerHTML === '▽') {
        oEltSpan.innerHTML = '△';
        oEltSpan.setAttribute('class', 'clsSpanListIcon clsIconCollapse');
      }
      oEltUl = oEltUl.parentNode.parentNode;
    }
  };

  /** this function puts on the page the toc by splitting it. */
  oHitp.fMakeToc = function () {
    var
      oEltBody = document.body,
      oEltSpliterDiv = document.createElement('div'), /* the general container*/
      oEltSpliterRightDiv = document.createElement('div'),
      oEltSpliterLeftDiv = document.createElement('div'),
      oEltTabNamesUl = document.createElement('ul'),
      oEltTabContentcontainerDiv = document.createElement('div'),
      oEltTab1ContentDiv = document.createElement('div'),
      //oEltTab2ContentDiv = document.createElement('div'),
      oEltTocBtnCollapseall = document.createElement('input'),
      oEltTocBtnExpandall = document.createElement('input'),
      oEltPPath = document.createElement("p"),
      oEltPNote = document.createElement("p"),
      oEltDivPopup = document.createElement('div'),
      oEltDivHitpmenu = document.createElement('div'),
      oXhr = new XMLHttpRequest(),
      sContentOriginal = document.body.innerHTML, sIdTabActive, sPathMenu;

    oHitp.nTocIdTreeLi = 0;
    oEltSpliterDiv.id = 'idSpliterDiv';
    /* remove from old-body its elements */
    oEltBody.innerHTML = '';
    oEltBody.appendChild(oEltSpliterDiv);

    /* set on right-splitter the old-body */
    oEltSpliterRightDiv.id = 'idSpliterRightDiv';
    oEltSpliterRightDiv.innerHTML = sContentOriginal;
    oEltSpliterDiv.appendChild(oEltSpliterRightDiv);

    /* insert toc */
    oEltSpliterLeftDiv.id = 'idSpliterLeftDiv';

    /* insert content on tab1 */
    oEltTab1ContentDiv.id = 'idTab1ContentDiv';
    oEltTab1ContentDiv.setAttribute('class', 'clsTabContent');
    oEltTab1ContentDiv.innerHTML = oHitp.fCreateUl_with_headings();
    oEltTab1ContentDiv.getElementsByTagName("ul")[0].setAttribute('id', 'idTocTree');
    /* insert collaplse-button */
    oEltTocBtnCollapseall.setAttribute('id', 'idBtnCollapse_All');
    oEltTocBtnCollapseall.setAttribute('type', 'button');
    oEltTocBtnCollapseall.setAttribute('value', '△');
    oEltTocBtnCollapseall.setAttribute('title', 'Collapse-All');
    oEltTocBtnCollapseall.setAttribute('class', 'clsBtn');
    oEltTocBtnCollapseall.onclick = function (event) {
      oHitp.fToctreeCollapseAll('idTocTree');
    };
    oEltTab1ContentDiv.insertBefore(oEltTocBtnCollapseall, oEltTab1ContentDiv.firstChild);
    /* insert expand-button */
    oEltTocBtnExpandall.setAttribute('id', 'idBtnExp_All');
    oEltTocBtnExpandall.setAttribute('type', 'button');
    oEltTocBtnExpandall.setAttribute('value', '▽');
    oEltTocBtnExpandall.setAttribute('title', 'Expand-All');
    oEltTocBtnExpandall.setAttribute('class', 'clsBtn');
    oEltTocBtnExpandall.onclick = function (event) {
      oHitp.fToctreeExpandAll('idTocTree');
    };
    oEltTab1ContentDiv.insertBefore(oEltTocBtnExpandall, oEltTab1ContentDiv.firstChild);
    /* toc: add note at the end */
    oEltPNote.innerHTML = '<span class="color-green style-b">Notes</span>: <br/>a) Clicking on ¶ or on ToC, you see the address of that text on address-bar. <br/>b) hovering a piece of text, you see its position on ToC. <br/>c) hovering a domain-link you see a preview.';
    oEltTab1ContentDiv.appendChild(oEltPNote);

    /* inset tab1 on tabcontainer */
    oEltTabContentcontainerDiv.id = 'idTabContentcontainerDiv';

    oEltTabContentcontainerDiv.appendChild(oEltTab1ContentDiv);
    //oEltTab2ContentDiv.id = 'idTab2ContentDiv';
    //oEltTab2ContentDiv.setAttribute('class', 'clsTabContent');
    //oEltTabContentcontainerDiv.appendChild(oEltTab2ContentDiv);

    /* insert tabcontainer on spliterLeft */
    oEltSpliterLeftDiv.appendChild(oEltTabContentcontainerDiv);

    /* insert tabnames */
    oEltTabNamesUl.id = 'idTabNamesUl';
    oEltTabNamesUl.innerHTML = '<li class="clsTabActive"><a href="#idTab1contentDiv">Page-structure</a></li>';
      //<li><a href="#idTab2contentDiv">Search</a></li>'
    oEltSpliterLeftDiv.insertBefore(oEltTabNamesUl, oEltSpliterLeftDiv.firstChild);

    /* insert page-path--element */
    oEltPPath.id = 'idPpath';
    oEltPPath.setAttribute('title', "© 2010-2014 Kaseluris.Nikos.1959");
    if (!document.getElementById("idMetaWebpage_path")) {
      oEltPPath.innerHTML = 'ToC: ' + document.title;
    } else {
      oEltPPath.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    oEltSpliterLeftDiv.insertBefore(oEltPPath, oEltSpliterLeftDiv.firstChild);

    /* insert site-structure menu */
    if (location.hostname !== '') {
      oEltDivHitpmenu.id = 'idHitpmenu';
      if (location.hostname === 'localhost') {
        sPathMenu = oHitp.sPathMenuLocal;
      } else {
        sPathMenu = oHitp.sPathMenuOnline;
      }
      oXhr.open('GET', location.origin + sPathMenu, false);
      oXhr.send(null);
      if (oXhr.status === 200) {
        oEltDivHitpmenu.innerHTML = oXhr.responseText;
        oEltSpliterLeftDiv.insertBefore(oEltDivHitpmenu, oEltSpliterLeftDiv.firstChild);
        oEltDivHitpmenu.onmouseover = function () {
          oHitp.nPosSplitPrevious = oEltSpliterLeftDiv.offsetWidth;
          oEltSpliterLeftDiv.style.width = window.innerWidth + 'px';
        };
        oEltDivHitpmenu.onmouseout = function () {
          oEltSpliterLeftDiv.style.width = oHitp.nPosSplitPrevious + 'px';
        };
      }
    }

    /* clicking on a content-link first go to its location, this way the backbutton goes where we clicked. */
    [].slice.call(document.querySelectorAll('#idSpliterRightDiv a')).forEach(function (oElt, nIndex, array) {
      oElt.onclick = function (event) {
        var sID,
          oEltSec = oElt;

        while (!oEltSec.tagName.match(/^SECTION/i)) {
          sID = oEltSec.id;
          if (sID) {
            break;
          } else {
            oEltSec = oEltSec.parentNode;
          }
        }
        sID = '#' + sID;
        if (location.href.substring(location.href.indexOf('#')) !== sID) {
          location.href = sID;
        }
      };
    });

    /* on content get-id */
    [].slice.call(document.querySelectorAll('*[id]')).forEach(function (oElt, nIndex, array) {
      oElt.onmouseover = function (event) {
        var sID = '',
          oEltSec = oElt;
        if (event.stopPropagation) {
          event.stopPropagation();
        } else {
          event.cancelBubble = true;
        }

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

        [].slice.call(document.querySelectorAll('#idSpliterLeftDiv a')).forEach(function (oElt, nIndex, array) {
          if (oElt.getAttribute('href') === sID) {
            oHitp.fToctreeCollapseAll('idTocTree');
            oHitp.fToctreeHighlightNode(oEltSpliterLeftDiv, oElt);
            oHitp.fToctreeExpandParent(oElt);
            if (oElt.scrollIntoViewIfNeeded) {
              oElt.scrollIntoViewIfNeeded();
            } else {
              oElt.scrollIntoView();
            }
            document.getElementById("idSpliterLeftDiv").scrollLeft = 0;
          }
        });
      };
    });

    /* On TABS Click Event */
    [].slice.call(document.querySelectorAll('ul#idTabNamesUl li')).forEach(function (oElt, nIndex, array) {
      oElt.onclick = function () {
        //Remove any "active" class
        document.querySelector('.clsTabActive').classList.remove('clsTabActive');
        //Add "active" class to selected tab
        oElt.classList.add('clsTabActive');
        //Hide all tab content
        [].slice.call(document.getElementsByClassName('clsTabContent')).forEach(function (oElt, nIndex, array) {
          oElt.style.display = 'none';
        });
        //Show content of active tab
        sIdTabActive = document.querySelector('.clsTabActive a').getAttribute('href').substring(1);
        document.getElementById(sIdTabActive).style.display = 'block';
        return false;
      };
    });

    /* insert spliterLeft */
    oEltSpliterDiv.insertBefore(oEltSpliterLeftDiv, oEltSpliterDiv.firstChild);

    oHitp.fSplit(oEltSpliterDiv);

    /* on links with class popupTrigger add this function
     * first insert popup container */
    oEltDivPopup.id = 'idPopup';
    document.body.appendChild(oEltDivPopup);
    [].slice.call(document.querySelectorAll('a.popupTrigger')).forEach(function (oElt, nIndex, array) {
      oElt.onmouseover = function (event) {
        var sLoc, sId1, sId2,
          nPy, nPx, nWh, nWw,
          oDoc;

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
          oXhr = new XMLHttpRequest();
          oXhr.open('GET', sId1, false);
          oXhr.send(null);
          if (oXhr.status === 200) {
            if (sId2) {
              //IF #fragment url, display only this element.
              oDoc = (new DOMParser()).parseFromString(oXhr.responseText, 'text/html');
              oEltDivPopup.innerHTML = '<section>' + oDoc.getElementById(sId2).innerHTML + '</section>';
            } else {
              //IF link to a picture, display it, not its code.
              if (sId1.match(/(png|jpg|gif)$/)) {
                oEltDivPopup.innerHTML = '<img src="' + sId1 + '" />';
              } else {
                document.getElementById('idPopup').innerHTML = oXhr.responseText;
              }
            }
          }
        }
        nPx = event.pageX;
        nPy = event.pageY;
        nWh = window.innerHeight;
        nWw = window.innerWidth;
        oEltDivPopup.style.top = (nWh / 2) - (nWh * 0.44 / 2)  + 'px'; //the height of popup is 44% of window
        if (nPx < nWw / 2) {
          oEltDivPopup.style.left = (nWw / 2) + 9 + 'px';
        } else {
          oEltDivPopup.style.left = 26 + 'px';
        }
        oEltDivPopup.style.overflow = 'auto';
        oEltDivPopup.style.display = 'block';
      };
      oElt.onmouseout = function () {
        oEltDivPopup.style.display = 'none';
      };
      //IF you prefer to close popup with click, instead of mouseout
      //oElt.onclick = function () {
        //oEltDivPopup.style.display = 'none';
      //};
    });

    /* tree initialization */
    oHitp.fToctreeInit();

    /* what to do on clicking a link in toc */
    [].slice.call(document.querySelectorAll("#idTocTree li > a")).forEach(function (oElt, nIndex, array) {
      oElt.onclick = function (event) {
        event.preventDefault();
        location.href = '#' + event.target.href.split('#')[1];
        oHitp.fToctreeHighlightNode(oEltSpliterLeftDiv, oElt);
        return false;
      };
      /* sets as title-attribute the text of a-element */
      oElt.title = oElt.textContent.replace(/\n/, ' ');
    });

    oHitp.fToctreeExpandAll('idTocTree');
    oHitp.fToctreeCollapseAll('idTocTree');
    oHitp.fToctreeExpandFirst('idTocTree');
    /* IF on idMetaWebpage_path paragraph we have and the classTocExpand
     * then the toc expands-all */
    if (document.getElementById("idMetaWebpage_path")) {
      if (document.getElementById("idMetaWebpage_path").getAttribute('class') === 'classTocExpand') {
        oHitp.fToctreeExpandAll('idTocTree');
      }
    }

    /* focus on right-div, Div can get the focus if it has tabindex attribute... on chrome */
    document.getElementById('idSpliterRightDiv').setAttribute('tabindex', -1);
    document.getElementById('idSpliterRightDiv').focus();
  };

  document.addEventListener('DOMContentLoaded', function () {
    oHitp.fMakeToc();
  });

  return oHitp;
})();