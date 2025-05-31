import React, { useState, useRef, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import Sidebar from "./Sidebar";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function CanvasBoard() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [drawMode, setDrawMode] = useState(false);
  const [drawColor, setDrawColor] = useState("#FFFFFF");
  const [tool, setTool] = useState("pencil");

  const canvasRef = useRef(null);
  const canvasDrawRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (canvasDrawRef.current) {
      const canvas = canvasDrawRef.current;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1f2937"; // dark bg base for draw canvas
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, []);

  const addToHistory = useCallback((updateFn) => {
    setElements((prevElements) => {
      setHistory((prevHistory) => [...prevHistory, prevElements]);
      setRedoStack([]);
      const newElements =
        typeof updateFn === "function" ? updateFn(prevElements) : updateFn;
      return newElements;
    });
  }, []);

  const handleAddText = useCallback(() => {
    const id = Date.now();
    const newElement = {
      id,
      type: "text",
      x: 100,
      y: 100,
      width: 200,
      height: 60,
      value: "Edit me",
      color: "#FFFFFF", // light text in dark mode
    };
    addToHistory((elements) => [...elements, newElement]);
  }, [addToHistory]);

  const handleUploadImage = useCallback(
    (file) => {
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
        addToHistory((elements) => [...elements, newElement]);
      };
      reader.readAsDataURL(file);
    },
    [addToHistory]
  );

  const handleElementChange = useCallback(
    (id, key, value) => {
      addToHistory((elements) =>
        elements.map((el) => (el.id === id ? { ...el, [key]: value } : el))
      );
    },
    [addToHistory]
  );

  const handleDelete = useCallback(() => {
    if (selectedId !== null) {
      addToHistory((elements) => elements.filter((el) => el.id !== selectedId));
      setSelectedId(null);
    }
  }, [selectedId, addToHistory]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [elements, ...prev]);
    setElements(last);
    setHistory((prev) => prev.slice(0, -1));
  }, [history, elements]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const [next, ...rest] = redoStack;
    setHistory((prev) => [...prev, elements]);
    setElements(next);
    setRedoStack(rest);
  }, [redoStack, elements]);

  const handleClear = useCallback(() => {
    addToHistory([]);
    setSelectedId(null);
    if (canvasDrawRef.current) {
      const ctx = canvasDrawRef.current.getContext("2d");
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#1f2937"; // dark base again
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [addToHistory]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: "#1f2937",
    });
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  const startDraw = useCallback(
    (e) => {
      if (!drawMode) return;
      isDrawing.current = true;
      const ctx = canvasDrawRef.current.getContext("2d");
      const rect = canvasDrawRef.current.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    },
    [drawMode]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing.current || !drawMode) return;
      const ctx = canvasDrawRef.current.getContext("2d");
      const rect = canvasDrawRef.current.getBoundingClientRect();
      ctx.strokeStyle = tool === "eraser" ? "#1f2937" : drawColor;
      ctx.lineWidth = tool === "eraser" ? 20 : 2;
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    },
    [drawMode, drawColor, tool]
  );

  const endDraw = useCallback(() => {
    if (!drawMode) return;
    isDrawing.current = false;
  }, [drawMode]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tagName = e.target.tagName.toLowerCase();
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        tagName !== "input" &&
        tagName !== "textarea"
      ) {
        handleDelete();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDelete]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-900 text-gray-200">
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
        onToggleDraw={() => setDrawMode((prev) => !prev)}
        darkMode={true}
      />

      <div className="flex justify-center items-center flex-1 p-4">
        <div
          ref={canvasRef}
          className="relative bg-gray-800 border border-gray-700 rounded-md shadow-lg"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        >
          <canvas
            ref={canvasDrawRef}
            className="absolute top-0 left-0 z-10 rounded-md"
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
              onDragStop={(e, d) => {
                handleElementChange(el.id, "x", d.x);
                handleElementChange(el.id, "y", d.y);
              }}
              onResizeStop={(e, direction, ref, delta, position) =>
                addToHistory((elements) =>
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
                    backgroundColor: "#1f2937",
                    border:
                      selectedId === el.id
                        ? "1px dashed #3b82f6" // blue accent
                        : "none",
                    outline: "none",
                    resize: "none",
                    padding: "6px",
                    fontSize: "1rem",
                    borderRadius: "4px",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  }}
                />
              ) : (
                <img
                  src={el.src}
                  alt="uploaded"
                  className="w-full h-full object-contain rounded"
                  style={{
                    border:
                      selectedId === el.id
                        ? "1px dashed #3b82f6"
                        : "none",
                  }}
                />
              )}
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
}
