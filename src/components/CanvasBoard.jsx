import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import Sidebar from "./Sidebar";

export default function CanvasBoard() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [drawMode, setDrawMode] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [tool, setTool] = useState("pencil");

  const canvasRef = useRef(null);
  const canvasDrawRef = useRef(null);
  const isDrawing = useRef(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [drawRedoStack, setDrawRedoStack] = useState([]);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  useEffect(() => {
    if (canvasDrawRef.current) {
      const canvas = canvasDrawRef.current;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  }, []);

  const addToHistory = (newElements) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements(newElements);
  };

  const handleAddText = () => {
    const id = Date.now();
    const newElement = {
      id,
      type: "text",
      x: 100,
      y: 100,
      width: 200,
      height: 60,
      value: "Edit me",
      color: "#000000",
    };
    addToHistory([...elements, newElement]);
  };

  const handleUploadImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = Date.now();
      const newElement = {
        id,
        type: "image",
        src: reader.result,
        x: 150,
        y: 150,
        width: 200,
        height: 200,
      };
      addToHistory([...elements, newElement]);
    };
    reader.readAsDataURL(file);
  };

  const handleElementChange = (id, key, value) => {
    const updated = elements.map((el) =>
      el.id === id ? { ...el, [key]: value } : el
    );
    addToHistory(updated);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      const updated = elements.filter((el) => el.id !== selectedId);
      addToHistory(updated);
      setSelectedId(null);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [elements, ...prev]);
    setElements(last);
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const [next, ...rest] = redoStack;
    setHistory((prev) => [...prev, elements]);
    setElements(next);
    setRedoStack(rest);
  };

  const handleClear = () => {
    addToHistory([]);
    setSelectedId(null);
    handleDrawClear();
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current);
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const startDraw = (e) => {
    if (!drawMode) return;
    isDrawing.current = true;
    const ctx = canvasDrawRef.current.getContext("2d");
    const rect = canvasDrawRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing.current || !drawMode) return;
    const ctx = canvasDrawRef.current.getContext("2d");
    const rect = canvasDrawRef.current.getBoundingClientRect();
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : drawColor;
    ctx.lineWidth = tool === "eraser" ? 20 : 2;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!drawMode) return;
    isDrawing.current = false;
    const dataUrl = canvasDrawRef.current.toDataURL();
    setDrawHistory((prev) => [...prev, dataUrl]);
    setDrawRedoStack([]);
  };

  const handleDrawClear = () => {
    const ctx = canvasDrawRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setDrawHistory([]);
    setDrawRedoStack([]);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100">
      <Sidebar
        onAddText={handleAddText}
        onUploadImage={handleUploadImage}
        onDelete={handleDelete}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onDownload={handleDownload}
        setDrawColor={setDrawColor}
        setTextColor={(color) =>
          selectedId && handleElementChange(selectedId, "color", color)
        }
        setTool={setTool}
        drawMode={drawMode}
        onToggleDraw={() => setDrawMode(!drawMode)}
      />

      <div className="flex justify-center items-center flex-1">
        <div
          ref={canvasRef}
          className="relative bg-white border border-gray-400"
          style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
        >
          <canvas
            ref={canvasDrawRef}
            className="absolute top-0 left-0 z-10"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
          />

          {elements.map((el) => (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              onDragStop={(e, d) =>
                handleElementChange(el.id, "x", d.x) ||
                handleElementChange(el.id, "y", d.y)
              }
              onResizeStop={(e, direction, ref, delta, position) =>
                addToHistory(
                  elements.map((item) =>
                    item.id === el.id
                      ? {
                          ...item,
                          width: ref.offsetWidth,
                          height: ref.offsetHeight,
                          ...position,
                        }
                      : item
                  )
                )
              }
              onClick={() => setSelectedId(el.id)}
              className="absolute z-20"
            >
              {el.type === "text" ? (
                <textarea
                  value={el.value}
                  onChange={(e) =>
                    handleElementChange(el.id, "value", e.target.value)
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    color: el.color,
                    background: "transparent",
                    border: selectedId === el.id ? "1px dashed #000" : "none",
                    outline: "none",
                    resize: "none",
                  }}
                />
              ) : (
                <img
                  src={el.src}
                  alt="uploaded"
                  className="w-full h-full object-contain"
                  style={{ border: selectedId === el.id ? "1px dashed #000" : "none" }}
                />
              )}
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
}
