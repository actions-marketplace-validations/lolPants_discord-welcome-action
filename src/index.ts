import * as core from '@actions/core'
import { readdir as readDir } from 'fs/promises'
import { join as joinPath } from 'path'
import { inspect } from 'util'
import { isDirectory } from './fs'
import { parseMarkdown } from './parse'

const run = async () => {
  // TODO
  // const token = core.getInput('discord-token')
  const contentPath = core.getInput('content')

  const isDir = await isDirectory(contentPath)
  if (!isDir) {
    core.setFailed(`Input 'content' must be a directory`)
    return
  }

  const paths = await readDir(contentPath)
  if (paths.length === 0) {
    core.warning('No template files were found in the specified directory')
    return
  }

  const jobs = paths
    .map(file => joinPath(contentPath, file))
    .map(async path => parseMarkdown(path))

  const files = await Promise.all(jobs)
  console.log(inspect(files, true, null))
  // TODO
}

void run().catch(error => core.setFailed(error))
