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

    // Resize canvas function
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    const stars = Array.from({ length: starCount }, () => new Star(canvas.width, canvas.height));

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

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
       }}
    />
  );
};

export default StarBackground;