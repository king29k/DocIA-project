"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface ModelProps {
  url: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: ModelProps) {
  const gltf = useLoader(GLTFLoader, url)
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.envMapIntensity = 0.8
          }
        }
      })
    }
  }, [gltf])

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  )
}

interface Model3DViewerProps {
  className?: string
  modelUrl?: string
  autoRotate?: boolean
  enableControls?: boolean
}

export default function Model3DViewer({
  className = "",
  modelUrl = "/models/Orb_assisent_ai.glb",
  autoRotate = true,
  enableControls = true,
}: Model3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="text-teal-600 font-medium">Chargement du modèle 3D...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl z-10">
          <div className="text-center">
            <p className="text-red-600 font-medium">Erreur de chargement</p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </div>
        </div>
      )}

      <Canvas
        className="w-full h-full rounded-3xl"
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={() => setIsLoading(false)}
        onError={(error) => {
          console.error("Canvas error:", error)
          setError("Impossible de charger le modèle 3D")
          setIsLoading(false)
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0d9488" />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#3b82f6" />

        {/* Environment */}
        <fog attach="fog" args={["#f0f9ff", 8, 20]} />

        {/* Model */}
        <Model url={modelUrl} scale={2} position={[0, -0.5, 0]} />

        {/* Controls */}
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  )
}
