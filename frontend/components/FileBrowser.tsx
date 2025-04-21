// Import statements
import { useState, useEffect } from 'react';
import { Folder, FileText, ChevronLeft, RefreshCw } from 'lucide-react';

// Types
type DirectoryItem = {
  name: string;
  type: string;
  size?: string;
};

type FileBrowserProps = {
  startingPath: string;
  getDirectoryContents: (path: string) => DirectoryItem[];
};

// Sub-component Props Types
type NavigationBarProps = {
  currentPath: string;
  displayPath: string;
  navigateUp: () => void;
  refreshDirectory: () => void;
  isLoading: boolean;
};

type DirectoryContentsProps = {
  isLoading: boolean;
  directoryContents: DirectoryItem[];
  selectedItem: string | null;
  setSelectedItem: (item: string) => void;
  navigateToDirectory: (dirName: string) => void;
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
export default function FileBrowser({ startingPath, getDirectoryContents }: FileBrowserProps) {
  // State management
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [directoryContents, setDirectoryContents] = useState<DirectoryItem[]>(getDirectoryContents(startingPath));
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load directory contents when path changes
  useEffect(() => {
    const loadDirectoryContents = async () => {
      setIsLoading(true);
      try {
        setDirectoryContents(getDirectoryContents(currentPath));
      } catch (error) {
        console.error('Error loading directory contents:', error);
        setDirectoryContents(getDirectoryContents(currentPath));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDirectoryContents();
  }, [currentPath, getDirectoryContents]);

  // Navigation functions
  const navigateToDirectory = (dirName: string) => {
    const newPath = currentPath === '/' 
      ? `/${dirName}` 
      : `${currentPath}/${dirName}`;
    setCurrentPath(newPath);
    setSelectedItem(null);
  };

  const navigateUp = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '/' : `/${pathParts.join('/')}`;
    setCurrentPath(newPath);
    setSelectedItem(null);
  };

  const refreshDirectory = async () => {
    setIsLoading(true);
    try {
      setDirectoryContents(getDirectoryContents(startingPath));
    } catch (error) {
      console.error('Error refreshing directory contents:', error);
    } finally {
      setIsLoading(false);
      setSelectedItem(null);
    }
  };

  // Format the path for display
  const displayPath = currentPath === '/' ? '/' : currentPath;

  // Render component
  return (
    <div className="border rounded-lg shadow-sm sm:w-80 w-full">
      {/* Navigation bar */}
      <NavigationBar 
        currentPath={currentPath}
        displayPath={displayPath}
        navigateUp={navigateUp}
        refreshDirectory={refreshDirectory}
        isLoading={isLoading}
      />
      
      {/* Directory contents */}
      <DirectoryContents 
        isLoading={isLoading}
        directoryContents={directoryContents}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        navigateToDirectory={navigateToDirectory}
      />
      
      {/* Status bar */}
      <StatusBar itemCount={directoryContents.length} />
    </div>
  );
}

// Sub-components
function NavigationBar({ 
  currentPath, 
  displayPath, 
  navigateUp, 
  refreshDirectory,
  isLoading
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
          {displayPath}
        </span>
      </div>
      <button 
        className="p-1 rounded hover:bg-gray-200"
        onClick={refreshDirectory}
        disabled={isLoading}
      >
        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}

function DirectoryContents({ 
  isLoading, 
  directoryContents, 
  selectedItem,
  setSelectedItem,
  navigateToDirectory
}: DirectoryContentsProps) {
  return (
    <div className="overflow-auto h-fit">
      {isLoading ? (
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
                  navigateToDirectory(item.name);
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
      {item.size && <div className="text-xs text-gray-500">{item.size}</div>}
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