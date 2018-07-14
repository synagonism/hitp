/*
 * version.7.last.minor: hitp.js (2013.11.06.7 minor 2013.11.06.7)
 * version.7.last: hitp.2013.11.06.7.js (tabs)
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
 * Copyright (C) 2010-2013 Kaseluris.Nikos.1959,
 * kaseluris.nikos@gmail.com
 * synagonism.net/
 *
 *** DHTMLgoodies ***
 * To create the expandable-tree I modified code from
 * http://www.dhtmlgoodies.com/
 */

/*global $, jQuery*/
var oHitp = {
  /** toc-tree variables */
  nTocIdTreeLi: 0,
  nPosSplitPrevious: 0,

  /** splitter related code */
  fcnSplit: function (elm) {
    var nPosSplitCurrent = 222, /* setting */
      eltSpliterDiv = elm,
      eltSpliterChildren = eltSpliterDiv.children(),
      eltSpliterLeftDiv = eltSpliterChildren.first(),
      eltSpliterRightDiv = eltSpliterChildren.next(),
      eltSpliterBarDiv = $('<div></div>'),
      eltSpliterBarDivGhost,
      eltSpliterBarButonDiv = $('<div></div>');

    function fcnDragPerform(evt) {
      var nIncr = evt.pageX;
      eltSpliterBarDivGhost.css('left', nIncr);
    }

    /* Perform actual splitting and animate it */
    function fcnTocSplit_to(nPos) {
      nPos = parseInt(nPos, null);
      oHitp.nPosSplitPrevious = nPosSplitCurrent;
      nPosSplitCurrent = nPos;

      var sizeB = eltSpliterDiv.width() - nPos - 10 - 10; /* setting splitBar, padding */
      eltSpliterLeftDiv.css({'width': nPos + 'px'});
      eltSpliterBarDiv.css({'left': nPos + 'px'});
      eltSpliterRightDiv.css({
        'width': sizeB + 'px',
        'left': nPos + 10 + 'px'
      });

      eltSpliterDiv.queue(function () {
        setTimeout(function () {
          eltSpliterDiv.dequeue();
          eltSpliterChildren.trigger('resize');
        }, 22);
      });
    }

    function fcnDragEnd() {
      var p = eltSpliterBarDivGhost.position();
      eltSpliterBarDivGhost.remove();
      eltSpliterBarDivGhost = null;
      eltSpliterChildren.css({
        '-moz-user-select': 'text',
        '-webkit-user-select': 'text'
      });
      $(document).unbind("mousemove", fcnDragPerform)
        .unbind("mouseup", fcnDragEnd);
      fcnTocSplit_to(p.left);
    }

    function fcnDragStart(evt) {
      eltSpliterBarDivGhost = eltSpliterBarDiv.clone(false)
        .insertAfter(eltSpliterLeftDiv);
      eltSpliterBarDivGhost.attr({'id': 'idSpliterBarDivGhost'})
        .css({
          'left': eltSpliterBarDiv.position().left,
        });
      eltSpliterChildren.css({
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-webkit-user-select': 'none'
      });
      $(document).bind("mousemove", fcnDragPerform).bind("mouseup", fcnDragEnd);
    }

    eltSpliterBarDiv.attr({'id': 'idSpliterBarDiv'})
      .css({
        'height': '100%',
      })
      .bind("mousedown", fcnDragStart)
      .hover(
        function () {
          $(this).css({'background': '#cccccc'});
        },
        function () {
          $(this).css({'background': 'linear-gradient(to left, #aaaaaa, #dddddd 100%)'});
        }
      );
    eltSpliterBarDiv.insertAfter(eltSpliterLeftDiv);
    eltSpliterBarButonDiv.attr({'id': 'idSpliterBarButonDiv'});
    eltSpliterBarDiv.append(eltSpliterBarButonDiv);
    eltSpliterBarButonDiv.mousedown(function (evt) {
      fcnTocSplit_to((nPosSplitCurrent === 0) ? oHitp.nPosSplitPrevious : 0);
      return false;
    });
    fcnTocSplit_to(nPosSplitCurrent);
    //needed for proper zoom
    window.addEventListener("resize", function () {
      fcnTocSplit_to(nPosSplitCurrent);
    });
  },

  /** 2013.07.17
   * Returns an html-ul-element that holds the outline.
   * <ul>
   *   <li id="idTocTreeLI1">
   *   ...
   *   </li>
   * </ul>
   */
  fcnCreate_ul_with_headings: function () {
    var arElm = document.body.getElementsByTagName('*'),
      arHdng = [],
      rxH = /h\d/i,
      nLvlThis,
      nLvlNext,
      nLvlPrev = 0,
      nLvlToc = 0,
      nI,
      nJ,
      sUl = '',
      sHcnt,
      sHid,
      sHlvl,
      elm;

    for (nI = 0; nI < arElm.length; nI += 1) {
      elm = arElm[nI];
      if (rxH.test(elm.nodeName)) {
        arHdng.push(elm);
      }
      //and and the 'footer' element
      if (elm.nodeName.match(/footer/i)) {
        arHdng.push(elm);
      }
    }
    arElm = [];

    //the first heading is the title of doc
    sHcnt = arHdng[0].innerHTML;
    sHcnt = sHcnt.replace(/\n {4}<a class="hide" href="#\w*">¶<\/a>/, '');
    sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
    sUl = '<ul><li class="clsLvl0"><a href="#idHeader">' + sHcnt + '</a>';

    for (nI = 1; nI < arHdng.length; nI += 1) {
      elm = arHdng[nI];
      //special footer case;
      if (elm.nodeName.match(/footer/i)) {
        nLvlThis = 1;
        nLvlToc = 1;
        sUl += '<li class="clsLvl1"><a href="#idFooter">Footer</a></li>';
        nLvlPrev = 1;
        continue;
      }
      nLvlThis = elm.nodeName.substr(1, 1);
      if (nLvlThis > nLvlPrev) {
        sUl += '<ul>'; //new list
        nLvlToc = 1 + parseInt(nLvlToc, 10);
      }
      sHid = elm.id;
      sHlvl = sHid.charAt(sHid.length - 1);
      sHid = sHid.replace(/(\w*)H\d/, '$1');
      /* removes from heading the "classHide" content */
      sHcnt = elm.innerHTML;
      /*jslint regexp: true*/
      sHcnt = sHcnt.replace(/\n {4}<a class="hide" href=[^>]+>¶<\/a>/, '');
      sHcnt = sHcnt.replace(/<[^>]+>/g, '');
      /*jslint regexp: false*/
      sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
      sUl += '<li class="clsLvl' + sHlvl + '"><a href="#' + sHid + '">' + sHcnt + '</a>';
      if (arHdng[nI + 1]) {
        nLvlNext = arHdng[nI + 1].nodeName.substr(1, 1);
        if (arHdng[nI + 1].nodeName.match(/footer/i)) {
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
  },

  /** Modified from http://www.dhtmlgoodies.com/ */
  fcnTreeShow_hide_node: function (e, inputId) {
    var nodeThis, nodeParent;
    if (inputId) {
      if (!document.getElementById(inputId)) {
        return;
      }
      nodeThis = document.getElementById(inputId).getElementsByTagName('span')[0];
    } else {
      nodeThis = this;
      if (this.tagName === 'a') {
        nodeThis = this.parentNode.getElementsByTagName('span')[0];
      }
    }
    nodeParent = nodeThis.parentNode;/* ▽△◇,⋁⋀,▼▲◆,∇∆, */
    if (nodeThis.innerHTML === '▽') {
      nodeThis.innerHTML = '△';
      nodeThis.setAttribute('class', 'clsSpanListIcon clsIconCollapse');
      nodeParent.getElementsByTagName('ul')[0].style.display = 'block';
    } else if (nodeThis.innerHTML === '△') {
      nodeThis.innerHTML = '▽';
      nodeThis.setAttribute('class', 'clsSpanListIcon');
      nodeParent.getElementsByTagName('ul')[0].style.display = 'none';
    }
    return false;
  },

  /** Makes the display-style: none.
   * Modified from http://www.dhtmlgoodies.com/ */
  fcnTreeCollapse_all: function (idTree) {
    var tocTreeLIs = document.getElementById(idTree).getElementsByTagName('li'),
      nI,
      subItems;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      if (subItems.length > 0 && subItems[0].style.display === 'block') {
        oHitp.fcnTreeShow_hide_node(false, tocTreeLIs[nI].id);
      }
    }
  },

  /** Inserts images with onclick events, before a-elements.
   * Sets id on li-elements.
   * Modified from http://www.dhtmlgoodies.com/ */
  fcnTreeInit: function () {
    var tocTree = document.getElementById('idTocTree'),
      tocTreeLIs = tocTree.getElementsByTagName('li'), /* Get an array of all menu items */
      nI,
      subItems,
      eltSpan,
      aTag;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      oHitp.nTocIdTreeLi += 1;
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      eltSpan = document.createElement('span');
      eltSpan.innerHTML = '▽';
      eltSpan.onclick = oHitp.fcnTreeShow_hide_node;
      eltSpan.setAttribute('class', 'clsSpanListIcon');
      if (subItems.length === 0) {
        eltSpan.innerHTML = '◇';
        eltSpan.removeAttribute('class');
        eltSpan.setAttribute('class', 'clsDiamond');
      }
      aTag = tocTreeLIs[nI].getElementsByTagName('a')[0];
      tocTreeLIs[nI].insertBefore(eltSpan, aTag);
      if (!tocTreeLIs[nI].id) {
        tocTreeLIs[nI].id = 'idTocTreeLI' + oHitp.nTocIdTreeLi;
      }
    }
  },

  /** Highlights ONE item in toc-list */
  fcnTreeHighlight_item: function (eltSpliterLeftDiv, elm) {
    /* removes existing highlighting */
    var tocTreeAs = eltSpliterLeftDiv.getElementsByTagName('a'),
      nI;
    for (nI = 0; nI < tocTreeAs.length; nI += 1) {
      tocTreeAs[nI].removeAttribute('class');
    }
    elm.setAttribute('class', 'clsTocTreeHighlight');
  },

  /** Goes to Id, and blinks it. From HTML5-Outliner */
  fcnTreeGoto_id: function (id) {
    var el, currentOpacity, currentTransition, duration, itr, blink;
    location.href = '#' + id;
    el = document.getElementById(id);
    currentOpacity = window.getComputedStyle(el).opacity;
    currentTransition = window.getComputedStyle(el).webkitTransition;
    duration = 200;
    itr = 0;
    el.style.webkitTransitionProperty = 'opacity';
    el.style.webkitTransitionDuration = duration + "ms";
    el.style.webkitTransitionTimingFunction = 'ease';
    blink = function () {
      el.style.opacity = (itr % 2 === 0 ? 0 : currentOpacity);
      if (itr < 3) {
        itr += 1;
        setTimeout(blink, duration);
      } else {
        el.style.webkitTransition = currentTransition;
      }
    };
    blink();
  },

  /** Makes the display-style: block.
   * Modified from http://www.dhtmlgoodies.com/ */
  fcnTreeExpand_all: function (idTree) {
    var tocTreeLIs = document.getElementById(idTree).getElementsByTagName('li'),
      nI,
      subItems;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      if (subItems.length > 0 && subItems[0].style.display !== 'block') {
        oHitp.fcnTreeShow_hide_node(false, tocTreeLIs[nI].id);
      }
    }
  },

  /** Expands the first children. */
  fcnTreeExpand_first: function (idTree) {
    var tocTreeLIs, subItems;
    tocTreeLIs = document.getElementById(idTree).getElementsByTagName('li');
    /* expand the first ul-element */
    subItems = tocTreeLIs[0].getElementsByTagName('ul');
    if (subItems.length > 0 && subItems[0].style.display !== 'block') {
      oHitp.fcnTreeShow_hide_node(false, tocTreeLIs[0].id);
    }
  },

  /** expands all the parents only, of an element */
  fcnTreeExpand_parent: function (elm) {
    var eltSpan, eltUl;
    /** the parent of a-elm is li-elm with parent a ul-elm. */
    eltUl = elm.parentNode.parentNode;
    while (eltUl.tagName === 'UL') {
      eltUl.style.display = 'block';
      /* the parent is li-elm, its first-child is img */
      eltSpan = eltUl.parentNode.firstChild;
      if (eltSpan.tagName === 'SPAN' && eltSpan.innerHTML === '▽') {
        eltSpan.innerHTML = '△';
        eltSpan.setAttribute('class', 'clsSpanListIcon clsIconCollapse');
      }
      eltUl = eltUl.parentNode.parentNode;
    }
  },

  /** this function puts on the page the toc by splitting it. */
  fctMake_toc: function () {
    /* create toc */
    var contentOriginal = document.body.innerHTML,
      eltBody = document.body,
      eltSpliterDiv = document.createElement('div'), /* the general container*/
      eltSpliterRightDiv = document.createElement('div'),
      eltSpliterLeftDiv = document.createElement('div'),
      eltTabNamesUl = document.createElement('ul'),
      eltTabContentcontainerDiv = document.createElement('div'),
      eltTab1ContentDiv = document.createElement('div'),
//      eltTab2ContentDiv = document.createElement('div'),
      eltTocBtnCollapse_all = document.createElement('input'),
      eltTocBtnExpand_all = document.createElement('input'),
      eltPpath = document.createElement("p"),
      eltPNote = document.createElement("p"),
      eltPopupcontainer = document.createElement('div'),
      eltHitpmenu = document.createElement('div'),
      jqrSelectorId,
      xhrequest = new XMLHttpRequest();

    oHitp.nTocIdTreeLi = 0;
    eltSpliterDiv.id = 'idSpliterDiv';
    /* remove from old-body its elements */
    eltBody.innerHTML = '';
    eltBody.appendChild(eltSpliterDiv);

    /* set on right-splitter the old-body */
    eltSpliterRightDiv.id = 'idSpliterRightDiv';
    eltSpliterRightDiv.innerHTML = contentOriginal;
    eltSpliterDiv.appendChild(eltSpliterRightDiv);

    /* insert toc */
    eltSpliterLeftDiv.id = 'idSpliterLeftDiv';

    /* insert content on tab1 */
    eltTab1ContentDiv.id = 'idTab1ContentDiv';
    eltTab1ContentDiv.setAttribute('class', 'clsTabContent');
    eltTab1ContentDiv.innerHTML = oHitp.fcnCreate_ul_with_headings();
    eltTab1ContentDiv.getElementsByTagName("ul")[0].setAttribute('id', 'idTocTree');
    /* insert collaplse-button */
    eltTocBtnCollapse_all.setAttribute('id', 'idBtnCollapse_All');
    eltTocBtnCollapse_all.setAttribute('type', 'button');
    eltTocBtnCollapse_all.setAttribute('value', '△');
    eltTocBtnCollapse_all.setAttribute('title', 'Collapse-All');
    eltTocBtnCollapse_all.setAttribute('class', 'clsBtn');
    $(eltTocBtnCollapse_all).click(
      function (event) {
        oHitp.fcnTreeCollapse_all('idTocTree');
      }
    );
    eltTab1ContentDiv.insertBefore(eltTocBtnCollapse_all, eltTab1ContentDiv.firstChild);
    /* insert expand-button */
    eltTocBtnExpand_all.setAttribute('id', 'idBtnExp_All');
    eltTocBtnExpand_all.setAttribute('type', 'button');
    eltTocBtnExpand_all.setAttribute('value', '▽');
    eltTocBtnExpand_all.setAttribute('title', 'Expand-All');
    eltTocBtnExpand_all.setAttribute('class', 'clsBtn');
    $(eltTocBtnExpand_all).click(
      function (event) {
        oHitp.fcnTreeExpand_all('idTocTree');
      }
    );
    eltTab1ContentDiv.insertBefore(eltTocBtnExpand_all, eltTab1ContentDiv.firstChild);
    /* toc: add note at the end */
    eltPNote.innerHTML = '<span class="color-green style-b">Notes</span>: <br/>a) Clicking on TEXT, you see its position on ToC and its address on address-bar. <br/>b) hovering a domain-link you see a preview.';
    eltTab1ContentDiv.appendChild(eltPNote);

    /* inset tab1 on tabcontainer */
    eltTabContentcontainerDiv.id = 'idTabContentcontainerDiv';

    eltTabContentcontainerDiv.appendChild(eltTab1ContentDiv);
//    eltTab2ContentDiv.id = 'idTab2ContentDiv';
//    eltTab2ContentDiv.setAttribute('class', 'clsTabContent');
//    eltTabContentcontainerDiv.appendChild(eltTab2ContentDiv);

    /* insert tabcontainer on spliterLeft */
    eltSpliterLeftDiv.appendChild(eltTabContentcontainerDiv);

    /* insert tabnames */
    eltTabNamesUl.id = 'idTabNamesUl';
    eltTabNamesUl.innerHTML = '<li class="clsTabActive"><a href="#idTab1contentDiv">Page-structure</a></li>';//<li><a href="#idTab2contentDiv">Search</a></li>'
    eltSpliterLeftDiv.insertBefore(eltTabNamesUl, eltSpliterLeftDiv.firstChild);

    /* insert page-path--element */
    eltPpath.id = 'idPpath';
    eltPpath.setAttribute('title', "© 2010-2013 Kaseluris.Nikos.1959");
    if (!document.getElementById("idMetaWebpage_path")) {
      eltPpath.innerHTML = 'ToC: ' + document.title;
    } else {
      eltPpath.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    eltSpliterLeftDiv.insertBefore(eltPpath, eltSpliterLeftDiv.firstChild);

    /* insert site-structure menu */
    if (location.hostname !== '') {
      eltHitpmenu.id = 'idHitpmenu';
      xhrequest.open('GET', 'http://' + location.hostname + '/hitpmenu.html', false);
//      xhrequest.setRequestHeader('User-Agent', navigator.userAgent);
      xhrequest.send(null);
      if (xhrequest.status === 200) {
        eltHitpmenu.innerHTML = xhrequest.responseText;
        if (eltHitpmenu.innerHTML !== '') {
          eltSpliterLeftDiv.insertBefore(eltHitpmenu, eltSpliterLeftDiv.firstChild);
        }
        $(eltHitpmenu).hover(
          function () {
            oHitp.nPosSplitPrevious = $(eltSpliterLeftDiv).width();
            $(eltSpliterLeftDiv).css({
              'width': $(window).width() + 'px'
            });
          },
          function () {
            $(eltSpliterLeftDiv).css({
              'width': oHitp.nPosSplitPrevious + 'px'
            });
          }
        );
      }
    }

    $(eltSpliterLeftDiv).find("#idTocTree li > a").each(
      /* what to do on clicking a link in toc */
      function () {
        $(this).click(
          function (event) {
            event.preventDefault();
            var id = $(event.target).attr("href").split('#')[1];
            oHitp.fcnTreeGoto_id(id);
            oHitp.fcnTreeHighlight_item(eltSpliterLeftDiv, this);
            return false;
          }
        );
        /* sets as title-attribute the text of a-element */
        var txt = $(this).text();
        $(this).attr('title', txt);
      }
    );

    /* on content get-id */
    $(eltSpliterRightDiv).find("*[id]").each(
      function () {
        $(this).click(
          function (event) {
            if (event.stopPropagation) {
              event.stopPropagation();
            } else {
              event.cancelBubble = true;
            }

            /* find the id of closest header */
            var sID = false,
              eltSec = $(this);
            /* first go where you click */
            sID = '#' + eltSec.attr('id');
            if (location.href.substring(location.href.indexOf('#')) !== sID) {
              location.href = sID;
            }

            /* find section's id */
            while (!eltSec.get(0).tagName.match(/^SECTION/i)) {
              eltSec = eltSec.parent();
              if (eltSec.get(0).tagName.match(/^HEADER/i)) {
                break;
              }
              if (eltSec.get(0).tagName.match(/^FOOTER/i)) {
                break;
              }
            }
            if (eltSec.get(0).tagName.match(/^HEADER/i)) {
              sID = '#idHeader';
            } else if (eltSec.get(0).tagName.match(/^FOOTER/i)) {
              sID = '#idFooter';
            } else {
              sID = '#' + eltSec.attr('id');
            }

            $(eltSpliterLeftDiv).find("a").each(
              function () {
                var position, windowHeight;
                if ($(this).attr('href') === sID) {
                  oHitp.fcnTreeCollapse_all('idTocTree');
                  oHitp.fcnTreeHighlight_item(eltSpliterLeftDiv, this);
                  oHitp.fcnTreeExpand_parent(this);
                  /* scroll to this element */
                  $(eltSpliterLeftDiv).scrollTop(0);
                  position = $(this).offset().top;
                  windowHeight = $(window).height();
                  $(eltSpliterLeftDiv).scrollTop(position - (windowHeight / 2));
                }
              }
            );
          }
        );
      }
    );

    /* tabs action Default */
    $(".clsTabContent").hide(); //Hide all content
    $("ul#idTabNamesUl li:first").addClass("clsTabActive").show(); //Activate first tab
    jqrSelectorId = $(".clsTabActive").find("a").attr("href");
    $(jqrSelectorId).show(); //Show first tab content
    /* On Click Event */
    $("ul#idTabNamesUl li").click(function() {
      $("ul#idTabNamesUl li").removeClass("clsTabActive"); //Remove any "active" class
      $(this).addClass("clsTabActive"); //Add "active" class to selected tab
      $(".clsTabContent").hide(); //Hide all tab content
      jqrSelectorId = $(".clsTabActive").find("a").attr("href");
      $(jqrSelectorId).show(); //Show content of active tab
      return false;
    });

    /* insert spliterLeft */
    eltSpliterDiv.insertBefore(eltSpliterLeftDiv, eltSpliterDiv.firstChild);

    oHitp.fcnSplit($("#idSpliterDiv"));

    /* on links with class popupTrigger add this function
     * first insert popup container */
    eltPopupcontainer.id = 'idPopup';
    eltSpliterRightDiv.appendChild(eltPopupcontainer);
    $('a.popupTrigger').mouseover(function (event) {
      var sLoc, sId1, sId2, sPopup, xmlhttp, pv;
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
        sPopup = document.getElementById(sId2).innerHTML;
        /* substring popup-content if it is big text */
        /*jslint regexp: true*/
        if (sPopup.replace(/<[^>]*>?/g, '').length > 901) {
          sPopup = sPopup.substring(0, 901);
          sPopup = sPopup + '   ... ... ... ... ... ...   ';
        }
        /*jslint regexp: false*/
        $('#idPopup').html(sPopup);
      } else {
        $('#idPopup').html("");
        $('#idPopup').load(sId1 + ' #' + sId2);
      }
      pv = event.pageY;
      if (pv > $(window).height() * 4.5 / 7) {
        pv = $(window).height() / 9;
      } else {
        pv = pv + 26;
      }
      $('#idPopup').css({
        'top': pv + 'px',
        'left': $(window).width() / 2.5 + 'px'
      });
      $('#idPopup').show().appendTo('body');
      /* code for click on popup */
  //  });
  //  $('#idPopup').click(function () {
  //    $('#idPopup').hide();
  //  });
    /* next line if you prefer hide popup with finishing hovering */
    }).mouseout(function () {
      $('#idPopup').hide();
    });

    /* tree initialization */
    oHitp.fcnTreeInit();
    oHitp.fcnTreeExpand_all('idTocTree');
    oHitp.fcnTreeCollapse_all('idTocTree');
    oHitp.fcnTreeExpand_first('idTocTree');
    /* IF on idMetaWebpage_path paragraph we have and the classTocExpand
     * then the toc expands-all */
    if (document.getElementById("idMetaWebpage_path")) {
      if (document.getElementById("idMetaWebpage_path").getAttribute('class') === 'classTocExpand') {
        oHitp.fcnTreeExpand_all('idTocTree');
      }
    }

    /* focus on right-div */
    $("#idSpliterRightDiv").attr("tabindex", -1).focus();
  }
};

$(document).ready(function () {
  oHitp.fctMake_toc();
});
