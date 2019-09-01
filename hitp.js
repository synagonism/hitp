/*
 * hitp.js - html5.id.toc.preview webpage-format code.
 * This code is the result of the evolution of my
 * a) TableOfContents chrome extention (https:// chrome.google.com/webstore/detail/tableofcontents/eeknhipceeelbgdbcmchicoaoalfdnhi)
 * and
 * b) synagonism-mw MediaWiki skin (http:// synagonism-mw.sourceforge.net/)
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2010-2019 Kaseluris.Nikos.1959 (synagonism)
 * kaseluris.nikos@gmail.com
 * https:// synagonism.net/
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
    /** contains the-versions of hitp.js */
    aVersion: [
      'hitp.js.17-5-0.2019-09-01: langoKamo',
      'hitp.js.17-4-0.2019-08-28: scrollTop',
      'hitp.js.17-3-0.2019-02-19.2019-03-05: main-name-searching',
      'hitp.js.17-2-1.2018-10-08: filMcs.last.html',
      'hitp.js.17-2-0.2018-09-21: name-notation',
      'hitp.js.17-1-0.2018-09-16: location.hash',
      'hitp.js.17-0-1.2018-09-15: home-icon',
      'hitp.js.17-0-0.2018-09-15: search-scalability',
      'hitp.js.16-5-2.2018-01-23',
      'hitp.js.16-5-1.2018-01-06: Đchain-network',
      'hitp.js.16-5-0.2017-11-10: arrow keys in search',
      'hitp.js.16-4-2.2017-10-17: no type-ahead in search',
      'hitp.js.16-4-1.2017-06-23: greek search',
      'hitp.js.16-3-5.2017-06-18: type after type-ahead, title-help, cnrInf-width',
      'hitp.js.16-2-0.2017-06-07: search-toc-show-easy',
      'hitp.js.16-1-2.2017-06-07: search-icon',
      'hitp.js.16.2017-06-05.search (15-6): hitp.16.2017-06-05.js',
      'hitp.js.15.2016-10-27.any-machine (14-9): hitp.15.2016-10-27.js',
      'hitp.js.14.2016-06-09.table-content-tree (13): hitp.14.2016-06-09.js',
      'hitp.js.13.2016-06-07.preview (12-11): hitp.13.2016-06-07.js',
      'hitp.js.12.2016-01-24.toc-icn-img (11.9): hitp.2016.01.24.12.js',
      'hitp.js.11.2015-10-26.preferences: hitp.2015.10.26.11.js',
      'hitp.js.10.2014-08-05.valuenames: hitp.2014.08.05.10.js',
      'hitp.js.9.2014-08-02.no-jQuery: hitp.2014.08.02.9.js',
      'hitp.js.8.2014-01-09.toc-on-hovering: hitp.2014.01.09.8.js',
      'hitp.js.7.2013-11-06.tabs: hitp.2013.11.06.7.js',
      'hitp.js.6.2013-08-21.site-structure: hitp.2013.08.21.6.js',
      'hitp.js.previous: hitp.2013.07.15.js (toc-ul-specific, hitp-obj)',
      'hitp.js.previous: /hitp/hitp.2013.06.29.js (hitp-dir)',
      'hitp.js.previous: toc.2013.05.30.js (section id)',
      'hitp.js.previous: toc.2013.04.19.js (JSLint ok)',
      'hitp.js.previous: toc.2013.04.14.js (preview links)',
      'hitp.js.previous: toc.2013.04.07.js (button expand|collapse)',
      'hitp.js.previous: toc.2013.04.05.js (toc scrolls to highlited)',
      'hitp.js.previous: toc.2013.04.04.js (goes click location)',
      'hitp.js.previous: toc.2013.04.01.js (toc on any browser)',
      'hitp.js.previous: 2010.12.06 (toc on chrome)'
    ],
    /** config variables */
    nCfgPageinfoWidth: 30, // % of window width
    /**
     * filSite-structure contains absolute urls, because we see it from many pages.
     * Then we must-know the-homepage of the-site and create different menus.
     */
    sCfgHomeLocal: '/dWstSgm/',

    bEdge: navigator.userAgent.indexOf('Edge/') > -1,
    bFirefox: navigator.userAgent.indexOf('Firefox/') > -1,

    /**
     * Find key of object given value
     */
    fObjvalRKey: function (oIn, valIn) {
      return Object.keys(oIn).find(
        function (key) {
          return oIn[key] === valIn
        }
      )
    },

    /** holds the-object of the-Html-element a-user clicks on */
    oEltClicked: document.body,
    oEltSitemenuUl: undefined,

    sPathSite: '',
    sPathSitemenu: '',
    /** selector for a-elements with clsClickCnt */
    sQrslrAClk: 'idFoo',
    sQrslrAClkLast: ''
  }

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
      fEvtLink,
      fEvtPreview,
      fEvtClickContent,
      fEvtMouseoverContent,
      oEltBody = document.body,
      // top-container with site, home, title, search and width subcontainers,
      oEltCnrTopDiv = document.createElement('div'),
      oEltTopTitleP = document.createElement('p'),
      oEltTopWidthIcnI = document.createElement('i'),
      // main-container with page-content and page-info sub-containers,
      oEltCnrMainDiv = document.createElement('div'),
      oEltCnrMainPgcntDiv = document.createElement('div'),
      oEltCnrMainPginfDiv = document.createElement('div'),
      // extra containers,
      oEltCnrWidthDiv = document.createElement('div'),
      oEltCnrPreviewDiv = document.createElement('div'),
      // Page-info-cnr: PathP, TabHeadersUl, TabCntDiv,
      oEltPginfPathP = document.createElement('p'),
      oEltPginfTabHeadersUl = document.createElement('ul'),
      // Tab-content contains: TabCntToc, TabCntSrch,
      oEltPginfTabCntDiv = document.createElement('div'),
      oEltTabCntTocDiv = document.createElement('div'),
      oEltTabCntTocExpBtn = document.createElement('input'),
      oEltTabCntTocCpsBtn = document.createElement('input'),
      oEltTabCntTocPrfDiv = document.createElement('div'),
      oEltTabCntTocNotP = document.createElement('p'),
      oXHR,
      sContentOriginal = oEltBody.innerHTML,
      sIdTabActive

    if (oHitp.oEltSitemenuUl) {
      var
        oEltCnrSiteDiv = document.createElement('div'),
        oEltTopSitemenuIcnI = document.createElement('i'),
        oEltTopHomeIcnI = document.createElement('i')
    }

    if (oHitp.aNamidxRoot) {
      var
        oEltTopSearchIcnI = document.createElement('i'),
        oEltTabCntSrchDiv = document.createElement('div'),
        oEltTabCntSrchLbl = document.createElement('label'),
        oEltTabCntSrchSlt = document.createElement('select'),
        oEltTabCntSrchP = document.createElement('p'),
        oEltTabCntSrchLblChk = document.createElement('label'),
        oEltTabCntSrchIpt = document.createElement('input'),
        oEltTabCntSrchOl = document.createElement('ol'),
        sPathNames,
        // localhost or online,
        sTabCntSrchOl =
          '<li>SEE ' +
            '<a class="clsPreview" href="' + oHitp.sPathSite + 'dirMiwMcs/dirCor/filMcs.last.html#idMcsattNamcvn">name-notation--of-Mcs</a>.</li>' +
          '<li>TYPE a-name of ' +
            '<a class="clsPreview" href="' + oHitp.sPathSite + 'dirMiwMcs/dirCor/filMcs.last.html#idDescription">a-structured-concept-Mcs</a> of ' +
            '<a class="clsPreview" href="' + oHitp.sPathSite + '#idAboutme">Kaseluris.Nikos.1959-WORLDVIEW</a>.</li>' +
          '<li>the major concepts are-related to "<strong>char</strong>", ' +
            '"<strong>javascript</strong>" and ' +
            '"<strong>chain-network</strong>".</li>' +
          '<li>structured-concept-searching demonstrates THE-POWER of structured-concepts.' +
            '<br>compare them with Google-WORD-search and Wikipedia-TEXT-entries.</li>' +
          '<li><a class="clsPreview" href="' + oHitp.sPathSite + '#idAboutme">Kaseluris.Nikos.1959</a> works more than 30 years on structured-concepts. ' +
            '<br>his offline-worldview contains more than 100,000 structured-concepts.' +
            '<br><a class="clsPreview" href="' + oHitp.sPathSite + '#idSupport">support him</a> to continue publishing.</li>' +
          '<li>this site uses 3 types of searching:' +
            '<br>- Word-Site-Search from Site-Menu,' +
            '<br>- Word-Page-Search by hitting Ctrl+F and' +
            '<br>- Structured-Concept-Search here.</li>'

      oHitp.aSuggestions = [[]]
      oHitp.sNamidx = 'root' // the-namidx-file to search first
      oHitp.sSrchCrnt = '' // current search-index
      oHitp.sSrchNext = '' // next search-index
      sPathNames = oHitp.sPathSite + 'dirMiwMcs/dirNamidx/'
      oEltTopTitleP.setAttribute('title', 'clicking GREEN-TITLE shows search-tab, clicking CONTENT shows Toc-tab')
      oEltTopSearchIcnI.setAttribute('class', 'clsFa clsFaSearch clsTopIcn clsColorWhite clsFloatRight clsPosRight')
      oEltTopSearchIcnI.addEventListener('click', function () {
        fCnrOntopRemove()
        fCnrSearchShow()
      })

      function fCnrSearchShow() {
        // Remove active-class from first-child-elt of PginfTabHeaders
        document.getElementById('idPginfTabHeadersUl')
          .firstElementChild.classList.remove('clsTabActive')
        // Add active-class on second-child-element of PginfTabHeaders
        document.getElementById('idPginfTabHeadersUl')
          .childNodes[1].classList.add('clsTabActive')
        // Hide tab-content from TabCntToc
        document.getElementById('idTabCntTocDiv').style.display = 'none'
        // Show tab-content on TabCntSrch
        document.getElementById('idTabCntSrchDiv').style.display = 'block'
        // on TabCntSrch focus input-element
        oEltTabCntSrchIpt.focus()
      }
    }

    oEltCnrTopDiv.id = 'idCnrTopDiv'
    oEltCnrMainDiv.id = 'idCnrMainDiv'

    // top-title-text
    oEltTopTitleP.innerHTML = document.getElementsByTagName('title')[0].innerHTML
    oEltTopTitleP.id = 'idTopTitleP'
    // width-icon
    oEltTopWidthIcnI.setAttribute('class', 'clsFa clsFaArrowsH clsTopIcn clsColorWhite clsFloatRight clsTtp clsPosRight')
    // to show a-tooltip on an-element:
    // - set clsTtp on element
    // - set tooltip (<span class="clsTtp">Width of Page-Info</span>) inside the-element
    // - on element click add clsClicked and clsTtpShow
    oEltTopWidthIcnI.innerHTML = '<span class="clsTtp">width of page-info</span>'
    oEltTopWidthIcnI.addEventListener('click', function () {
      if (oEltTopWidthIcnI.className.indexOf('clsClicked') > -1) {
        oEltCnrWidthDiv.style.display = 'block'
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
      } else {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
        oHitp.oEltClicked = oEltTopWidthIcnI
        oEltTopWidthIcnI.classList.add('clsClicked', 'clsTtpShow')
      }
    })
    // width-content
    oEltCnrWidthDiv.id = 'idCnrWidthDiv'
    oEltCnrWidthDiv.innerHTML = '<p id="idWidthCntP" class="clsCenter">close <i class="clsFa clsFaClose clsFloatRight clsColorWhite clsTopIcn"></i></p>' +
      '<fieldset><legend>Page-Info-width:</legend>' +
      '<input type="radio" id="idRdbWidth0" name="nameRdbWidth">0 %<br>' +
      '<input type="radio" id="idRdbWidth10" name="nameRdbWidth">10 %<br>' +
      '<input type="radio" id="idRdbWidth20" name="nameRdbWidth">20 %<br>' +
      '<input type="radio" id="idRdbWidth25" name="nameRdbWidth">25 %<br>' +
      '<input type="radio" id="idRdbWidth30" name="nameRdbWidth">30 %<br>' +
      '<input type="radio" id="idRdbWidth40" name="nameRdbWidth">40 %<br>' +
      '<input type="radio" id="idRdbWidth50" name="nameRdbWidth">50 %<br>' +
      '<input type="radio" id="idRdbWidth100" name="nameRdbWidth">100 %<br>' +
      '</fieldset>'
    oEltCnrTopDiv.appendChild(oEltTopTitleP)
    oEltCnrTopDiv.appendChild(oEltTopWidthIcnI)
    if (oHitp.aNamidxRoot) {
      oEltCnrTopDiv.appendChild(oEltTopSearchIcnI)
      oEltTopTitleP.addEventListener('click', function () {
        fCnrOntopRemove()
        fCnrSearchShow()
      })
    } else {
      oEltTopTitleP.addEventListener('click', function () {
        fCnrOntopRemove()
      })
    }
    function fCnrOntopRemove() {
      oEltCnrPreviewDiv.style.display = 'none' // remove popup-cnr
      oEltCnrWidthDiv.style.display = 'none' // remove width-cnr
      if (oHitp.oEltSitemenuUl) {
        oEltCnrSiteDiv.style.display = 'none' // remove site-cnr
      }
      oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked') // remove tooltip clicks
    }
    function fCnrTocShow() {
      // Remove active-class from second-child-elt of PginfTabHeaders
      document.getElementById('idPginfTabHeadersUl')
        .childNodes[1].classList.remove('clsTabActive')
      // Add active-class on second-child-element of PginfTabHeaders
      document.getElementById('idPginfTabHeadersUl')
        .childNodes[0].classList.add('clsTabActive')
      if (oHitp.aNamidxRoot) {
        // Hide tab-content from TabCntSrch
        document.getElementById('idTabCntSrchDiv').style.display = 'none'
      }
      // Show tab-content on TabCntToc
      document.getElementById('idTabCntTocDiv').style.display = 'block'
    }

    oEltBody.innerHTML = ''
    oEltBody.appendChild(oEltCnrTopDiv)
    oEltBody.appendChild(oEltCnrMainDiv)
    oEltBody.appendChild(oEltCnrWidthDiv)
    document.getElementById('idWidthCntP').addEventListener('click', function () {
      oEltCnrWidthDiv.style.display = 'none'
    })
    document.getElementById('idRdbWidth0').addEventListener('click', function () {
      fWidthPginf(0)
      oHitp.nCfgPageinfoWidth = 0
    })
    document.getElementById('idRdbWidth10').addEventListener('click', function () {
      fWidthPginf(10)
      oHitp.nCfgPageinfoWidth = 10
    })
    document.getElementById('idRdbWidth20').addEventListener('click', function () {
      fWidthPginf(20)
      oHitp.nCfgPageinfoWidth = 20
    })
    document.getElementById('idRdbWidth25').addEventListener('click', function () {
      fWidthPginf(25)
      oHitp.nCfgPageinfoWidth = 25
    })
    document.getElementById('idRdbWidth30').addEventListener('click', function () {
      fWidthPginf(30)
      oHitp.nCfgPageinfoWidth = 30
    })
    document.getElementById('idRdbWidth40').addEventListener('click', function () {
      fWidthPginf(40)
      oHitp.nCfgPageinfoWidth = 40
    })
    document.getElementById('idRdbWidth50').addEventListener('click', function () {
      fWidthPginf(50)
      oHitp.nCfgPageinfoWidth = 50
    })
    document.getElementById('idRdbWidth100').addEventListener('click', function () {
      fWidthPginf(100)
      oHitp.nCfgPageinfoWidth = 100
    })
    if (oHitp.nCfgPageinfoWidth === 0) {
      document.getElementById('idRdbWidth0').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 10) {
      document.getElementById('idRdbWidth10').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 20) {
      document.getElementById('idRdbWidth20').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 25) {
      document.getElementById('idRdbWidth25').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 30) {
      document.getElementById('idRdbWidth30').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 40) {
      document.getElementById('idRdbWidth40').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 50) {
      document.getElementById('idRdbWidth50').checked = true
    } else if (oHitp.nCfgPageinfoWidth === 100) {
      document.getElementById('idRdbWidth100').checked = true
    }

    // adds click event on input link elements
    fEvtLink = function (oEltIn) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault()

        if (oEltIn.className.indexOf('clsClicked') > -1) {
          oEltIn.classList.remove('clsClicked')
          fCnrOntopRemove()
          location.href = oEltIn.href
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked',
            'clsTtpShow', 'clsTriClicked')
          oHitp.oEltClicked = oEltIn
          oEltIn.classList.add('clsClicked')
          fEvtPreview(oEvtIn)
        }
      })
    }

    // site-structure menu
    if (oHitp.oEltSitemenuUl) {
      oHitp.oEltSitemenuUl.setAttribute('id', 'idSitemenuUl')

      // site-icn
      oEltTopSitemenuIcnI.setAttribute('class', 'clsFa clsFaMenu clsTopIcn clsColorWhite clsFloatLeft clsTtp')
      oEltTopSitemenuIcnI.innerHTML = '<span class="clsTtp">Site-structure</span>'
      oEltTopSitemenuIcnI.addEventListener('click', function () {
        if (oEltTopSitemenuIcnI.className.indexOf('clsClicked') > -1) {
          oEltCnrSiteDiv.style.display = 'block'
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
          oHitp.oEltClicked = oEltTopSitemenuIcnI
          oEltTopSitemenuIcnI.classList.add('clsClicked', 'clsTtpShow')
        }
      })
      // home-icn
      oEltTopHomeIcnI.setAttribute('class', 'clsFa clsFaHome clsTopIcn clsColorWhite clsFloatLeft clsTtp')
      oEltTopHomeIcnI.innerHTML = '<span class="clsTtp">Home-webpage</span>'
      oEltTopHomeIcnI.addEventListener('click', function () {
        if (oEltTopHomeIcnI.className.indexOf('clsClicked') > -1) {
          oEltTopHomeIcnI.classList.remove('clsClicked')
          oHitp.oEltClicked.classList.remove('clsTtpShow')
          location.href = oHitp.sPathSite
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
          oHitp.oEltClicked = oEltTopHomeIcnI
          oEltTopHomeIcnI.classList.add('clsClicked', 'clsTtpShow')
        }
      })
      // site-content
      oEltCnrSiteDiv.id = 'idCnrSiteDiv'
      oEltCnrSiteDiv.innerHTML =
        '<p id="idSiteCntP1" class="clsCenter">close <i class="clsFa clsFaClose clsFloatRight clsColorWhite clsTopIcn"></i></p>' +
        '<p id="idSiteCntP2" class="clsCenter">Site-structure</p>'
      oEltCnrSiteDiv.appendChild(oHitp.oEltSitemenuUl)
      oEltCnrTopDiv.insertBefore(oEltTopHomeIcnI, oEltCnrTopDiv.firstChild)
      oEltCnrTopDiv.insertBefore(oEltTopSitemenuIcnI, oEltCnrTopDiv.firstChild)
      oEltBody.appendChild(oEltCnrSiteDiv)
      document.getElementById('idSiteCntP1').addEventListener('click', function () {
        oEltCnrSiteDiv.style.display = 'none'
      })
      // oHitp.oTreeUl.fTruCreate(oHitp.oEltSitemenuUl);
      // on a-links, first highlight
      Array.prototype.slice.call(document.querySelectorAll('#idSitemenuUl a')).forEach(function (oEltIn) {
        fEvtLink(oEltIn)
      })
    }

    // set on page-content-cnr the original-body content
    oEltCnrMainPgcntDiv.id = 'idCnrMainPgcntDiv'
    oEltCnrMainPgcntDiv.innerHTML = sContentOriginal
    oEltCnrMainDiv.appendChild(oEltCnrMainPgcntDiv)

    // insert page-info-cnr
    oEltCnrMainPginfDiv.id = 'idCnrMainPginfDiv'
    // insert content on TabCntToc
    oEltTabCntTocDiv.id = 'idTabCntTocDiv'
    oEltTabCntTocDiv.setAttribute('class', 'clsTabCnt')
    oEltTabCntTocDiv.innerHTML = oHitp.fTocTriCreate()
    // insert collaplse-button
    oEltTabCntTocCpsBtn.setAttribute('id', 'idBtnCollapse_All')
    oEltTabCntTocCpsBtn.setAttribute('type', 'button')
    oEltTabCntTocCpsBtn.setAttribute('value', 'collapse-all')
    oEltTabCntTocCpsBtn.setAttribute('class', 'clsBtn')
    oEltTabCntTocCpsBtn.addEventListener('click', function () {
      if (oEltTabCntTocCpsBtn.className.indexOf('clsClicked') > -1) {
        oHitp.oTreeUl.fTruTocCollapseAll()
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
      } else {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
        oHitp.oEltClicked = oEltTabCntTocCpsBtn
        oEltTabCntTocCpsBtn.classList.add('clsClicked', 'clsTtpShow')
      }
    })
    oEltTabCntTocDiv.insertBefore(oEltTabCntTocCpsBtn, oEltTabCntTocDiv.firstChild)
    // insert expand-button
    oEltTabCntTocExpBtn.setAttribute('id', 'idBtnExp_All')
    oEltTabCntTocExpBtn.setAttribute('type', 'button')
    oEltTabCntTocExpBtn.setAttribute('value', 'expand-all')
    oEltTabCntTocExpBtn.setAttribute('class', 'clsBtn')
    oEltTabCntTocExpBtn.addEventListener('click', function () {
      if (oEltTabCntTocExpBtn.className.indexOf('clsClicked') > -1) {
        oHitp.oTreeUl.fTruTocExpandAll()
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
      } else {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
        oHitp.oEltClicked = oEltTabCntTocExpBtn
        oEltTabCntTocExpBtn.classList.add('clsClicked', 'clsTtpShow')
      }
    })
    oEltTabCntTocDiv.insertBefore(oEltTabCntTocExpBtn, oEltTabCntTocDiv.firstChild)
    // TabCntToc: preferences
    oEltTabCntTocDiv.appendChild(document.createElement('p'))
    oEltTabCntTocPrfDiv.innerHTML = '<span class="clsColorGreen clsB">PREFERENCES</span>:<br>' +
      '<fieldset><legend><span class="clsColorGreen">fonts</span>:</legend>' +
      '<input type="radio" id="idRdbFontMono" name="nameRdbFont" checked/>Mono (default)<br>' +
      '<input type="radio" id="idRdbFontSerif" name="nameRdbFont"/>Serif<br>' +
      '<input type="radio" id="idRdbFontSSerif" name="nameRdbFont"/>Sans-serif' +
      '</fieldset>'
    oEltTabCntTocDiv.appendChild(oEltTabCntTocPrfDiv)
    // TabCntToc: end-note
    oEltTabCntTocNotP.innerHTML = '<span class="clsColorGreen clsB">notes</span>:<br>' +
      'a) clicking on CONTENT, shows its Toc position, the-links, the-address-link-icon <i class="clsFa clsFaLink clsImgLnkIcn"></i>, and removes ontop windows and highlights.<br>' +
      'b) clicking on TITLE or SEARCH-icon, shows SEARCH-tab.<br>' +
      'c) clicking on ADDRESS-LINK-ICON or on Toc, you see the-address of that text on address-bar.<br>' +
      'd) clicking <span class="clsColorBlue">a-BLUE-LINK</span> shows a-preview.<br>' +
      'e) SECOND-CLICK, usually, does the-events attached to components in-order-to work well on touch-screens.'
    oEltTabCntTocDiv.appendChild(oEltTabCntTocNotP)
    // insert TabCntToc in TabCnt
    oEltPginfTabCntDiv.id = 'idTabCntDiv'
    oEltPginfTabCntDiv.appendChild(oEltTabCntTocDiv)

    // insert tab-cnr IN page-info-cnr
    oEltCnrMainPginfDiv.appendChild(oEltPginfTabCntDiv)

    // insert TabHeaders IN page-info-cnr
    oEltPginfTabHeadersUl.id = 'idPginfTabHeadersUl'
    // if aNamidxRoot, search
    if (oHitp.aNamidxRoot) {
      oEltPginfTabHeadersUl.innerHTML =
        '<li class="clsTabActive"><a href="#idTabCntTocDiv">page-Toc</a></li>' +
        '<li><a href="#idTabCntSrchDiv">search</a></li>'
    } else {
      oEltPginfTabHeadersUl.innerHTML =
        '<li class="clsTabActive"><a href="#idTabCntTocDiv">page-Toc</a></li>'
    }
    oEltCnrMainPginfDiv.insertBefore(oEltPginfTabHeadersUl, oEltCnrMainPginfDiv.firstChild)

    // insert page-path-elt IN page-info-cnr
    oEltPginfPathP.id = 'idPginfPathP'
    oEltPginfPathP.setAttribute('title', '© 2010-2019 Kaseluris.Nikos.1959') // nnn
    if (!document.getElementById('idMetaWebpage_path')) {
      oEltPginfPathP.innerHTML = 'Toc: ' + document.title
    } else {
      oEltPginfPathP.innerHTML = document.getElementById('idMetaWebpage_path').innerHTML
    }
    oEltCnrMainPginfDiv.insertBefore(oEltPginfPathP, oEltCnrMainPginfDiv.firstChild)

    if (oHitp.aNamidxRoot) {
      // TabCntSrch
      oEltTabCntSrchDiv.id = 'idTabCntSrchDiv'
      oEltTabCntSrchDiv.setAttribute('class', 'clsTabCnt')
      oEltTabCntSrchLbl.innerHTML = 'language:'
      oEltTabCntSrchLbl.for = 'idTabCntSrchSlt'
      oEltTabCntSrchSlt.id = 'idTabCntSrchSlt'
      //var oEltTabCntSrchOpn1 = document.createElement('option')
      //oEltTabCntSrchOpn1.value = 'lagALL'
      //oEltTabCntSrchOpn1.text = 'ALL'
      //oEltTabCntSrchSlt.add(oEltTabCntSrchOpn1)
      var oEltTabCntSrchOpn2 = document.createElement('option')
      oEltTabCntSrchOpn2.value = 'lagEng'
      oEltTabCntSrchOpn2.text = 'English (Eng)'
      oEltTabCntSrchSlt.add(oEltTabCntSrchOpn2)
      var oEltTabCntSrchOpn3 = document.createElement('option')
      oEltTabCntSrchOpn3.value = 'lagEll'
      oEltTabCntSrchOpn3.text = 'Greek (Ell)'
      oEltTabCntSrchSlt.add(oEltTabCntSrchOpn3)
      var oEltTabCntSrchOpn4 = document.createElement('option')
      oEltTabCntSrchOpn4.value = 'lagKmo'
      oEltTabCntSrchOpn4.text = 'langoKamo (Kmo)'
      oEltTabCntSrchSlt.add(oEltTabCntSrchOpn4)
      oEltTabCntSrchSlt.options[0].selected = true
      oEltTabCntSrchP.id = 'idTabCntSrchP'
      oEltTabCntSrchP.setAttribute('class', 'clsCenter')
      oEltTabCntSrchP.innerHTML = fTabCntSrchPSetText()
      oEltTabCntSrchLblChk.innerHTML =
        '<input type="checkbox" id="idTabCntSrchChk">show All, not 999 (slow)'
      oEltTabCntSrchLblChk.id = 'idTabCntSrchLblChk'
      oEltTabCntSrchIpt.id = 'idTabCntSrchIpt'

      oEltTabCntSrchSlt.addEventListener('change', function () {
        oEltTabCntSrchP.innerHTML = fTabCntSrchPSetText()
        oEltTabCntSrchOl.innerHTML = sTabCntSrchOl
        oHitp.sNamidx = 'root'
        fSearchSuggest()
      })
      // on enter, go to concept
      // on typing, suggest
      oEltTabCntSrchIpt.addEventListener('keyup', function (oEvtIn) {
        var
          n,
          aLi,
          // list of elements of suggestion,
          sLoc = ''
        if (oEvtIn.code === 'Enter' || oEvtIn.keyCode === 13) {
          // go to highlighted item
          aLi = oEltTabCntSrchOl.getElementsByClassName('clsClicked')
          if (aLi.length > 0) {
            // <a class="clsPreviw" href="...">concept-name</a>
            sLoc = aLi[0].href
            if (sLoc === undefined) {
              // li contains no a-element
              var
                sI = aLi[0].innerHTML,
                // char..chas : 126924 (lagEng03si_2_0),
                sNif = sI.substring(sI.indexOf(' (lag') + 2, sI.lastIndexOf(')')),
                // lagEng03si_2_0,
                a = sI.substring(0, sI.indexOf(' ')).split('..')
              oEltTabCntSrchIpt.value = a[0]
              fSearchSuggest(sNif)
            } else if (sLoc !== '') {
              var sTxt = aLi[0].text
              if (sTxt.indexOf('!⇒') > 0) {
                // found main-name, search for this
                oEltTabCntSrchIpt.value = sTxt.substring(sTxt.indexOf('!⇒') + 2)
                fSearchSuggest()
              } else {
                // go to name's address
                location.href = sLoc
              }
            }
          }
        } else if ((oEvtIn.code !== 'ArrowDown' && oEvtIn.code !== 'ArrowUp' &&
             oEvtIn.code !== 'ArrowLeft' && oEvtIn.code !== 'ArrowRight' &&
             oEvtIn.code !== 'PageDown' && oEvtIn.code !== 'PageUp' &&
             oEvtIn.code !== 'ShiftLeft' && oEvtIn.code !== 'ShiftRight' &&
             oEvtIn.code !== 'ControlLeft' && oEvtIn.code !== 'ControlRight') ||
           (oEvtIn.keyCode !== 40 && oEvtIn.keyCode !== 38 &&
            oEvtIn.keyCode !== 37 && oEvtIn.keyCode !== 39 &&
            oEvtIn.keyCode !== 34 && oEvtIn.keyCode !== 33 &&
            oEvtIn.keyCode !== 16 && oEvtIn.keyCode !== 17)) {
          fSearchSuggest()
        } else if (oEvtIn.code === 'ArrowDown' || oEvtIn.keyCode === 40) {
          aLi = oEltTabCntSrchOl.getElementsByTagName('li')
          for (n = 0; n < aLi.length; n++) {
            var oLi = aLi[n]
            if (oLi.innerHTML.indexOf(' (lag') > 0) {
              if (oLi.className.indexOf('clsClicked') >= 0 && n + 1 < aLi.length) {
                oLi.classList.remove('clsClicked')
                oHitp.oEltClicked = aLi[n + 1]
                aLi[n + 1].classList.add('clsClicked')
                break
              }
            } else if (oLi.children[0].className.indexOf('clsClicked') >= 0 &&
                n + 1 < aLi.length) {
              oLi.children[0].classList.remove('clsClicked')
              oEltCnrPreviewDiv.style.display = 'none'
              oHitp.oEltClicked = aLi[n + 1].children[0]
              aLi[n + 1].children[0].classList.add('clsClicked')
              break
            }
          }
        } else if (oEvtIn.code === 'ArrowUp' || oEvtIn.keyCode === 38) {
          aLi = oEltTabCntSrchOl.getElementsByTagName('li')
          for (n = 0; n < aLi.length; n++) {
            oLi = aLi[n]
            if (oLi.innerHTML.indexOf(' (lag') > 0) {
              if (oLi.className.indexOf('clsClicked') >= 0 && n - 1 >= 0) {
                oLi.classList.remove('clsClicked')
                oHitp.oEltClicked = aLi[n - 1]
                aLi[n - 1].classList.add('clsClicked')
                break
              }
            } else if (oLi.children[0].className.indexOf('clsClicked') > -1 &&
                n - 1 >= 0) {
              oLi.children[0].classList.remove('clsClicked')
              oEltCnrPreviewDiv.style.display = 'none'
              oHitp.oEltClicked = aLi[n - 1].children[0]
              aLi[n - 1].children[0].classList.add('clsClicked')
              break
            }
          }
        }
      })

      /**
       * doing: suggests names of structured-concepts,
       *   that BEGIN with input-search-string.
       * input: nothing string of namidx to search: lagEng03si_2_0, root, ...
       */
      function fSearchSuggest(sSSNamidxIn) {
        var
          nLag,
          // number of lag name in root-namidx,
          sLi,
          // text of first suggestion,
          sLag = oEltTabCntSrchSlt.options[oEltTabCntSrchSlt.selectedIndex].value,
          sNamidx_path,
          sSrchInpt = oEltTabCntSrchIpt.value,
          sSrchLtr = sSrchInpt.charAt(0).toUpperCase(),
          sSuggestions = ''

        oHitp.sNamidx = ''
        oHitp.sSrchCrnt = ''
        oHitp.sSrchNext = ''
        if (sSSNamidxIn) {
          fSSNamidxDisplay(sSSNamidxIn)
        } else if (sSrchInpt.length > 0) {
          // console.log('>>> start: ' + sSrchInpt + ', ' + oHitp.sNamidx + ', ' + oHitp.sSrchCrnt + '..' + oHitp.sSrchNext)
          var bRest = true
          for (var n = 1; n < oHitp.aNamidxRoot.length; n++) {
            // display quantities, for the-lag
            if (sLag === 'lagALL') {
              // search only letter not REST on all languages

            } else if (oHitp.aNamidxRoot[n][0].startsWith(sLag)) {
              // only selected language
              if (oHitp.aNamidxRoot[n][0] === sLag) {
                nLag = n // index of lag in aNamidxRoot ["lagEng",";English",143707],
              } else if (oHitp.aNamidxRoot[n][1] === sSrchLtr) {
                // found search-letter
                oHitp.sSrchCrnt = oHitp.aNamidxRoot[n][1]
                if (!oHitp.aNamidxRoot[n + 1] || oHitp.aNamidxRoot[n + 1][1].startsWith(';')) {
                  // last letter, if n+1 does not exist or is the-name of another lag
                  oHitp.sSrchNext = oHitp.aNamidxRoot[n][1]
                } else {
                  oHitp.sSrchNext = oHitp.aNamidxRoot[n + 1][1]
                }

                if (oHitp.aNamidxRoot[n][0].endsWith('_0')) {
                  // namidx is a-referenceNo
                  fSSNamidxRefManage(oHitp.aNamidxRoot[n][0])
                } else {
                  // namidx is a-referenceNo
                  fSSNamidxDisplay(oHitp.aNamidxRoot[n][0])
                }
                bRest = false
                break
              }
            }
          }
          if (bRest) {
            fSSNamidxDisplay(oHitp.aNamidxRoot[nLag + 1][0])
          }
        } else {
          // sSrchInpt.length < 0
          // no input value, display this:
          oEltTabCntSrchOl.innerHTML = sTabCntSrchOl
          oEltTabCntSrchP.innerHTML = fTabCntSrchPSetText()
          oHitp.sNamidx = 'root'
        }

        /**
         * doing: decide what to do with a-reference-namidx
         * input: lagEng03si_0, lagEng03si_2_0
         */
        function fSSNamidxRefManage(sNamidxRefIn) {
          // console.log(sNamidxRefIn + ': RefManage')

          if (oHitp.aSuggestions.length === 1 || oHitp.aSuggestions[0][0] !== ';' + sNamidxRefIn) {
            // read it
            oHitp.sNamidx = sNamidxRefIn
            sNamidx_path = fSSNamidx_pathFind(sNamidxRefIn)
            sSuggestions = ''
            oXHR = new XMLHttpRequest()
            oXHR.open('GET', sNamidx_path, true)
            oXHR.send(null)
            oXHR.onreadystatechange = function () {
              if (oXHR.readyState === 4 && oXHR.status === 200) {
                oHitp.aSuggestions = JSON.parse(oXHR.responseText)
                var a = oHitp.aSuggestions[0][1].split('..')
                oHitp.sSrchCrnt = a[0].substring(1)
                oHitp.sSrchNext = a[1]

                if (oHitp.sSrchCrnt.toUpperCase() === sSrchInpt.toUpperCase()) {
                  fSSNamidxRefDisplay(sNamidxRefIn)
                } else {
                  fSSFindIdxinref()
                }
              }
            }
          } else if (oHitp.aSuggestions[0][0] === ';' + sNamidxRefIn) {
            if (oHitp.aSuggestions[0][1].split('..')[0].substring(1).toUpperCase() === sSrchInpt.toUpperCase()) {
              fSSNamidxRefDisplay(sNamidxRefIn)
            } else {
              fSSFindIdxinref()
            }
          }

          function fSSFindIdxinref() {
            // we have the-suggestions, find the-namidx of input-search
            for (var n = 2; n < oHitp.aSuggestions.length; n++) {
              // ["lagEng03si_2_0","char..chas",126924],
              // IF sSrchInpt < index, THEN previous is our namidx
              if (sSrchInpt < oHitp.aSuggestions[n][1].split('..')[0]) {
                oHitp.sNamidx = oHitp.aSuggestions[n - 1][0]
                if (oHitp.sNamidx.endsWith('_0')) {
                  fSSNamidxRefManage(oHitp.sNamidx)
                } else {
                  // found namidx, display it
                  fSSNamidxDisplay(oHitp.sNamidx)
                }
                break
              } else if (n + 1 === oHitp.aSuggestions.length) {
                oHitp.sNamidx = oHitp.aSuggestions[n][0]
                if (oHitp.sNamidx.endsWith('_0')) {
                  fSSNamidxRefManage(oHitp.sNamidx)
                } else {
                  // found namidx, display it
                  fSSNamidxDisplay(oHitp.sNamidx)
                }
                break
              }
            }
          }
        }

        /**
         * doing: display names of a-reference-namidx,
         *   make them clickable,
         *   highligts first.
         * input: sNamidxRefIn: lagEng03si_0, ..
         */
        function fSSNamidxRefDisplay(sNamidxRefIn) {
          oHitp.sNamidx = sNamidxRefIn
          if (oHitp.aSuggestions[0][0] === ';' + sNamidxRefIn) {
            fSSNamidxRefDisplayRead()
          } else {
            sNamidx_path = fSSNamidx_pathFind(sNamidxRefIn)
            sSuggestions = ''
            oXHR = new XMLHttpRequest()
            oXHR.open('GET', sNamidx_path, true)
            oXHR.send(null)
            oXHR.onreadystatechange = function () {
              if (oXHR.readyState === 4 && oXHR.status === 200) {
                oHitp.aSuggestions = JSON.parse(oXHR.responseText)
                var a = oHitp.aSuggestions[0][1].split('..')
                oHitp.sSrchCrnt = a[0].substring(1)
                oHitp.sSrchNext = a[1]
                sSrchInpt = fSSEscapeRs(sSrchInpt)
                fSSNamidxRefDisplayRead()
              }
            }
          }

          function fSSNamidxRefDisplayRead() {
            for (var i = 1; i < oHitp.aSuggestions.length; i++) {
              sSuggestions = sSuggestions +
                '<li>' + oHitp.aSuggestions[i][1] + ' : ' + oHitp.aSuggestions[i][2] +
                '  (' + oHitp.aSuggestions[i][0] + ')'
            }
            oEltTabCntSrchP.innerHTML = oHitp.aSuggestions[0][2].toLocaleString() +
              ' ' + oHitp.sSrchCrnt + '..' + oHitp.sSrchNext +
              ' / ' + fTabCntSrchPSetText()
            oEltTabCntSrchOl.innerHTML = sSuggestions
            Array.prototype.slice.call(document.querySelectorAll('#idTabCntSrchOl li')).forEach(function (oEltIn) {
              oEltIn.style.cursor = 'pointer'
              oEltIn.addEventListener('click', function () {
                var
                  sIn = oEltIn.innerHTML,
                  // char..chas : 126924 (lagEng03si_2_0),
                  sNif = sIn.substring(sIn.indexOf('(') + 1, sIn.indexOf(')')),
                  // lagEng03si_2_0,
                  sIx = sIn.substring(0, sIn.indexOf(' ')),
                  // char..chas,
                  a = sIx.split('..')
                oEltTabCntSrchIpt.value = a[0]
                fSSNamidxDisplay(sNif)
              })
            })
            if (oHitp.aSuggestions.length > 0) {
              var oLi = oEltTabCntSrchOl.getElementsByTagName('li')[0]
              oLi.classList.add('clsClicked')
              oHitp.oEltClicked = oLi
            }
          }
        }

        /**
         * doing: display names of a-namidx
         * input: sNamidxIn: lagEll01alfa, lagEng02bi, lagEng03si_0
         */
        function fSSNamidxDisplay(sNamidxIn) {
          oHitp.sNamidx = sNamidxIn

          if (sNamidxIn.endsWith('_0')) {
            // case: ref-namidx
            fSSNamidxRefDisplay(sNamidxIn)
          } else {
            // case: refNo-namidx
            // IF sNamidxIn is different from last-read, get it
            if (!oHitp.aSuggestions || (oHitp.aSuggestions[0][0] !== ';' + sNamidxIn)) {
              sNamidx_path = fSSNamidx_pathFind(sNamidxIn)
              sSuggestions = ''
              oXHR = new XMLHttpRequest()
              oXHR.open('GET', sNamidx_path, true)
              oXHR.send(null)
              oXHR.onreadystatechange = function () {
                if (oXHR.readyState === 4 && oXHR.status === 200) {
                  oHitp.aSuggestions = JSON.parse(oXHR.responseText)
                  var a = oHitp.aSuggestions[0][1].split('..')
                  oHitp.sSrchCrnt = a[0].substring(1)
                  oHitp.sSrchNext = a[1]
                  fSSNamidxDisplayRead()
                }
              }
            } else if (oHitp.aSuggestions[0][0] === ';' + sNamidxIn) {
              // we have-read the-namidx, loop
              fSSNamidxDisplayRead()
            }
          } // refNo-namidx

          /**
           * doing: reads from aSuggestions the-names that match the-search-name,
           *   formats them as preview-links,
           *   adds the-eventlistener 'link-preview' on them and
           *   highlights the-first.
           */
          function fSSNamidxDisplayRead() {
            var n, i
            if (sSrchInpt.toUpperCase() === oHitp.sSrchCrnt.toUpperCase()) {
              // if sSrchInpt === sSrchCrnt, display all
              n = 0
              for (i = 1; i < oHitp.aSuggestions.length; i++) {
                n = n + 1
                sSuggestions = sSuggestions +
                  '<li><a class="clsPreview" href="' + oHitp.sPathSite + 'dirMiwMcs/' +
                  oHitp.aSuggestions[i][1] + '">' +
                  oHitp.aSuggestions[i][0]
                if (!document.getElementById('idTabCntSrchChk').checked) {
                  if (n > 998) {
                    sSuggestions = sSuggestions + '<li>...'
                    break
                  }
                }
              }
              oEltTabCntSrchP.innerHTML =
                oHitp.aSuggestions[0][2].toLocaleString() +
                ' ' + oHitp.sSrchCrnt + '..' + oHitp.sSrchNext +
                ' / ' + fTabCntSrchPSetText()
              oEltTabCntSrchOl.innerHTML = sSuggestions
              fSSEvtPreview()
              if (oHitp.aSuggestions.length > 0) {
                sLi = oEltTabCntSrchOl.getElementsByTagName('li')[0]
                sLi.children[0].classList.add('clsClicked')
                oHitp.oEltClicked = sLi.children[0]
              }
            } else {
              // else display part
              n = 0
              // console.log(new RegExp('^u\\+','i').test('U+0011')) // true
              sSrchInpt = fSSEscapeRs(sSrchInpt)
              for (i = 1; i < oHitp.aSuggestions.length; i++) {
                if (new RegExp('^' + sSrchInpt, 'i').test(oHitp.aSuggestions[i][0])) {
                  // IF n > 999 stop ?
                  n = n + 1
                  sSuggestions = sSuggestions +
                    '<li><a class="clsPreview" href="' + oHitp.sPathSite + 'dirMiwMcs/' +
                    oHitp.aSuggestions[i][1] + '">' +
                    oHitp.aSuggestions[i][0]
                  if (!document.getElementById('idTabCntSrchChk').checked) {
                    if (n > 998) {
                      sSuggestions = sSuggestions + '<li>...'
                      break
                    }
                  }
                }
              }
              if (!document.getElementById('idTabCntSrchChk').checked) {
                if (n > 998) {
                  oEltTabCntSrchP.innerHTML = n.toLocaleString() +
                    'plus / ' + oHitp.aSuggestions[0][2].toLocaleString() +
                    ' ' + oHitp.sSrchCrnt + '..' + oHitp.sSrchNext +
                    ' / ' + fTabCntSrchPSetText()
                } else {
                  oEltTabCntSrchP.innerHTML = n.toLocaleString() +
                    ' / ' + oHitp.aSuggestions[0][2].toLocaleString() +
                    ' ' + oHitp.sSrchCrnt + '..' + oHitp.sSrchNext +
                    ' / ' + fTabCntSrchPSetText()
                }
              } else {
                oEltTabCntSrchP.innerHTML = n.toLocaleString() +
                  ' / ' + oHitp.aSuggestions[0][2].toLocaleString() +
                  ' ' + oHitp.sSrchCrnt + '..' + oHitp.sSrchNext +
                  ' / ' + fTabCntSrchPSetText()
              }
              oEltTabCntSrchOl.innerHTML = sSuggestions
              fSSEvtPreview()
              if (sSuggestions.length > 0) {
                sLi = oEltTabCntSrchOl.getElementsByTagName('li')[0]
                sLi.children[0].classList.add('clsClicked')
                oHitp.oEltClicked = sLi.children[0]
              }
            }
          }
        }

        /**
         * input: lagEng01ei, lagEll01alfa
         * output: site/dirMiwMcs/dirNamidx/dirLagEng/namidx.lagEng01ei.json
         */
        function fSSNamidx_pathFind(sNamidxIn) {
          return sPathNames + 'dirL' + sNamidxIn.substring(1, 6) +
                 '/namidx.' + sNamidxIn + '.json'
        }

        /**
         * doing: adds preview-event on links in search-sugestions and
         *   adds its text on search-input
         */
        function fSSEvtPreview() {
          // clicking on TabCntSrchOl-links, first highlight
          Array.prototype.slice.call(document.querySelectorAll('#idTabCntSrchOl a')).forEach(function (oEltIn) {
            var sTxt = oEltIn.innerHTML
            if (sTxt.indexOf('!⇒') > 0) {
              // found main-name
              oEltIn.addEventListener('click', function (oEvtIn) {
                // don't link, set main-name as search-name, search for this.
                oEvtIn.preventDefault()
                oEltTabCntSrchIpt.value = sTxt.substring(sTxt.indexOf('!⇒') + 2)
                fSearchSuggest()
              })
            } else {
              fEvtLink(oEltIn)
              oEltIn.addEventListener('click', function () {
                oEltTabCntSrchIpt.value = sTxt
              })
            }
          })
        }

        /**
         * input: a-search-name string
         * output: the same string escaped (for '+' '.' '|' '(' '*')
         *   to use it as a-regexp without special chars.
         */
        function fSSEscapeRs(sIn) {
          if (sIn.indexOf('+') !== -1) {
            sIn = sIn.split('+').join('\\+')
          }
          if (sIn.indexOf('.') !== -1) {
            sIn = sIn.split('.').join('\\.')
          }
          if (sIn.indexOf('|') !== -1) {
            sIn = sIn.split('|').join('\\|')
          }
          if (sIn.indexOf('(') !== -1) {
            sIn = sIn.split('(').join('\\(')
          }
          if (sIn.indexOf('*') !== -1) {
            sIn = sIn.split('*').join('\\*')
          }
          return sIn
        }
        document.getElementById('idCnrMainPginfDiv').scrollTop = 0 //nnn
      }

      oEltTabCntSrchOl.addEventListener('keyup', function (oEvtIn) {
        var aLi, n, oLi
        if (oEvtIn.code === 'ArrowDown' || oEvtIn.keyCode === 40) {
          aLi = oEltTabCntSrchOl.getElementsByTagName('li')
          for (n = 0; n < aLi.length; n++) {
            oLi = aLi[n]
            if (oLi.children[0].className.indexOf('clsClicked') > -1 &&
                n + 1 < aLi.length) {
              oLi.children[0].classList.remove('clsClicked')
              oEltCnrPreviewDiv.style.display = 'none'
              oHitp.oEltClicked = aLi[n + 1].children[0]
              aLi[n + 1].children[0].classList.add('clsClicked')
              break
            }
          }
        } else if (oEvtIn.code === 'ArrowUp' || oEvtIn.keyCode === 38) {
          aLi = oEltTabCntSrchOl.getElementsByTagName('li')
          for (n = 0; n < aLi.length; n++) {
            oLi = aLi[n]
            if (oLi.children[0].className.indexOf('clsClicked') > -1 &&
                n - 1 >= 0) {
              oLi.children[0].classList.remove('clsClicked')
              oEltCnrPreviewDiv.style.display = 'none'
              oHitp.oEltClicked = aLi[n - 1].children[0]
              aLi[n - 1].children[0].classList.add('clsClicked')
              break
            }
          }
        }
      })
      oEltTabCntSrchOl.id = 'idTabCntSrchOl'
      oEltTabCntSrchOl.innerHTML = sTabCntSrchOl
      oEltTabCntSrchDiv.appendChild(oEltTabCntSrchLbl)
      oEltTabCntSrchDiv.appendChild(oEltTabCntSrchSlt)
      oEltTabCntSrchDiv.appendChild(oEltTabCntSrchP)
      oEltTabCntSrchDiv.appendChild(oEltTabCntSrchLblChk)
      oEltTabCntSrchDiv.appendChild(oEltTabCntSrchIpt)
      oEltTabCntSrchDiv.appendChild(oEltTabCntSrchOl)
      oEltPginfTabCntDiv.appendChild(oEltTabCntSrchDiv)
    }

    /**
     * doing: returns the-text with the-number of names found in search-tab
     */
    function fTabCntSrchPSetText() {
      var
        nLag,
        sLag = oEltTabCntSrchSlt.options[oEltTabCntSrchSlt.selectedIndex].value
      if (sLag === 'lagALL') {
        return oHitp.aNamidxRoot[0][2].toLocaleString() + ' total NAMES'
      } else {
        for (var n = 1; n < oHitp.aNamidxRoot.length; n++) {
          if (oHitp.aNamidxRoot[n][0] === sLag) {
            nLag = n
            break
          }
        }
        return oHitp.aNamidxRoot[nLag][2].toLocaleString() + ' ' + oHitp.aNamidxRoot[nLag][1].substring(1) +
          ' / ' + oHitp.aNamidxRoot[0][2].toLocaleString() + ' total NAMES'
      }
    }

    // clicking on content-link first go to its location,
    // this way the backbutton goes where we clicked
    Array.prototype.slice.call(document.querySelectorAll('#idCnrMainPgcntDiv a')).forEach(function (oEltIn) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        var
          oEltScn = oEltIn,
          sIdScn

        oEvtIn.preventDefault()

        function fGo_where_clicked() {
          // first, go to where you clicked
          while (!oEltScn.tagName.match(/^SECTION/i)) {
            sIdScn = oEltScn.id
            if (sIdScn) {
              break
            } else {
              oEltScn = oEltScn.parentNode
            }
          }
          sIdScn = '#' + sIdScn
          if (location.hash !== sIdScn) {
            location.href = sIdScn
          }
        }

        if (oEltIn.className.indexOf('clsClicked') > -1) {
          oEltIn.classList.remove('clsClicked')
          fGo_where_clicked()
          location.href = oEltIn.href
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
          oHitp.oEltClicked = oEltIn
          oEltIn.classList.add('clsClicked')
          if (oEltIn.className.indexOf('clsPreview') > -1) {
            fEvtClickContent(oEvtIn)
            fEvtPreview(oEvtIn)
          }
        }
      })
    })

    // insert MainPginf-cnr in Main-cnr */
    oEltCnrMainDiv.insertBefore(oEltCnrMainPginfDiv, oEltCnrMainDiv.firstChild)

    // Sets width of MainPginf-cnr
    function fWidthPginf(nPercentIn) {
      var
        nWidthPgcnt,
        nWidthPginf

      nWidthPginf = parseInt(window.outerWidth * (nPercentIn / 100))
      nWidthPgcnt = oEltCnrMainDiv.offsetWidth - nWidthPginf
      oEltCnrMainPginfDiv.style.width = nWidthPginf + 'px'
      oEltCnrMainPgcntDiv.style.width = nWidthPgcnt + 'px'
      oEltCnrMainPgcntDiv.style.left = nWidthPginf + 'px'
    }
    fWidthPginf(oHitp.nCfgPageinfoWidth)
    // needed for proper zoom
    window.addEventListener('resize', function () {
      fWidthPginf(oHitp.nCfgPageinfoWidth)
    })

    // on MainPgcnt-cnr get-id, highlight toc, highlight links, remove popup, remove clicked link */
    fEvtClickContent = function (oEvtIn) {
      var sIdScn = '',
        oEltScn = oEvtIn.target

      if (oEvtIn.target.nodeName !== 'A') {
        oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow')
      }

      oEltCnrPreviewDiv.style.display = 'none' // remove popup
      if (oHitp.oEltSitemenuUl) {
        oEltCnrSiteDiv.style.display = 'none' // remove site-content
      }
      oEltCnrWidthDiv.style.display = 'none' // remove width-content
      if (oHitp.aNamidxRoot) {
        fCnrTocShow()
      }

      /* find id of enclosing SECTION, this is-stored on toc */
      sIdScn = '#' + oEltScn.id
      while (oEltScn && !oEltScn.tagName.match(/^SECTION/i)) {
        oEltScn = oEltScn.parentNode
        if (!oEltScn.tagName) {
          break
        } else if (oEltScn.tagName.match(/^HEADER/i) ||
                oEltScn.tagName.match(/^FOOTER/i)) {
          break
        }
      }
      if (oEltScn.tagName) {
        if (oEltScn.tagName.match(/^HEADER/i)) {
          sIdScn = '#idHeader'
        } else if (oEltScn.tagName.match(/^FOOTER/i)) {
          sIdScn = '#idFooter'
        } else {
          sIdScn = '#' + oEltScn.id
        }
      }

      /* on toc highlight the-found-id */
      Array.prototype.slice.call(document.querySelectorAll('#idTocTri a')).forEach(function (oEltAIn) {
        if (oEltAIn.getAttribute('href') === sIdScn) {
          oHitp.oTreeUl.fTruExpandParent(oEltAIn)
          oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltAIn)
          if (oEltAIn.scrollIntoViewIfNeeded) {
            oEltAIn.scrollIntoViewIfNeeded(true)
          } else {
            oEltAIn.scrollIntoView(false)
          }
          document.getElementById('idCnrMainPginfDiv').scrollLeft = 0
        }
      })

      // on found-id on a-elt add clsClickCnt
      oHitp.sQrslrAClkLast = oHitp.sQrslrAClk
      var oElt = oEvtIn.target
      oHitp.sQrslrAClk = '#' + oElt.id + ' a'
      while (oHitp.sQrslrAClk === '# a') {
        oElt = oElt.parentNode
        oHitp.sQrslrAClk = '#' + oElt.id + ' a'
      }
      if (oHitp.sQrslrAClkLast !== oHitp.sQrslrAClk) {
        Array.prototype.slice.call(document.querySelectorAll(oHitp.sQrslrAClkLast)).forEach(function (oEltAIn) {
          oEltAIn.classList.remove('clsClickCnt')
        })
        Array.prototype.slice.call(document.querySelectorAll(oHitp.sQrslrAClk)).forEach(function (oEltAIn) {
          oEltAIn.classList.add('clsClickCnt')
        })
      }
    }
    // on MainPgcnt-cnr get id on mouseover and highlight toc
    fEvtMouseoverContent = function (oEvtIn) {
      var sIdScn = '',
        oEltScn = oEvtIn.target

      // Find id of enclosing SECTION, this is-stored on toc
      sIdScn = '#' + oEltScn.id
      while (oEltScn && !oEltScn.tagName.match(/^SECTION/i)) {
        oEltScn = oEltScn.parentNode
        if (!oEltScn.tagName) {
          break
        } else if (oEltScn.tagName.match(/^HEADER/i) ||
                oEltScn.tagName.match(/^FOOTER/i)) {
          break
        }
      }
      if (oEltScn.tagName) {
        if (oEltScn.tagName.match(/^HEADER/i)) {
          sIdScn = '#idHeader'
        } else if (oEltScn.tagName.match(/^FOOTER/i)) {
          sIdScn = '#idFooter'
        } else {
          sIdScn = '#' + oEltScn.id
        }
      }

      // on toc highlight the-found-id
      Array.prototype.slice.call(document.querySelectorAll('#idTocTri a')).forEach(function (oEltAIn) {
        if (oEltAIn.getAttribute('href') === sIdScn) {
          oHitp.oTreeUl.fTruExpandParent(oEltAIn)
          oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltAIn)
          if (oEltAIn.scrollIntoViewIfNeeded) {
            oEltAIn.scrollIntoViewIfNeeded(true)
          } else {
            oEltAIn.scrollIntoView(false)
          }
          document.getElementById('idCnrMainPginfDiv').scrollLeft = 0
        }
      })
    }
    // events click, mouseover on elements in page-content-container
    Array.prototype.slice.call(document.querySelectorAll('#idCnrMainPgcntDiv *[id]')).forEach(function (oEltIn) {
      oEltIn.addEventListener('click', fEvtClickContent)
      oEltIn.addEventListener('mouseover', fEvtMouseoverContent)
    })

    // event click on TAB-Headers
    Array.prototype.slice.call(document.querySelectorAll('ul#idPginfTabHeadersUl li')).forEach(function (oEltIn) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault()
        // Remove any 'active' class
        document.querySelector('.clsTabActive').classList.remove('clsTabActive')
        // Add 'active' class to selected tab
        oEltIn.classList.add('clsTabActive')
        // Hide all tab content
        Array.prototype.slice.call(document.getElementsByClassName('clsTabCnt')).forEach(function (oEltIn) {
          oEltIn.style.display = 'none'
        })
        // Show content of active tab
        sIdTabActive = document.querySelector('.clsTabActive a').getAttribute('href').substring(1)
        document.getElementById(sIdTabActive).style.display = 'block'
        if (sIdTabActive === 'idTabCntSrchDiv') {
          // on TabCntSrch focus input-element
          oEltTabCntSrchIpt.focus()
        }
        // return false;
      })
    })
    if (oHitp.aNamidxRoot) {
      document.getElementById('idTabCntSrchDiv').style.display = 'none'
    }

    // insert popup-container
    oEltCnrPreviewDiv.id = 'idCnrPreviewDiv'
    oEltBody.appendChild(oEltCnrPreviewDiv)

    // on clsPreview-links add this event-listener
    fEvtPreview = function (oEvtIn) {
      var sLoc, sId1, sId2,
        nPy, nPx, nWh, nWw,
        oDoc
      oEvtIn.preventDefault()
      oEvtIn.stopPropagation()
      nPx = oEvtIn.pageX
      nPy = oEvtIn.pageY
      nWh = window.innerHeight
      nWw = window.innerWidth
      if (oEvtIn.target.nodeName === 'IMG') {
        // links on img-elements
        sId1 = oEvtIn.target.parentNode.href
      } else {
        sId1 = oEvtIn.target.href
      }
      if (sId1.indexOf('#') > 0) {
        sId2 = sId1.substring(sId1.indexOf('#') + 1)
        sId1 = sId1.substring(0, sId1.indexOf('#'))
      }
      sLoc = location.href
      if (sLoc.indexOf('#') > 0) {
        sLoc = sLoc.substring(0, sLoc.indexOf('#'))
      }
      // internal-link
      if (sLoc === sId1) {
        oEltCnrPreviewDiv.innerHTML = '<section>' + document.getElementById(sId2).innerHTML + '</section>'
      } else {
        oEltCnrPreviewDiv.innerHTML = ''
        oXHR = new XMLHttpRequest()
        oXHR.open('GET', sId1, true)
        oXHR.send(null)
        oXHR.onreadystatechange = function () {
          if (oXHR.readyState === 4 && oXHR.status === 200) { // DONE, OK
            if (sId2) {
              // IF #fragment url, display only this element.
              oDoc = (new DOMParser()).parseFromString(oXHR.responseText, 'text/html')
              oEltCnrPreviewDiv.innerHTML = '<section>' + oDoc.getElementById(sId2).innerHTML + '</section>'
            } else {
              // IF link to a picture, display it, not its code.
              if (sId1.match(/(png|jpg|gif)$/)) {
                var oImg = new Image()
                var nIW, nIH, nPW, nPH
                nPW = nWw / 2.2
                nPH = nWh * 0.4
                oImg.src = sId1
                oImg.addEventListener('load', function () {
                  nIW = oImg.width
                  nIH = oImg.height
                  if (nIH > nPH) {
                    nIW = (nIW * nPH) / nIH
                    nIH = nPH
                  }
                  oEltCnrPreviewDiv.innerHTML = '<p class="clsCenter"><img src="' + sId1 +
                    '" width="' + nIW +
                    '" height="' + nIH + '" /></p>'
                })
              } else {
                document.getElementById('idCnrPreviewDiv').innerHTML = oXHR.responseText
              }
            }
          }
        }
      }

      oEltCnrPreviewDiv.style.top = (nWh / 2) - (nWh * 0.44 / 2) + 'px' // the height of popup is 44% of window
      if (nPx < nWw / 2) {
        oEltCnrPreviewDiv.style.left = (nWw / 2) + 9 + 'px'
      } else {
        oEltCnrPreviewDiv.style.left = 26 + 'px'
      }
      oEltCnrPreviewDiv.style.overflow = 'auto'
      oEltCnrPreviewDiv.style.display = 'block'
    }

    // change font
    document.getElementById('idRdbFontMono').addEventListener('click', function () {
      oEltBody.style.fontFamily = 'fntUbuntuMonoRgr, "Courier New", "Lucida Console"'
    })
    document.getElementById('idRdbFontSerif').addEventListener('click', function () {
      oEltBody.style.fontFamily = '"Times New Roman", Georgia'
    })
    document.getElementById('idRdbFontSSerif').addEventListener('click', function () {
      oEltBody.style.fontFamily = 'Arial, Verdana'
    })

    // event on clicking a link in toc
    Array.prototype.slice.call(document.querySelectorAll('#idTocTri li > a')).forEach(function (oEltIn) {
      oEltIn.addEventListener('click', function (oEvtIn) {
        oEvtIn.preventDefault()
        oHitp.oEltClicked.classList.remove('clsTtpShow')
        if (oEltIn.className.indexOf('clsPreview') > -1) {
          if (oEltIn.className.indexOf('clsClicked') > -1) {
            oEltIn.classList.remove('clsClicked')
            oEltCnrPreviewDiv.style.display = 'none'
            location.href = '#' + oEvtIn.target.href.split('#')[1]
            oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltIn)
          } else {
            oHitp.oEltClicked.classList.remove('clsClicked')
            oHitp.oEltClicked = oEltIn
            oEltIn.classList.add('clsClicked')
            fEvtPreview(oEvtIn)
          }
        } else {
          oEltCnrPreviewDiv.style.display = 'none'
          location.href = '#' + oEvtIn.target.href.split('#')[1]
          oHitp.fTocTriHighlightNode(oEltCnrMainPginfDiv, oEltIn)
        }
      })
    })

    // clicking on PginfPathP-links and TabCntSrchOl-links, first highlight
    Array.prototype.slice.call(document.querySelectorAll('#idPginfPathP a, #idTabCntSrchOl a')).forEach(function (oEltIn) {
      fEvtLink(oEltIn)
    })

    window.onhashchange = function () {
      location.href = location.hash
    }

    // focus on right-div, Div can get the focus if it has tabindex attribute... on chrome
    document.getElementById('idCnrMainPgcntDiv').setAttribute('tabindex', -1)
    document.getElementById('idCnrMainPgcntDiv').focus()
  }

  /**
   * created: {2013-07-17}
   * Returns a string html-ul-element that holds
   * the-toc-tree with the-headings of the-page.
   * <ul id="idTocTri" class="clsTreeUl">
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
      aElm = document.body.getElementsByTagName('*'),
      aHdng = [],
      nLvlThis, nLvlNext, nLvlPrev = 0, nLvlToc = 0, n, nJ,
      rHdng = /h\d/i,
      sUl = '', sHcnt, sHid, sHlvl,
      oElt

    for (n = 0; n < aElm.length; n += 1) {
      oElt = aElm[n]
      if (rHdng.test(oElt.nodeName)) {
        aHdng.push(oElt)
      }
      // and and the 'footer' element
      if (oElt.nodeName.match(/footer/i)) {
        aHdng.push(oElt)
      }
    }
    aElm = []

    // the first heading is the title of doc
    sHcnt = aHdng[0].innerHTML
    sHcnt = sHcnt.replace(/\n {4}<a class="clsHide" href=[^<]+<\/a>/, '')
    sHcnt = sHcnt.replace(/<br\/*>/g, ' ')
    sUl = '<ul id="idTocTri" class="clsTreeUl"><li><a class="clsPreview" href="#idHeader">' + sHcnt + '</a>'

    for (n = 1; n < aHdng.length; n += 1) {
      oElt = aHdng[n]
      // special footer case;
      if (oElt.nodeName.match(/footer/i)) {
        nLvlThis = 1
        nLvlToc = 1
        sUl += '<li><a class="clsPreview" href="#idFooter">footer</a></li>'
        nLvlPrev = 1
        continue
      }
      nLvlThis = oElt.nodeName.substr(1, 1)
      if (nLvlThis > nLvlPrev) {
        sUl += '<ul>' // new list
        nLvlToc = 1 + parseInt(nLvlToc, 10)
      }
      sHid = oElt.id
      sHlvl = sHid.charAt(sHid.length - 1)
      sHid = sHid.replace(/(\w*)H\d/, '$1')
      // removes from heading the 'clsHide' content
      sHcnt = oElt.innerHTML
      // jslint regexp: true
      sHcnt = sHcnt.replace(/\n {4}<a class="clsHide" href=[^<]+<\/a>/, '')
      sHcnt = sHcnt.replace(/<[^>]+>/g, '')
      // jslint regexp: false
      sHcnt = sHcnt.replace(/<br\/*>/g, ' ')
      if (sHid === 'idComment') {
        sUl += '<li><a href="#' + sHid + '">' + sHcnt + '</a>'
      } else {
        sUl += '<li><a class="clsPreview" href="#' + sHid + '">' + sHcnt + '</a>'
      }
      if (aHdng[n + 1]) {
        nLvlNext = aHdng[n + 1].nodeName.substr(1, 1)
        if (aHdng[n + 1].nodeName.match(/footer/i)) {
          nLvlNext = 1
        }
        if (nLvlThis > nLvlNext) {
          nLvlToc = nLvlToc - nLvlNext
          for (nJ = 0; nJ < nLvlToc; nJ += 1) {
            sUl += '</li></ul></li>'
          }
          nLvlToc = nLvlNext
        }
        if (nLvlThis === nLvlNext) {
          sUl += '</li>'
        }
      }
      nLvlPrev = nLvlThis
    }
    sUl += '</li></ul></li></ul>'
    return sUl
  }

  /**
   * Highlights ONE item in toc-list
   */
  oHitp.fTocTriHighlightNode = function (oEltCnrMainPginfDiv, oElm) {
    // removes existing highlighting
    var
      aTocTriA = oEltCnrMainPginfDiv.getElementsByTagName('a'),
      n

    for (n = 0; n < aTocTriA.length; n += 1) {
      aTocTriA[n].classList.remove('clsTocTriHighlight')
    }
    oElm.classList.add('clsTocTriHighlight')
  }

  /**
   * Created: {2016-07-20}
   * Makes collapsible-trees, unordered-lists with clsTreeUl.
   */
  oHitp.oTreeUl = (function () {
    var oTreeUl = {}

    /**
     * Creates one-clsTreeUl-list tree.
     * If no input, creates ALL lists of the-doc, trees.
     */
    oTreeUl.fTruCreate = function (oUlIn) {
      // find all clsTreeUl-lists
      var
        aLi,
        aUl,
        aUlSub,
        n, n2,
        oEltI

      if (oUlIn) {
        aUl = [oUlIn]
      } else {
        aUl = document.querySelectorAll('.clsTreeUl')
      }

      for (n = 0; n < aUl.length; n++) {
        // add the-clsTreeUl to the-sub-lists
        var aSubul = aUl[n].getElementsByTagName('ul')
        for (n2 = 0; n2 < aSubul.length; n2++) {
          aSubul[n2].className = 'clsTreeUl'
        }

        // on first li:
        // add node-image
        // add event-listener
        aLi = aUl[n].getElementsByTagName('li')
        for (n2 = 0; n2 < aLi.length; n2++) {
          aUlSub = aLi[n2].getElementsByTagName('ul')
          oEltI = document.createElement('i')
          oEltI.setAttribute('class', 'clsFa clsFaCrcCol')
          if (aUlSub.length === 0) {
            oEltI.setAttribute('class', 'clsFa clsFaCrc')
          } else {
            oEltI.addEventListener('click', fTruListenerClickCreate(aLi[n2]))
          }
          aLi[n2].insertBefore(oEltI, aLi[n2].firstChild)

          // collapse the-lists within this listitem
          oTreeUl.fTruToggleLi(aLi[n2])

          // first-level expand
          if (aLi[n2].parentNode.parentNode.nodeName !== 'LI') {
            oTreeUl.fTruToggleLi(aLi[n2])
          }
        }
      }
    }

    /**
     * Expands or Collapses an-input-listitem.
     *
     * @input {object} oEltLiIn The-listitem to toggle
     */
    oTreeUl.fTruToggleLi = function (oEltLiIn) {
      var
        aUl,
        // determine whether to expand or collaple,
        bCollapsed = oEltLiIn.firstChild.className.indexOf('clsFaCrcExp') > -1,
        n,
        oEltLi

      // find uls of input li
      aUl = oEltLiIn.getElementsByTagName('ul')
      for (n = 0; n < aUl.length; n++) {
        // toggle display of first-level ul
        oEltLi = aUl[n]
        while (oEltLi.nodeName !== 'LI') {
          oEltLi = oEltLi.parentNode
        }
        if (oEltLi === oEltLiIn) {
          aUl[n].style.display = bCollapsed ? 'block' : 'none'
        }
      }

      if (aUl.length > 0) {
        if (bCollapsed) {
          if (oEltLiIn.firstChild.tagName === 'I') {
            oEltLiIn.firstChild.classList.remove('clsFaCrcExp')
            oEltLiIn.firstChild.classList.add('clsFaCrcCol')
          }
        } else {
          if (oEltLiIn.firstChild.tagName === 'I') {
            oEltLiIn.firstChild.classList.remove('clsFaCrcCol')
            oEltLiIn.firstChild.classList.add('clsFaCrcExp')
          }
        }
      }
    }

    /** Makes the display-style: none. */
    oTreeUl.fTruTocCollapseAll = function () {
      var
        aSubnodes,
        aTocTriLI = document.getElementById('idTocTri').getElementsByTagName('li'),
        n

      for (n = 0; n < aTocTriLI.length; n += 1) {
        aSubnodes = aTocTriLI[n].getElementsByTagName('ul')
        if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'block') {
          oHitp.oTreeUl.fTruToggleLi(aTocTriLI[n])
        }
      }
    }

    /** Makes the display-style: block. */
    oTreeUl.fTruTocExpandAll = function () {
      var
        aSubnodes,
        aTocTriLI = document.getElementById('idTocTri').getElementsByTagName('li'),
        n

      for (n = 0; n < aTocTriLI.length; n += 1) {
        aSubnodes = aTocTriLI[n].getElementsByTagName('ul')
        if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'none') {
          oHitp.oTreeUl.fTruToggleLi(aTocTriLI[n])
        }
      }
    }

    /** Expands the first children. */
    oTreeUl.fTruTocExpandFirst = function () {
      var aTocTriLI, aSubnodes

      aTocTriLI = document.getElementById('idTocTri').getElementsByTagName('li')
      /* expand the first ul-element */
      aSubnodes = aTocTriLI[0].getElementsByTagName('ul')
      if (aSubnodes.length > 0 && aSubnodes[0].style.display === 'none') {
        oHitp.oTreeUl.fTruToggleLi(aTocTriLI[0])
      }
    }

    /**
     * Expands all the parents ONLY, of an element with link to a heading.
     */
    oTreeUl.fTruExpandParent = function (oEltAIn) {
      var oEltI, oEltUl

      oHitp.oTreeUl.fTruTocCollapseAll()
      // the parent of a-link-elm is li-elm with parent a ul-elm.
      oEltUl = oEltAIn.parentNode.parentNode
      while (oEltUl.tagName === 'UL') {
        oEltUl.style.display = 'block'
        // the parent is li-elm, its first-child is img
        oEltI = oEltUl.parentNode.firstChild
        if (oEltI.tagName === 'I' && oEltI.className.indexOf('clsFaCrcExp') > -1) {
          oEltI.classList.remove('clsFaCrcExp')
          oEltI.classList.add('clsFaCrcCol')
        }
        oEltUl = oEltUl.parentNode.parentNode
      }
    }

    /**
     * Returns a-click-listener that toggles the input listitem.
     *
     * @input {object} oEltLiIn The-listitem to toggle
     */
    function fTruListenerClickCreate(oEltLiIn) {
      return function (oEvtIn) {
        var
          oEltI = oEvtIn.target,
          oEltLi = (oEvtIn.target.parentNode),
          sIcls = oEltI.className

        if (sIcls.indexOf('clsTriClicked') > -1) {
          oHitp.oEltClicked.classList.remove('clsTriClicked')
          oEltI.classList.remove('clsTriClicked')
          if (oEltLi === oEltLiIn) {
            oTreeUl.fTruToggleLi(oEltLiIn)
          }
          if (sIcls.indexOf('clsFaCrcExp') > -1) {
            oEltI.classList.remove('clsFaCrcExp')
            oEltI.classList.add('clsFaCrcCol')
          } else if (sIcls.indexOf('clsFaCrcCol') > -1) {
            oEltI.classList.remove('clsFaCrcCol')
            oEltI.classList.add('clsFaCrcExp')
          }
        } else {
          oHitp.oEltClicked.classList.remove('clsClicked', 'clsTtpShow', 'clsTriClicked')
          oHitp.oEltClicked = oEltI
          oEltI.classList.add('clsTriClicked')
        }
      }
    }

    return oTreeUl
  })()

  /**
   * doing: reads the-config, site-menu, namidx.root files, if exist,
   * and creates the-containers of the-page.
   *
   * The DOMContentLoaded event fires when the initial HTML document 
   * has been completely loaded and parsed,
   * WITHOUGHT waiting for stylesheets, images, and subframes to finish loading.
   * A different event, load, should be used only to detect a fully-loaded page.
   */
  document.addEventListener('DOMContentLoaded', function () {
    // read aNamidxRoot
    var
      oConfig,
      oXHR,
      sNiRoot

    if (location.hostname === '') {
      // no server, display only Toc
      oHitp.sPathSite = ''
      oHitp.sPathSitemenu = ''
    } else if (location.hostname === 'localhost') {
      oHitp.sPathSite = location.origin + oHitp.sCfgHomeLocal
      oHitp.sPathSitemenu = oHitp.sPathSite + 'filSite-structureLocal.html'
    } else {
      oHitp.sPathSite = location.origin + '/'
      oHitp.sPathSitemenu = oHitp.sPathSite + 'filSite-structure.html'
    }

    if (oHitp.sPathSitemenu) {
      // server found
      // read config
      oXHR = new XMLHttpRequest()
      oXHR.open('GET', oHitp.sPathSite + 'config.json', true)
      oXHR.send(null)
      oXHR.onreadystatechange = function () {
        if (oXHR.readyState === 4) {
          if (oXHR.status === 404) {
            // no config
            fSitemenu()
          } else if (oXHR.status === 200) {
            oConfig = JSON.parse(oXHR.responseText)
            if (oConfig.nCfgPageinfoWidth) {
              oHitp.nCfgPageinfoWidth = oConfig.nCfgPageinfoWidth
            }
            if (oConfig.sCfgHomeLocal) {
              oHitp.sCfgHomeLocal = oConfig.sCfgHomeLocal
              if (location.hostname === 'localhost') {
                oHitp.sPathSite = location.origin + oHitp.sCfgHomeLocal
                oHitp.sPathSitemenu = oHitp.sPathSite + 'filSite-structureLocal.html'
              } else if (location.hostname.length > 1) {
                oHitp.sPathSite = location.origin + '/'
                oHitp.sPathSitemenu = oHitp.sPathSite + 'filSite-structure.html'
              }
            }
            fSitemenu()
          }
        }
      }
    } else {
      // no server, display only Toc
      oHitp.fContainersInsert()
      oHitp.oTreeUl.fTruCreate()
      // IF on idMetaWebpage_path paragraph we have and the clsTocExpand
      // then the toc expands-all
      if (document.getElementById('idMetaWebpage_path')) {
        if (document.getElementById('idMetaWebpage_path').getAttribute('class') === 'clsTocExpand') {
          oHitp.oTreeUl.fTruTocExpandAll()
        }
      }
    }

    /**
     * doing: reads the-site-menu, if exists, and creates the-containers of the-page.
     */
    function fSitemenu() {
      // site-menu
      if (oHitp.sPathSitemenu) {
        oXHR = new XMLHttpRequest()
        oXHR.open('GET', oHitp.sPathSitemenu, true)
        oXHR.send(null)
        oXHR.onreadystatechange = function () {
          if (oXHR.readyState === 4) {
            if (oXHR.status === 404) {
              // no site-menu
              fNamidx()
            } else if (oXHR.status === 200) {
              oHitp.oEltSitemenuUl = (new DOMParser()).parseFromString(oXHR.responseText, 'text/html')
              oHitp.oEltSitemenuUl = oHitp.oEltSitemenuUl.querySelector('ul')
              fNamidx()
            }
          }
        }
      }
    }

    /**
     * doing: reads the-namidx.root-file, if exists, and creates the-containers of the-page.
     */
    function fNamidx() {
      // find aNamidxRoot
      sNiRoot = oHitp.sPathSite + 'dirMiwMcs/dirNamidx/namidx.root.json'
      oXHR = new XMLHttpRequest()
      oXHR.open('GET', sNiRoot, true)
      oXHR.send(null)
      oXHR.onreadystatechange = function () {
        if (oXHR.readyState === 4) {
          if (oXHR.status === 404) {
            // no Mcs-search, file not found
            oHitp.fContainersInsert()
            oHitp.oTreeUl.fTruCreate()
            // IF on idMetaWebpage_path paragraph we have and the clsTocExpand
            // then the toc expands-all
            if (document.getElementById('idMetaWebpage_path')) {
              if (document.getElementById('idMetaWebpage_path').getAttribute('class') === 'clsTocExpand') {
                oHitp.oTreeUl.fTruTocExpandAll()
              }
            }
            if (location.hash) {
              location.href = location.hash
            }
          } else if (oXHR.status === 200) {
            // oHitp.aNamidxRoot contains namidx.root.json if exists
            oHitp.aNamidxRoot = JSON.parse(oXHR.responseText)
            oHitp.fContainersInsert()
            oHitp.oTreeUl.fTruCreate()
            // IF on idMetaWebpage_path paragraph we have and the clsTocExpand
            // then the toc expands-all
            if (document.getElementById('idMetaWebpage_path')) {
              if (document.getElementById('idMetaWebpage_path').getAttribute('class') === 'clsTocExpand') {
                oHitp.oTreeUl.fTruTocExpandAll()
              }
            }
            if (location.hash) {
              location.href = location.hash
            }
          }
        }
      }
    }
  })

  return oHitp
})()
