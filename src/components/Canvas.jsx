import { useEffect, useRef } from 'react';

const Canvas = ({ transform, boardSize, gridSize }) => {
  const canvasRef = useRef(null);

  const drawGrid = (ctx, width, height, transform) => {
    ctx.clearRect(0, 0, width, height);
    
    // Calculate visible area in world coordinates
    const visibleArea = {
      left: -transform.x / transform.scale,
      top: -transform.y / transform.scale,
      right: (width - transform.x) / transform.scale,
      bottom: (height - transform.y) / transform.scale
    };

    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(
      Math.max(0, transform.x),
      Math.max(0, transform.y),
      Math.min(boardSize * transform.scale, width),
      Math.min(boardSize * transform.scale, height)
    );

    // Calculate grid parameters based on zoom
    const scaledGridSize = gridSize * transform.scale;
    
    // Calculate visible grid lines
    const startX = Math.max(0, Math.floor(visibleArea.left / gridSize) * gridSize);
    const startY = Math.max(0, Math.floor(visibleArea.top / gridSize) * gridSize);
    const endX = Math.min(boardSize, Math.ceil(visibleArea.right / gridSize) * gridSize);
    const endY = Math.min(boardSize, Math.ceil(visibleArea.bottom / gridSize) * gridSize);

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      const screenX = x * transform.scale + transform.x;
      ctx.moveTo(screenX, Math.max(0, transform.y));
      ctx.lineTo(screenX, Math.min(height, boardSize * transform.scale + transform.y));
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      const screenY = y * transform.scale + transform.y;
      ctx.moveTo(Math.max(0, transform.x), screenY);
      ctx.lineTo(Math.min(width, boardSize * transform.scale + transform.x), screenY);
    }

    ctx.stroke();

    // Draw board boundary
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      transform.x,
      transform.y,
      boardSize * transform.scale,
      boardSize * transform.scale
    );
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
  }, [transform, boardSize, gridSize]);

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