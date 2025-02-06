import { useEffect, useRef } from 'react';

const GRID_SIZE = 40;

const Canvas = ({ transform }) => {
  const canvasRef = useRef(null);

  const drawGrid = (ctx, width, height, transform) => {
    ctx.clearRect(0, 0, width, height);
    
    // Calculate grid parameters based on zoom
    const gridSize = GRID_SIZE * transform.scale;
    const offsetX = transform.x % gridSize;
    const offsetY = transform.y % gridSize;

    // Calculate visible grid lines
    const startX = -offsetX;
    const startY = -offsetY;
    const endX = width;
    const endY = height;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw larger grid every 5 cells
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    const largeGridSize = gridSize * 5;
    const largeOffsetX = transform.x % largeGridSize;
    const largeOffsetY = transform.y % largeGridSize;

    // Draw large vertical lines
    for (let x = -largeOffsetX; x <= endX; x += largeGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw large horizontal lines
    for (let y = -largeOffsetY; y <= endY; y += largeGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        drawGrid(ctx, width, height, transform);
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    drawGrid(ctx, canvas.width, canvas.height, transform);
  }, [transform]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default Canvas; 