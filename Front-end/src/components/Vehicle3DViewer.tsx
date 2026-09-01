import { Suspense, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'

import { Asset } from 'expo-asset'
import { Canvas } from '@react-three/fiber/native'
import { OrbitControls, useGLTF } from '@react-three/drei/native'

type Vehicle3DViewerProps = {
  modelSource: number | null
  height?: number
}

function VehicleModel({ uri }: { uri: string }) {
  const { scene } = useGLTF(uri)

  return (
    <primitive
      object={scene}
      position={[0, -0.8, 0]}
      scale={1}
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
          position: [0, 1.2, 5],
          fov: 35,
        }}
      >
        <ambientLight intensity={2} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
        />

        <directionalLight
          position={[-5, 2, -5]}
          intensity={1.5}
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