import { useEffect, useRef } from 'react';

const GRID_SIZE = 40;

const Canvas = ({ transform }) => {
  const canvasRef = useRef(null);

  const drawGrid = (ctx, width, height, transform) => {
    ctx.clearRect(0, 0, width, height);
    
    // Calculate grid parameters based on zoom
    const gridSize = GRID_SIZE * transform.scale;
    
    // Calculate grid offset based on transform
    const offsetX = transform.x % gridSize;
    const offsetY = transform.y % gridSize;

    // Adapt opacity and line width based on zoom level
    const baseOpacity = Math.min(0.2, Math.max(0.05, transform.scale * 0.1));
    const lineWidth = Math.max(0.5, transform.scale * 0.5);

    // Draw small grid
    ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`;
    ctx.lineWidth = lineWidth;

    // Draw vertical lines
    for (let x = offsetX; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = offsetY; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw larger grid (5x5)
    const largeGridSize = gridSize * 5;
    const largeOffsetX = transform.x % largeGridSize;
    const largeOffsetY = transform.y % largeGridSize;
    
    // Make large grid lines bolder and more visible
    ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity * 2})`;
    ctx.lineWidth = lineWidth * 1.5;

    // Draw large vertical lines
    for (let x = largeOffsetX; x <= width; x += largeGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw large horizontal lines
    for (let y = largeOffsetY; y <= height; y += largeGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw extra large grid (25x25) when zoomed out
    if (transform.scale < 0.5) {
      const extraLargeGridSize = largeGridSize * 5;
      const extraLargeOffsetX = transform.x % extraLargeGridSize;
      const extraLargeOffsetY = transform.y % extraLargeGridSize;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity * 3})`;
      ctx.lineWidth = lineWidth * 2;

      // Draw extra large vertical lines
      for (let x = extraLargeOffsetX; x <= width; x += extraLargeGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw extra large horizontal lines
      for (let y = extraLargeOffsetY; y <= height; y += extraLargeGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
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