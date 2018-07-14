/*
 * version.6.last.minor: hitp.js (2013.08.21.6 minor 2013.08.21.6)
 * version.6.last: hitp.2013.08.21.6.js (site-structure)
 * version.previous: hitp.2013.07.15.js (toc-ul-specific, HITP-obj)
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
var HITP = {
  /** toc-tree variables */
  ptTocNoIdTreeLi: 0,
  posSplitPrevious: 0,

  /** splitter related code */
  mdSplit: function (elm) {
    return elm.each(function (e) {
      var posSplitCurrent = 222, /* setting */
        eltSpliterDiv = $(this),
        eltSpliterChildren = eltSpliterDiv.children(),
        eltSpliterLeftDiv = eltSpliterChildren.first(),
        eltSpliterRightDiv = eltSpliterChildren.next(),
        eltSpliterBarDiv = $('<div></div>'),
        eltSpliterBarDivGhost,
        eltSpliterBarButonDiv = $('<div></div>');

      function fcnDragPerform(e) {
        var incr = e.pageX;
        eltSpliterBarDivGhost.css('left', incr);
      }

      /* Perform actual splitting and animate it */
      function fcnTocSplit_to(pos) {
        pos = parseInt(pos, null);
        HITP.posSplitPrevious = posSplitCurrent;
        posSplitCurrent = pos;

        var sizeB = eltSpliterDiv.width() - pos - 10 - 10; /* setting splitBar, padding */
        eltSpliterLeftDiv.css({'width': pos + 'px'});
        eltSpliterBarDiv.css({'left': pos + 'px'});
        eltSpliterRightDiv.css({
          'width': sizeB + 'px',
          'left': pos + 10 + 'px'
        });

        eltSpliterDiv.queue(function () {
          setTimeout(function () {
            eltSpliterDiv.dequeue();
            eltSpliterChildren.trigger('resize');
          }, 22);
        });
      }

      function fcnDragEnd(e) {
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

      function fcnDragStart(e) {
        if (e.target !== this) {
          return;
        }
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
      eltSpliterBarButonDiv.mousedown(function (e) {
        if (e.target !== this) {
          return;
        }
        fcnTocSplit_to((posSplitCurrent === 0) ? HITP.posSplitPrevious : 0);
        return false;
      });
      fcnTocSplit_to(posSplitCurrent);
      //needed for proper zoom
      $(window).bind("resize", function () {
        fcnTocSplit_to(posSplitCurrent);
      });
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
  mdCreate_ul_with_headings: function () {
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
  mdTreeShow_hide_node: function (e, inputId) {
    var nodeThis, parentNode;
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
    parentNode = nodeThis.parentNode;/* ▶►▷⊳ ▾▼▽∇ ◇◊*/
    if (nodeThis.innerHTML === '▶') {
      nodeThis.innerHTML = '∇';
      parentNode.getElementsByTagName('ul')[0].style.display = 'block';
    } else if (nodeThis.innerHTML === '∇') {
      nodeThis.innerHTML = '▶';
      parentNode.getElementsByTagName('ul')[0].style.display = 'none';
    }
    return false;
  },

  /** Makes the display-style: none.
   * Modified from http://www.dhtmlgoodies.com/ */
  mdTreeCollapseAll: function (idTree) {
    var tocTreeLIs = document.getElementById(idTree).getElementsByTagName('li'),
      nI,
      subItems;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      if (subItems.length > 0 && subItems[0].style.display === 'block') {
        HITP.mdTreeShow_hide_node(false, tocTreeLIs[nI].id);
      }
    }
  },

  /** Inserts images with onclick events, before a-elements.
   * Sets id on li-elements.
   * Modified from http://www.dhtmlgoodies.com/ */
  mdTreeInit: function () {
    var tocTree = document.getElementById('idTocTree'),
      tocTreeLIs = tocTree.getElementsByTagName('li'), /* Get an array of all menu items */
      nI,
      subItems,
      eltSpan,
      aTag;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      HITP.ptTocNoIdTreeLi += 1;
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      eltSpan = document.createElement('span');
      eltSpan.innerHTML = '▶';
      eltSpan.onclick = HITP.mdTreeShow_hide_node;
      eltSpan.setAttribute('class', 'classSpanListIcon');
      if (subItems.length === 0) {
        eltSpan.innerHTML = '◇';
        eltSpan.removeAttribute('class');
      }
      aTag = tocTreeLIs[nI].getElementsByTagName('a')[0];
      tocTreeLIs[nI].insertBefore(eltSpan, aTag);
      if (!tocTreeLIs[nI].id) {
        tocTreeLIs[nI].id = 'idTocTreeLI' + HITP.ptTocNoIdTreeLi;
      }
    }
  },

  /** Highlights ONE item in toc-list */
  mdTreeHighlight_item: function (eltSpliterLeftDiv, elm) {
    /* removes existing highlighting */
    var tocTreeAs = eltSpliterLeftDiv.getElementsByTagName('a'),
      nI;
    for (nI = 0; nI < tocTreeAs.length; nI += 1) {
      tocTreeAs[nI].removeAttribute('class');
    }
    elm.setAttribute('class', 'classTocTreeHighlight');
  },

  /** Goes to Id, and blinks it. From HTML5-Outliner */
  mdTreeGoto_id: function (id) {
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
  mdTreeExpand_all: function (idTree) {
    var tocTreeLIs = document.getElementById(idTree).getElementsByTagName('li'),
      nI,
      subItems;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      if (subItems.length > 0 && subItems[0].style.display !== 'block') {
        HITP.mdTreeShow_hide_node(false, tocTreeLIs[nI].id);
      }
    }
  },

  /** Expands the first children. */
  mdTreeExpand_first: function (idTree) {
    var tocTreeLIs, subItems;
    tocTreeLIs = document.getElementById(idTree).getElementsByTagName('li');
    /* expand the first ul-element */
    subItems = tocTreeLIs[0].getElementsByTagName('ul');
    if (subItems.length > 0 && subItems[0].style.display !== 'block') {
      HITP.mdTreeShow_hide_node(false, tocTreeLIs[0].id);
    }
  },

  /** expands all the parents only, of an element */
  mdTreeExpand_parent: function (elm) {
    var eltSpan, eltUl;
    /** the parent of a-elm is li-elm with parent a ul-elm. */
    eltUl = elm.parentNode.parentNode;
    while (eltUl.tagName === 'UL') {
      eltUl.style.display = 'block';
      /* the parent is li-elm, its first-child is img */
      eltSpan = eltUl.parentNode.firstChild;
      if (eltSpan.tagName === 'SPAN' && eltSpan.innerHTML === '▶') {
        eltSpan.innerHTML = '∇';
      }
      eltUl = eltUl.parentNode.parentNode;
    }
  },

  /** this function puts on the page the toc by splitting it. */
  mdMake_toc: function () {
    /* create toc */
    var contentOriginal = document.body.innerHTML,
      eltBody = document.body,
      eltSpliterDiv = document.createElement('div'), /* the general container*/
      eltSpliterRightDiv = document.createElement('div'),
      eltSpliterLeftDiv = document.createElement('div'),
      eltTocBtnCollapse_All = document.createElement('input'),
      eltTocBtnExp_All = document.createElement('input'),
      eltPpath = document.createElement("p"),
      eltPNote = document.createElement("p"),
      eltPopupcontainer = document.createElement('div'),
      eltHitpmenu = document.createElement('div'),
      oRequest = new XMLHttpRequest();

    HITP.ptTocNoIdTreeLi = 0;
    eltSpliterDiv.id = 'idSpliterDiv';
    /* remove from old-body its elements */
    eltBody.innerHTML = '';
    eltBody.appendChild(eltSpliterDiv);

    /* set on right-splitter the old-body */
    eltSpliterRightDiv.id = 'idSpliterRightDiv';
    eltSpliterRightDiv.innerHTML = contentOriginal;
    eltSpliterDiv.appendChild(eltSpliterRightDiv);

    /* insert toc */
    eltSpliterLeftDiv.id = 'idSpliterLefDiv';
    eltSpliterLeftDiv.innerHTML = HITP.mdCreate_ul_with_headings();
    eltSpliterLeftDiv.getElementsByTagName("ul")[0].setAttribute('id', 'idTocTree');
    /* insert collaplse-button */
    eltTocBtnCollapse_All.setAttribute('id', 'idBtnCollapse_All');
    eltTocBtnCollapse_All.setAttribute('type', 'button');
    eltTocBtnCollapse_All.setAttribute('value', '►');
    eltTocBtnCollapse_All.setAttribute('title', 'Collapse-All');
    eltTocBtnCollapse_All.setAttribute('class', 'classBtn');
    $(eltTocBtnCollapse_All).click(
      function (event) {
        HITP.mdTreeCollapseAll('idTocTree');
      }
    );
    eltSpliterLeftDiv.insertBefore(eltTocBtnCollapse_All, eltSpliterLeftDiv.firstChild);
    /* insert expand-button */
    eltTocBtnExp_All.setAttribute('id', 'idBtnExp_All');
    eltTocBtnExp_All.setAttribute('type', 'button');
    eltTocBtnExp_All.setAttribute('value', '∇');
    eltTocBtnExp_All.setAttribute('title', 'Expand-All');
    eltTocBtnExp_All.setAttribute('class', 'classBtn');
    $(eltTocBtnExp_All).click(
      function (event) {
        HITP.mdTreeExpand_all('idTocTree');
      }
    );
    eltSpliterLeftDiv.insertBefore(eltTocBtnExp_All, eltSpliterLeftDiv.firstChild);

    /* insert page-path--element */
    eltPpath.setAttribute('title', "© 2010-2013 Kaseluris.Nikos.1959");
    if (!document.getElementById("idMetaWebpage_path")) {
      eltPpath.innerHTML = 'ToC: ' + document.title;
    } else {
      eltPpath.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    eltSpliterLeftDiv.insertBefore(eltPpath, eltSpliterLeftDiv.firstChild);

    /* insert site-structure menu */
    eltHitpmenu.id = 'idHitpmenu';
    oRequest.open('GET', 'http://' + location.hostname + '/hitpmenu.html', false);
    oRequest.setRequestHeader('User-Agent', navigator.userAgent);
    oRequest.send(null);
    if (oRequest.status === 200) {
      eltHitpmenu.innerHTML = oRequest.responseText;
    }
    $('#idHitpmenu').load('hitpmenu.txt');
    if (eltHitpmenu.innerHTML !== '') {
      eltSpliterLeftDiv.insertBefore(eltHitpmenu, eltSpliterLeftDiv.firstChild);
    }

    /* toc: add note at the end */
    eltPNote.innerHTML = '<span class="color-green style-b">Notes</span>: <br/>a) Clicking on TEXT, you see its position on ToC and its address on address-bar. <br/>b) hovering a domain-link you see a preview.';
    eltSpliterLeftDiv.appendChild(eltPNote);

    $(eltSpliterLeftDiv).find("#idTocTree li > a").each(
      /* what to do on clicking a link in toc */
      function () {
        $(this).click(
          function (event) {
            event.preventDefault();
            var id = $(event.target).attr("href").split('#')[1];
            HITP.mdTreeGoto_id(id);
            HITP.mdTreeHighlight_item(eltSpliterLeftDiv, this);
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
                  HITP.mdTreeCollapseAll('idTocTree');
                  HITP.mdTreeHighlight_item(eltSpliterLeftDiv, this);
                  HITP.mdTreeExpand_parent(this);
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
    eltSpliterDiv.insertBefore(eltSpliterLeftDiv, eltSpliterDiv.firstChild);

    HITP.mdSplit($("#idSpliterDiv"));

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
        if (sPopup.replace(/<[^>]*>?/g, '').length > 1000) {
          sPopup = sPopup.substring(0, 900);
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
        pv = $(window).height() / 6;
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

    HITP.mdTreeInit();
    HITP.mdTreeExpand_all('idTocTree');
    HITP.mdTreeCollapseAll('idTocTree');
    HITP.mdTreeExpand_first('idTocTree');
    /* IF on idMetaWebpage_path paragraph we have and the classTocExpand
     * then the toc expands-all */
    if (document.getElementById("idMetaWebpage_path")) {
      if (document.getElementById("idMetaWebpage_path").getAttribute('class') === 'classTocExpand') {
        HITP.mdTreeExpand_all('idTocTree');
      }
    }
    //focus div
    $("#idSpliterRightDiv").attr("tabindex", -1).focus();

    $('#idHitpmenu').hover(
      function () {
        HITP.posSplitPrevious = $(eltSpliterLeftDiv).width();
        $(eltSpliterLeftDiv).css({
          'width': $(window).width() + 'px'
        });
      },
      function () {
        $(eltSpliterLeftDiv).css({
          'width': HITP.posSplitPrevious + 'px'
        });
      }
    );

  }
};

$(document).ready(function () {
  HITP.mdMake_toc();
});
