import React, { useState } from "react";
import {
  Plus, Image as ImageIcon, Pencil, Undo2, Redo2, Trash2, Download, Paintbrush, X, Menu
} from "lucide-react";

export default function Sidebar({
  onAddText,
  onUploadImage,
  onToggleDraw,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  setDrawColor,
  setTextColor,
  setTool,
  drawMode,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const Button = ({ onClick, className, title, children }) => (
    <button
      onClick={onClick}
      className={`w-full py-2 rounded transition-all duration-200 hover:scale-105 ${className}`}
      title={title}
    >
      {children}
    </button>
  );

  const Section = ({ label, children }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-purple-900 text-white p-4 space-y-4 min-h-screen">
        <h2 className="text-xl font-bold text-center">Tools</h2>

        <Button onClick={onAddText} className="bg-blue-500 hover:bg-blue-600">Add Text</Button>

        <Section label="Text Color">
          <input
            type="color"
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 rounded"
            aria-label="Text color picker"
          />
        </Section>

        <Section label="Upload Image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUploadImage(e.target.files[0])}
            className="w-full bg-white text-black rounded px-2 py-1"
            aria-label="Upload image"
          />
        </Section>

        <Button
          onClick={onToggleDraw}
          className={`${drawMode ? "bg-green-600" : "bg-green-800"} hover:bg-green-700`}
        >
          {drawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
        </Button>

        <Section label="Drawing Color">
          <input
            type="color"
            onChange={(e) => setDrawColor(e.target.value)}
            className="w-full h-10 rounded"
            aria-label="Drawing color picker"
          />
        </Section>

        <div className="flex space-x-2">
          <Button
            onClick={() => setTool("pencil")}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600"
          >
            Pencil
          </Button>
          <Button
            onClick={() => setTool("eraser")}
            className="flex-1 bg-white text-black hover:bg-gray-300"
          >
            Eraser
          </Button>
        </div>

        <div className="flex justify-between space-x-2">
          <Button onClick={onUndo} className="flex-1 bg-purple-600 hover:bg-purple-700">Undo</Button>
          <Button onClick={onRedo} className="flex-1 bg-purple-600 hover:bg-purple-700">Redo</Button>
        </div>

        <Button onClick={onClear} className="bg-red-600 hover:bg-red-700">Clear</Button>
        <Button onClick={onDownload} className="bg-teal-500 hover:bg-teal-600">Download</Button>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-purple-900 text-white flex justify-around items-center p-2 z-50">
        <button onClick={onAddText} title="Add Text"><Plus size={24} /></button>
        <label title="Upload Image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUploadImage(e.target.files[0])}
            className="hidden"
          />
          <ImageIcon size={24} />
        </label>
        <button onClick={onToggleDraw} title="Toggle Draw">
          <Paintbrush size={24} />
        </button>
        <button onClick={onUndo} title="Undo"><Undo2 size={24} /></button>
        <button onClick={onRedo} title="Redo"><Redo2 size={24} /></button>
        <button onClick={onClear} title="Clear"><Trash2 size={24} /></button>
        <button onClick={onDownload} title="Download"><Download size={24} /></button>
      </div>
    </>
  );
}
