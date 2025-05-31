import React, { useState } from "react";
import {
  Plus,
  Image as ImageIcon,
  Pencil,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Paintbrush,
  X,
  Menu,
  Eraser,
} from "lucide-react";

const Button = ({ onClick, title, children, className = "" }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-300 shadow-lg hover:scale-[1.03] 
      bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600
      ${className}`}
  >
    {children}
  </button>
);

const Section = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">{label}</label>
    {children}
  </div>
);

function DesktopSidebar({
  onAddText,
  onUploadImage,
  onDelete,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  setDrawColor,
  setTextColor,
  setTool,
  drawMode,
  onToggleDraw,
  darkMode,
}) {
  return (
    <aside
      className={`hidden md:flex flex-col w-72 p-5 space-y-5 min-h-screen border-r shadow-xl backdrop-blur-lg rounded-tr-3xl rounded-br-3xl
      ${
        darkMode
          ? "bg-[#121a2f]/80 border-gray-700 text-white"
          : "bg-white border-gray-300 text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text drop-shadow-lg">
        Creative Tools
      </h2>

      <div className="space-y-4">
        <Button onClick={onAddText} title="Add Text">
          <Plus /> Add Text
        </Button>

        <Section label="Text Color">
          <input
            type="color"
            onChange={(e) => setTextColor(e.target.value)}
            className={`w-full h-10 rounded-md border bg-transparent cursor-pointer ${
              darkMode ? "border-gray-700" : "border-gray-300"
            }`}
          />
        </Section>

        <Section label="Upload Image">
          <label
            className={`block w-full cursor-pointer text-center py-2 rounded-lg transition
            ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUploadImage(e.target.files[0])}
              className="hidden"
            />
            <ImageIcon className="inline mr-2" size={18} />
            Choose Image
          </label>
        </Section>

        <Button onClick={onToggleDraw} title="Toggle Draw">
          <Paintbrush />
          {drawMode ? "Disable Draw Mode" : "Enable Draw Mode"}
        </Button>

        <Section label="Drawing Color">
          <input
            type="color"
            onChange={(e) => setDrawColor(e.target.value)}
            className={`w-full h-10 rounded-md border bg-transparent cursor-pointer ${
              darkMode ? "border-gray-700" : "border-gray-300"
            }`}
          />
        </Section>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setTool("pencil")} title="Pencil">
            <Pencil /> Pencil
          </Button>
          <Button onClick={() => setTool("eraser")} title="Eraser">
            <Eraser /> Eraser
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onUndo} title="Undo">
            <Undo2 /> Undo
          </Button>
          <Button onClick={onRedo} title="Redo">
            <Redo2 /> Redo
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onClear}
            title="Clear"
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 /> Clear
          </Button>
          <Button
            onClick={onDownload}
            title="Download"
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Download /> Download
          </Button>
        </div>
      </div>
    </aside>
  );
}

function MobileSidebar({
  isOpen,
  setIsOpen,
  onAddText,
  onUploadImage,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  setDrawColor,
  setTextColor,
  setTool,
  drawMode,
  onToggleDraw,
  darkMode,
}) {
  return (
    <>
      {/* Bottom Navbar */}
      <nav
        className={`md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] rounded-2xl shadow-xl px-4 py-3 flex justify-around items-center z-50 border
        ${
          darkMode
            ? "bg-[#1f2937] border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={darkMode ? "text-white hover:text-purple-400" : "hover:text-purple-600"}
        >
          <Menu size={24} />
        </button>
        <button
          onClick={onUndo}
          className={darkMode ? "text-white hover:text-yellow-400" : "hover:text-yellow-600"}
        >
          <Undo2 size={24} />
        </button>
        <button
          onClick={onRedo}
          className={darkMode ? "text-white hover:text-yellow-400" : "hover:text-yellow-600"}
        >
          <Redo2 size={24} />
        </button>
        <button
          onClick={onClear}
          className={darkMode ? "text-white hover:text-red-400" : "hover:text-red-600"}
        >
          <Trash2 size={24} />
        </button>
        <button
          onClick={onDownload}
          className={darkMode ? "text-white hover:text-teal-400" : "hover:text-teal-600"}
        >
          <Download size={24} />
        </button>
      </nav>

      {/* Side Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-50 flex">
          <div
            className={`w-3/4 h-full p-5 space-y-5 overflow-y-auto shadow-lg animate-slide-in-left
            ${
              darkMode
                ? "bg-[#1f2937] text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
                Creative Tools
              </h2>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <Button onClick={onAddText}>
              <Plus /> Add Text
            </Button>

            <Section label="Text Color">
              <input
                type="color"
                onChange={(e) => setTextColor(e.target.value)}
                className={`w-full h-10 rounded border cursor-pointer bg-transparent ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
            </Section>

            <Section label="Upload Image">
              <label
                className={`block cursor-pointer py-2 text-center rounded-lg transition ${
                  darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onUploadImage(e.target.files[0])}
                  className="hidden"
                />
                <ImageIcon className="inline mr-2" size={18} />
                Choose Image
              </label>
            </Section>

            <Button onClick={onToggleDraw}>
              <Paintbrush /> {drawMode ? "Disable Draw" : "Enable Draw"}
            </Button>

            <Section label="Drawing Color">
              <input
                type="color"
                onChange={(e) => setDrawColor(e.target.value)}
                className={`w-full h-10 rounded border cursor-pointer bg-transparent ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}
              />
            </Section>

            <div className="flex gap-2">
              <Button onClick={() => setTool("pencil")}>
                <Pencil /> Pencil
              </Button>
              <Button onClick={() => setTool("eraser")}>
                <Eraser /> Eraser
              </Button>
            </div>
          </div>
          <div className="w-1/4" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}

export default function Sidebar(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DesktopSidebar {...props} darkMode={props.darkMode} />
      <MobileSidebar {...props} isOpen={isOpen} setIsOpen={setIsOpen} darkMode={props.darkMode} />
    </>
  );
}
