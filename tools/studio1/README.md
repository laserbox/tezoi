# Studio1 web scene

The Interactive 3D scene is baked from Photara Forge's
`outputs/studio1_drawer_warm_v9/final.blend`. The script opens the source
read-only, applies visible mesh modifiers in memory, unwraps the merged mesh,
and bakes the combined Cycles response into a 4096×4096 texture. It corrects
the inward-facing extraction hood normals in the export copy so its visible
side receives the bake. The original Blender file is never saved.

Example on this machine:

```powershell
& 'D:\ProgramCode\C++\build_windows\bin\blender.exe' -b `
  'D:\ProgramCode\Python\photara-forge\outputs\studio1_drawer_warm_v9\final.blend' `
  --python-exit-code 1 --python 'D:\ProgramCode\Web\tezoi\tools\studio1\bake_web_scene.py' `
  -- 'C:\Users\WINDOWS\AppData\Local\Temp\tezoi-studio1-final' 4096 512
```

Copy `studio1-baked.glb` and `studio1-baked.json` from the output directory to
`site/assets/studio1-v9-web/`. The GLB embeds the PNG; the separate PNG is kept
in the build output only. Update the version strings in the manifest and site
references when replacing the model so browsers reload it.

The viewer displays the baked texture as an unlit material. Static baked
lighting follows the original scene, but reflections and highlights cannot
change physically with the camera as they do in the original Cycles render.
