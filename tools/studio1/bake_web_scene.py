"""Bake the supplied Blender scene into a self-contained web GLB.

Run in background Blender with the source blend open. This operates on the
in-memory scene only; the original blend and its source assets are untouched.
"""
import json
import math
import sys
import time
from pathlib import Path

import bpy
from mathutils import Vector


def main():
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = Path(args[0]).resolve()
    size = int(args[1]) if len(args) > 1 else 4096
    samples = int(args[2]) if len(args) > 2 else 48
    out.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = False
    scene.render.bake.margin = 2
    scene.render.bake.use_clear = True

    # Prefer OptiX; fall back to CUDA, and finally CPU on other machines.
    prefs = bpy.context.preferences.addons['cycles'].preferences
    chosen = 'CPU'
    for backend in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = backend
            prefs.get_devices()
            gpu = [d for d in prefs.devices if d.type == backend]
            if gpu:
                for d in prefs.devices:
                    d.use = d.type == backend
                chosen = backend
                scene.cycles.device = 'GPU'
                break
        except Exception as exc:
            print('GPU_BACKEND_UNAVAILABLE', backend, str(exc), flush=True)
    if chosen == 'CPU':
        scene.cycles.device = 'CPU'
    print('BAKE_DEVICE', chosen, 'SIZE', size, 'SAMPLES', samples, flush=True)

    # Preserve the Blender reference camera before mesh consolidation. glTF's
    # Y-up conversion maps Blender (x,y,z) to (x,z,-y).
    source_camera = scene.camera
    if not source_camera:
        raise RuntimeError('The source scene has no active camera')
    bpy.context.view_layer.update()
    camera_matrix = source_camera.matrix_world.copy()
    eye = camera_matrix.translation
    forward = camera_matrix.to_quaternion() @ Vector((0, 0, -1))
    target = eye + forward * 4.5
    to_gltf = lambda v: [float(v.x), float(v.z), float(-v.y)]
    aspect = scene.render.resolution_x * scene.render.pixel_aspect_x / (scene.render.resolution_y * scene.render.pixel_aspect_y)
    horizontal_fov = source_camera.data.angle_x
    vertical_fov = 2 * math.atan(math.tan(horizontal_fov / 2) / aspect)
    reference = {
        'position': to_gltf(eye), 'target': to_gltf(target),
        'verticalFovDegrees': math.degrees(vertical_fov),
        'referenceAspect': aspect, 'near': max(.01, source_camera.data.clip_start),
        'far': source_camera.data.clip_end,
        'resolution': [scene.render.resolution_x, scene.render.resolution_y],
    }

    meshes = [o for o in scene.objects if o.type == 'MESH' and not o.hide_render and o.visible_get()]
    if not meshes:
        raise RuntimeError('The source scene has no visible meshes')
    print('SOURCE_MESHES', len(meshes), flush=True)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    # Applying evaluated modifiers before joining preserves visible geometry.
    bpy.ops.object.convert(target='MESH')
    converted = list(bpy.context.selected_objects)
    # The source extraction hood uses inward-facing normals. Cycles shades its
    # visible back faces in the original render, but texture baking samples the
    # front side, which would otherwise bake the entire hood nearly black.
    funnel = next((o for o in converted if o.name == 'extraction_funnel'), None)
    if funnel:
        bpy.ops.object.select_all(action='DESELECT')
        funnel.select_set(True)
        bpy.context.view_layer.objects.active = funnel
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode='OBJECT')
        bpy.ops.object.select_all(action='DESELECT')
        for obj in converted:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = converted[0]
    bpy.ops.object.join()
    mesh = bpy.context.object
    mesh.name = 'studio1_baked'
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    while mesh.data.uv_layers:
        mesh.data.uv_layers.remove(mesh.data.uv_layers[0])
    mesh.data.uv_layers.new(name='WebBake')
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    started = time.monotonic()
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=.00015)
    bpy.ops.object.mode_set(mode='OBJECT')
    print('UV_SECONDS', round(time.monotonic() - started, 2), 'FACES', len(mesh.data.polygons), flush=True)

    image = bpy.data.images.new('Studio1_Lighting_Bake', width=size, height=size, alpha=True, float_buffer=True)
    image.generated_color = (0, 0, 0, 1)
    image.colorspace_settings.name = 'Linear Rec.709'
    for material in mesh.data.materials:
        if material is None or not material.use_nodes:
            raise RuntimeError('Every source surface must have a node material')
        node = material.node_tree.nodes.new('ShaderNodeTexImage')
        node.name = '__web_bake_target__'
        node.image = image
        material.node_tree.nodes.active = node
    bpy.ops.object.select_all(action='DESELECT')
    mesh.select_set(True)
    bpy.context.view_layer.objects.active = mesh
    print('BAKE_START', flush=True)
    started = time.monotonic()
    bpy.ops.object.bake(type='COMBINED')
    print('BAKE_SECONDS', round(time.monotonic() - started, 2), flush=True)

    # Save the light bake through the source scene's AgX and exposure. The web
    # renderer displays the resulting sRGB texture without another tone map.
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '8'
    png_path = out / 'studio1-baked-lighting.png'
    image.save_render(str(png_path), scene=scene)

    tex = bpy.data.images.load(str(png_path), check_existing=False)
    tex.colorspace_settings.name = 'sRGB'
    material = bpy.data.materials.new('Studio1 baked appearance')
    material.use_nodes = True
    nodes = material.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    tex_node = nodes.new('ShaderNodeTexImage')
    tex_node.image = tex
    material.node_tree.links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 1.0
    mesh.data.materials.clear()
    mesh.data.materials.append(material)
    for poly in mesh.data.polygons:
        poly.material_index = 0
    glb_path = out / 'studio1-baked.glb'
    bpy.ops.export_scene.gltf(filepath=str(glb_path), export_format='GLB', use_selection=True,
                              export_yup=True, export_apply=True, export_image_format='AUTO')
    manifest = {
        'model': glb_path.name + '?v=20261029b', 'camera': reference,
        'source': 'studio1_drawer_warm_v9/final.blend',
        'sourceMeshCount': len(meshes), 'faces': len(mesh.data.polygons),
        'bake': {'type': 'combined', 'textureSize': size, 'samples': samples,
                 'device': chosen, 'viewTransform': scene.view_settings.view_transform,
                 'exposure': scene.view_settings.exposure},
    }
    (out / 'studio1-baked.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print('WEB_BAKE_FINISHED', json.dumps(manifest, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
