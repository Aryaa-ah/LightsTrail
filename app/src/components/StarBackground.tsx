import React, { useEffect, useRef } from 'react';

interface StarBackgroundProps {
  starCount?: number;
}

const StarBackground: React.FC<StarBackgroundProps> = ({ starCount = 1000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Safely get canvas and context
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas function with better production handling
    const resizeCanvas = () => {
      // Use document.documentElement for better cross-browser support
      const width = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const height = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
        document.body.scrollHeight || 0,
        document.documentElement.scrollHeight || 0
      );
      
      canvas.width = width;
      canvas.height = height;
      
      // Force canvas style update
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };

    // Star class with explicit type initialization
    class Star {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 1.5;
        this.speed = Math.random() * 0.3;
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update(canvasWidth: number) {
        this.x -= this.speed;
        if (this.x < 0) {
          this.x = canvasWidth;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create stars with initial canvas dimensions
    let stars: Star[] = [];
    
    const initializeStars = () => {
      stars = Array.from({ length: starCount }, () => new Star(canvas.width, canvas.height));
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      stars.forEach(star => {
        star.update(canvas.width);
        star.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    // Enhanced resize handler
    const handleResize = () => {
      resizeCanvas();
      initializeStars(); // Reinitialize stars on resize
    };

    // Initial setup with delay for production
    const initialize = () => {
      resizeCanvas();
      initializeStars();
      animate();
    };

    // Use setTimeout to ensure DOM is fully loaded in production
    const timeoutId = setTimeout(initialize, 100);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block', // Ensure canvas is displayed as block
      }}
    />
  );
};

export default StarBackground;