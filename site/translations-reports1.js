export default {
  "滴管任务 · 配置复核": {
    "zh": "滴管任务 · 配置复核",
    "en": "Dropper task · Configuration review"
  },
  "回到滴管任务的原始装配。": {
    "zh": "回到滴管任务的原始装配。",
    "en": "Return to the original dropper task assembly."
  },
  "冻结初始关节姿态和两组器皿布局。此图使用额外的装配检查视角；灰色背景为展示辅助。": {
    "zh": "冻结初始关节姿态和两组器皿布局。此图使用额外的装配检查视角；灰色背景为展示辅助。",
    "en": "The initial joint pose and both sets of vessel layouts are frozen. This image uses an additional assembly inspection view; the gray background is a display aid."
  },
  "核对结果": {
    "zh": "核对结果",
    "en": "Review results"
  },
  "确认的来源与修正": {
    "zh": "确认的来源与修正",
    "en": "Confirmed sources and corrections"
  },
  "RealMan RM65-B。底层 URDF 与旧候选相同；改正的是装配导入、逐面材料、初始姿态和展示方式。": {
    "zh": "RealMan RM65-B。底层 URDF 与旧候选相同；改正的是装配导入、逐面材料、初始姿态和展示方式。",
    "en": "RealMan RM65-B. The underlying URDF is the same as in the previous candidate; the corrections concern assembly import, per-face materials, initial pose, and presentation."
  },
  "原 Xense 外壳、左右夹指、转接板、安装板和 D435i 腕部外壳。保留原局部坐标，不重居中或缩放。": {
    "zh": "原 Xense 外壳、左右夹指、转接板、安装板和 D435i 腕部外壳。保留原局部坐标，不重居中或缩放。",
    "en": "Original Xense housing, left and right gripper fingers, adapter plate, mounting plate, and D435i wrist housing. Original local coordinates are preserved, without recentering or scaling."
  },
  "烧杯 mix；锥形瓶 flask＋可动 dropper＋两侧蓝色胶头。其余任务器皿均排除。": {
    "zh": "烧杯 mix；锥形瓶 flask＋可动 dropper＋两侧蓝色胶头。其余任务器皿均排除。",
    "en": "Beaker mix; conical flask flask + movable dropper + blue bulb sections on both sides. All other task vessels are excluded."
  },
  "沿用上一版：烧杯黄绿色、锥形瓶蓝青色。保留原液体材质参数；液量未测量，当前仅表现外观。": {
    "zh": "沿用上一版：烧杯黄绿色、锥形瓶蓝青色。保留原液体材质参数；液量未测量，当前仅表现外观。",
    "en": "As in the previous version: yellow-green for the beaker and blue-cyan for the conical flask. Original liquid material parameters are retained; liquid volume has not been measured, and only appearance is currently represented."
  },
  "滴管任务配置：烧杯高 90 mm、直径约 60 mm；锥形瓶高 140 mm；玻璃管 160 mm、胶头高 35 mm。上传 CAD 的 100 / 160 / 250 mm 另一套尺寸保留为备选，不混入当前场景。": {
    "zh": "滴管任务配置：烧杯高 90 mm、直径约 60 mm；锥形瓶高 140 mm；玻璃管 160 mm、胶头高 35 mm。上传 CAD 的 100 / 160 / 250 mm 另一套尺寸保留为备选，不混入当前场景。",
    "en": "Dropper task configuration: beaker height 90 mm, diameter approximately 60 mm; conical flask height 140 mm; glass tube 160 mm, bulb height 35 mm. The alternative 100 / 160 / 250 mm dimensions in the uploaded CAD are retained as an option and are not mixed into the current scene."
  },
  "D435i 名义内参 640×480，fx＝fy＝462.1386899 px；固定相机与物理腕相机按冻结安装变换。原展示近景、虚拟腕相机单独命名，不冒充传感器画面。": {
    "zh": "D435i 名义内参 640×480，fx＝fy＝462.1386899 px；固定相机与物理腕相机按冻结安装变换。原展示近景、虚拟腕相机单独命名，不冒充传感器画面。",
    "en": "D435i nominal intrinsics at 640×480, fx = fy = 462.1386899 px; the fixed camera and physical wrist camera use the frozen mounting transforms. The original display close-up and virtual wrist camera are named separately and are not presented as sensor footage."
  },
  "按冻结关节和安装链复算，部件位置最大差 1.11e-16 m（数值精度内）。": {
    "zh": "按冻结关节和安装链复算，部件位置最大差 1.11e-16 m（数值精度内）。",
    "en": "Recalculation using the frozen joints and mounting chain gives a maximum component position difference of 1.11e-16 m (within numerical precision)."
  },
  "2026-10-22 原任务已渲染画面，仅作为外观与装配参考；不是 IMG_6100 的新转换结果，也没有重启该任务。": {
    "zh": "2026-10-22 原任务已渲染画面，仅作为外观与装配参考；不是 IMG_6100 的新转换结果，也没有重启该任务。",
    "en": "Previously rendered footage of the original task from 2026-10-22, used only as an appearance and assembly reference; this is not a new conversion of IMG_6100, and that task has not been restarted."
  },
  "construction SHA-256：": {
    "zh": "构建记录 SHA-256：",
    "en": "construction SHA-256:"
  },
  "下载配置修正记录": {
    "zh": "下载配置修正记录",
    "en": "Download configuration correction log"
  },
  "263 个源时间采样，固定机器人关节位置限制内生成。最大 TCP 位置残差 2.143 mm，最大关节速度 4.054 rad/s；速度限制尚未验证。几何接触、碰撞、胶头变形、液体与任务成功未求解。人手采用 MediaPipe 估计，没有 Xsens 实测动捕。": {
    "zh": "263 个源时间采样，固定机器人关节位置限制内生成。最大 TCP 位置残差 2.143 mm，最大关节速度 4.054 rad/s；速度限制尚未验证。几何接触、碰撞、胶头变形、液体与任务成功未求解。人手采用 MediaPipe 估计，没有 Xsens 实测动捕。",
    "en": "263 source-time samples, generated within the fixed robot joint position limits. Maximum TCP position residual: 2.143 mm; maximum joint velocity: 4.054 rad/s. Velocity limits have not yet been verified. Geometric contact, collisions, bulb deformation, liquid, and task success have not been solved. Human hands are estimated using MediaPipe; there is no measured Xsens motion capture."
  },
  "Ego2Sim V9 · 消除开场翻肘": {
    "zh": "Ego2Sim V9 · 消除开场翻肘",
    "en": "Ego2Sim V9 · Eliminating the initial elbow flip"
  },
  "EGO2SIM / V9 / ready01 / 2026-10-25": {
    "zh": "EGO2SIM / V9 / ready01 / 2026-10-25",
    "en": "EGO2SIM / V9 / ready01 / 2026-10-25"
  },
  "重新规划机械臂初始待机姿态，以同一肘部构型完成 35 秒连续求解。持握、滴加、放回和自由释放通过本轮接触与液体检查；烧杯接收": {
    "zh": "重新规划机械臂初始待机姿态，以同一肘部构型完成 35 秒连续求解。持握、滴加、放回和自由释放通过本轮接触与液体检查；烧杯接收",
    "en": "The robot's initial standby pose was replanned to complete a continuous 35-second solve with the same elbow configuration. Holding, dispensing, returning, and free release passed this round's contact and liquid checks; the beaker received"
  },
  "，未检出洒出。各视频来自同一条原生状态记录。": {
    "zh": "，未检出洒出。各视频来自同一条原生状态记录。",
    "en": ", with no spillage detected. All videos come from the same native state record."
  },
  "夹持、回瓶与自由斜靠": {
    "zh": "夹持、回瓶与自由斜靠",
    "en": "Grasping, return to flask, and freely leaning rest"
  },
  "之前为什么会转一下": {
    "zh": "之前为什么会转一下",
    "en": "Why it rotated before"
  },
  "直接从旧待机位连续跟随直线目标，会触及基座和肘部限位，最大位置残差 69.121 mm，已拒绝。当前改为在第一个物理步之前，根据初始滴管几何规划管轴上方 80 mm 的安全预抓取待机位，再从该姿态连续求解。原机器人、相机、视觉资产、滴管初态、物理参数和液体模型不变；没有中途复位、截掉开场、焊接或物体位姿强制回放。": {
    "zh": "直接从旧待机位连续跟随直线目标，会触及基座和肘部限位，最大位置残差 69.121 mm，已拒绝。当前改为在第一个物理步之前，根据初始滴管几何规划管轴上方 80 mm 的安全预抓取待机位，再从该姿态连续求解。原机器人、相机、视觉资产、滴管初态、物理参数和液体模型不变；没有中途复位、截掉开场、焊接或物体位姿强制回放。",
    "en": "Continuously following straight-line targets directly from the old standby pose reached the base and elbow limits, with a maximum position residual of 69.121 mm; this candidate was rejected. The current approach plans a safe pre-grasp standby pose 80 mm above the tube axis from the initial dropper geometry before the first physics step, then solves continuously from that pose. The original robot, cameras, visual assets, initial dropper state, physical parameters, and liquid model are unchanged; there are no mid-run resets, cuts to the opening, welds, or forced object pose playback."
  },
  "起始机械臂关节姿态确实改变了，因此不能称为“从同一起点得到了更短路径”。新开场六关节累计行程为 9.808°，旧版为 520.794°。跨越烧杯与锥形瓶时的基座运动、腕部保持工具方向的补偿，以及进出瓶口的倾角调整仍保留。": {
    "zh": "起始机械臂关节姿态确实改变了，因此不能称为“从同一起点得到了更短路径”。新开场六关节累计行程为 9.808°，旧版为 520.794°。跨越烧杯与锥形瓶时的基座运动、腕部保持工具方向的补偿，以及进出瓶口的倾角调整仍保留。",
    "en": "The initial robot joint pose did change, so this cannot be described as “a shorter path from the same starting point.” The cumulative travel of the six joints during the new opening is 9.808°, compared with 520.794° previously. Base motion between the beaker and conical flask, wrist compensation to maintain tool orientation, and tilt adjustments when entering and leaving the flask opening are retained."
  },
  "实际 30 Hz 记录的全程峰值关节速度 0.928 rad/s，峰值加速度 2.254 rad/s²；旧版分别为 1.873 和 2.254。这些是采样轨迹诊断，不是新硬件限值。逐原生步的关节位置、控制与驱动力限制另行检查。完整轨迹静态预检不能代替动态接触审核。": {
    "zh": "实际 30 Hz 记录的全程峰值关节速度 0.928 rad/s，峰值加速度 2.254 rad/s²；旧版分别为 1.873 和 2.254。这些是采样轨迹诊断，不是新硬件限值。逐原生步的关节位置、控制与驱动力限制另行检查。完整轨迹静态预检不能代替动态接触审核。",
    "en": "Across the actual 30 Hz record, peak joint velocity is 0.928 rad/s and peak acceleration is 2.254 rad/s²; the previous values were 1.873 and 2.254, respectively. These are sampled trajectory diagnostics, not new hardware limits. Joint position, control, and actuator force limits are checked separately at every native step. A static precheck of the complete trajectory cannot replace dynamic contact review."
  },
  "项目": {
    "zh": "项目",
    "en": "Item"
  },
  "实际结果": {
    "zh": "实际结果",
    "en": "Actual result"
  },
  "≤0.10 mm": {
    "zh": "≤0.10 mm",
    "en": "≤0.10 mm"
  },
  "整轨迹静态预检": {
    "zh": "整轨迹静态预检",
    "en": "Static precheck of the full trajectory"
  },
  "未检出禁止穿插": {
    "zh": "未检出禁止穿插",
    "en": "No prohibited interpenetration detected"
  },
  "全原生步 ≤0.10 N": {
    "zh": "全原生步 ≤0.10 N",
    "en": "≤0.10 N at all native steps"
  },
  "8–26 s 每个原生步": {
    "zh": "8–26 s 每个原生步",
    "en": "Every native step from 8–26 s"
  },
  "各 ≤5 mm": {
    "zh": "各 ≤5 mm",
    "en": "≤5 mm each"
  },
  "胶头中心偏移 / 相对转动": {
    "zh": "胶头中心偏移 / 相对转动",
    "en": "Bulb center displacement / relative rotation"
  },
  "1.437 mm / 3.394°": {
    "zh": "1.437 mm / 3.394°",
    "en": "1.437 mm / 3.394°"
  },
  "≤5 mm，保留原门槛": {
    "zh": "≤5 mm，保留原门槛",
    "en": "≤5 mm, original threshold retained"
  },
  "烧杯上方 / 回瓶 XY 误差": {
    "zh": "烧杯上方 / 回瓶 XY 误差",
    "en": "XY error above beaker / on return to flask"
  },
  "自由释放后倾角": {
    "zh": "自由释放后倾角",
    "en": "Tilt angle after free release"
  },
  ">0.01 / >0.001 N": {
    "zh": ">0.01 / >0.001 N",
    "en": ">0.01 / >0.001 N"
  },
  "末态速度 / 角速度": {
    "zh": "末态速度 / 角速度",
    "en": "Final-state speed / angular velocity"
  },
  "0.0343 mm/s / 0.00866 rad/s": {
    "zh": "0.0343 mm/s / 0.00866 rad/s",
    "en": "0.0343 mm/s / 0.00866 rad/s"
  },
  "原配置限制": {
    "zh": "原配置限制",
    "en": "Original configuration limits"
  },
  "液体进入烧杯": {
    "zh": "液体进入烧杯",
    "en": "Liquid entering the beaker"
  },
  "0.161543 mL": {
    "zh": "0.161543 mL",
    "en": "0.161543 mL"
  },
  "0.000000 mL / 0": {
    "zh": "0.000000 mL / 0",
    "en": "0.000000 mL / 0"
  },
  "<0.000001 mL": {
    "zh": "<0.000001 mL",
    "en": "<0.000001 mL"
  },
  "旧版管尖相对位移 5 mm 指标仍为": {
    "zh": "旧版管尖相对位移 5 mm 指标仍为",
    "en": "The previous 5 mm tube-tip relative displacement criterion remains"
  },
  "模型范围": {
    "zh": "模型范围",
    "en": "Model scope"
  },
  "控制器读取模拟中的实际滴管位姿反馈，不代表视频端到端部署或真机成功。35 秒是重新规划的执行时钟；原视频、分割、点云、资产及三维手部 15 个上游 demo 均原样保留。原固定相机仍只覆盖局部，完整机械臂用已有总览视角展示。全部 5 个视频为 Blender Cycles 1280×960、24 samples、30 Hz、1,051 帧，无渲染轨迹平滑；1,051 个管尖与液体回放状态逐项绑定原生记录，并做全视频解码。": {
    "zh": "控制器读取模拟中的实际滴管位姿反馈，不代表视频端到端部署或真机成功。35 秒是重新规划的执行时钟；原视频、分割、点云、资产及三维手部 15 个上游 demo 均原样保留。原固定相机仍只覆盖局部，完整机械臂用已有总览视角展示。全部 5 个视频为 Blender Cycles 1280×960、24 samples、30 Hz、1,051 帧，无渲染轨迹平滑；1,051 个管尖与液体回放状态逐项绑定原生记录，并做全视频解码。",
    "en": "The controller reads feedback from the actual simulated dropper pose; this does not demonstrate end-to-end deployment from video or success on real hardware. The 35 seconds use a replanned execution clock; all 15 upstream demos covering the original video, segmentation, point clouds, assets, and 3D hands are retained unchanged. The original fixed camera still covers only part of the scene; the existing overview shows the full robot arm. All 5 videos use Blender Cycles at 1280×960, 24 samples, 30 Hz, and 1,051 frames, with no rendering trajectory smoothing; all 1,051 tube-tip and liquid playback states are individually bound to native records, and every video is fully decoded for verification."
  },
  "本轮完整 175,000 原生步、8 项接触记录反例、5 项液体记录反例、3 项渲染绑定反例和便携模型数组等价检查通过。": {
    "zh": "本轮完整 175,000 原生步、8 项接触记录反例、5 项液体记录反例、3 项渲染绑定反例和便携模型数组等价检查通过。",
    "en": "This round passed checks covering all 175,000 native steps, 8 contact-record counterexamples, 5 liquid-record counterexamples, 3 render-binding counterexamples, and portable model array equivalence."
  },
  "起始姿态与转动对比": {
    "zh": "起始姿态与转动对比",
    "en": "Initial pose and rotation comparison"
  },
  "接触与限制": {
    "zh": "接触与限制",
    "en": "Contact and limits"
  },
  "接触覆盖": {
    "zh": "接触覆盖",
    "en": "Contact coverage"
  },
  "回放绑定": {
    "zh": "回放绑定",
    "en": "Playback binding"
  },
  "上游保留": {
    "zh": "上游保留",
    "en": "Upstream preservation"
  },
  "V8 原结果与原视频": {
    "zh": "V8 原结果与原视频",
    "en": "Original V8 results and videos"
  },
  "。本次失败的旧待机位直线 IK 候选未进入完整物理求解，也未发布为成功。": {
    "zh": "。本次失败的旧待机位直线 IK 候选未进入完整物理求解，也未发布为成功。",
    "en": ". The failed straight-line IK candidate from the old standby pose did not proceed to a complete physics solve and was not published as a success."
  },
  "下载液体演示": {
    "zh": "下载液体演示",
    "en": "Download liquid demo"
  },
  "EGO2SIM / V10 / lower02 / 2026-10-25": {
    "zh": "EGO2SIM / V10 / lower02 / 2026-10-25",
    "en": "EGO2SIM / V10 / lower02 / 2026-10-25"
  },
  "最大管尖相对位移由 11.055 mm 降为": {
    "zh": "最大管尖相对位移由 11.055 mm 降为",
    "en": "Maximum tube-tip relative displacement decreased from 11.055 mm to"
  },
  "，原 5 mm 门槛不变。双侧持握、滴加、放回、自由释放及原有全部原生门槛同时通过。烧杯接收 0.161 mL，未检出洒出。": {
    "zh": "，原 5 mm 门槛不变。双侧持握、滴加、放回、自由释放及原有全部原生门槛同时通过。烧杯接收 0.161 mL，未检出洒出。",
    "en": ", with the original 5 mm threshold unchanged. Bilateral holding, dispensing, return, free release, and all original native-step thresholds passed together. The beaker received 0.161 mL, with no spillage detected."
  },
  "持握与自然放回": {
    "zh": "持握与自然放回",
    "en": "Holding and natural return"
  },
  "管尖与接触审核": {
    "zh": "管尖与接触审核",
    "en": "Tube-tip and contact review"
  },
  "旧方案胶头中心移动仅 1.437 mm，但胶头相对夹爪转动达到 3.394°，经长管放大后管尖相对位移达到 11.055 mm。改变姿态角、去掉或削弱转动反馈、保持管轴恒倾角都未通过，失败记录保留。": {
    "zh": "旧方案胶头中心移动仅 1.437 mm，但胶头相对夹爪转动达到 3.394°，经长管放大后管尖相对位移达到 11.055 mm。改变姿态角、去掉或削弱转动反馈、保持管轴恒倾角都未通过，失败记录保留。",
    "en": "In the previous approach, the bulb center moved only 1.437 mm, but the bulb rotated 3.394° relative to the gripper; the long tube amplified this into a tube-tip relative displacement of 11.055 mm. Changing the pose angle, removing or weakening rotational feedback, and maintaining a constant tube-axis tilt all failed; their failure records are retained."
  },
  "10 mm 下移得到 5.156 mm，14 mm 下移反而回升到 9.207 mm，均不发布。采用的 12 mm 方案得到 4.327 mm，胶头中心偏移 0.749 mm、相对转动 1.256°，左右实际接触累计滑移 1.569/1.640 mm。未提高摩擦、附加焊接或把原 5 mm 门槛改名放宽。": {
    "zh": "10 mm 下移得到 5.156 mm，14 mm 下移反而回升到 9.207 mm，均不发布。采用的 12 mm 方案得到 4.327 mm，胶头中心偏移 0.749 mm、相对转动 1.256°，左右实际接触累计滑移 1.569/1.640 mm。未提高摩擦、附加焊接或把原 5 mm 门槛改名放宽。",
    "en": "A 10 mm downward shift yielded 5.156 mm, while a 14 mm shift increased it again to 9.207 mm; neither is published. The adopted 12 mm approach yielded 4.327 mm, with 0.749 mm bulb center displacement, 1.256° relative rotation, and cumulative slip at actual left/right contacts of 1.569/1.640 mm. Friction was not increased, no weld was added, and the original 5 mm threshold was not renamed or relaxed."
  },
  "35 秒、175,000 原生步的抓持、滴加、自然放回和全部原门槛共同通过。该结果针对本场景的假定物性；不等于不同初态、真实胶头或真机已经标定验证。": {
    "zh": "35 秒、175,000 原生步的抓持、滴加、自然放回和全部原门槛共同通过。该结果针对本场景的假定物性；不等于不同初态、真实胶头或真机已经标定验证。",
    "en": "Grasping, dispensing, natural return, and all original thresholds passed together over 35 seconds and 175,000 native steps. This result applies to the assumed physical properties in this scene; it does not mean that different initial states, real bulbs, or real hardware have been calibrated and verified."
  },
  "动作平稳性": {
    "zh": "动作平稳性",
    "en": "Motion smoothness"
  },
  "完整连续求解验收": {
    "zh": "完整连续求解验收",
    "en": "Complete continuous-solve acceptance"
  },
  "实测结果": {
    "zh": "实测结果",
    "en": "Measured result"
  },
  "≤5 mm": {
    "zh": "≤5 mm",
    "en": "≤5 mm"
  },
  "胶头中心偏移 / 转动": {
    "zh": "胶头中心偏移 / 转动",
    "en": "Bulb center displacement / rotation"
  },
  "烧杯 / 回瓶 XY 误差": {
    "zh": "烧杯 / 回瓶 XY 误差",
    "en": "XY error at beaker / on return to flask"
  },
  "自然斜靠角": {
    "zh": "自然斜靠角",
    "en": "Natural leaning angle"
  },
  "0.0355 mm/s / 0.00794 rad/s": {
    "zh": "0.0355 mm/s / 0.00794 rad/s",
    "en": "0.0355 mm/s / 0.00794 rad/s"
  },
  "Newton 峰值 / 警告": {
    "zh": "Newton 峰值 / 警告",
    "en": "Peak Newton iterations / warnings"
  },
  "0.161493 mL": {
    "zh": "0.161493 mL",
    "en": "0.161493 mL"
  },
  "4.61e-13 mL": {
    "zh": "4.61e-13 mL",
    "en": "4.61e-13 mL"
  },
  "参考 SimFoundry 后补了什么": {
    "zh": "参考 SimFoundry 后补了什么",
    "en": "What was added after consulting SimFoundry"
  },
  "的反投影、世界坐标、物体配准、物性导入、场景整理和对象局部关键点规划做了逐段审查。本轮增加对象局部抓点与管尖事件目标的一致性核对，新增 528 个变换的 SE(3) 与往返核对、XYZW/WXYZ 序列转换、实际加载的质量/惯量/摩擦/限制一致性，以及三类错误坐标反例；同时按动作阶段分解管尖偏移，绑定输入状态哈希。": {
    "zh": "的反投影、世界坐标、物体配准、物性导入、场景整理和对象局部关键点规划做了逐段审查。本轮增加对象局部抓点与管尖事件目标的一致性核对，新增 528 个变换的 SE(3) 与往返核对、XYZW/WXYZ 序列转换、实际加载的质量/惯量/摩擦/限制一致性，以及三类错误坐标反例；同时按动作阶段分解管尖偏移，绑定输入状态哈希。",
    "en": " was reviewed section by section for back-projection, world coordinates, object registration, physical property import, scene organization, and object-local keypoint planning. This round adds consistency checks between object-local grasp points and tube-tip event targets, SE(3) and round-trip checks for 528 additional transforms, XYZW/WXYZ sequence conversion, consistency of the actually loaded mass/inertia/friction/limits, and three categories of incorrect-coordinate counterexamples. Tube-tip displacement is also broken down by action phase and bound to input-state hashes."
  },
  "整个链路下一步仍要优化": {
    "zh": "整个链路下一步仍要优化",
    "en": "Further improvements needed across the pipeline"
  },
  "实际边界与下一步": {
    "zh": "实际边界与下一步",
    "en": "Actual boundaries and next steps"
  },
  "单目 CAD 尺度先验；独立相机跟踪仅 4/9 样本有效。视频与机器人另有 132.96 mm 布局适配，须继续标定与独立保留帧验证。": {
    "zh": "单目 CAD 尺度先验；独立相机跟踪仅 4/9 样本有效。视频与机器人另有 132.96 mm 布局适配，须继续标定与独立保留帧验证。",
    "en": "Monocular CAD scale prior; independent camera tracking is valid for only 4/9 samples. Video and robot layouts also require a 132.96 mm adaptation, with further calibration and independent held-out-frame validation needed."
  },
  "263 帧中 82 帧管尖可见；轴向 roll 不可观测。192 组人手接触候选中 7 组几何未通过，严格指尖检查仅 160 组通过；几何候选不代表测得接触力。": {
    "zh": "263 帧中 82 帧管尖可见；轴向 roll 不可观测。192 组人手接触候选中 7 组几何未通过，严格指尖检查仅 160 组通过；几何候选不代表测得接触力。",
    "en": "The tube tip is visible in 82 of 263 frames; axial roll is unobservable. Of 192 human-hand contact candidate pairs, 7 failed geometric checks, and only 160 passed strict fingertip checks; geometric candidates do not represent measured contact forces."
  },
  "进一步加入全尺寸携带工具的规划扫掠体、对象局部事件和不确定性。当前反馈读取模拟真实位姿，尚非视频感知端到端部署。": {
    "zh": "进一步加入全尺寸携带工具的规划扫掠体、对象局部事件和不确定性。当前反馈读取模拟真实位姿，尚非视频感知端到端部署。",
    "en": "Further incorporate swept volumes of the full-size carried tool, object-local events, and uncertainty into planning. Current feedback reads the actual simulated pose; this is not yet end-to-end deployment from video perception."
  },
  "优先实测压力–压缩曲线、质量、摩擦和容量。双片弹簧胶头、等温气腔、黏性管流、弹道液滴与静液面仍是简化模型；未覆盖 CFD、润湿、飞溅、混色或化学反应。": {
    "zh": "优先实测压力–压缩曲线、质量、摩擦和容量。双片弹簧胶头、等温气腔、黏性管流、弹道液滴与静液面仍是简化模型；未覆盖 CFD、润湿、飞溅、混色或化学反应。",
    "en": "Prioritize measurement of pressure–compression curves, mass, friction, and capacity. The two-part spring bulb, isothermal air chamber, viscous tube flow, ballistic droplets, and static liquid surfaces remain simplified models; CFD, wetting, splashing, color mixing, and chemical reactions are not covered."
  },
  "视频与证据": {
    "zh": "视频与证据",
    "en": "Videos and evidence"
  },
  "全部原生门槛": {
    "zh": "全部原生门槛",
    "en": "All native-step thresholds"
  },
  "平稳性": {
    "zh": "平稳性",
    "en": "Smoothness"
  },
  "独立记录核对": {
    "zh": "独立记录核对",
    "en": "Independent record cross-check"
  },
  "抓点与管尖目标核对": {
    "zh": "抓点与管尖目标核对",
    "en": "Grasp-point and tube-tip target checks"
  },
  "SimFoundry 代码审查": {
    "zh": "SimFoundry 代码审查",
    "en": "SimFoundry code review"
  },
  "下载液体视频": {
    "zh": "下载液体视频",
    "en": "Download liquid video"
  },
  "← 返回五阶段 Demo": {
    "zh": "← 返回五阶段 Demo",
    "en": "← Back to the five-stage demo"
  },
  "V5 · 原滴管配置、颜色和尺度保持 · 物理求解关闭": {
    "zh": "V5 · 原滴管配置、颜色和尺度保持 · 物理求解关闭",
    "en": "V5 · Original dropper configuration, colors, and scale retained · Physics solve disabled"
  },
  "检查": {
    "zh": "检查",
    "en": "Check"
  },
  "V5": {
    "zh": "V5",
    "en": "V5"
  },
  "手部接触候选": {
    "zh": "手部接触候选",
    "en": "Hand contact candidates"
  },
  "严格逐指投影": {
    "zh": "严格逐指投影",
    "en": "Strict per-finger projection"
  },
  "平均指尖表面距离": {
    "zh": "平均指尖表面距离",
    "en": "Mean fingertip-to-surface distance"
  },
  "5.80 mm": {
    "zh": "5.80 mm",
    "en": "5.80 mm"
  },
  "额外通道投影": {
    "zh": "额外通道投影",
    "en": "Additional corridor projection"
  },
  "0 mm": {
    "zh": "0 mm",
    "en": "0 mm"
  },
  "独立目标平滑偏移": {
    "zh": "独立目标平滑偏移",
    "en": "Independent target smoothing offset"
  },
  "夹爪直接跟随物体接触中心，避免独立平滑引入错位": {
    "zh": "夹爪直接跟随物体接触中心，避免独立平滑引入错位",
    "en": "The gripper directly follows the object's contact center to avoid misalignment introduced by independent smoothing"
  },
  "4.32 mm": {
    "zh": "4.32 mm",
    "en": "4.32 mm"
  },
  "IK 数值拟合误差，不是硬件执行精度": {
    "zh": "IK 数值拟合误差，不是硬件执行精度",
    "en": "IK numerical fitting error, not hardware execution accuracy"
  },
  "4.00 rad/s": {
    "zh": "4.00 rad/s",
    "en": "4.00 rad/s"
  },
  "保持位置限位及 4 rad/s 候选约束；未认证真机速度能力": {
    "zh": "保持位置限位及 4 rad/s 候选约束；未认证真机速度能力",
    "en": "Position limits and the 4 rad/s candidate constraint retained; real-hardware velocity capability is not certified"
  },
  "182 / 216 帧；P95 13.44 mm": {
    "zh": "182 / 216 帧；P95 13.44 mm",
    "en": "182 / 216 frames; P95 13.44 mm"
  },
  "接触目标帧最差 3.81 mm；P95 3.80 mm；接近、换物、撤离不计入接触目标": {
    "zh": "接触目标帧最差 3.81 mm；P95 3.80 mm；接近、换物、撤离不计入接触目标",
    "en": "Worst contact-target frame: 3.81 mm; P95 3.80 mm; approach, object switching, and retreat are excluded from contact targets"
  },
  "所有 192 对原始候选均保留。缺失手部观测没有补造成接触；使用原门槛统计。": {
    "zh": "所有 192 对原始候选均保留。缺失手部观测没有补造成接触；使用原门槛统计。",
    "en": "All 192 original candidate pairs are retained. Missing hand observations are not fabricated as contacts; statistics use the original thresholds."
  },
  "仍未通过时间": {
    "zh": "仍未通过时间",
    "en": "Times still failing checks"
  },
  "无未通过候选；无观测不视为通过": {
    "zh": "无未通过候选；无观测不视为通过",
    "en": "No failed candidates; missing observations do not count as passes"
  },
  "8.50–13.00s · 转移滴管": {
    "zh": "8.50–13.00s · 转移滴管",
    "en": "8.50–13.00s · Transfer the dropper"
  },
  "13.00–27.00s · 滴加意图": {
    "zh": "13.00–27.00s · 滴加意图",
    "en": "13.00–27.00s · Dispensing intent"
  },
  "27.00–30.67s · 放回滴管": {
    "zh": "27.00–30.67s · 放回滴管",
    "en": "27.00–30.67s · Return the dropper"
  },
  "32.00–40.50s · 操作烧杯": {
    "zh": "32.00–40.50s · 操作烧杯",
    "en": "32.00–40.50s · Manipulate the beaker"
  },
  "仍未修复的 7 对": {
    "zh": "仍未修复的 7 对",
    "en": "7 pairs still unresolved"
  },
  "最大指尖距离": {
    "zh": "最大指尖距离",
    "en": "Maximum fingertip distance"
  },
  "结论": {
    "zh": "结论",
    "en": "Conclusion"
  },
  "268.86 → 134.77 mm": {
    "zh": "268.86 → 134.77 mm",
    "en": "268.86 → 134.77 mm"
  },
  "有界关节与图像约束下未满足三维距离，保留拒绝。": {
    "zh": "有界关节与图像约束下未满足三维距离，保留拒绝。",
    "en": "The 3D distance requirement was not met under bounded joint and image constraints; rejection is retained."
  },
  "15.05 → 14.09 mm": {
    "zh": "15.05 → 14.09 mm",
    "en": "15.05 → 14.09 mm"
  },
  "17.500s / Left": {
    "zh": "17.500s / 左手",
    "en": "17.500s / Left"
  },
  "7.55 px": {
    "zh": "7.55 px",
    "en": "7.55 px"
  },
  "22.42 → 14.42 mm": {
    "zh": "22.42 → 14.42 mm",
    "en": "22.42 → 14.42 mm"
  },
  "18.500s / Left": {
    "zh": "18.500s / 左手",
    "en": "18.500s / Left"
  },
  "8.35 px": {
    "zh": "8.35 px",
    "en": "8.35 px"
  },
  "19.39 → 14.23 mm": {
    "zh": "19.39 → 14.23 mm",
    "en": "19.39 → 14.23 mm"
  },
  "25.667s / Right": {
    "zh": "25.667s / 右手",
    "en": "25.667s / Right"
  },
  "5.96 px": {
    "zh": "5.96 px",
    "en": "5.96 px"
  },
  "滴管到夹爪对齐": {
    "zh": "滴管到夹爪对齐",
    "en": "Dropper-to-gripper alignment"
  },
  "物体和机械臂按估计位姿／IK 分别回放，未建立物理附着。表面距离为无符号距离，不能替代完整穿透、碰撞、摩擦、力分配和任务成功验收。未做液体求解或硬件执行。": {
    "zh": "物体和机械臂按估计位姿／IK 分别回放，未建立物理附着。表面距离为无符号距离，不能替代完整穿透、碰撞、摩擦、力分配和任务成功验收。未做液体求解或硬件执行。",
    "en": "The objects and robot arm are played back separately using estimated poses and IK; no physical attachment has been established. Surface distances are unsigned and cannot replace full penetration, collision, friction, force distribution, and task-success acceptance checks. No liquid solve or hardware execution has been performed."
  },
  "逐段复核 JSON": {
    "zh": "逐段复核 JSON",
    "en": "Section-by-section review JSON"
  },
  "实验记录": {
    "zh": "实验记录",
    "en": "Experiment log"
  },
  "三维手与三角面锚点": {
    "zh": "三维手与三角面锚点",
    "en": "3D hands and triangle-surface anchors"
  },
  "几何验证": {
    "zh": "几何验证",
    "en": "Geometric validation"
  },
  "独立一致性检查": {
    "zh": "独立一致性检查",
    "en": "Independent consistency checks"
  },
  "Ego2Sim · 滴管抓取与放回验证": {
    "zh": "Ego2Sim · 滴管抓取与放回验证",
    "en": "Ego2Sim · Dropper grasp-and-return validation"
  },
  "滴管能被夹起、搬运并放回。": {
    "zh": "滴管能被夹起、搬运并放回。",
    "en": "The dropper can be grasped, transported, and returned."
  },
  "35 秒连续求解：接近、闭合、抬升、移到烧杯上方、回瓶、松开及稳定。175,000 个原生步全部审计；没有抓持焊接、中途重置或物体位姿强制回放。液体未求解，烧杯后续摇晃也不在本轮范围内。": {
    "zh": "35 秒连续求解：接近、闭合、抬升、移到烧杯上方、回瓶、松开及稳定。175,000 个原生步全部审计；没有抓持焊接、中途重置或物体位姿强制回放。液体未求解，烧杯后续摇晃也不在本轮范围内。",
    "en": "Continuous 35-second solve: approach, closure, lift, move above the beaker, return to the flask, release, and stabilization. All 175,000 native steps were audited; there are no grasp welds, mid-run resets, or forced object pose playback. Liquid has not been solved, and subsequent beaker shaking is outside this round's scope."
  },
  "这次修复了什么": {
    "zh": "这次修复了什么",
    "en": "What was fixed this time"
  },
  "胶头接触启用原名义系数对应的扭转摩擦（condim 4），并用 impratio 10 降低软接触的慢滑移；没有提高摩擦系数。双指耦合与滑动限位的数值稳定时间常数分别为 3 ms 和 2 ms。胶头仍是两片带弹簧的滑动近似，尚未完成真实橡胶材料标定。": {
    "zh": "胶头接触启用原名义系数对应的扭转摩擦（condim 4），并用 impratio 10 降低软接触的慢滑移；没有提高摩擦系数。双指耦合与滑动限位的数值稳定时间常数分别为 3 ms 和 2 ms。胶头仍是两片带弹簧的滑动近似，尚未完成真实橡胶材料标定。",
    "en": "Bulb contact enables torsional friction corresponding to the original nominal coefficient (condim 4), with impratio 10 reducing slow slip in soft contact; the friction coefficient was not increased. Numerical stabilization time constants for two-finger coupling and sliding limits are 3 ms and 2 ms, respectively. The bulb remains a two-part spring-loaded sliding approximation; calibration against real rubber material is not yet complete."
  },
  "检查项": {
    "zh": "检查项",
    "en": "Check item"
  },
  "本轮结果": {
    "zh": "本轮结果",
    "en": "Result this round"
  },
  "≤ 0.10 mm": {
    "zh": "≤ 0.10 mm",
    "en": "≤ 0.10 mm"
  },
  "≤ 0.10 N": {
    "zh": "≤ 0.10 N",
    "en": "≤ 0.10 N"
  },
  "持握双侧接触": {
    "zh": "持握双侧接触",
    "en": "Bilateral contact during holding"
  },
  "90,001 / 90,001 步": {
    "zh": "90,001 / 90,001 步",
    "en": "90,001 / 90,001 steps"
  },
  "≤ 5 mm": {
    "zh": "≤ 5 mm",
    "en": "≤ 5 mm"
  },
  "烧杯上方 XY 偏差": {
    "zh": "烧杯上方 XY 偏差",
    "en": "XY deviation above the beaker"
  },
  "回瓶前 XY 偏差": {
    "zh": "回瓶前 XY 偏差",
    "en": "XY deviation before return to the flask"
  },
  "夹爪释放后的接触力": {
    "zh": "夹爪释放后的接触力",
    "en": "Contact force after gripper release"
  },
  "0.000 N": {
    "zh": "0.000 N",
    "en": "0.000 N"
  },
  "≤ 2 mm/s": {
    "zh": "≤ 2 mm/s",
    "en": "≤ 2 mm/s"
  },
  "最后两秒最大角速度": {
    "zh": "最后两秒最大角速度",
    "en": "Maximum angular velocity in the last two seconds"
  },
  "0.005401 rad/s": {
    "zh": "0.005401 rad/s",
    "en": "0.005401 rad/s"
  },
  "≤ 0.01 mm（滑动关节）": {
    "zh": "≤ 0.01 mm（滑动关节）",
    "en": "≤ 0.01 mm (sliding joints)"
  },
  "数值警告 / 最大迭代": {
    "zh": "数值警告 / 最大迭代",
    "en": "Numerical warnings / maximum iterations"
  },
  "持握检查区间为 8–26 秒，包括抬升、搬运和放回。双侧最小接触合力分别为 1.042 / 1.047 N。全程最大接触穿透约 0.271 mm，来自软接触模型，不能与“初始无穿插”混为一谈。最终滴管自然靠在瓶内，最后两秒管尖位移 0.00258 mm。": {
    "zh": "持握检查区间为 8–26 秒，包括抬升、搬运和放回。双侧最小接触合力分别为 1.042 / 1.047 N。全程最大接触穿透约 0.271 mm，来自软接触模型，不能与“初始无穿插”混为一谈。最终滴管自然靠在瓶内，最后两秒管尖位移 0.00258 mm。",
    "en": "The holding check covers 8–26 seconds, including lift, transport, and return. Minimum resultant contact forces on the two sides are 1.042 / 1.047 N. Maximum contact penetration over the full run is approximately 0.271 mm and comes from the soft-contact model; it must not be confused with “no initial interpenetration.” The dropper ultimately rests naturally inside the flask, with a tube-tip displacement of 0.00258 mm during the last two seconds."
  },
  "时间轴与适配边界": {
    "zh": "时间轴与适配边界",
    "en": "Timeline and adaptation boundaries"
  },
  "原 RealMan RM65-B、Xense、CAD 尺寸和固定相机配置保留。近景是展示相机；烧杯黄绿色、锥形瓶青蓝色液体保留原显示颜色，未进行液体动力学、吸取量或滴加量求解。": {
    "zh": "原 RealMan RM65-B、Xense、CAD 尺寸和固定相机配置保留。近景是展示相机；烧杯黄绿色、锥形瓶青蓝色液体保留原显示颜色，未进行液体动力学、吸取量或滴加量求解。",
    "en": "The original RealMan RM65-B, Xense, CAD dimensions, and fixed-camera configuration are retained. The close-up uses a presentation camera; the yellow-green beaker liquid and cyan-blue conical flask liquid retain their original display colors. No liquid dynamics, aspiration volume, or dispensing volume has been solved."
  },
  "结论适用于本轮名义 MuJoCo 接触模型。指尖使用 4 mm 空间分组的原 CAD 表面凸包近似；这不是精确全表面碰撞认证、高保真材料验证或真机试验。每步审计和 30 Hz 视频采样分别保存，视频上的当前力值是采样值，报告峰值来自全部原生步。": {
    "zh": "结论适用于本轮名义 MuJoCo 接触模型。指尖使用 4 mm 空间分组的原 CAD 表面凸包近似；这不是精确全表面碰撞认证、高保真材料验证或真机试验。每步审计和 30 Hz 视频采样分别保存，视频上的当前力值是采样值，报告峰值来自全部原生步。",
    "en": "The conclusions apply to this round's nominal MuJoCo contact model. Fingertips use convex-hull approximations of the original CAD surface grouped at 4 mm spatial intervals; this is not exact full-surface collision certification, high-fidelity material validation, or a real-hardware trial. Per-step audits and 30 Hz video samples are saved separately. Current force values shown in videos are sampled values; report peaks come from all native steps."
  },
  "覆盖、拒绝测试与哈希": {
    "zh": "覆盖、拒绝测试与哈希",
    "en": "Coverage, rejection tests, and hashes"
  },
  "初态与 CAD 分块": {
    "zh": "初态与 CAD 分块",
    "en": "Initial state and CAD partitioning"
  },
  "夹指约束改动": {
    "zh": "夹指约束改动",
    "en": "Gripper-finger constraint changes"
  },
  "缺步、丢失单侧接触、禁止碰撞、滑移超限及求解迭代触顶的 5 项反例均被拒绝。历史保留：": {
    "zh": "缺步、丢失单侧接触、禁止碰撞、滑移超限及求解迭代触顶的 5 项反例均被拒绝。历史保留：",
    "en": "All 5 counterexamples involving missing steps, lost unilateral contact, prohibited collisions, excessive slip, and solver iteration saturation were rejected. Historical records retained:"
  },
  "V5 三维接触与资产": {
    "zh": "V5 三维接触与资产",
    "en": "V5 3D contact and assets"
  },
  "MuJoCo 接触与滑移文档": {
    "zh": "MuJoCo 接触与滑移文档",
    "en": "MuJoCo contact and slip documentation"
  },
  "下载抓持近景": {
    "zh": "下载抓持近景",
    "en": "Download grasping close-up"
  },
  "Ego2Sim 动态几何与重定向 V4": {
    "zh": "Ego2Sim 动态几何与重定向 V4",
    "en": "Ego2Sim Dynamic Geometry and Retargeting V4"
  },
  "从动态滴管，到三维接触与机器人回放": {
    "zh": "从动态滴管，到三维接触与机器人回放",
    "en": "From a dynamic dropper to 3D contact and robot playback"
  },
  "动态滴管": {
    "zh": "动态滴管",
    "en": "Dynamic dropper"
  },
  "拟合残差": {
    "zh": "拟合残差",
    "en": "Fitting residual"
  },
  "烧杯动态位姿": {
    "zh": "烧杯动态位姿",
    "en": "Dynamic beaker pose"
  },
  "坐标关系": {
    "zh": "坐标关系",
    "en": "Coordinate relationships"
  },
  "可达通道适配": {
    "zh": "可达通道适配",
    "en": "Reachable-corridor adaptation"
  },
  "81/192 对满足双指 12mm 与重投影门槛；平均指尖—表面距离 123.30→9.37mm。接触点是实际三角面位置，不是测量力。": {
    "zh": "81/192 对满足双指 12mm 与重投影门槛；平均指尖—表面距离 123.30→9.37mm。接触点是实际三角面位置，不是测量力。",
    "en": "81/192 pairs meet the 12mm two-finger and reprojection thresholds; mean fingertip-to-surface distance 123.30→9.37mm. Contact points are positions on actual triangle surfaces, not force measurements."
  },
  "保持骨骼比例；整体尺度允许 0.8–1.2，当前 0.800–1.200。不是人体尺寸标定；缺失观测没有补成真值。": {
    "zh": "保持骨骼比例；整体尺度允许 0.8–1.2，当前 0.800–1.200。不是人体尺寸标定；缺失观测没有补成真值。",
    "en": "Skeletal proportions are retained; overall scale is allowed within 0.8–1.2 and currently spans 0.800–1.200. This is not human-body dimension calibration; missing observations have not been filled in as ground truth."
  },
  "夹持中心数值拟合 P95 0.0032mm，最大 0.0033mm（不是实测执行精度）；TCP P95 4.32mm。关节位置限位通过，最大关节速度 4.00rad/s，未据此宣称可直接下发硬件。": {
    "zh": "夹持中心数值拟合 P95 0.0032mm，最大 0.0033mm（不是实测执行精度）；TCP P95 4.32mm。关节位置限位通过，最大关节速度 4.00rad/s，未据此宣称可直接下发硬件。",
    "en": "Grasp-center numerical fitting: P95 0.0032mm, maximum 0.0033mm (not measured execution accuracy); TCP P95 4.32mm. Joint position limits passed; maximum joint velocity is 4.00rad/s. This does not support a claim that commands can be sent directly to hardware."
  },
  "197/263 帧通过指垫中心与胶头椭球／杯壁圆柱代理检查；不等于全 CAD 碰撞认证或物理夹持。": {
    "zh": "197/263 帧通过指垫中心与胶头椭球／杯壁圆柱代理检查；不等于全 CAD 碰撞认证或物理夹持。",
    "en": "197/263 frames passed proxy checks using finger-pad centers and a bulb ellipsoid / cup-wall cylinder; this is not full CAD collision certification or physical grasping."
  },
  "RealMan RM65-B + Xense 原资产、初态及相机安装配置；黄绿色烧杯液体和蓝青色锥形瓶液体；模型未缩放。": {
    "zh": "RealMan RM65-B + Xense 原资产、初态及相机安装配置；黄绿色烧杯液体和蓝青色锥形瓶液体；模型未缩放。",
    "en": "Original RealMan RM65-B + Xense assets, initial state, and camera mounting configuration; yellow-green beaker liquid and blue-cyan conical flask liquid; models have not been scaled."
  },
  "物理求解、力分配、摩擦验证、完整碰撞认证、液体转移、真实相机—机器人外参标定。": {
    "zh": "物理求解、力分配、摩擦验证、完整碰撞认证、液体转移、真实相机—机器人外参标定。",
    "en": "Physics solve, force distribution, friction validation, full collision certification, liquid transfer, and real camera–robot extrinsic calibration."
  },
  "必须保留的估计边界": {
    "zh": "必须保留的估计边界",
    "en": "Estimation boundaries that must be retained"
  },
  "物体按照估计且适配后的位姿回放，机器人按 IK 独立运动；未模拟抓持附着。换物阶段包含显式自由空间规划，不是恢复的人手轨迹。EgoCPT 仅提供设计参考，没有运行它的力分配或 RL。": {
    "zh": "物体按照估计且适配后的位姿回放，机器人按 IK 独立运动；未模拟抓持附着。换物阶段包含显式自由空间规划，不是恢复的人手轨迹。EgoCPT 仅提供设计参考，没有运行它的力分配或 RL。",
    "en": "Objects are played back at estimated, adapted poses, while the robot moves independently using IK; grasp attachment is not simulated. The object-switching phase includes explicit free-space planning, not a recovered human-hand trajectory. EgoCPT provides design reference only; its force distribution and RL have not been run."
  },
  "动态位姿": {
    "zh": "动态位姿",
    "en": "Dynamic poses"
  },
  "坐标矩阵": {
    "zh": "坐标矩阵",
    "en": "Coordinate matrices"
  },
  "逐帧审计 CSV": {
    "zh": "逐帧审计 CSV",
    "en": "Per-frame audit CSV"
  },
  "网站已更新本地文件；未发布线上。旧版几何报告仍保留，当前结果以 V4 为准。": {
    "zh": "网站已更新本地文件；未发布线上。旧版几何报告仍保留，当前结果以 V4 为准。",
    "en": "Local website files have been updated; not published online. The previous geometry report is retained; V4 is the current authoritative result."
  },
  "Ego2Sim 转换 · 生成与验证报告": {
    "zh": "Ego2Sim 转换 · 生成与验证报告",
    "en": "Ego2Sim Conversion · Generation and Validation Report"
  },
  "已新增实际反投影点云、桌面世界系、CAD 首帧注册、手部重投影和接触时序候选。旧机器人轨迹仍是原任务坐标下的运动学候选，未经过新几何的外参标定。": {
    "zh": "已新增实际反投影点云、桌面世界系、CAD 首帧注册、手部重投影和接触时序候选。旧机器人轨迹仍是原任务坐标下的运动学候选，未经过新几何的外参标定。",
    "en": "Actual back-projected point clouds, a tabletop world frame, first-frame CAD registration, hand reprojection, and temporal contact candidates have been added. The previous robot trajectory remains a kinematic candidate in the original task coordinates and has not undergone extrinsic calibration against the new geometry."
  },
  "从 IMG_6100 到可编辑场景": {
    "zh": "从 IMG_6100 到可编辑场景",
    "en": "From IMG_6100 to an editable scene"
  },
  "实际处理": {
    "zh": "实际处理",
    "en": "Actual processing"
  },
  "43.8867 秒视频，按观察标注 7 个阶段与目标器皿。": {
    "zh": "43.8867 秒视频，按观察标注 7 个阶段与目标器皿。",
    "en": "43.8867-second video, annotated by observation into 7 phases with target vessels."
  },
  "分割与深度": {
    "zh": "分割与深度",
    "en": "Segmentation and depth"
  },
  "透明玻璃边界有误差；深度不是标定尺度。": {
    "zh": "透明玻璃边界有误差；深度不是标定尺度。",
    "en": "Transparent glass boundaries contain errors; depth is not at a calibrated scale."
  },
  "逐帧人体遮罩＋排除移动资产的多帧背景＋静态锥形瓶参考；遮挡杯体用斜线标记，残留背景区域补全。": {
    "zh": "逐帧人体遮罩＋排除移动资产的多帧背景＋静态锥形瓶参考；遮挡杯体用斜线标记，残留背景区域补全。",
    "en": "Per-frame human masks + a multiframe background excluding moving assets + a static conical flask reference; occluded cup regions are marked with hatching, and remaining background regions are completed."
  },
  "人类动作": {
    "zh": "人类动作",
    "en": "Human actions"
  },
  "三维根部按任务坐标估计；没有测量接触力。": {
    "zh": "三维根部按任务坐标估计；没有测量接触力。",
    "en": "The 3D root is estimated in task coordinates; no contact force was measured."
  },
  "源动作、位置和时序是演示候选，不是完整物理求解。": {
    "zh": "源动作、位置和时序是演示候选，不是完整物理求解。",
    "en": "Source actions, positions, and timing are demonstration candidates, not a complete physics solve."
  },
  "分割精修 · V2": {
    "zh": "分割精修 · V2",
    "en": "Segmentation refinement · V2"
  },
  "同帧烧杯分割前后对照": {
    "zh": "同帧烧杯分割前后对照",
    "en": "Before-and-after beaker segmentation in the same frame"
  },
  "局部检查记录": {
    "zh": "局部检查记录",
    "en": "Local inspection log"
  },
  "去手视图保留当前可见物体，利用其他源帧补充背景和静态锥形瓶；被手遮住的杯体以斜线提示未知，不补造隐藏液体和玻璃。背景配准仍有接缝、阴影和视差，不是标定后的三维重建真值。本轮仅更新感知展示，机器人候选与原液体配色保持原版本，未新增物理求解。": {
    "zh": "去手视图保留当前可见物体，利用其他源帧补充背景和静态锥形瓶；被手遮住的杯体以斜线提示未知，不补造隐藏液体和玻璃。背景配准仍有接缝、阴影和视差，不是标定后的三维重建真值。本轮仅更新感知展示，机器人候选与原液体配色保持原版本，未新增物理求解。",
    "en": "The hand-removed view retains currently visible objects and uses other source frames to supplement the background and static conical flask. Cup regions occluded by hands are hatched as unknown, without fabricating hidden liquid or glass. Background registration still has seams, shadows, and parallax; it is not calibrated 3D reconstruction ground truth. This round updates perception displays only. Robot candidates and original liquid colors remain at the previous version, with no additional physics solve."
  },
  "五段展示均可单独播放、下载。场景总览中的资产转台为循环检查视角；其余视频处理视图与源时间采样对齐。反馈视频是生成记录的动画回顾，不是实时求解过程。": {
    "zh": "五段展示均可单独播放、下载。场景总览中的资产转台为循环检查视角；其余视频处理视图与源时间采样对齐。反馈视频是生成记录的动画回顾，不是实时求解过程。",
    "en": "All five demo segments can be played and downloaded individually. The asset turntable in the scene overview is a looping inspection view; the other processed video views align with source-time samples. The feedback video is an animated review of generation records, not a real-time solving process."
  },
  "43.83 s · 1280×720 ·": {
    "zh": "43.83 s · 1280×720 ·",
    "en": "43.83 s · 1280×720 ·"
  },
  "02 · 场景与资产重建": {
    "zh": "02 · 场景与资产重建",
    "en": "02 · Scene and asset reconstruction"
  },
  "43.83 s · 1280×480 ·": {
    "zh": "43.83 s · 1280×480 ·",
    "en": "43.83 s · 1280×480 ·"
  },
  "43.83 s · 1280×960 ·": {
    "zh": "43.83 s · 1280×960 ·",
    "en": "43.83 s · 1280×960 ·"
  },
  "架构与参考": {
    "zh": "架构与参考",
    "en": "Architecture and references"
  },
  "任务字幕的展示形式参考": {
    "zh": "任务字幕的展示形式参考",
    "en": "The presentation of task captions references"
  },
  "的带时间戳动作说明；本轮未调用 Flora 模型。网站交互按 TEZOI 原有视觉体系集成。": {
    "zh": "的带时间戳动作说明；本轮未调用 Flora 模型。网站交互按 TEZOI 原有视觉体系集成。",
    "en": "'s timestamped action descriptions; the Flora model was not invoked in this round. Website interactions are integrated with TEZOI's existing visual system."
  },
  "完成视频理解、实际分割与相对深度推理、去手处理、冻结 CAD 导入、手形估计和机器人运动学候选。三维手部根坐标由任务坐标先验放置，机器人对象运动依阶段映射；均不是标定后的三维动作真值。接触标签是候选，不是触觉测量。相机继承原滴管名义配置，灰色展示背景未重建成原办公室。": {
    "zh": "完成视频理解、实际分割与相对深度推理、去手处理、冻结 CAD 导入、手形估计和机器人运动学候选。三维手部根坐标由任务坐标先验放置，机器人对象运动依阶段映射；均不是标定后的三维动作真值。接触标签是候选，不是触觉测量。相机继承原滴管名义配置，灰色展示背景未重建成原办公室。",
    "en": "Completed video understanding, actual segmentation and relative-depth inference, hand removal, frozen CAD import, hand-shape estimation, and robot kinematic candidates. The 3D hand root coordinates are placed using task-coordinate priors, and robot object motion is mapped by phase; neither is calibrated 3D action ground truth. Contact labels are candidates, not tactile measurements. Cameras inherit the original nominal dropper configuration; the gray display background has not been reconstructed into the original office."
  },
  "Ego2Sim · 模块核对与接触优化": {
    "zh": "Ego2Sim · 模块核对与接触优化",
    "en": "Ego2Sim · Module Review and Contact Optimization"
  },
  "用证据连接 Video → World → Robot": {
    "zh": "用证据连接 Video → World → Robot",
    "en": "Connecting Video → World → Robot with evidence"
  },
  "严格逐指几何检查": {
    "zh": "严格逐指几何检查",
    "en": "Strict per-finger geometry checks"
  },
  "仍需复查": {
    "zh": "仍需复查",
    "en": "Still requires review"
  },
  "本轮实际新增": {
    "zh": "本轮实际新增",
    "en": "Actual additions this round"
  },
  "白圈：原视频指尖观测；彩色骨架：三维手的投影；金色：实际 CAD 表面锚点。263 个 6 Hz 样本以 30 fps 重复显示，不是 30 Hz 新推理。": {
    "zh": "白圈：原视频指尖观测；彩色骨架：三维手的投影；金色：实际 CAD 表面锚点。263 个 6 Hz 样本以 30 fps 重复显示，不是 30 Hz 新推理。",
    "en": "White circles: fingertip observations in the source video; colored skeletons: projected 3D hands; gold: actual CAD surface anchors. 263 samples at 6 Hz are repeated for display at 30 fps; this is not new inference at 30 Hz."
  },
  "参考模块": {
    "zh": "参考模块",
    "en": "Reference module"
  },
  "现有实现": {
    "zh": "现有实现",
    "en": "Current implementation"
  },
  "SAM 3.1": {
    "zh": "SAM 3.1",
    "en": "SAM 3.1"
  },
  "SAM3 image + 点/框提示；263 个分割样本": {
    "zh": "SAM3 image + 点/框提示；263 个分割样本",
    "en": "SAM3 image + point/box prompts; 263 segmentation samples"
  },
  "SAM 3D": {
    "zh": "SAM 3D",
    "en": "SAM 3D"
  },
  "用户提供的烧杯、锥形瓶与滴管 CAD": {
    "zh": "用户提供的烧杯、锥形瓶与滴管 CAD",
    "en": "User-provided beaker, conical flask, and dropper CAD"
  },
  "MoGe-3": {
    "zh": "MoGe-3",
    "en": "MoGe-3"
  },
  "作为深度、点云和内参的交叉检查；需 Linux/CUDA，官方当前不支持 macOS。": {
    "zh": "作为深度、点云和内参的交叉检查；需 Linux/CUDA，官方当前不支持 macOS。",
    "en": "For cross-checking depth, point clouds, and intrinsics; requires Linux/CUDA and is currently not officially supported on macOS."
  },
  "MediaPipe 21 点 + 有界三维关节拟合": {
    "zh": "MediaPipe 21 点 + 有界三维关节拟合",
    "en": "MediaPipe 21 landmarks + bounded 3D joint fitting"
  },
  "Fpose + SpaTracker": {
    "zh": "Fpose + SpaTracker",
    "en": "Fpose + SpaTracker"
  },
  "优先评估遮挡后的身份和位姿连续性；透明管尖仍需置信度与几何约束。": {
    "zh": "优先评估遮挡后的身份和位姿连续性；透明管尖仍需置信度与几何约束。",
    "en": "Prioritize evaluation of identity and pose continuity after occlusion; the transparent tube tip still requires confidence and geometric constraints."
  },
  "实际 CAD 三角面距离 + 时序几何候选": {
    "zh": "实际 CAD 三角面距离 + 时序几何候选",
    "en": "Actual CAD triangle-surface distances + temporal geometric candidates"
  },
  "失败如何回到上游": {
    "zh": "失败如何回到上游",
    "en": "How failures feed back upstream"
  },
  "↖ 身份 / 深度 / 跟踪 / 接触失败，返回对应步骤": {
    "zh": "↖ 身份 / 深度 / 跟踪 / 接触失败，返回对应步骤",
    "en": "↖ Identity / depth / tracking / contact failure: return to the corresponding step"
  },
  "源时间": {
    "zh": "源时间",
    "en": "Source time"
  },
  "最大表面距离": {
    "zh": "最大表面距离",
    "en": "Maximum surface distance"
  },
  "回查步骤": {
    "zh": "回查步骤",
    "en": "Step to revisit"
  },
  "134.77 mm": {
    "zh": "134.77 mm",
    "en": "134.77 mm"
  },
  "手部身份与深度": {
    "zh": "手部身份与深度",
    "en": "Hand identity and depth"
  },
  "8.22 mm": {
    "zh": "8.22 mm",
    "en": "8.22 mm"
  },
  "图像跟踪与关节姿态": {
    "zh": "图像跟踪与关节姿态",
    "en": "Image tracking and joint pose"
  },
  "15.26 mm": {
    "zh": "15.26 mm",
    "en": "15.26 mm"
  },
  "物体位姿与局部接触": {
    "zh": "物体位姿与局部接触",
    "en": "Object pose and local contact"
  },
  "Right / pipette": {
    "zh": "右手 / 滴管",
    "en": "Right / pipette"
  },
  "2.51 px": {
    "zh": "2.51 px",
    "en": "2.51 px"
  },
  "11.87 mm": {
    "zh": "11.87 mm",
    "en": "11.87 mm"
  },
  "9.67s 误差达 135mm：先回查身份与深度，而不是扩大吸附范围。第 199 帧存在两个同名 Left/beaker 观测，保留两项并排除其时序关联。手的 Left/Right 是原检测标签，不是已验证的真实左右手身份。": {
    "zh": "9.67s 误差达 135mm：先回查身份与深度，而不是扩大吸附范围。第 199 帧存在两个同名 Left/beaker 观测，保留两项并排除其时序关联。手的 Left/Right 是原检测标签，不是已验证的真实左右手身份。",
    "en": "At 9.67s, the error reaches 135mm: first revisit identity and depth instead of expanding the snapping range. Frame 199 contains two observations with the same Left/beaker label; both are retained and excluded from temporal association. Left/Right are original hand-detection labels, not verified true left/right hand identities."
  },
  "V10 的 35 秒滴管物理周期仍保留：管尖相对位移 4.33 mm、双侧持握、简化液体和自由斜靠已有独立记录。本轮没有重算机器人或液体，V11 几何尚未绑定 V10 执行。源视频后半段拿起烧杯、摇晃的动作也不在该物理周期中。单目尺度、相机外参、整手穿透与人手真实接触力未验证。": {
    "zh": "V10 的 35 秒滴管物理周期仍保留：管尖相对位移 4.33 mm、双侧持握、简化液体和自由斜靠已有独立记录。本轮没有重算机器人或液体，V11 几何尚未绑定 V10 执行。源视频后半段拿起烧杯、摇晃的动作也不在该物理周期中。单目尺度、相机外参、整手穿透与人手真实接触力未验证。",
    "en": "V10's 35-second dropper physics cycle is retained: independent records already cover 4.33 mm tube-tip relative displacement, bilateral holding, simplified liquid, and freely leaning rest. The robot and liquid were not recomputed in this round, and V11 geometry has not yet been bound to V10 execution. Picking up and shaking the beaker in the latter half of the source video is also outside that physics cycle. Monocular scale, camera extrinsics, whole-hand penetration, and actual human-hand contact forces remain unverified."
  },
  "证据文件与方法来源": {
    "zh": "证据文件与方法来源",
    "en": "Evidence files and method sources"
  },
  "所有优化候选": {
    "zh": "所有优化候选",
    "en": "All optimization candidates"
  },
  "V10 物理报告": {
    "zh": "V10 物理报告",
    "en": "V10 physics report"
  },
  "Ego2Sim V8 · 自然放回与简化液体求解": {
    "zh": "Ego2Sim V8 · 自然放回与简化液体求解",
    "en": "Ego2Sim V8 · Natural Return and Simplified Liquid Solve"
  },
  "夹起、吸液、滴加，再自由斜靠在瓶内。": {
    "zh": "夹起、吸液、滴加，再自由斜靠在瓶内。",
    "en": "Grasp, aspirate, dispense, then let the dropper lean freely inside the flask."
  },
  "，未检出洒出；滴管释放后由瓶底与瓶颈支撑，倾斜约": {
    "zh": "，未检出洒出；滴管释放后由瓶底与瓶颈支撑，倾斜约",
    "en": ", with no spillage detected; after release, the dropper is supported by the flask bottom and neck at a tilt of approximately"
  },
  "不是完整 CFD，也不是真机验证": {
    "zh": "不是完整 CFD，也不是真机验证",
    "en": "Neither full CFD nor real-hardware validation"
  },
  "11.05 mm": {
    "zh": "11.05 mm",
    "en": "11.05 mm"
  },
  "自然斜靠与实际抓持": {
    "zh": "自然斜靠与实际抓持",
    "en": "Natural leaning rest and actual grasping"
  },
  "完整机器人动作": {
    "zh": "完整机器人动作",
    "en": "Complete robot motion"
  },
  "动作与自然放回": {
    "zh": "动作与自然放回",
    "en": "Motion and natural return"
  },
  "接触模型与指标变化": {
    "zh": "接触模型与指标变化",
    "en": "Contact model and metric changes"
  },
  "旧指标测量距夹持中心约 177.5 mm 的管尖，相对转动会放大其偏移。新指标使用双方接触点雅可比，逐步积分按法向力加权的切向相对速度；每侧累计滑移 ≤5 mm、胶头中心移动 ≤5 mm、转动 ≤5° 是本轮明确的工程检查值。旧 5 mm 管尖门槛原样保留为失败。完整接触最大软穿透为 0.222 mm，与初始无穿插不同。": {
    "zh": "旧指标测量距夹持中心约 177.5 mm 的管尖，相对转动会放大其偏移。新指标使用双方接触点雅可比，逐步积分按法向力加权的切向相对速度；每侧累计滑移 ≤5 mm、胶头中心移动 ≤5 mm、转动 ≤5° 是本轮明确的工程检查值。旧 5 mm 管尖门槛原样保留为失败。完整接触最大软穿透为 0.222 mm，与初始无穿插不同。",
    "en": "The old metric measured the tube tip approximately 177.5 mm from the grasp center, where relative rotation amplifies displacement. The new metric uses contact-point Jacobians on both sides and integrates normal-force-weighted tangential relative velocities step by step. Cumulative slip ≤5 mm on each side, bulb center motion ≤5 mm, and rotation ≤5° are this round's explicit engineering checks. The old 5 mm tube-tip threshold is retained unchanged as a failure. Maximum soft penetration across all contacts is 0.222 mm, which differs from the absence of initial interpenetration."
  },
  "胶头实际压缩量驱动等温空气压力、黏性管流、静水压与毛细阻力。液滴达到脱离条件后按重力飞行，必须穿过真实容器口后才计入液面；没有直接指定液体转移曲线。液体重量、浮力、胶头压力、射流反作用和液滴冲量反馈给机械系统。烧杯黄绿色与锥形瓶青蓝色保持原显示颜色。": {
    "zh": "胶头实际压缩量驱动等温空气压力、黏性管流、静水压与毛细阻力。液滴达到脱离条件后按重力飞行，必须穿过真实容器口后才计入液面；没有直接指定液体转移曲线。液体重量、浮力、胶头压力、射流反作用和液滴冲量反馈给机械系统。烧杯黄绿色与锥形瓶青蓝色保持原显示颜色。",
    "en": "Actual bulb compression drives isothermal air pressure, viscous tube flow, hydrostatic pressure, and capillary resistance. Once droplets meet the detachment conditions, they travel under gravity and are counted toward the liquid surface only after passing through an actual container opening; no liquid-transfer curve is directly prescribed. Liquid weight, buoyancy, bulb pressure, jet reaction, and droplet impulses feed back into the mechanical system. The beaker's yellow-green and conical flask's cyan-blue retain their original display colors."
  },
  "水样密度、黏度、表面张力和 2.5 mL 空气腔为假设。使用低液位静液面与简化管流，不解析晃动、润湿、飞溅、混色或化学反应；非中央瓶壁路径未作完整流体边界验证。吸取量和滴加量不是实测标定结果。": {
    "zh": "水样密度、黏度、表面张力和 2.5 mL 空气腔为假设。使用低液位静液面与简化管流，不解析晃动、润湿、飞溅、混色或化学反应；非中央瓶壁路径未作完整流体边界验证。吸取量和滴加量不是实测标定结果。",
    "en": "Water-like density, viscosity, surface tension, and a 2.5 mL air chamber are assumptions. The model uses low-level static liquid surfaces and simplified tube flow; it does not resolve sloshing, wetting, splashing, color mixing, or chemical reactions. Off-center paths along the flask wall have not undergone full fluid-boundary validation. Aspiration and dispensing volumes are not measured calibration results."
  },
  "结果": {
    "zh": "结果",
    "en": "Result"
  },
  "不得超过0.10 N": {
    "zh": "不得超过0.10 N",
    "en": "Must not exceed 0.10 N"
  },
  "关节 / 控制 / 驱动力": {
    "zh": "关节 / 控制 / 驱动力",
    "en": "Joints / control / actuator forces"
  },
  "本轮门槛通过": {
    "zh": "本轮门槛通过",
    "en": "This round's thresholds passed"
  },
  "接触处累计切向滑移": {
    "zh": "接触处累计切向滑移",
    "en": "Cumulative tangential slip at contacts"
  },
  "2.019 / 2.063 mm": {
    "zh": "2.019 / 2.063 mm",
    "en": "2.019 / 2.063 mm"
  },
  "1.437 mm": {
    "zh": "1.437 mm",
    "en": "1.437 mm"
  },
  "≤5 mm（未通过）": {
    "zh": "≤5 mm（未通过）",
    "en": "≤5 mm (failed)"
  },
  "烧杯上方 / 回瓶 XY 偏差": {
    "zh": "烧杯上方 / 回瓶 XY 偏差",
    "en": "XY deviation above beaker / on return to flask"
  },
  "释放后倾角": {
    "zh": "释放后倾角",
    "en": "Tilt angle after release"
  },
  "释放后有支撑": {
    "zh": "释放后有支撑",
    "en": "Supported after release"
  },
  "最终夹爪接触力": {
    "zh": "最终夹爪接触力",
    "en": "Final gripper contact force"
  },
  "末态最大线速度 / 角速度": {
    "zh": "末态最大线速度 / 角速度",
    "en": "Maximum final-state linear speed / angular velocity"
  },
  "实际进入烧杯的体积": {
    "zh": "实际进入烧杯的体积",
    "en": "Volume actually entering the beaker"
  },
  "洒出 / 未处理边界碰撞": {
    "zh": "洒出 / 未处理边界碰撞",
    "en": "Spillage / unhandled boundary collisions"
  },
  "总体积最大误差": {
    "zh": "总体积最大误差",
    "en": "Maximum total-volume error"
  },
  "原生步 / 数值警告": {
    "zh": "原生步 / 数值警告",
    "en": "Native steps / numerical warnings"
  },
  "验证与可复现证据": {
    "zh": "验证与可复现证据",
    "en": "Validation and reproducible evidence"
  },
  "实际 30 Hz 状态的最大关节速度为 1.873 rad/s、加速度为 2.254 rad/s²；未用渲染平滑替换机械状态，也不将不同时钟的数值作为改善比例。5 个完整视频均为 1280×960、30 Hz、1,051 帧、Blender Cycles 24 samples；每个视频全帧解码校验；1,051 个回放样本的管尖位置、液体体积、压力和悬空液滴体积与对应原生步逐项一致，文件哈希绑定。固定相机沿用原外参与视野，因此只覆盖部分机械臂；完整操作用总览和近景展示。原视频、分割、点云、动态资产和三维手部分项保留原观测时钟；这 35 秒是重新规划的执行时钟，不是原视频逐帧预测。烧杯后续晃动不在本轮范围内。": {
    "zh": "实际 30 Hz 状态的最大关节速度为 1.873 rad/s、加速度为 2.254 rad/s²；未用渲染平滑替换机械状态，也不将不同时钟的数值作为改善比例。5 个完整视频均为 1280×960、30 Hz、1,051 帧、Blender Cycles 24 samples；每个视频全帧解码校验；1,051 个回放样本的管尖位置、液体体积、压力和悬空液滴体积与对应原生步逐项一致，文件哈希绑定。固定相机沿用原外参与视野，因此只覆盖部分机械臂；完整操作用总览和近景展示。原视频、分割、点云、动态资产和三维手部分项保留原观测时钟；这 35 秒是重新规划的执行时钟，不是原视频逐帧预测。烧杯后续晃动不在本轮范围内。",
    "en": "The actual 30 Hz states have a maximum joint velocity of 1.873 rad/s and acceleration of 2.254 rad/s²; rendering smoothing has not replaced mechanical states, and values from different clocks are not used as improvement ratios. All 5 complete videos are 1280×960, 30 Hz, 1,051 frames, and Blender Cycles 24 samples; every frame of each video is decoded and checked. Tube-tip position, liquid volume, pressure, and airborne droplet volume in all 1,051 playback samples individually match their corresponding native steps, with file-hash binding. The fixed camera retains its original extrinsics and field of view, so it covers only part of the robot arm; the complete operation is shown in overview and close-up views. The original video, segmentation, point clouds, dynamic assets, and 3D hand outputs retain their original observation clocks; these 35 seconds use a replanned execution clock, not frame-by-frame predictions from the original video. Subsequent beaker shaking is outside this round's scope."
  },
  "原生覆盖与反例": {
    "zh": "原生覆盖与反例",
    "en": "Native-step coverage and counterexamples"
  },
  "便携模型等价检查": {
    "zh": "便携模型等价检查",
    "en": "Portable model equivalence checks"
  },
  "V7 原始结果与视频": {
    "zh": "V7 原始结果与视频",
    "en": "Original V7 results and videos"
  },
  "。V8 初次液体试跑 liquid01 接收 0.09693 mL，低于 0.1 mL 检查值，未发布；增加吸液行程后从初态完整重跑，未降低门槛。": {
    "zh": "。V8 初次液体试跑 liquid01 接收 0.09693 mL，低于 0.1 mL 检查值，未发布；增加吸液行程后从初态完整重跑，未降低门槛。",
    "en": ". V8's first liquid trial, liquid01, received 0.09693 mL, below the 0.1 mL check value, and was not published. After increasing the aspiration stroke, the full run was repeated from the initial state; the threshold was not lowered."
  },
  "下载近景": {
    "zh": "下载近景",
    "en": "Download close-up"
  },
  "Ego2Sim · 连续动作与基础物理试跑": {
    "zh": "Ego2Sim · 连续动作与基础物理试跑",
    "en": "Ego2Sim · Continuous Motion and Basic Physics Trial"
  },
  "连续动作与基础物理试跑": {
    "zh": "连续动作与基础物理试跑",
    "en": "Continuous Motion and Basic Physics Trial"
  },
  "连续重定向候选": {
    "zh": "连续重定向候选",
    "en": "Continuous retargeting candidate"
  },
  "抖动处理": {
    "zh": "抖动处理",
    "en": "Jitter handling"
  },
  "本轮": {
    "zh": "本轮",
    "en": "This round"
  },
  "6 姿态/秒，重复编码为 30 fps": {
    "zh": "6 姿态/秒，重复编码为 30 fps",
    "en": "6 poses/second, repeated and encoded at 30 fps"
  },
  "关节加速度 RMS，同一 6 Hz 比较": {
    "zh": "关节加速度 RMS，同一 6 Hz 比较",
    "en": "Joint acceleration RMS, compared at the same 6 Hz rate"
  },
  "2.319 rad/s²（下降 8.6%）": {
    "zh": "2.319 rad/s²（下降 8.6%）",
    "en": "2.319 rad/s² (down 8.6%)"
  },
  "25.238 rad/s³": {
    "zh": "25.238 rad/s³",
    "en": "25.238 rad/s³"
  },
  "新增接触中心位移": {
    "zh": "新增接触中心位移",
    "en": "Added contact-center displacement"
  },
  "密集 CAD 表面距离": {
    "zh": "密集 CAD 表面距离",
    "en": "Dense CAD surface distances"
  },
  "1072 / 1072 通过；最大 6.950 mm": {
    "zh": "1072 / 1072 通过；最大 6.950 mm",
    "en": "1072 / 1072 passed; maximum 6.950 mm"
  },
  "密集 30 Hz 的峰值角速度为 3.347 rad/s、峰值角加速度为 61.057 rad/s²，仍需后续控制与速度规划；不能把不同采样率的 jerk 数值直接当成改善比例。": {
    "zh": "密集 30 Hz 的峰值角速度为 3.347 rad/s、峰值角加速度为 61.057 rad/s²，仍需后续控制与速度规划；不能把不同采样率的 jerk 数值直接当成改善比例。",
    "en": "The dense 30 Hz trajectory has a peak angular velocity of 3.347 rad/s and peak angular acceleration of 61.057 rad/s²; further control and velocity planning are still needed. Jerk values at different sample rates cannot be treated directly as improvement ratios."
  },
  "使用 MuJoCo 3.17.0，执行 219,000 个 0.2 ms 原生步，500 Hz 更新驱动。机器人保留原名义质量、惯量、驱动增益和力上限，加入机械臂重力补偿及参考速度前馈。滴管、烧杯和锥形瓶是自由物体；初始化后没有物体位姿注入、抓持焊接或中途重置。指尖采用原 CAD 的单凸包近似，其余选定物体使用原碰撞分块。": {
    "zh": "使用 MuJoCo 3.17.0，执行 219,000 个 0.2 ms 原生步，500 Hz 更新驱动。机器人保留原名义质量、惯量、驱动增益和力上限，加入机械臂重力补偿及参考速度前馈。滴管、烧杯和锥形瓶是自由物体；初始化后没有物体位姿注入、抓持焊接或中途重置。指尖采用原 CAD 的单凸包近似，其余选定物体使用原碰撞分块。",
    "en": "Using MuJoCo 3.17.0, the run executes 219,000 native steps of 0.2 ms with actuator updates at 500 Hz. The robot retains its original nominal masses, inertias, actuator gains, and force limits, with added arm gravity compensation and reference-velocity feedforward. The dropper, beaker, and conical flask are free bodies; after initialization, there is no object pose injection, grasp welding, or mid-run resetting. Fingertips use single-convex-hull approximations of the original CAD; other selected objects use their original collision partitions."
  },
  "最早问题发生在初态：滴管与瓶颈存在约 2.05 mm 穿插，导致较大的数值接触冲量。随后还出现指尖凸包互碰、换物阶段附近机械臂自碰以及抓持偏差。因此这轮不能用于证明真实抓持力、完整动作可行或液体转移成功。": {
    "zh": "最早问题发生在初态：滴管与瓶颈存在约 2.05 mm 穿插，导致较大的数值接触冲量。随后还出现指尖凸包互碰、换物阶段附近机械臂自碰以及抓持偏差。因此这轮不能用于证明真实抓持力、完整动作可行或液体转移成功。",
    "en": "The earliest problem occurs in the initial state: approximately 2.05 mm of interpenetration between the dropper and flask neck produces a large numerical contact impulse. Fingertip convex-hull collisions, arm self-collisions near the object-switching phase, and grasp deviations then occur. This round therefore cannot demonstrate real grasp forces, feasibility of the complete action, or successful liquid transfer."
  },
  "数值警告": {
    "zh": "数值警告",
    "en": "Numerical warnings"
  },
  "30 Hz 采样最大穿插": {
    "zh": "30 Hz 采样最大穿插",
    "en": "Maximum interpenetration sampled at 30 Hz"
  },
  "滴管最大位置偏离": {
    "zh": "滴管最大位置偏离",
    "en": "Maximum dropper position deviation"
  },
  "烧杯最大位置偏离": {
    "zh": "烧杯最大位置偏离",
    "en": "Maximum beaker position deviation"
  },
  "液体与真实材料标定": {
    "zh": "液体与真实材料标定",
    "en": "Liquid and real-material calibration"
  },
  "接触力与穿插记录为 30 Hz 采样，不能当作每个求解步的峰值。凸包可能带来保守的假碰撞；此次结果是基础预检，不替代精确 CAD 全碰撞或高保真接触验收。": {
    "zh": "接触力与穿插记录为 30 Hz 采样，不能当作每个求解步的峰值。凸包可能带来保守的假碰撞；此次结果是基础预检，不替代精确 CAD 全碰撞或高保真接触验收。",
    "en": "Contact force and interpenetration records are sampled at 30 Hz and cannot be taken as peaks across all solver steps. Convex hulls may produce conservative false collisions; these results are a basic precheck and do not replace exact full-CAD collision checks or high-fidelity contact acceptance."
  },
  "物理设置与结果": {
    "zh": "物理设置与结果",
    "en": "Physics settings and results"
  },
  "视频校验": {
    "zh": "视频校验",
    "en": "Video verification"
  },
  "求解配置参考": {
    "zh": "求解配置参考",
    "en": "Solver configuration reference"
  },
  "。原 RealMan RM65-B、Xense、相机安装、CAD 尺度与液体显示颜色保持。": {
    "zh": "。原 RealMan RM65-B、Xense、相机安装、CAD 尺度与液体显示颜色保持。",
    "en": ". The original RealMan RM65-B, Xense, camera mounting, CAD scale, and liquid display colors are retained."
  },
  "EGO2SIM / GEOMETRY & CONTACT / V3": {
    "zh": "EGO2SIM / 几何与接触 / V3",
    "en": "EGO2SIM / GEOMETRY & CONTACT / V3"
  },
  "这次补上实际点云与几何注册。每一步保留估计、拟合误差和未完成的验证。": {
    "zh": "这次补上实际点云与几何注册。每一步保留估计、拟合误差和未完成的验证。",
    "en": "Actual point clouds and geometric registration have been added in this round. Estimates, fitting errors, and incomplete validation are retained at every step."
  },
  "完整生成报告": {
    "zh": "完整生成报告",
    "en": "Complete generation report"
  },
  "现在的 pipeline 到了哪一步": {
    "zh": "现在的 pipeline 到了哪一步",
    "en": "Where the pipeline stands now"
  },
  "仍有限制": {
    "zh": "仍有限制",
    "en": "Limitations remain"
  },
  "88 份 DA3 深度 + 内参反投影，输出 RGB 点云与 PLY。": {
    "zh": "88 份 DA3 深度 + 内参反投影，输出 RGB 点云与 PLY。",
    "en": "88 DA3 depth outputs + back-projection using intrinsics, producing RGB point clouds and PLY files."
  },
  "桌面与世界系": {
    "zh": "桌面与世界系",
    "en": "Tabletop and world frame"
  },
  "不是标定相机或 SLAM。独立 LK 抽查仅 4/9 帧有足够支持，5 帧未验证。": {
    "zh": "不是标定相机或 SLAM。独立 LK 抽查仅 4/9 帧有足够支持，5 帧未验证。",
    "en": "This is neither a calibrated camera nor SLAM. Independent LK spot checks have sufficient support in only 4/9 frames; 5 frames remain unverified."
  },
  "保持原 CAD 尺寸，联合优化深度尺度和两个器皿首帧 XY，导出 Blender。": {
    "zh": "保持原 CAD 尺寸，联合优化深度尺度和两个器皿首帧 XY，导出 Blender。",
    "en": "Original CAD dimensions are retained; depth scale and first-frame XY positions of both vessels are jointly optimized and exported to Blender."
  },
  "手部与接触": {
    "zh": "手部与接触",
    "en": "Hands and contact"
  },
  "2D 邻近不是 3D 接触；无 Xsens 实测骨架，无接触力。": {
    "zh": "2D 邻近不是 3D 接触；无 Xsens 实测骨架，无接触力。",
    "en": "2D proximity is not 3D contact; there is no measured Xsens skeleton and no contact force."
  },
  "保留 RealMan RM65-B、Xense、原相机和液体颜色；既有 IK 候选。": {
    "zh": "保留 RealMan RM65-B、Xense、原相机和液体颜色；既有 IK 候选。",
    "en": "RealMan RM65-B, Xense, original cameras, and liquid colors retained; existing IK candidates."
  },
  "01 / 深度 → 反投影点云 → 桌面世界": {
    "zh": "01 / 深度 → 反投影点云 → 桌面世界",
    "en": "01 / Depth → Back-projected point cloud → Tabletop world"
  },
  "世界坐标点云 PLY": {
    "zh": "世界坐标点云 PLY",
    "en": "World-coordinate point cloud PLY"
  },
  "逐帧相机矩阵": {
    "zh": "逐帧相机矩阵",
    "en": "Per-frame camera matrices"
  },
  "首帧拟合遮罩 IoU（240×135）：烧杯 0.618 → 0.787；锥形瓶 0.484 → 0.638。输入遮罩本身也有玻璃边界误差，此分数不是独立真值准确率。轴对称物体的绕轴旋转未观测。": {
    "zh": "首帧拟合遮罩 IoU（240×135）：烧杯 0.618 → 0.787；锥形瓶 0.484 → 0.638。输入遮罩本身也有玻璃边界误差，此分数不是独立真值准确率。轴对称物体的绕轴旋转未观测。",
    "en": "First-frame fitted mask IoU (240×135): beaker 0.618 → 0.787; conical flask 0.484 → 0.638. The input masks themselves also have glass-boundary errors; these scores are not accuracy against independent ground truth. Rotation about the symmetry axis of axisymmetric objects is unobserved."
  },
  "Blender 检查视角。带点云、估计桌面、源相机和已注册 CAD；未注册滴管保存在隐藏的明确命名集合中。": {
    "zh": "Blender 检查视角。带点云、估计桌面、源相机和已注册 CAD；未注册滴管保存在隐藏的明确命名集合中。",
    "en": "Blender inspection view. Includes point clouds, estimated tabletop, source camera, and registered CAD; the unregistered dropper is stored in a clearly named hidden collection."
  },
  "下载 observation-world.blend": {
    "zh": "下载 observation-world.blend",
    "en": "Download observation-world.blend"
  },
  "视频中估计器皿间距 173.1 mm，原任务 306.1 mm。仅靠刚体变换，双锚点配准的最小 RMS 仍约 66.5 mm。两个场景不能冒充已精确统一，下一步需要明确观测布局到机器人可达布局的适配与标定。": {
    "zh": "视频中估计器皿间距 173.1 mm，原任务 306.1 mm。仅靠刚体变换，双锚点配准的最小 RMS 仍约 66.5 mm。两个场景不能冒充已精确统一，下一步需要明确观测布局到机器人可达布局的适配与标定。",
    "en": "Estimated vessel spacing in the video is 173.1 mm, compared with 306.1 mm in the original task. With rigid transforms alone, the minimum RMS for two-anchor registration remains approximately 66.5 mm. The two scenes cannot be presented as precisely unified; the next step requires explicit adaptation and calibration from the observed layout to a robot-reachable layout."
  },
  "保留模型手部骨骼形状，优化根部位置；手实例投影误差中位数 32.42 → 7.59 px。226/239 个手实例通过 ≤12 px 的几何候选质量门，30 个缺失帧未补造。此结果只说明二维投影拟合改善，不保证三维手形真实。": {
    "zh": "保留模型手部骨骼形状，优化根部位置；手实例投影误差中位数 32.42 → 7.59 px。226/239 个手实例通过 ≤12 px 的几何候选质量门，30 个缺失帧未补造。此结果只说明二维投影拟合改善，不保证三维手形真实。",
    "en": "The model hand's skeletal shape is retained while its root position is optimized; median hand-instance projection error decreases from 32.42 → 7.59 px. 226/239 hand instances pass the ≤12 px geometric-candidate quality gate, and 30 missing frames have not been fabricated. This result demonstrates only improved 2D projection fitting; it does not guarantee realistic 3D hand shape."
  },
  "原始／滤波关键点、三维估计与候选记录": {
    "zh": "原始／滤波关键点、三维估计与候选记录",
    "en": "Raw/filtered keypoints, 3D estimates, and candidate records"
  },
  "SimFoundry": {
    "zh": "SimFoundry",
    "en": "SimFoundry"
  },
  "EgoCPT": {
    "zh": "EgoCPT",
    "en": "EgoCPT"
  },
  "未运行：动力学、力分配、碰撞完整验证、胶头变形、液体仿真、任务成功验收。当前展示包含真实处理产物和明确标记的候选，不是已完成的物理求解。": {
    "zh": "未运行：动力学、力分配、碰撞完整验证、胶头变形、液体仿真、任务成功验收。当前展示包含真实处理产物和明确标记的候选，不是已完成的物理求解。",
    "en": "Not run: dynamics, force distribution, full collision validation, bulb deformation, liquid simulation, and task-success acceptance. The current presentation includes actual processing outputs and clearly labeled candidates, not a completed physics solve."
  }
};
