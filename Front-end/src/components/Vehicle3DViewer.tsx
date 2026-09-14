import { Suspense, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'

import { Asset } from 'expo-asset'
import { Canvas } from '@react-three/fiber/native'
import { OrbitControls, useGLTF } from '@react-three/drei/native'
import * as THREE from 'three'

type Vehicle3DViewerProps = {
  modelSource: number | null
  height?: number
}

function VehicleModel({ uri }: { uri: string }) {
  const { scene } = useGLTF(uri)

  const fittedScene = useMemo(() => {
    const model = scene.clone(true)

    // Find original model size
    const box = new THREE.Box3().setFromObject(model)
    const size = new THREE.Vector3()

    box.getSize(size)

    const largestDimension = Math.max(
      size.x,
      size.y,
      size.z
    )

    // Resize car first
    if (largestDimension > 0) {
      const scale = 4.5 / largestDimension
      model.scale.setScalar(scale)
    }

    // Recalculate the box AFTER scaling
    const scaledBox = new THREE.Box3().setFromObject(model)
    const center = new THREE.Vector3()

    scaledBox.getCenter(center)

    // Then centre the resized vehicle
    model.position.sub(center)

    return model
  }, [scene])

  return (
    <primitive
      object={fittedScene}
      rotation={[0, Math.PI, 0]}
    />
  )
}

export default function Vehicle3DViewer({
  modelSource,
  height = 220,
}: Vehicle3DViewerProps) {
  const [modelUri, setModelUri] = useState<string | null>(null)

  useEffect(() => {
    if (!modelSource) {
      setModelUri(null)
      return
    }

    let active = true

    async function loadModel() {
      const asset = Asset.fromModule(modelSource!)

      await asset.downloadAsync()

      if (active) {
        setModelUri(asset.localUri ?? asset.uri)
      }
    }

    loadModel()

    return () => {
      active = false
    }
  }, [modelSource])

  if (!modelSource) {
    return <View style={[styles.container, { height }]} />
  }

  if (!modelUri) {
    return (
      <View style={[styles.loadingContainer, { height }]}>
        <ActivityIndicator color="#3CFFFC" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { height }]}>
      <Canvas
        camera={{
          position: [0, 0.7, 5],
          fov: 35,
        }}
      >
        <ambientLight intensity={3} />

        <hemisphereLight
          args={['#FFFFFF', '#555555', 3]}
        />

        <directionalLight
          position={[5, 5, 5]}
          intensity={5}
        />

        <directionalLight
          position={[-5, 3, 2]}
          intensity={3}
        />

        <Suspense fallback={null}>
          <VehicleModel uri={modelUri} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={7}
        />
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },

  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})