/*
 * HitpNamidxSftp.mjs - module that creates name-indexes and uploads the-files
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 - 2025 Kaseluris.Nikos.1959 (hmnSngo)
 * kaseluris.nikos@gmail.com
 * https://synagonism.net/
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
 *
 * DOING:
 *   it works stand-alone.
 *   1) it indexes the-names of Hitp-files in namidx.txt in languages setted.
 *   2) it creates the-file 'sftp.json' that contains the-changed files we have to upload.
 *   3) it computes the-number of names.
 *   4) it uploads the-files
 * INPUT: dirManager/namidx.txt
 * OUTPUT: dirLang/namidx.lagLangX.json, namidx.lagRoot.json, sftp.json,
 *
 * RUN from dirHitp: node dirManager/HitpNamidxSftp.mjs password
 *
 * PROBLEM:
 *
 */

import moFs from 'fs'
import mfReadlines from 'n-readlines' // npm install n-readlines
import mfClient from 'ssh2-sftp-client' // npm install ssh2-sftp-client
import mfEs6_promise_pool from 'es6-promise-pool' // npm install es6-promise-pool
import {oSftp, fSftp} from './HitpSftp.mjs'
import {fWriteJsonArray} from './HitpUtil.mjs'
import {fNamidx} from './HitpNamidx.mjs'

const
  // contains the-versions of HitpNamidxSftp.js
  aVersion = [
    'HitpNamidxSftp.mjs.0-8-0.2025-05-27: index and sftp',
    'HitpNamidx.mjs.0-7-0.2025-05-17: only Hitp files',
    'mNamidx.mjs.0-6-1.2025-02-23: sFileIdxRest===sLagIn+00_0',
    'mNamidx.mjs.0-6-0.2025-02-22: sFileIdxRest===sLagIn+00',
    'mNamidx.mjs.0-5-2.2023-12-04: <p>[name:: on EXTRA names',
    'mNamidx.mjs.0-5-1.2023-11-27: >[name:: on EXTRA names',
    'mNamidx.mjs.0-5-0.2022-09-13: meta-info::',
    'mNamidx.mjs.0-4-0.2022-02-09: p-Mcs',
    'mNamidx.mjs.0-2-0.2021-12-31: lagEspo',
    'mNamidx.mjs.0-1-0.2021-11-29: creation',
    'namidx: {2021-11-19} index-files-comments',
    'namidx: {2021-11-15} reference-index-file',
    'namidx: {2021-11-14} Chinese-indices',
    'namidx: {2021-11-01} solved char on other-lags but not on denoted',
    'namidx: {2021-05-02} .mjs',
    'namidx: {2021-04-04} lagALLL',
    'namidx: {2021-04-03} oSetFileUp',
    'namidx: {2021-03-25} * lagEngl lagElln',
    'namidx: {2021-01-04} * McsSngo',
    'namidx: {2020-10-19} * Mcs. for section and paragraph-Mcs',
    'namidx: {2020-10-18} McsP.',
    'namidx: {2019-12-11} cptqnt.root.json',
    'namidx: {2019-09-05} lagKmo',
    'namidx: {2018-10-25} cptqnt.json',
    'namidx: {2018-10-16} * Mcs.',
    'namidx: {2018-09-22}',
    'namidx: {2017-06-01} created'
  ]

let
  aFileHitpInComments,
  aFileHitpTxt = [],
  aLagAlone = undefined

if (process.argv[2]) {
  oSftp.password = process.argv[2]
} else {
  console.log('type password after HitpNamidxSftp.mjs')
  process.exit()
}

aFileHitpInComments = moFs.readFileSync('dirManager/namidx.txt').toString().split('\n')

// a) find Hitp-files to remove|add its names and put paths in aFileHitpTxt.
// b) find languages to work-with.
for (let n = 0; n < aFileHitpInComments.length; n++) {
  let sLn = aFileHitpInComments[n]

  // remove comments and empty-lines
  if (!sLn.startsWith('//') && sLn.length !== 0) {
    if (sLn.startsWith('lag')) {
      if (!aLagAlone) aLagAlone = []
      aLagAlone.push(sLn.substring(0,7))
    } else {
      // remove comments after ;
      if (sLn.indexOf(';') > 0) {
        aFileHitpTxt.push(sLn.substring(0,sLn.lastIndexOf(';')))
      } else {
        aFileHitpTxt.push(sLn)
      }
    }
  }
}

// create name-indices
fNamidx(aFileHitpTxt)

//upload files
fSftp()
