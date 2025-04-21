// Import statements
import { useState, useEffect } from 'react';
import { Folder, FileText, ChevronLeft, RefreshCw } from 'lucide-react';

// Types
type DirectoryItem = {
  name: string;
  type: string;
  abspath: string;
};

type FileBrowserProps = {
  currentPath: string;
  directoryContents: DirectoryItem[];
  onFileItemClick: (filename: string) => void;
  navigateToDirectory: (abspath: string) => void;
};

// Sub-component Props Types
type NavigationBarProps = {
  currentPath: string;
  displayPath: string;
  navigateUp: () => void;
  refreshDirectory: () => void;
};

type DirectoryContentsProps = {
  directoryContents: DirectoryItem[];
  selectedItem: string | null;
  setSelectedItem: (item: string) => void;
  navigateToDirectory: (dirName: string) => void;
  onFileItemClick: (filename: string) => void;
};

type DirectoryItemProps = {
  item: DirectoryItem;
  isSelected: boolean;
  onSelect: () => void;
};

type StatusBarProps = {
  itemCount: number;
};

// Main Component
export default function FileBrowser(
    {
      currentPath, 
      directoryContents,
      onFileItemClick,
      navigateToDirectory
    }: FileBrowserProps) {
  // State management
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const navigateUp = () => {
    if (currentPath === '/') return;
    // ...
  };

  const refreshDirectory = async () => {
    
  };

  // Render component
  return (
    <div className="border rounded-lg shadow-sm sm:w-80 w-full">
      {/* Navigation bar */}
      <NavigationBar 
        currentPath={currentPath}
        navigateUp={navigateUp}
        refreshDirectory={refreshDirectory}
      />
      
      {/* Directory contents */}
      <DirectoryContents 
        directoryContents={directoryContents}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        navigateToDirectory={navigateToDirectory}
        onFileItemClick={onFileItemClick}
      />
      
      {/* Status bar */}
      <StatusBar itemCount={directoryContents.length} />
    </div>
  );
}

// Sub-components
function NavigationBar({ 
  currentPath, 
  navigateUp, 
  refreshDirectory,
}: NavigationBarProps) {
  return (
    <div className="flex items-center w-full justify-between p-2 bg-gray-100 border-b">
      <div className="flex items-center w-full">
        <button 
          onClick={navigateUp}
          disabled={currentPath === '/'}
          className={`p-1 rounded mr-2 ${currentPath === '/' ? 'text-gray-400' : 'hover:bg-gray-200'}`}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium truncate">
          {currentPath}
        </span>
      </div>
      <button 
        className="p-1 rounded hover:bg-gray-200"
        onClick={refreshDirectory}
      >
      </button>
    </div>
  );
}

function DirectoryContents({ 
  directoryContents, 
  selectedItem,
  setSelectedItem,
  navigateToDirectory,
  onFileItemClick
}: DirectoryContentsProps) {
  return (
    <div className="overflow-auto h-fit">
      {false ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : directoryContents.length > 0 ? (
        <ul className="divide-y">
          {directoryContents.map((item: DirectoryItem) => (
            <DirectoryItem 
              key={item.name}
              item={item}
              isSelected={selectedItem === item.name}
              onSelect={() => {
                setSelectedItem(item.name);
                if (item.type === 'directory') {
                    navigateToDirectory(item.abspath);
                } else {
                    onFileItemClick(item.name)
                }
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500">This folder is empty</div>
      )}
    </div>
  );
}

function DirectoryItem({ item, isSelected, onSelect }: DirectoryItemProps) {
  return (
    <li 
      onClick={onSelect}
      className={`flex items-center p-2 cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      {item.type === 'directory' ? (
        <Folder size={18} className="text-blue-500 mr-2" />
      ) : (
        <FileText size={18} className="text-gray-500 mr-2" />
      )}
      <div className="flex-1 truncate">{item.name}</div>
    </li>
  );
}

function StatusBar({ itemCount }: StatusBarProps) {
  return (
    <div className="p-2 border-t bg-gray-50 text-xs text-gray-500">
      {itemCount} items
    </div>
  );
}