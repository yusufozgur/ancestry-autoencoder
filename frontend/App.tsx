import './App.css'
import FileBrowser from "./components/FileBrowser"

const sample_dir_contents = [
    { name: 'Documents', type: 'directory' },
    { name: 'Pictures', type: 'directory' },
    { name: 'config.json', type: 'file', size: '4 KB' },
    { name: 'notes.txt', type: 'file', size: '12 KB' }
  ]

function App() {
  return (
    <div id="main"
      className='flex flex-col items-center min-h-screen'
    >
      <p>Choose the vcf</p>
      <FileBrowser startingPath='/' getDirectoryContents={(path: string)=>{
        if (path === "/") {
          return sample_dir_contents
        } else {
          return []
        }
      }} />
    </div>
  )
}

export default App
