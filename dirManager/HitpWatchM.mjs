/*
 * HitpWatchM.mjs - module that watches for file changes, creates name-indices,
 *   and uploads the-files
 * The MIT License (MIT)
 *
 * Copyright (c) 2021-2025 Kaseluris.Nikos.1959 (hmnSngo)
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
 *
 * DOING: watch changes on files ending .last.html
 * INPUT:
 * OUTPUT:
 * RUN: node dirManager/HitpWatchM.mjs pwd
 *
 */

import moFs from 'fs'
import moCrypto from 'crypto'
import moPath from 'path'
import mfReadlines from 'n-readlines' // npm install n-readlines
import {fNamidx} from './HitpNamidxM.mjs'
import mfClient from 'ssh2-sftp-client'
import mfEs6_promise_pool from 'es6-promise-pool'
import {oSftp, fSftp} from './HitpSftpM.mjs'
import {fWriteJsonObject} from './HitpUtilM.mjs'

const
  // contains the-versions of HitpWatchM.mjs
  aVersion = [
    'HitpWatchM.mjs.0-5-0.2025-05-19: Hitp only',
    'mWatch.mjs.0-4-0.2021-12-14: save ordered oHitp_Hash',
    'mWatch.mjs.0-3-0.2021-12-01: setTimeout solves file reading',
    'mWatch.mjs.0-2-0.2021-11-29: imports mNamidx, mSftp, stores hashes of Mcs',
    'mWatch.mjs.0-1-0.2021-11-28: creation'
  ]

let
  oHitp_Hash,
  aFileMcsIn = [],
  sCwd = process.cwd() + moPath.sep

sCwd = sCwd.replace(/\\/g, '/')
if (process.argv[2]) {
  oSftp.password = process.argv[2]
} else {
  console.log('type password after mWatch.mjs')
  process.exit()
}

if (moFs.existsSync('dirManager/oHitp_Hash.json')) {
  oHitp_Hash = JSON.parse(moFs.readFileSync('dirManager/oHitp_Hash.json'))
} else {
  oHitp_Hash = {}
}

moFs.watch(sCwd, {recursive: true}, (eventType, sFilename) => {
  if (sFilename && eventType === 'change' && sFilename.endsWith('.last.html')) {

    sFilename = sFilename.replace(/\\/g, '/')
    let sFileResolved = moPath.join(sCwd, sFilename)
    console.log(sFilename)
    console.log('>>>RESOLVED: '+sFileResolved)
    setTimeout(() => {
      const fileBuffer = moFs.readFileSync(sFileResolved)
      const hashSum = moCrypto.createHash('sha256')
      hashSum.update(fileBuffer)
      const sHashCurrent = hashSum.digest('hex')
      if (oHitp_Hash[sFilename]) {
        if (sHashCurrent === oHitp_Hash[sFilename]) {
          return
        }
      }
      oHitp_Hash[sFilename] = sHashCurrent
      const oMHOrdered = {}
      Object.keys(oHitp_Hash).sort().forEach(function(key) {
        oMHOrdered[key] = oHitp_Hash[key];
      })
      //moFs.writeFileSync('oHitp_Hash.json', JSON.stringify(oMHOrdered))
      fWriteJsonObject('dirManager/oHitp_Hash.json', oMHOrdered)

      //aFileMcsIn.push(sFilename)
      //setTimeout(() => console.log(aFileMcsIn), 1000)

      fNamidx(sFilename, fSftp)
    }, 500)

  }
})
