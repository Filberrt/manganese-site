import { mkdir, writeFile } from 'node:fs/promises'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer
      this.onload?.()
      this.onloadend?.()
    })
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:application/octet-stream;base64,${Buffer.from(buffer).toString('base64')}`
      this.onload?.()
      this.onloadend?.()
    })
  }
}

const geometry = new THREE.IcosahedronGeometry(1, 3)
const position = geometry.getAttribute('position')

for (let index = 0; index < position.count; index += 1) {
  const vertex = new THREE.Vector3().fromBufferAttribute(position, index).normalize()
  const variation =
    Math.sin(vertex.x * 8.7 + vertex.y * 3.1) * 0.07 +
    Math.sin(vertex.z * 11.2 - vertex.x * 4.4) * 0.045
  const radialScale = 0.91 + variation
  vertex.multiplyScalar(radialScale)
  vertex.x *= 1.18
  vertex.y *= 0.78
  vertex.z *= 0.94
  vertex.y += 0.08 * Math.sin(vertex.x * 3.2)
  position.setXYZ(index, vertex.x, vertex.y, vertex.z)
}

geometry.computeVertexNormals()
geometry.clearGroups()
const materialIndexByTriangle = [0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0]
const triangleCount = position.count / 3
for (let triangle = 0; triangle < triangleCount; triangle += 1) {
  const materialIndex = materialIndexByTriangle[triangle % materialIndexByTriangle.length]
  geometry.addGroup(triangle * 3, 3, materialIndex)
}

const materials = [
  new THREE.MeshStandardMaterial({ color: '#b8a98f', roughness: 0.98, metalness: 0 }),
  new THREE.MeshStandardMaterial({ color: '#dfd3b8', roughness: 1, metalness: 0 }),
  new THREE.MeshStandardMaterial({ color: '#8f8067', roughness: 1, metalness: 0 }),
]

const stone = new THREE.Mesh(geometry, materials)
stone.rotation.set(0.24, -0.28, 0.08)
stone.castShadow = true
stone.receiveShadow = true

const scene = new THREE.Scene()
scene.add(stone)

const exporter = new GLTFExporter()
const output = await new Promise((resolve, reject) => {
  exporter.parse(scene, resolve, reject, { binary: true, onlyVisible: true })
})

await mkdir('public/models/fast', { recursive: true })
await writeFile('public/models/fast/gypsum-anhydrite-custom.glb', Buffer.from(output))
