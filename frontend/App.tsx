import FileBrowser from "./components/FileBrowser"
import { useState } from 'react'
import { changeDirFsChangeDirNewdirPut, getCurrentDirFsGetCwdGet, GetCurrentDirFsGetCwdGetData, listDirFsListDirGet } from "./client"
import { useEffect } from "react"

const sample_dir_contents = [
    { name: 'Documents', type: 'directory' },
    { name: 'Pictures', type: 'directory' },
    { name: 'config.json', type: 'file', size: '4 KB' },
    { name: 'notes.txt', type: 'file', size: '12 KB' }
  ]


function App() {
  const [vcfPath, setVcfPath] = useState<string | null>(null)
  const [currentWorkingDir, setCurrentWorkingDir] = useState<string | null>(null)
  const [directoryContents, setDirectoryContents] = useState<string[]>([])

  //loader
  useEffect(() => {
    const fetcher = async () => {
      const {data, error} = await getCurrentDirFsGetCwdGet()
      console.log(data)
      setCurrentWorkingDir(data)
    }
    fetcher()
    const fetcher2 = async () => {
      const {data, error} = await listDirFsListDirGet()
      console.log(data)
      setDirectoryContents(data)
    }
    fetcher2()
    }, [])

  return (
    <div id="main"
      className='flex flex-col items-center min-h-screen'
    >
      <p>cwd: {currentWorkingDir}</p>
      <p>listdir: {JSON.stringify(directoryContents)}</p>
      <p>_</p>
      {vcfPath ? vcfPath : <><p>Choose the vcf</p>
      <FileBrowser
        currentPath={currentWorkingDir!}
        directoryContents={directoryContents!}
        navigateToDirectory={async (abspath) => {

          const fetcher = async () => {
            changeDirFsChangeDirNewdirPut({path: {newdir: abspath}})
          }
          fetcher()

          const fetcher2 = async () => {
            const {data, error} = await getCurrentDirFsGetCwdGet()
            console.log(data)
            setCurrentWorkingDir(data)
          }
          fetcher2()
        }}
        onFileItemClick={setVcfPath}
      /></>}
    </div>
  )
}

export default App
