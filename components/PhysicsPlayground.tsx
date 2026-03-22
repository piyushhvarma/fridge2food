"use client";

import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

export const PNG_FOOD_IMAGES = [
  "/burger-w-fries-removebg-preview.png",
  "/cake-removebg-preview.png",
  "/chicken-lollipop-removebg-preview.png",
  "/cookie-removebg-preview.png",
  "/crossiont-removebg-preview.png",
  "/curry-removebg-preview.png",
  "/egg-removebg-preview.png",
  "/eggsandwich-removebg-preview.png",
  "/fries-removebg-preview.png",
  "/hot-dog-removebg-preview.png",
  "/ice-tea-removebg-preview.png",
  "/mushroom-removebg-preview.png",
  "/noodles-removebg-preview.png",
  "/omelette-removebg-preview.png",
  "/orange-juice-removebg-preview.png",
  "/pie-removebg-preview.png",
  "/popcorn-removebg-preview.png",
  "/popcorn2-removebg-preview.png",
  "/ramen-removebg-preview.png",
  "/rolls-removebg-preview.png",
  "/soup-removebg-preview.png",
  "/sushi-removebg-preview.png",
  "/taco-removebg-preview.png",
];

export default function PhysicsPlayground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Engine & World
    const engine = Matter.Engine.create({
      // Smooth constraints to prevent tunnelling
      positionIterations: 8,
      velocityIterations: 8,
    });

    // Slower, floaty gravity (Drop slowly)
    engine.gravity.y = 0.2;

    const world = engine.world;
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 2. Setup Renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false, // Critical to show sprites
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    renderRef.current = render;

    // Keep the HD quality of transparent PNGs 
    render.canvas.style.imageRendering = "auto";

    // 3. Create Solid Boundaries
    const thickness = 1000; // Super thick to prevent physics clipping/falling through!
    const wallOptions: Matter.IBodyDefinition = {
      isStatic: true,
      render: { fillStyle: "transparent" },
      friction: 0.8,
      restitution: 0.1, // Little bounce on boundaries
    };

    const floor = Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 10, width * 3, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(0 - thickness / 2, height / 2, thickness, height * 3, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 3, wallOptions);

    Matter.World.add(world, [floor, leftWall, rightWall]);

    // 4. Interaction Constraints
    const mouse = Matter.Mouse.create(render.canvas);
    // 🚨 CRITICAL FIX for Windows Scaling / Retina displays:
    mouse.pixelRatio = window.devicePixelRatio || 1;

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.World.add(world, mouseConstraint);
    render.mouse = mouse;

    // 5. Spawner Logic (Raining PNGs)
    let spawnCount = 0;
    const maxItems = Math.min(30, PNG_FOOD_IMAGES.length * 2); // Plenty of food
    let spawnInterval: NodeJS.Timeout;

    const spawnItem = async () => {
      if (spawnCount >= maxItems) return;
      spawnCount++;

      const path = PNG_FOOD_IMAGES[Math.floor(Math.random() * PNG_FOOD_IMAGES.length)];

      // We aim for roughly an 80px visual footprint for the food
      const targetSize = 80 + (Math.random() * 40 - 20);

      // Load image natively to extract correct aspect ratio & scale factor
      const img = new Image();
      img.src = path;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Fallback gracefully if missing
      });

      const nativeWidth = img.width || targetSize;
      const nativeHeight = img.height || targetSize;

      // Matter JS handles scale multiplicatively. 
      // i.e., an image naturally draws at its px dimension unless scaled.
      const scaleX = targetSize / nativeWidth;
      const scaleY = targetSize / nativeHeight;

      // Ensure bodies spawn entirely within bounds
      const xRange = width - 200;
      const x = Math.random() * xRange + 100;
      const y = -100 - Math.random() * 200; // Drop sequentially from offscreen top

      // Create either a circle or rectangle based on general food shape
      // (Rectangles are safer for flat bottoms like burgers)
      const isCircle = Math.random() > 0.7; // ~30% chance for rollable objects

      let body;
      const bodyOptions = {
        restitution: 0.6, // Fun bounciness
        friction: 0.5,    // Sliding resistance
        frictionAir: 0.03, // Extra drag so they drop extra slowly
        density: 0.05,
        render: {
          sprite: {
            texture: path,
            xScale: scaleX,
            yScale: scaleY,
          },
        },
      };

      if (isCircle) {
        body = Matter.Bodies.circle(x, y, targetSize / 2, bodyOptions);
      } else {
        body = Matter.Bodies.rectangle(x, y, targetSize * 0.9, targetSize * 0.9, {
          ...bodyOptions,
          chamfer: { radius: 10 } // Smooth rounded corners
        });
      }

      // Add angular velocity for chaotic tumbling while dropping
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

      Matter.World.add(world, body);
    };

    // Burst initial array of 3 foods
    for (let i = 0; i < 3; i++) {
      spawnItem();
    }

    // Set gentle raining sequence
    spawnInterval = setInterval(() => {
      spawnItem();
      // Occasionally drop two!
      if (Math.random() > 0.7) spawnItem();
    }, 1500);

    // 6. Start Physics System
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 7. Dynamic Resizing
    const handleResize = () => {
      if (!renderRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      renderRef.current.canvas.width = newWidth;
      renderRef.current.canvas.height = newHeight;
      renderRef.current.options.width = newWidth;
      renderRef.current.options.height = newHeight;

      Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + thickness / 2 - 10 });
      Matter.Body.setPosition(rightWall, { x: newWidth + thickness / 2, y: newHeight / 2 });
    };

    window.addEventListener("resize", handleResize);

    // 8. Lifecycle cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(spawnInterval);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "auto",
        zIndex: 0
      }}
    />
  );
}
