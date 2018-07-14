/*
 * version.last: hitp.js (2013.07.15 minor 2013.07.15)
 * version.this: hitp.2013.07.15.js (last toc-ul-specific, HITP-obj)
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
 * hitp.js - html5.id.toc.preview text-format code.
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
 ***************************** DHTMLgoodies *****************************
 * To create the expandable-tree I modified code from
 * http://www.dhtmlgoodies.com/
 */

/*global $, jQuery*/
var HITP = {
  /** toc-tree variables */
  ptTocNoIdTreeLi: 0,

  /** splitter related code */
  mdSplit: function (elm) {
    return elm.each(function (e) {
      var posSplitCurrent = 222, /* setting */
        posSplitPrevious,
        elmDivSplitter = $(this),
        mychilds = elmDivSplitter.children(),
        elmSpliterLeftDiv = mychilds.first(),
        elmSpliterRightDiv = mychilds.next(),
        elmSpliterBarDiv = $('<div></div>'),
        elmSpliterBarDivGhost,
        elmSpliterBarButonDiv = $('<div></div>');

      $("body").css({
        'width': '100%',
        'height': '100%',
        'padding': '0',
        'margin': '0',
      });
      elmDivSplitter.css({
        'background-color': 'blue',
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'height': '100%',
        'width': '100%',
        'margin': '0',
        'padding': '0',
      });
      elmSpliterLeftDiv.css({
        'background-color': '#ffffff',
        'position': 'absolute',
        'left': '0',
        'height': '100%',
        'margin': '0',
        'overflow': 'auto',
        'font-size': '14px',
      });
      elmSpliterRightDiv.css({
        'background-color': 'white',
        'position': 'fixed',
        'right': '0',
        'height': '100%',
        'overflow': 'auto',
        'padding': '0 5px 0 5px',
        'z-index': '25',
        'outline': 'none',
      });

      function funDragPerform(e) {
        var incr = e.pageX;
        elmSpliterBarDivGhost.css('left', incr);
      }

      /* Perform actual splitting and animate it */
      function funTocSplitTo(pos) {
        pos = parseInt(pos, null);
        posSplitPrevious = posSplitCurrent;
        posSplitCurrent = pos;

        var sizeB = elmDivSplitter.width() - pos - 10 - 10; /* setting splitBar padding */
        elmSpliterLeftDiv.css({'width': pos + 'px'});
        elmSpliterBarDiv.css({'left': pos});
        elmSpliterRightDiv.css({'width': sizeB + 'px', 'left': pos + 10});

        elmDivSplitter.queue(function () {
          setTimeout(function () {
            elmDivSplitter.dequeue();
            mychilds.trigger('resize');
          }, 22);
        });
      }

      function funDragEnd(e) {
        var p = elmSpliterBarDivGhost.position();
        elmSpliterBarDivGhost.remove();
        elmSpliterBarDivGhost = null;
        mychilds.css("-webkit-user-select", "text");
        $(document).unbind("mousemove", funDragPerform)
          .unbind("mouseup", funDragEnd);
        funTocSplitTo(p.left);
      }

      function funDragStart(e) {
        if (e.target !== this) {
          return;
        }
        elmSpliterBarDivGhost = elmSpliterBarDiv.clone(false)
          .insertAfter(elmSpliterLeftDiv);
        elmSpliterBarDivGhost.attr({'id': 'idSpliterBarDivGhost'})
          .css({
            'position': 'absolute',
            'background-color': '#cccccc',
            'z-index': '250',
            '-webkit-user-select': 'none',
            'left': elmSpliterBarDiv.position().left,
          });
        mychilds.css({
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none'
        });
        $(document).bind("mousemove", funDragPerform).bind("mouseup", funDragEnd);
      }

      elmSpliterBarDiv.attr({'id': 'idSpliterBarDiv'})
        .css({
          'background-color': '#999999',
          'cursor': 'e-resize',
          'position': 'absolute',
          'width': '10px',
          'height': '100%',
        })
        .bind("mousedown", funDragStart)
        .hover(
          function () {
            $(this).css({'background-color': '#DDDDDD'});
          },
          function () {
            $(this).css({'background-color': '#999999'});
          }
        );
      elmSpliterBarDiv.insertAfter(elmSpliterLeftDiv);
      elmSpliterBarButonDiv.css({
        'background-color': '#888888',
        'position': 'relative',
        'top': '40%',
        'height': '15%',
        'width': '10px',
        'cursor': 'pointer'
      });
      elmSpliterBarButonDiv.attr({'id': 'idSpliterBarButonDiv'});
      elmSpliterBarDiv.append(elmSpliterBarButonDiv);
      elmSpliterBarButonDiv.mousedown(function (e) {
        if (e.target !== this) {
          return;
        }
        funTocSplitTo((posSplitCurrent === 0) ? posSplitPrevious : 0);
        return false;
      });
      funTocSplitTo(posSplitCurrent);
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
      nLvlThis, nLvlNext, nLvlPrev = 0, nLvlToc = 0, nI, nJ,
      sUl = '', sHcnt, sHid,
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
    sUl = '<ul><li><a href="#idHeader">' + sHcnt + '</a>';

    for (nI = 1; nI < arHdng.length; nI += 1) {
      elm = arHdng[nI];
      //special footer case;
      if (elm.nodeName.match(/footer/i)) {
        nLvlThis = 1;
        nLvlToc = 1;
        sUl += '<li><a href="#idFooter">Footer</a></li>';
        nLvlPrev = 1;
        continue;
      }
      nLvlThis = elm.nodeName.substr(1, 1);
      if (nLvlThis > nLvlPrev) {
        sUl += '<ul>'; //new list
        nLvlToc = 1 + parseInt(nLvlToc, 10);
      }
      sHid = elm.id;
      sHid = sHid.replace(/(\w*)H\d/, '$1');
      /* removes from heading the "classHide" content */
      sHcnt = elm.innerHTML;
      /*jslint regexp: true*/
      sHcnt = sHcnt.replace(/\n {4}<a class="hide" href=[^>]+>¶<\/a>/, '');
      sHcnt = sHcnt.replace(/<[^>]+>/g, '');
      /*jslint regexp: false*/
      sHcnt = sHcnt.replace(/<br\/*>/g, ' ');
      sUl += '<li><a href="#' + sHid + '">' + sHcnt + '</a>';
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
    parentNode = nodeThis.parentNode;/* ▶▷⊳ ▾▼▽∇ ◇◊*/
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
      elmSpan,
      aTag;
    for (nI = 0; nI < tocTreeLIs.length; nI += 1) {
      HITP.ptTocNoIdTreeLi += 1;
      subItems = tocTreeLIs[nI].getElementsByTagName('ul');
      elmSpan = document.createElement('span');
      elmSpan.innerHTML = '▶';
      elmSpan.onclick = HITP.mdTreeShow_hide_node;
      elmSpan.setAttribute('class', 'classSpanListIcon');
      if (subItems.length === 0) {
        elmSpan.innerHTML = '◇';
        elmSpan.removeAttribute('class');
      }
      aTag = tocTreeLIs[nI].getElementsByTagName('a')[0];
      tocTreeLIs[nI].insertBefore(elmSpan, aTag);
      if (!tocTreeLIs[nI].id) {
        tocTreeLIs[nI].id = 'idTocTreeLI' + HITP.ptTocNoIdTreeLi;
      }
    }
  },

  /** Highlights ONE item in toc-list */
  mdTreeHighlight_item: function (elmSpliterLeftDiv, elm) {
    /* removes existing highlighting */
    var tocTreeAs = elmSpliterLeftDiv.getElementsByTagName('a'),
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
    var elmSpan, elmUl;
    /** the parent of a-elm is li-elm with parent a ul-elm. */
    elmUl = elm.parentNode.parentNode;
    while (elmUl.tagName === 'UL') {
      elmUl.style.display = 'block';
      /* the parent is li-elm, its first-child is img */
      elmSpan = elmUl.parentNode.firstChild;
      if (elmSpan.tagName === 'SPAN' && elmSpan.innerHTML === '▶') {
        elmSpan.innerHTML = '∇';
      }
      elmUl = elmUl.parentNode.parentNode;
    }
  },

  /** this function puts on the page the toc by splitting it. */
  mdMake_toc: function () {
    /* create toc */
    var contentOriginal = document.body.innerHTML,
      elmBody = document.body,
      elmDivSplitter = document.createElement('div'), /* the general container*/
      elmSpliterRightDiv = document.createElement('div'),
      elmSpliterLeftDiv = document.createElement('div'),
      elmTocBtnCollapse_All = document.createElement('input'),
      elmTocBtnExp_All = document.createElement('input'),
      elmPpath = document.createElement("p"),
      elmPNote = document.createElement("p"),
      elmPopupcontainer = document.createElement('div');

    HITP.ptTocNoIdTreeLi = 0;
    elmDivSplitter.id = 'idDivSplitter';
    /* remove from old-body its elements */
    elmBody.innerHTML = '';
    elmBody.appendChild(elmDivSplitter);

    /* set on right-splitter the old-body */
    elmSpliterRightDiv.id = 'idSpliterRightDiv';
    elmSpliterRightDiv.innerHTML = contentOriginal;
    elmDivSplitter.appendChild(elmSpliterRightDiv);

    /* insert toc */
    elmSpliterLeftDiv.id = 'idSpliterLefDiv';
    elmSpliterLeftDiv.innerHTML = HITP.mdCreate_ul_with_headings();
    elmSpliterLeftDiv.getElementsByTagName("ul")[0].setAttribute('id', 'idTocTree');
    /* insert collaplse-button */
    elmTocBtnCollapse_All.setAttribute('id', 'idBtnCollapse_All');
    elmTocBtnCollapse_All.setAttribute('type', 'button');
    elmTocBtnCollapse_All.setAttribute('value', '▶');
    elmTocBtnCollapse_All.setAttribute('title', 'Collapse-All');
    elmTocBtnCollapse_All.setAttribute('class', 'classBtn');
    $(elmTocBtnCollapse_All).click(
      function (event) {
        HITP.mdTreeCollapseAll('idTocTree');
      }
    );
    elmSpliterLeftDiv.insertBefore(elmTocBtnCollapse_All, elmSpliterLeftDiv.firstChild);
    /* insert expand-button */
    elmTocBtnExp_All.setAttribute('id', 'idBtnExp_All');
    elmTocBtnExp_All.setAttribute('type', 'button');
    elmTocBtnExp_All.setAttribute('value', '∇');
    elmTocBtnExp_All.setAttribute('title', 'Expand-All');
    elmTocBtnExp_All.setAttribute('class', 'classBtn');
    $(elmTocBtnExp_All).click(
      function (event) {
        HITP.mdTreeExpand_all('idTocTree');
      }
    );
    elmSpliterLeftDiv.insertBefore(elmTocBtnExp_All, elmSpliterLeftDiv.firstChild);
    /* insert site-structure menu */
    /* insert page-path--element */
    elmPpath.setAttribute('title', "© 2010-2013 Kaseluris.Nikos.1959");
    if (!document.getElementById("idMetaWebpage_path")) {
      elmPpath.innerHTML = 'ToC: ' + document.title;
    } else {
      elmPpath.innerHTML = document.getElementById("idMetaWebpage_path").innerHTML;
    }
    elmSpliterLeftDiv.insertBefore(elmPpath, elmSpliterLeftDiv.firstChild);

    /* toc: add note at the end */
    elmPNote.innerHTML = 'Notes: <br/>a) Clicking on TEXT, you see its position on ToC and its address on address-bar. <br/>b) hovering a domain-link you see a preview.';
    elmSpliterLeftDiv.appendChild(elmPNote);

    $(elmSpliterLeftDiv).find("li > a").each(
      /* what to do on clicking a link in toc */
      function () {
        $(this).click(
          function (event) {
            event.preventDefault();
            var id = $(event.target).attr("href").split('#')[1];
            HITP.mdTreeGoto_id(id);
            HITP.mdTreeHighlight_item(elmSpliterLeftDiv, this);
            return false;
          }
        );
        /* sets as title-attribute the text of a-element */
        var txt = $(this).text();
        $(this).attr('title', txt);
      }
    );

    /* on content get-id */
    $(elmSpliterRightDiv).find("*[id]").each(
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
              elmSec = $(this);
            /* first go where you click */
            location.href = '#' + $(this).attr('id');

            /* find section's id */
            while (!elmSec.get(0).tagName.match(/^SECTION/i)) {
              elmSec = elmSec.parent();
              if (elmSec.get(0).tagName.match(/^HEADER/i)) {
                break;
              }
              if (elmSec.get(0).tagName.match(/^FOOTER/i)) {
                break;
              }
            }
            if (elmSec.get(0).tagName.match(/^HEADER/i)) {
              sID = '#idHeader';
            } else if (elmSec.get(0).tagName.match(/^FOOTER/i)) {
              sID = '#idFooter';
            } else {
              sID = '#' + elmSec.attr('id');
            }

            $(elmSpliterLeftDiv).find("a").each(
              function () {
                var position, windowHeight;
                if ($(this).attr('href') === sID) {
                  HITP.mdTreeCollapseAll('idTocTree');
                  HITP.mdTreeHighlight_item(elmSpliterLeftDiv, this);
                  HITP.mdTreeExpand_parent(this);
                  /* scroll to this element */
                  $(elmSpliterLeftDiv).scrollTop(0);
                  position = $(this).offset().top;
                  windowHeight = $(window).height();
                  $(elmSpliterLeftDiv).scrollTop(position - (windowHeight / 2));
                }
              }
            );
          }
        );
      }
    );
    elmDivSplitter.insertBefore(elmSpliterLeftDiv, elmDivSplitter.firstChild);

    HITP.mdSplit($("#idDivSplitter"));

    /* on links with class popupTrigger add this function
     * first insert popup container */
    elmPopupcontainer.id = 'idPopup';
    elmSpliterRightDiv.appendChild(elmPopupcontainer);

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
      $('#idPopup').css({'top': pv, 'left': $(window).width() / 2.5});
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
  }
};

$(document).ready(function () {
  HITP.mdMake_toc();
});
