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

const outline = new THREE.Shape()
outline.moveTo(-0.86, -0.32)
outline.lineTo(-0.72, 0.42)
outline.lineTo(-0.24, 0.7)
outline.lineTo(0.42, 0.58)
outline.lineTo(0.86, 0.18)
outline.lineTo(0.68, -0.48)
outline.lineTo(0.18, -0.68)
outline.lineTo(-0.48, -0.58)
outline.closePath()

const geometry = new THREE.ExtrudeGeometry(outline, {
  depth: 1.14,
  bevelEnabled: true,
  bevelSegments: 4,
  bevelSize: 0.14,
  bevelThickness: 0.16,
  steps: 2,
  curveSegments: 4,
})
geometry.translate(0, 0, -0.57)
geometry.scale(1.06, 0.82, 0.92)
geometry.computeVertexNormals()

const stone = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({
    color: '#ded5c4',
    roughness: 1,
    metalness: 0,
  }),
)
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
