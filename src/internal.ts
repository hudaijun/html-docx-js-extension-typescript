import JSZip = require('jszip')
import { getMHTdocument } from './utils'
import { contentTypesXml, documentXmlRels, relsXml } from './assets'
import { documentTemplate, Orient, Margins, defaultMargins } from './templates'
import { isBrowser } from 'browser-or-node'

export type DocumentOptions = typeof defaultDocumentOptions

const defaultDocumentOptions = {
  orientation: 'portrait' as Orient,
  margins: {} as Partial<Margins>,
  width: 11946,
  height: 16838,
}

function mergeOptions<T>(options: T, patch: Partial<T>) {
  return { ...options, ...patch } as T
}

export async function generateDocument(zip: JSZip) {
  const buffer = await zip.generateAsync({ type: 'arraybuffer' })
  if (isBrowser) {
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
  } else {
    return new Buffer(new Uint8Array(buffer))
  }
}

function getBinaryData(str: string) {
  return isBrowser ? new Blob([str]) : new Buffer(str, 'utf-8')
}

function renderDocumentFile(documentOptions: DocumentOptions) {
  const { orientation, margins } = documentOptions
  const marginsOptions = mergeOptions(defaultMargins, margins)
  let width = 0
  let height = 0
  if (orientation === 'landscape') {
    height = documentOptions.width
    width = documentOptions.height
  } else {
    width = documentOptions.width
    height = documentOptions.height
  }
  return documentTemplate(width, height, orientation, marginsOptions)
}

export function addFiles(zip: JSZip, htmlSource: string, options: Partial<DocumentOptions>) {
  const documentOptions = mergeOptions(defaultDocumentOptions, options)
  zip.file('[Content_Types].xml', getBinaryData(contentTypesXml), {
    createFolders: false,
  })
  zip.folder('_rels')?.file('.rels', getBinaryData(relsXml), { createFolders: false })
  return zip
    .folder('word')
    ?.file('document.xml', renderDocumentFile(documentOptions), {
      createFolders: false,
    })
    ?.file('afchunk.mht', getMHTdocument(htmlSource), {
      createFolders: false,
    })
    ?.folder('_rels')
    ?.file('document.xml.rels', getBinaryData(documentXmlRels), {
      createFolders: false,
    })
}