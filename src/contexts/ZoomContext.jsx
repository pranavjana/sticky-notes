import { createContext, useContext, useState, useCallback } from 'react';

const ZoomContext = createContext();

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_SPEED = 0.03;

export function ZoomProvider({ children }) {
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX, screenY) => {
    return {
      x: (screenX - transform.x) / transform.scale,
      y: (screenY - transform.y) / transform.scale
    };
  }, [transform]);

  // Convert world coordinates to screen coordinates
  const worldToScreen = useCallback((worldX, worldY) => {
    return {
      x: worldX * transform.scale + transform.x,
      y: worldY * transform.scale + transform.y
    };
  }, [transform]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const { clientX, clientY, deltaY } = e;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = ZOOM_SPEED * direction;
    
    setTransform(prev => {
      const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.scale * (1 + factor)));
      const scaleDiff = newScale - prev.scale;
      
      // Calculate new position to zoom towards cursor
      return {
        scale: newScale,
        x: prev.x - (clientX - prev.x) * (scaleDiff / prev.scale),
        y: prev.y - (clientY - prev.y) * (scaleDiff / prev.scale)
      };
    });
  }, []);

  const startDragging = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrag = useCallback((e) => {
    if (!isDragging) return;
    
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  }, [isDragging, dragStart]);

  return (
    <ZoomContext.Provider value={{
      transform,
      isDragging,
      screenToWorld,
      worldToScreen,
      handleWheel,
      startDragging,
      stopDragging,
      handleDrag
    }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom() {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
} 
