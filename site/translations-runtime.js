export default {
  "VIDEO → OBJECT EVENTS → TASK GRAPH": {
    "zh": "视频 → 物体事件 → 任务图",
    "en": "VIDEO → OBJECT EVENTS → TASK GRAPH"
  },
  "让任务分解连接实际观测。": {
    "zh": "让任务分解连接实际观测。",
    "en": "Connect task decomposition to actual observations."
  },
  "同一视频时间轴上展示操作意图、胶头与管尖观测状态，再用人手—物体接触候选确定机器人换物时机。字幕描述任务意图；液量和任务成功仍未测量。": {
    "zh": "同一视频时间轴上展示操作意图、胶头与管尖观测状态，再用人手—物体接触候选确定机器人换物时机。字幕描述任务意图；液量和任务成功仍未测量。",
    "en": "Show task intent and observed bulb and tip states on the same video timeline, then use human–object contact candidates to determine when the robot switches objects. Captions describe task intent; liquid volume and task success remain unmeasured."
  },
  "任务字幕与观测": {
    "zh": "任务字幕与观测",
    "en": "Task captions and observations"
  },
  "INPUT / 第一视角": {
    "zh": "输入 / 第一视角",
    "en": "INPUT / First-person view"
  },
  "OUTPUT / 任务分解": {
    "zh": "输出 / 任务分解",
    "en": "OUTPUT / Task decomposition"
  },
  "视频观察 + 接触事件": {
    "zh": "视频观察 + 接触事件",
    "en": "Video observations + contact events"
  },
  "保留原视频时间轴": {
    "zh": "保留原视频时间轴",
    "en": "Preserve the original video timeline"
  },
  "识别两组任务资产": {
    "zh": "识别两组任务资产",
    "en": "Identify two sets of task assets"
  },
  "接触事件连接机器人换物": {
    "zh": "接触事件连接机器人换物",
    "en": "Link contact events to robot object switching"
  },
  "任务图与源帧事件": {
    "zh": "任务图与源帧事件",
    "en": "Task graph and source-frame events"
  },
  "滴加意图不等于液体转移成功": {
    "zh": "滴加意图不等于液体转移成功",
    "en": "Dispensing intent does not establish successful liquid transfer"
  },
  "DEPTH → WORLD → DYNAMIC MESH POSE": {
    "zh": "深度 → 世界坐标 → 动态网格位姿",
    "en": "DEPTH → WORLD → DYNAMIC MESH POSE"
  },
  "把静态重建补成动态资产轨迹。": {
    "zh": "把静态重建补成动态资产轨迹。",
    "en": "Extend static reconstruction into dynamic asset trajectories."
  },
  "SAM3 分割与 DA3 深度经过桌面注册，进入统一观测世界。固定原滴管 CAD 尺寸，逐帧拟合胶头、可见管尖和烧杯位姿；遮挡管尖使用管长与容器几何先验，轴向转角仍不可观测。视频到机器人的刚体矩阵与额外布局适配分别保存。": {
    "zh": "SAM3 分割与 DA3 深度经过桌面注册，进入统一观测世界。固定原滴管 CAD 尺寸，逐帧拟合胶头、可见管尖和烧杯位姿；遮挡管尖使用管长与容器几何先验，轴向转角仍不可观测。视频到机器人的刚体矩阵与额外布局适配分别保存。",
    "en": "SAM3 segmentation and DA3 depth are registered to the tabletop in a shared observation world frame. With the original dropper CAD dimensions fixed, fit the bulb, visible tip, and beaker poses frame by frame. Use tube-length and container-geometry priors for the occluded tip; axial rotation remains unobservable. Save the video-to-robot rigid transform and additional layout adaptation separately."
  },
  "场景重建与坐标配准": {
    "zh": "场景重建与坐标配准",
    "en": "Scene reconstruction and coordinate registration"
  },
  "精细分割与对比": {
    "zh": "精细分割与对比",
    "en": "Detailed segmentation and comparison"
  },
  "相对深度": {
    "zh": "相对深度",
    "en": "Relative depth"
  },
  "去手与遮挡": {
    "zh": "去手与遮挡",
    "en": "Hand removal and occlusion"
  },
  "原任务资产": {
    "zh": "原任务资产",
    "en": "Original task assets"
  },
  "INPUT / 原始观测": {
    "zh": "输入 / 原始观测",
    "en": "INPUT / Original observations"
  },
  "OUTPUT / 动态几何与配准": {
    "zh": "输出 / 动态几何与配准",
    "en": "OUTPUT / Dynamic geometry and registration"
  },
  "实际点云 + 动态 CAD 拟合": {
    "zh": "实际点云 + 动态 CAD 拟合",
    "en": "Actual point cloud + dynamic CAD fitting"
  },
  "反投影与桌面注册": {
    "zh": "反投影与桌面注册",
    "en": "Back-projection and tabletop registration"
  },
  "逐帧滴管和烧杯变换": {
    "zh": "逐帧滴管和烧杯变换",
    "en": "Frame-by-frame dropper and beaker transforms"
  },
  "区分观测与遮挡先验": {
    "zh": "区分观测与遮挡先验",
    "en": "Distinguish observations from occlusion priors"
  },
  "动态位姿、坐标矩阵、点云和场景": {
    "zh": "动态位姿、坐标矩阵、点云和场景",
    "en": "Dynamic poses, coordinate matrices, point clouds, and scenes"
  },
  "估计注册与布局适配；不是实测外参标定": {
    "zh": "估计注册与布局适配；不是实测外参标定",
    "en": "Estimated registration and layout adaptation; not measured extrinsic calibration"
  },
  "逐段修复捏合姿态，保留观测边界。": {
    "zh": "逐段修复捏合姿态，保留观测边界。",
    "en": "Refine pinch poses segment by segment while preserving observational limits."
  },
  "固定动态滴管、相机和原始候选，加入五个深度起点与物体局部时序锚点，保持骨段长度。原 12 mm／12 px 门槛下，三维几何检查从 185/192 提高到 189/192，严格逐指检查从 160/192 提高到 187/192。剩余 5 组保留并回查身份、深度或投影；这是新的几何结果，尚未用于重新求解机器人。": {
    "zh": "固定动态滴管、相机和原始候选，加入五个深度起点与物体局部时序锚点，保持骨段长度。原 12 mm／12 px 门槛下，三维几何检查从 185/192 提高到 189/192，严格逐指检查从 160/192 提高到 187/192。剩余 5 组保留并回查身份、深度或投影；这是新的几何结果，尚未用于重新求解机器人。",
    "en": "Keep the dynamic dropper, camera, and original candidates fixed; add five depth initializations and object-local temporal anchors while preserving bone lengths. Under the original 12 mm／12 px thresholds, 3D geometry checks improve from 185/192 to 189/192, and strict per-finger checks from 160/192 to 187/192. Retain the remaining 5 groups for identity, depth, or projection review. These are new geometry results and have not yet been used to solve the robot motion again."
  },
  "多起点接触优化": {
    "zh": "多起点接触优化",
    "en": "Multi-start contact optimization"
  },
  "原三维接触与距离": {
    "zh": "原三维接触与距离",
    "en": "Original 3D contacts and distances"
  },
  "逐段修复前后": {
    "zh": "逐段修复前后",
    "en": "Before and after segment-by-segment refinement"
  },
  "三维手到任务世界": {
    "zh": "三维手到任务世界",
    "en": "3D hand in the task world frame"
  },
  "原始视频骨架": {
    "zh": "原始视频骨架",
    "en": "Original video skeleton"
  },
  "INPUT / 人类示范": {
    "zh": "输入 / 人类示范",
    "en": "INPUT / Human demonstration"
  },
  "OUTPUT / 三维手与接触候选": {
    "zh": "输出 / 三维手与接触候选",
    "en": "OUTPUT / 3D hand and contact candidates"
  },
  "保骨长关节优化 + 实际 Mesh 表面": {
    "zh": "保骨长关节优化 + 实际网格表面",
    "en": "Bone-length-preserving joint optimization + actual mesh surface"
  },
  "固定原始候选与门槛": {
    "zh": "固定原始候选与门槛",
    "en": "Keep original candidates and thresholds fixed"
  },
  "三维接触几何门槛": {
    "zh": "三维接触几何门槛",
    "en": "3D contact geometry thresholds"
  },
  "严格逐指投影检查": {
    "zh": "严格逐指投影检查",
    "en": "Strict per-finger projection checks"
  },
  "逐段审计、三维手与三角面锚点": {
    "zh": "逐段审计、三维手与三角面锚点",
    "en": "Segment-by-segment audits, 3D hand, and triangle anchors"
  },
  "几何候选不等于接触力、穿透认证或抓持成功": {
    "zh": "几何候选不等于接触力、穿透认证或抓持成功",
    "en": "Geometric candidates do not establish contact forces, certified non-penetration, or grasp success"
  },
  "CONTACT → ASPIRATE → DISPENSE → RETURN": {
    "zh": "接触 → 吸液 → 滴加 → 放回",
    "en": "CONTACT → ASPIRATE → DISPENSE → RETURN"
  },
  "同一构型完成抓取、滴加和放回。": {
    "zh": "同一构型完成抓取、滴加和放回。",
    "en": "Grasp, dispense, and return with the same arm configuration."
  },
  "保留 RealMan RM65-B、Xense、原相机及视觉资产。机械臂从重新规划的安全预抓取位出发，消除开场大幅翻肘；沿倾斜管轴取放，以实际模拟位姿反馈修正对准。胶头压缩驱动简化气压与管内流动求解，液滴在重力下进入烧杯。35 秒为重新规划的执行时钟，原视频及上游分项保留观测时钟。": {
    "zh": "保留 RealMan RM65-B、Xense、原相机及视觉资产。机械臂从重新规划的安全预抓取位出发，消除开场大幅翻肘；沿倾斜管轴取放，以实际模拟位姿反馈修正对准。胶头压缩驱动简化气压与管内流动求解，液滴在重力下进入烧杯。35 秒为重新规划的执行时钟，原视频及上游分项保留观测时钟。",
    "en": "Retain the RealMan RM65-B, Xense, original camera, and visual assets. Start the arm from a replanned safe pre-grasp pose to eliminate the large initial elbow flip; pick up and return the dropper along its tilted axis, correcting alignment with actual simulated pose feedback. Bulb compression drives a simplified air-pressure and tube-flow solver, with droplets falling into the beaker under gravity. The 35-second duration is the replanned execution clock; the original video and upstream components retain the observation clock."
  },
  "机器人完整动作": {
    "zh": "机器人完整动作",
    "en": "Complete robot motion"
  },
  "滴管与夹爪近景": {
    "zh": "滴管与夹爪近景",
    "en": "Dropper and gripper close-up"
  },
  "吸液与滴加": {
    "zh": "吸液与滴加",
    "en": "Aspiration and dispensing"
  },
  "原固定相机": {
    "zh": "原固定相机",
    "en": "Original fixed camera"
  },
  "坐标与布局适配": {
    "zh": "坐标与布局适配",
    "en": "Coordinate and layout adaptation"
  },
  "三维人手对照": {
    "zh": "三维人手对照",
    "en": "3D human-hand comparison"
  },
  "同一求解 / 总览": {
    "zh": "同一求解 / 总览",
    "en": "Same simulation / Overview"
  },
  "自由物体接触 + 简化液体": {
    "zh": "自由物体接触 + 简化液体",
    "en": "Free-object contact + simplified liquid"
  },
  "连续原生步": {
    "zh": "连续原生步",
    "en": "Continuous native simulation steps"
  },
  "持握 · 滴加 · 自由放回": {
    "zh": "持握 · 滴加 · 自由放回",
    "en": "Hold · Dispense · Release and return"
  },
  "已检查": {
    "zh": "已检查",
    "en": "Checked"
  },
  "液体模型": {
    "zh": "液体模型",
    "en": "Liquid model"
  },
  "简化气压与流动": {
    "zh": "简化气压与流动",
    "en": "Simplified air pressure and flow"
  },
  "同步机器人视频、接触与体积记录": {
    "zh": "同步机器人视频、接触与体积记录",
    "en": "Synchronized robot video, contact logs, and volume records"
  },
  "仿真状态反馈；不是完整 CFD 或真机验证": {
    "zh": "仿真状态反馈；不是完整 CFD 或真机验证",
    "en": "Simulation-state feedback; not full CFD or real-robot validation"
  },
  "OBSERVE → DIAGNOSE → REPAIR → VERIFY": {
    "zh": "观察 → 诊断 → 修复 → 验证",
    "en": "OBSERVE → DIAGNOSE → REPAIR → VERIFY"
  },
  "让接触和转移量成为修改依据。": {
    "zh": "让接触和转移量成为修改依据。",
    "en": "Use contact and transferred volume to guide revisions."
  },
  "每个 0.2 ms 原生步检查接触、关节限制、自由释放和液体体积。区分胶头接触处的切向滑移与长管尖因柔性转动产生的偏移；管尖相对位移与接触滑移同时满足原门槛，保留每轮失败记录。瓶底和瓶颈真实支撑释放后的滴管。液体使用简化气压、黏性管流、弹道液滴和静液面，不包含完整 CFD、飞溅或化学反应。": {
    "zh": "每个 0.2 ms 原生步检查接触、关节限制、自由释放和液体体积。区分胶头接触处的切向滑移与长管尖因柔性转动产生的偏移；管尖相对位移与接触滑移同时满足原门槛，保留每轮失败记录。瓶底和瓶颈真实支撑释放后的滴管。液体使用简化气压、黏性管流、弹道液滴和静液面，不包含完整 CFD、飞溅或化学反应。",
    "en": "Check contacts, joint limits, free release, and liquid volume at every 0.2 ms native step. Distinguish tangential slip at bulb contacts from long-tip displacement caused by flexible rotation. Both relative tip displacement and contact slip satisfy the original thresholds; retain failure records from every iteration. The bottle bottom and neck physically support the released dropper. The liquid model uses simplified air pressure, viscous tube flow, ballistic droplets, and a static liquid surface; it does not include full CFD, splashing, or chemical reactions."
  },
  "接触力与验收": {
    "zh": "接触力与验收",
    "en": "Contact forces and acceptance checks"
  },
  "液体转移与守恒": {
    "zh": "液体转移与守恒",
    "en": "Liquid transfer and conservation"
  },
  "实际抓持近景": {
    "zh": "实际抓持近景",
    "en": "Actual grasp close-up"
  },
  "早期几何修复记录": {
    "zh": "早期几何修复记录",
    "en": "Early geometry refinement records"
  },
  "手部接触修复前后": {
    "zh": "手部接触修复前后",
    "en": "Before and after hand-contact refinement"
  },
  "手部接触几何": {
    "zh": "手部接触几何",
    "en": "Hand-contact geometry"
  },
  "同一求解 / 抓持近景": {
    "zh": "同一求解 / 抓持近景",
    "en": "Same simulation / Grasp close-up"
  },
  "OUTPUT / 实际求解与测量": {
    "zh": "输出 / 实际求解与测量",
    "en": "OUTPUT / Actual simulation and measurements"
  },
  "接触与液体逐步核对": {
    "zh": "接触与液体逐步核对",
    "en": "Step-by-step contact and liquid checks"
  },
  "管尖相对位移 ≤5 mm": {
    "zh": "管尖相对位移 ≤5 mm",
    "en": "Relative tip displacement ≤5 mm"
  },
  "简化模型": {
    "zh": "简化模型",
    "en": "Simplified model"
  },
  "完整 CFD / 真机": {
    "zh": "完整 CFD / 真机",
    "en": "Full CFD / Real robot"
  },
  "未验证": {
    "zh": "未验证",
    "en": "Not validated"
  },
  "连续回放、原生审计与边界说明": {
    "zh": "连续回放、原生审计与边界说明",
    "en": "Continuous playback, native-step audits, and limitations"
  },
  "原始管尖门槛与接触、滴加共同复验；不代表真机验证": {
    "zh": "原始管尖门槛与接触、滴加共同复验；不代表真机验证",
    "en": "Recheck the original tip threshold together with contact and dispensing; this does not constitute real-robot validation"
  },
  "从安全预抓取位接近，保持同一肘部构型": {
    "zh": "从安全预抓取位接近，保持同一肘部构型",
    "en": "Approach from a safe pre-grasp pose, keeping the same elbow configuration"
  },
  "压缩胶头，再保留持握预紧并吸液": {
    "zh": "压缩胶头，再保留持握预紧并吸液",
    "en": "Compress the bulb, then retain grasp preload and aspirate"
  },
  "沿管轴抽出，离开瓶口后调整姿态": {
    "zh": "沿管轴抽出，离开瓶口后调整姿态",
    "en": "Withdraw along the tube axis; adjust pose after clearing the bottle opening"
  },
  "移至烧杯上方，压缩胶头滴加": {
    "zh": "移至烧杯上方，压缩胶头滴加",
    "en": "Move above the beaker and compress the bulb to dispense"
  },
  "返回并沿倾斜管轴放入锥形瓶": {
    "zh": "返回并沿倾斜管轴放入锥形瓶",
    "en": "Return and insert into the Erlenmeyer flask along the tilted tube axis"
  },
  "松开夹爪，自由释放": {
    "zh": "松开夹爪，自由释放",
    "en": "Open the gripper and release freely"
  },
  "重力与瓶底、瓶颈接触形成稳定斜靠": {
    "zh": "重力与瓶底、瓶颈接触形成稳定斜靠",
    "en": "Gravity and contact with the bottle bottom and neck create a stable tilted resting pose"
  },
  "识别烧杯与锥形瓶—滴管组合": {
    "zh": "识别烧杯与锥形瓶—滴管组合",
    "en": "Identify the beaker and the Erlenmeyer flask–dropper assembly"
  },
  "右手捏住滴管胶头，在锥形瓶内操作": {
    "zh": "右手捏住滴管胶头，在锥形瓶内操作",
    "en": "Pinch the dropper bulb with the right hand and operate it inside the Erlenmeyer flask"
  },
  "提起滴管，移到烧杯上方": {
    "zh": "提起滴管，移到烧杯上方",
    "en": "Lift the dropper and move it above the beaker"
  },
  "保持滴管朝下，向烧杯滴加": {
    "zh": "保持滴管朝下，向烧杯滴加",
    "en": "Keep the dropper pointed downward and dispense into the beaker"
  },
  "将滴管放回锥形瓶并松手": {
    "zh": "将滴管放回锥形瓶并松手",
    "en": "Return the dropper to the Erlenmeyer flask and let go"
  },
  "拿起烧杯，轻晃后放回桌面": {
    "zh": "拿起烧杯，轻晃后放回桌面",
    "en": "Pick up the beaker, swirl gently, and return it to the tabletop"
  },
  "松开烧杯，手退出操作区": {
    "zh": "松开烧杯，手退出操作区",
    "en": "Release the beaker and withdraw the hand from the work area"
  },
  "场景重建": {
    "zh": "场景重建",
    "en": "Scene reconstruction"
  },
  "三维手部回放": {
    "zh": "三维手部回放",
    "en": "3D hand playback"
  },
  "接触拟合前后对照": {
    "zh": "接触拟合前后对照",
    "en": "Contact fitting: before and after"
  },
  "抓持近景": {
    "zh": "抓持近景",
    "en": "Grasp close-up"
  },
  "示教回放": {
    "zh": "示教回放",
    "en": "Demonstration playback"
  },
  "仿真回放": {
    "zh": "仿真回放",
    "en": "Simulation playback"
  },
  "{0}时间": {
    "zh": "{0}时间",
    "en": "{0} time"
  },
  "{0} 秒，共 {1} 秒": {
    "zh": "{0} 秒，共 {1} 秒",
    "en": "{0} seconds of {1} seconds"
  },
  "暂停": {
    "zh": "暂停",
    "en": "Pause"
  },
  "播放": {
    "zh": "播放",
    "en": "Play"
  },
  "暂停演示": {
    "zh": "暂停演示",
    "en": "Pause demo"
  },
  "播放演示": {
    "zh": "播放演示",
    "en": "Play demo"
  },
  "视频加载失败，请重试。": {
    "zh": "视频加载失败，请重试。",
    "en": "Video failed to load. Please try again."
  },
  "AbortError": {
    "zh": "AbortError",
    "en": "AbortError"
  },
  "收起原视频对照": {
    "zh": "收起原视频对照",
    "en": "Hide original video comparison"
  },
  "对照原视频": {
    "zh": "对照原视频",
    "en": "Compare with original video"
  },
  "{0}演示": {
    "zh": "{0}演示",
    "en": "{0} demo"
  },
  "{0} 段视频": {
    "zh": "{0} 段视频",
    "en": "{0} videos"
  },
  "<video controls playsinline muted preload=\"none\"></video><figcaption><h6></h6></figcaption><p class=\"ego-preview-error\" data-ego-preview-error role=\"status\" hidden>视频加载失败，请重试。</p><button type=\"button\" data-ego-preview-retry hidden></button>": {
    "zh": "<video controls playsinline muted preload=\"none\"></video><figcaption><h6></h6></figcaption><p class=\"ego-preview-error\" data-ego-preview-error role=\"status\" hidden>视频加载失败，请重试。</p><button type=\"button\" data-ego-preview-retry hidden></button>",
    "en": "<video controls playsinline muted preload=\"none\"></video><figcaption><h6></h6></figcaption><p class=\"ego-preview-error\" data-ego-preview-error role=\"status\" hidden>Video failed to load. Please try again.</p><button type=\"button\" data-ego-preview-retry hidden></button>"
  },
  "{0}过程视频": {
    "zh": "{0}过程视频",
    "en": "{0} process video"
  },
  "重试{0}": {
    "zh": "重试{0}",
    "en": "Retry {0}"
  },
  "识别": {
    "zh": "识别",
    "en": "Identify"
  },
  "捏取": {
    "zh": "捏取",
    "en": "Pinch"
  },
  "转移": {
    "zh": "转移",
    "en": "Transfer"
  },
  "滴加": {
    "zh": "滴加",
    "en": "Dispense"
  },
  "放回": {
    "zh": "放回",
    "en": "Return"
  },
  "操作烧杯": {
    "zh": "操作烧杯",
    "en": "Handle beaker"
  },
  "退出": {
    "zh": "退出",
    "en": "Withdraw"
  },
  "早期几何修复记录 · 物理结果请切换「接触力与验收」": {
    "zh": "早期几何修复记录 · 物理结果请切换「接触力与验收」",
    "en": "Early geometry refinement records · For physical results, switch to “Contact forces and acceptance checks”"
  },
  "HISTORY": {
    "zh": "历史记录",
    "en": "HISTORY"
  },
  "原观测时钟": {
    "zh": "原观测时钟",
    "en": "Original observation clock"
  },
  "暂停同步演示": {
    "zh": "暂停同步演示",
    "en": "Pause synchronized demo"
  },
  "播放同步演示": {
    "zh": "播放同步演示",
    "en": "Play synchronized demo"
  },
  "OUTPUT /": {
    "zh": "输出 /",
    "en": "OUTPUT /"
  },
  "演示": {
    "zh": "演示",
    "en": "Demo"
  },
  "机器人动作候选": {
    "zh": "机器人动作候选",
    "en": "Robot motion candidates"
  },
  "原始滴管视频": {
    "zh": "原始滴管视频",
    "en": "Original dropper video"
  },
  "反馈演示时间": {
    "zh": "反馈演示时间",
    "en": "Feedback demo time"
  },
  "原视频时间": {
    "zh": "原视频时间",
    "en": "Original video time"
  },
  "IMG_6100": {
    "zh": "IMG_6100",
    "en": "IMG_6100"
  },
  "机器人求解时间": {
    "zh": "机器人求解时间",
    "en": "Robot simulation time"
  },
  "同一求解的另一观察视角": {
    "zh": "同一求解的另一观察视角",
    "en": "Another view of the same simulation"
  },
  "原始第一视角视频": {
    "zh": "原始第一视角视频",
    "en": "Original first-person video"
  },
  "同一求解 · 抓持近景": {
    "zh": "同一求解 · 抓持近景",
    "en": "Same simulation · Grasp close-up"
  },
  "同一求解 · 原固定相机": {
    "zh": "同一求解 · 原固定相机",
    "en": "Same simulation · Original fixed camera"
  },
  "同一求解 · 总览": {
    "zh": "同一求解 · 总览",
    "en": "Same simulation · Overview"
  },
  "第一视角视频": {
    "zh": "第一视角视频",
    "en": "First-person video"
  },
  "接近": {
    "zh": "接近",
    "en": "Approach"
  },
  "夹持": {
    "zh": "夹持",
    "en": "Grasp"
  },
  "抬升": {
    "zh": "抬升",
    "en": "Lift"
  },
  "释放": {
    "zh": "释放",
    "en": "Release"
  },
  "稳定": {
    "zh": "稳定",
    "en": "Settle"
  },
  "ArrowRight": {
    "zh": "ArrowRight",
    "en": "ArrowRight"
  },
  "ArrowLeft": {
    "zh": "ArrowLeft",
    "en": "ArrowLeft"
  },
  "Home": {
    "zh": "Home",
    "en": "Home"
  },
  "媒体尚未加载，请检查本地文件或网络连接。": {
    "zh": "媒体尚未加载，请检查本地文件或网络连接。",
    "en": "Media has not loaded. Check the local files or network connection."
  },
  "已经生成动态滴管／烧杯位姿、刚体配准矩阵与显式布局适配。保留单目、遮挡、轴向转角和透明物体的不确定性；不是实测外参。": {
    "zh": "已经生成动态滴管／烧杯位姿、刚体配准矩阵与显式布局适配。保留单目、遮挡、轴向转角和透明物体的不确定性；不是实测外参。",
    "en": "Dynamic dropper/beaker poses, a rigid registration matrix, and explicit layout adaptation have been generated. Monocular, occlusion, axial-rotation, and transparent-object uncertainties are retained; these are not measured extrinsics."
  },
  "正在读取本轮运动学检查。": {
    "zh": "正在读取本轮运动学检查。",
    "en": "Reading this iteration’s kinematic checks."
  },
  "保留每轮失败，依次修正初始配准、指尖碰撞形状、可达姿态、接触滑移与夹指行程。最新滴管周期由真实自由物体求解产生；旧几何候选不自动升级为物理成功。": {
    "zh": "保留每轮失败，依次修正初始配准、指尖碰撞形状、可达姿态、接触滑移与夹指行程。最新滴管周期由真实自由物体求解产生；旧几何候选不自动升级为物理成功。",
    "en": "Retain failures from every iteration while correcting initial registration, fingertip collision geometry, reachable poses, contact slip, and finger travel in sequence. The latest dropper cycle comes from an actual free-object simulation; previous geometric candidates do not automatically become physical successes."
  },
  "35 秒连续求解：自由持握、瓶底与瓶颈支撑、释放和简化液体转移均有原生记录。原始 5 mm 管尖相对位移已通过，并同时检查真实接触滑移、胶头中心位移和柔性转动。不是完整 CFD 或真机验证。": {
    "zh": "35 秒连续求解：自由持握、瓶底与瓶颈支撑、释放和简化液体转移均有原生记录。原始 5 mm 管尖相对位移已通过，并同时检查真实接触滑移、胶头中心位移和柔性转动。不是完整 CFD 或真机验证。",
    "en": "35 seconds of continuous simulation: native records cover free holding, bottle-bottom and neck support, release, and simplified liquid transfer. The original 5 mm relative tip displacement threshold is satisfied, with actual contact slip, bulb-center displacement, and flexible rotation checked together. This is not full CFD or real-robot validation."
  },
  "{0} 个运动学样本；关节位置限制{1}。最大 TCP 位置残差 {2} mm，最大关节速度 {3} rad/s。碰撞与动力学未验证。": {
    "zh": "{0} 个运动学样本；关节位置限制{1}。最大 TCP 位置残差 {2} mm，最大关节速度 {3} rad/s。碰撞与动力学未验证。",
    "en": "{0} kinematic samples; joint position limits: {1}. Maximum TCP position residual: {2} mm; maximum joint velocity: {3} rad/s. Collision and dynamics have not been validated."
  },
  "通过": {
    "zh": "通过",
    "en": "Passed"
  },
  "未通过": {
    "zh": "未通过",
    "en": "Failed"
  },
  "连续 30 Hz 实际求解回放；关节位置、控制和驱动力限制均通过。接触处累计切向滑移 {0} mm；胶头中心偏移 {1} mm，转动 {2}°。管尖相对位移 {3} mm，原 5 mm 门槛通过。": {
    "zh": "连续 30 Hz 实际求解回放；关节位置、控制和驱动力限制均通过。接触处累计切向滑移 {0} mm；胶头中心偏移 {1} mm，转动 {2}°。管尖相对位移 {3} mm，原 5 mm 门槛通过。",
    "en": "Continuous 30 Hz playback of the actual simulation; joint position, control, and actuator force limits all pass. Cumulative tangential slip at contacts: {0} mm; bulb-center displacement: {1} mm; rotation: {2}°. Relative tip displacement: {3} mm, passing the original 5 mm threshold."
  },
  "场景与资产重建": {
    "zh": "场景与资产重建",
    "en": "Scene and asset reconstruction"
  },
  "接触约束下的三维手部": {
    "zh": "接触约束下的三维手部",
    "en": "3D hand under contact constraints"
  },
  "视频手部关键点": {
    "zh": "视频手部关键点",
    "en": "Video hand keypoints"
  },
  "机器人第一视角 · Rokae／Wuji": {
    "zh": "机器人第一视角 · Rokae／Wuji",
    "en": "Robot first-person view · Rokae／Wuji"
  },
  "人类 Ego 与机器人 Ego 对照": {
    "zh": "人类第一视角与机器人第一视角对照",
    "en": "Human and robot first-person comparison"
  },
  "示范处理": {
    "zh": "示范处理",
    "en": "Demonstration processing"
  },
  "运动学求解片段": {
    "zh": "运动学求解片段",
    "en": "Kinematic solution clip"
  },
  "收起示范对照": {
    "zh": "收起示范对照",
    "en": "Hide demonstration comparison"
  },
  "对照示范视频": {
    "zh": "对照示范视频",
    "en": "Compare with demonstration video"
  },
  "照片对比": {
    "zh": "照片对比",
    "en": "Photo comparison"
  },
  "TEZOI 仿真演示": {
    "zh": "TEZOI 仿真演示",
    "en": "TEZOI simulation demo"
  },
  "离心管开盖与滴加混匀": {
    "zh": "离心管开盖与滴加混匀",
    "en": "Centrifuge tube uncapping, dispensing, and mixing"
  },
  "软袋开袋、加液与夹封": {
    "zh": "软袋开袋、加液与夹封",
    "en": "Pouch opening, liquid filling, and clip sealing"
  },
  "色素稀释": {
    "zh": "色素稀释",
    "en": "Dye dilution"
  },
  "Go2 行走": {
    "zh": "Go2 行走",
    "en": "Go2 walking"
  },
  "G1 舞蹈": {
    "zh": "G1 舞蹈",
    "en": "G1 dancing"
  },
  "双臂取药": {
    "zh": "双臂取药",
    "en": "Dual-arm medicine retrieval"
  },
  "双臂称量": {
    "zh": "双臂称量",
    "en": "Dual-arm weighing"
  },
  "柔性网线插拔": {
    "zh": "柔性网线插拔",
    "en": "Flexible Ethernet cable insertion and removal"
  },
  "双臂橡胶圈装配": {
    "zh": "双臂橡胶圈装配",
    "en": "Dual-arm rubber ring assembly"
  },
  "双臂内存条插装": {
    "zh": "双臂内存条插装",
    "en": "Dual-arm RAM module insertion"
  },
  "指尖拧紧 M12 螺母": {
    "zh": "指尖拧紧 M12 螺母",
    "en": "Fingertip tightening of an M12 nut"
  },
  "水瓶装盒与托盘放置": {
    "zh": "水瓶装盒与托盘放置",
    "en": "Water bottle boxing and tray placement"
  },
  "G1 人形机器人搬箱": {
    "zh": "G1 人形机器人搬箱",
    "en": "G1 humanoid robot box transport"
  },
  "连锁接触与动量传递": {
    "zh": "连锁接触与动量传递",
    "en": "Chain contacts and momentum transfer"
  },
  "弹性形变与卸载恢复": {
    "zh": "弹性形变与卸载恢复",
    "en": "Elastic deformation and recovery after unloading"
  },
  "线束弯曲与接触": {
    "zh": "线束弯曲与接触",
    "en": "Wire harness bending and contact"
  },
  "液体流动与流固接触": {
    "zh": "液体流动与流固接触",
    "en": "Liquid flow and fluid–solid contact"
  },
  "凝胶形变与接触力": {
    "zh": "凝胶形变与接触力",
    "en": "Gel deformation and contact forces"
  },
  "双臂毛毯对折": {
    "zh": "双臂毛毯对折",
    "en": "Dual-arm blanket folding"
  },
  "水瓶挤压": {
    "zh": "水瓶挤压",
    "en": "Water bottle squeezing"
  },
  "海绵吸水与挤水": {
    "zh": "海绵吸水与挤水",
    "en": "Sponge water absorption and squeezing"
  },
  "微滑反馈抓取": {
    "zh": "微滑反馈抓取",
    "en": "Micro-slip feedback grasping"
  },
  "多模态触觉感知": {
    "zh": "多模态触觉感知",
    "en": "Multimodal tactile sensing"
  },
  "Allegro 触觉抓取": {
    "zh": "Allegro 触觉抓取",
    "en": "Allegro tactile grasping"
  },
  "L20 灵巧手抓取": {
    "zh": "L20 灵巧手抓取",
    "en": "L20 dexterous hand grasping"
  },
  "指尖力控制": {
    "zh": "指尖力控制",
    "en": "Fingertip force control"
  },
  "弹性与塑性形变": {
    "zh": "弹性与塑性形变",
    "en": "Elastic and plastic deformation"
  },
  "软体物体抓取": {
    "zh": "软体物体抓取",
    "en": "Soft-object grasping"
  },
  "双手衣物悬挂": {
    "zh": "双手衣物悬挂",
    "en": "Two-handed garment hanging"
  },
  "Go2 布料接触": {
    "zh": "Go2 布料接触",
    "en": "Go2 cloth contact"
  },
  "实验室液体操作": {
    "zh": "实验室液体操作",
    "en": "Laboratory liquid handling"
  },
  "播放动态": {
    "zh": "播放动态",
    "en": "Play animation"
  },
  "暂停动态": {
    "zh": "暂停动态",
    "en": "Pause animation"
  },
  "{0}，共 {1}": {
    "zh": "{0}，共 {1}",
    "en": "{0} of {1}"
  },
  "重新加载": {
    "zh": "重新加载",
    "en": "Reload"
  },
  "暂停播放": {
    "zh": "暂停播放",
    "en": "Pause playback"
  },
  "重新播放": {
    "zh": "重新播放",
    "en": "Replay"
  },
  "播放对比": {
    "zh": "播放对比",
    "en": "Play comparison"
  },
  "视频加载失败，请点击重新加载。": {
    "zh": "视频加载失败，请点击重新加载。",
    "en": "Video failed to load. Click Reload."
  },
  "Comparison media unavailable": {
    "zh": "对比媒体不可用",
    "en": "Comparison media unavailable"
  },
  "Comparison seek unavailable": {
    "zh": "对比视频无法跳转",
    "en": "Comparison seek unavailable"
  },
  "Comparison seek did not reach the requested frame": {
    "zh": "对比视频未跳转到指定帧",
    "en": "Comparison seek did not reach the requested frame"
  },
  "正在加载对比画面…": {
    "zh": "正在加载对比画面…",
    "en": "Loading comparison…"
  },
  "请点击播放继续对比。": {
    "zh": "请点击播放继续对比。",
    "en": "Click Play to continue the comparison."
  },
  "仿真画面 {0}%，接触力热点 {1}%": {
    "zh": "仿真画面 {0}%，接触力热点 {1}%",
    "en": "Simulation view {0}%, contact force hotspots {1}%"
  },
  "正在缓冲对比画面…": {
    "zh": "正在缓冲对比画面…",
    "en": "Buffering comparison…"
  },
  "播放背景视频": {
    "zh": "播放背景视频",
    "en": "Play background video"
  },
  "暂停背景视频": {
    "zh": "暂停背景视频",
    "en": "Pause background video"
  },
  "ArrowDown": {
    "zh": "ArrowDown",
    "en": "ArrowDown"
  },
  "ArrowUp": {
    "zh": "ArrowUp",
    "en": "ArrowUp"
  },
  "三维重建场景：左键环绕，中键平移，按住右键和 WASD/QE 移动": {
    "zh": "三维重建场景：左键环绕，中键平移，按住右键和 WASD/QE 移动",
    "en": "Reconstructed 3D scene: orbit with the left mouse button, pan with the middle button, or hold the right button and use WASD/QE to move"
  },
  "场景配置 HTTP {0}": {
    "zh": "场景配置 HTTP {0}",
    "en": "Scene configuration HTTP {0}"
  },
  "此设备的 GPU 单缓冲区容量不足，完整场景需要至少 550 MiB": {
    "zh": "此设备的 GPU 单缓冲区容量不足，完整场景需要至少 550 MiB",
    "en": "This device’s GPU has insufficient capacity for a single buffer. The full scene requires at least 550 MiB."
  },
  "模型文件超过 1 GiB 大小限制": {
    "zh": "模型文件超过 1 GiB 大小限制",
    "en": "The model file exceeds the 1 GiB size limit"
  },
  "正在读取模型文件…": {
    "zh": "正在读取模型文件…",
    "en": "Reading model file…"
  },
  "正在下载完整场景：0%（约 {0} MB）": {
    "zh": "正在下载完整场景：0%（约 {0} MB）",
    "en": "Downloading full scene: 0% (approximately {0} MB)"
  },
  "模型下载 HTTP {0}": {
    "zh": "模型下载 HTTP {0}",
    "en": "Model download HTTP {0}"
  },
  "模型大小与配置不一致": {
    "zh": "模型大小与配置不一致",
    "en": "Model size does not match the configuration"
  },
  "正在下载完整场景：{0}%（约 {1} MB）": {
    "zh": "正在下载完整场景：{0}%（约 {1} MB）",
    "en": "Downloading full scene: {0}% (approximately {1} MB)"
  },
  "模型下载不完整": {
    "zh": "模型下载不完整",
    "en": "Model download incomplete"
  },
  "正在解析模型并上传 GPU，请稍候…": {
    "zh": "正在解析模型并上传 GPU，请稍候…",
    "en": "Parsing model and uploading to GPU. Please wait…"
  },
  "TEZOI · Scene Reconstruction": {
    "zh": "TEZOI · 场景重建",
    "en": "TEZOI · Scene Reconstruction"
  },
  "当前浏览器未允许全屏，可继续在页面内探索。": {
    "zh": "当前浏览器未允许全屏，可继续在页面内探索。",
    "en": "This browser did not allow fullscreen. You can continue exploring within the page."
  },
  "Media could not be loaded": {
    "zh": "媒体无法加载",
    "en": "Media could not be loaded"
  },
  "Aborted": {
    "zh": "已中止",
    "en": "Aborted"
  },
  "重新加载演示": {
    "zh": "重新加载演示",
    "en": "Reload demo"
  },
  "演示载入失败，请点击重新加载。": {
    "zh": "演示载入失败，请点击重新加载。",
    "en": "Demo failed to load. Click Reload."
  },
  "真实照片 {0}%，Real2Sim 场景 {1}%": {
    "zh": "真实照片 {0}%，Real2Sim 场景 {1}%",
    "en": "Real photo {0}%, Real2Sim scene {1}%"
  },
  "{0}加载失败，请重试。": {
    "zh": "{0}加载失败，请重试。",
    "en": "{0} failed to load. Please try again."
  },
  "真实照片": {
    "zh": "真实照片",
    "en": "Real photo"
  },
  "Real2Sim 场景": {
    "zh": "Real2Sim 场景",
    "en": "Real2Sim scene"
  },
  "实拍 {0}%，重建 {1}%": {
    "zh": "实拍 {0}%，重建 {1}%",
    "en": "Real photo {0}%, reconstruction {1}%"
  },
  "正在加载三维场景，请稍候…": {
    "zh": "正在加载三维场景，请稍候…",
    "en": "Loading 3D scene. Please wait…"
  },
  "三维场景不可用：{0}": {
    "zh": "三维场景不可用：{0}",
    "en": "3D scene unavailable: {0}"
  },
  "3DGS 加载失败": {
    "zh": "3DGS 加载失败",
    "en": "3DGS failed to load"
  },
  "三维场景加载失败：{0} 请使用支持 WebGPU 的桌面浏览器。": {
    "zh": "三维场景加载失败：{0} 请使用支持 WebGPU 的桌面浏览器。",
    "en": "3D scene failed to load: {0} Please use a desktop browser that supports WebGPU."
  },
  "视频对比": {
    "zh": "视频对比",
    "en": "Video comparison"
  },
  "正在加载三维场景…": {
    "zh": "正在加载三维场景…",
    "en": "Loading 3D scene…"
  },
  "三维场景加载失败：": {
    "zh": "三维场景加载失败：",
    "en": "3D scene failed to load:"
  },
  "三维场景暂时无法加载，可重试或查看{0}。": {
    "zh": "三维场景暂时无法加载，可重试或查看{0}。",
    "en": "The 3D scene cannot be loaded right now. Try again or view {0}."
  },
  "Texture": {
    "zh": "Texture",
    "en": "Texture"
  },
  "Object3D": {
    "zh": "Object3D",
    "en": "Object3D"
  },
  "Object": {
    "zh": "Object",
    "en": "Object"
  },
  "InstancedMesh": {
    "zh": "InstancedMesh",
    "en": "InstancedMesh"
  },
  "BatchedMesh": {
    "zh": "BatchedMesh",
    "en": "BatchedMesh"
  },
  "Material": {
    "zh": "Material",
    "en": "Material"
  },
  "MeshBasicMaterial": {
    "zh": "MeshBasicMaterial",
    "en": "MeshBasicMaterial"
  },
  "BufferGeometry": {
    "zh": "BufferGeometry",
    "en": "BufferGeometry"
  },
  "Mesh": {
    "zh": "Mesh",
    "en": "Mesh"
  },
  "BoxGeometry": {
    "zh": "BoxGeometry",
    "en": "BoxGeometry"
  },
  "ShaderMaterial": {
    "zh": "ShaderMaterial",
    "en": "ShaderMaterial"
  },
  "Camera": {
    "zh": "Camera",
    "en": "Camera"
  },
  "PerspectiveCamera": {
    "zh": "PerspectiveCamera",
    "en": "PerspectiveCamera"
  },
  "CubeCamera": {
    "zh": "CubeCamera",
    "en": "CubeCamera"
  },
  "CubemapFromEquirect": {
    "zh": "CubemapFromEquirect",
    "en": "CubemapFromEquirect"
  },
  "Group": {
    "zh": "Group",
    "en": "Group"
  },
  "Scene": {
    "zh": "Scene",
    "en": "Scene"
  },
  "SkinnedMesh": {
    "zh": "SkinnedMesh",
    "en": "SkinnedMesh"
  },
  "Bone": {
    "zh": "Bone",
    "en": "Bone"
  },
  "Skeleton": {
    "zh": "Skeleton",
    "en": "Skeleton"
  },
  "LineBasicMaterial": {
    "zh": "LineBasicMaterial",
    "en": "LineBasicMaterial"
  },
  "Line": {
    "zh": "Line",
    "en": "Line"
  },
  "LineSegments": {
    "zh": "LineSegments",
    "en": "LineSegments"
  },
  "LineLoop": {
    "zh": "LineLoop",
    "en": "LineLoop"
  },
  "PointsMaterial": {
    "zh": "PointsMaterial",
    "en": "PointsMaterial"
  },
  "Points": {
    "zh": "Points",
    "en": "Points"
  },
  "PlaneGeometry": {
    "zh": "PlaneGeometry",
    "en": "PlaneGeometry"
  },
  "MeshStandardMaterial": {
    "zh": "MeshStandardMaterial",
    "en": "MeshStandardMaterial"
  },
  "MeshPhysicalMaterial": {
    "zh": "MeshPhysicalMaterial",
    "en": "MeshPhysicalMaterial"
  },
  "MeshLambertMaterial": {
    "zh": "MeshLambertMaterial",
    "en": "MeshLambertMaterial"
  },
  "MeshDepthMaterial": {
    "zh": "MeshDepthMaterial",
    "en": "MeshDepthMaterial"
  },
  "MeshDistanceMaterial": {
    "zh": "MeshDistanceMaterial",
    "en": "MeshDistanceMaterial"
  },
  "X-File-Size": {
    "zh": "X-File-Size",
    "en": "X-File-Size"
  },
  "Content-Length": {
    "zh": "Content-Length",
    "en": "Content-Length"
  },
  "Light": {
    "zh": "Light",
    "en": "Light"
  },
  "HemisphereLight": {
    "zh": "HemisphereLight",
    "en": "HemisphereLight"
  },
  "SpotLight": {
    "zh": "SpotLight",
    "en": "SpotLight"
  },
  "PointLight": {
    "zh": "PointLight",
    "en": "PointLight"
  },
  "OrthographicCamera": {
    "zh": "OrthographicCamera",
    "en": "OrthographicCamera"
  },
  "DirectionalLight": {
    "zh": "DirectionalLight",
    "en": "DirectionalLight"
  },
  "WCOD": {
    "zh": "WCOD",
    "en": "WCOD"
  },
  "BackgroundCubeMaterial": {
    "zh": "BackgroundCubeMaterial",
    "en": "BackgroundCubeMaterial"
  },
  "BackgroundMaterial": {
    "zh": "BackgroundMaterial",
    "en": "BackgroundMaterial"
  },
  "WEBGL_multi_draw": {
    "zh": "WEBGL_multi_draw",
    "en": "WEBGL_multi_draw"
  },
  "EXT_texture_filter_anisotropic": {
    "zh": "EXT_texture_filter_anisotropic",
    "en": "EXT_texture_filter_anisotropic"
  },
  "EXT_color_buffer_half_float": {
    "zh": "EXT_color_buffer_half_float",
    "en": "EXT_color_buffer_half_float"
  },
  "EXT_color_buffer_float": {
    "zh": "EXT_color_buffer_float",
    "en": "EXT_color_buffer_float"
  },
  "EXT_clip_control": {
    "zh": "EXT_clip_control",
    "en": "EXT_clip_control"
  },
  "SphericalGaussianBlur": {
    "zh": "SphericalGaussianBlur",
    "en": "SphericalGaussianBlur"
  },
  "EquirectangularToCubeUV": {
    "zh": "EquirectangularToCubeUV",
    "en": "EquirectangularToCubeUV"
  },
  "CubemapToCubeUV": {
    "zh": "CubemapToCubeUV",
    "en": "CubemapToCubeUV"
  },
  "WEBGL_depth_texture": {
    "zh": "WEBGL_depth_texture",
    "en": "WEBGL_depth_texture"
  },
  "MOZ_WEBGL_depth_texture": {
    "zh": "MOZ_WEBGL_depth_texture",
    "en": "MOZ_WEBGL_depth_texture"
  },
  "WEBKIT_WEBGL_depth_texture": {
    "zh": "WEBKIT_WEBGL_depth_texture",
    "en": "WEBKIT_WEBGL_depth_texture"
  },
  "MOZ_EXT_texture_filter_anisotropic": {
    "zh": "MOZ_EXT_texture_filter_anisotropic",
    "en": "MOZ_EXT_texture_filter_anisotropic"
  },
  "WEBKIT_EXT_texture_filter_anisotropic": {
    "zh": "WEBKIT_EXT_texture_filter_anisotropic",
    "en": "WEBKIT_EXT_texture_filter_anisotropic"
  },
  "WEBGL_compressed_texture_s3tc": {
    "zh": "WEBGL_compressed_texture_s3tc",
    "en": "WEBGL_compressed_texture_s3tc"
  },
  "MOZ_WEBGL_compressed_texture_s3tc": {
    "zh": "MOZ_WEBGL_compressed_texture_s3tc",
    "en": "MOZ_WEBGL_compressed_texture_s3tc"
  },
  "WEBKIT_WEBGL_compressed_texture_s3tc": {
    "zh": "WEBKIT_WEBGL_compressed_texture_s3tc",
    "en": "WEBKIT_WEBGL_compressed_texture_s3tc"
  },
  "WEBGL_compressed_texture_pvrtc": {
    "zh": "WEBGL_compressed_texture_pvrtc",
    "en": "WEBGL_compressed_texture_pvrtc"
  },
  "WEBKIT_WEBGL_compressed_texture_pvrtc": {
    "zh": "WEBKIT_WEBGL_compressed_texture_pvrtc",
    "en": "WEBKIT_WEBGL_compressed_texture_pvrtc"
  },
  "WEBGL_clip_cull_distance": {
    "zh": "WEBGL_clip_cull_distance",
    "en": "WEBGL_clip_cull_distance"
  },
  "OES_texture_float_linear": {
    "zh": "OES_texture_float_linear",
    "en": "OES_texture_float_linear"
  },
  "WEBGL_multisampled_render_to_texture": {
    "zh": "WEBGL_multisampled_render_to_texture",
    "en": "WEBGL_multisampled_render_to_texture"
  },
  "WEBGL_render_shared_exponent": {
    "zh": "WEBGL_render_shared_exponent",
    "en": "WEBGL_render_shared_exponent"
  },
  "LinearTransferOETF": {
    "zh": "LinearTransferOETF",
    "en": "LinearTransferOETF"
  },
  "Linear": {
    "zh": "Linear",
    "en": "Linear"
  },
  "Reinhard": {
    "zh": "Reinhard",
    "en": "Reinhard"
  },
  "Cineon": {
    "zh": "Cineon",
    "en": "Cineon"
  },
  "ACESFilmic": {
    "zh": "ACESFilmic",
    "en": "ACESFilmic"
  },
  "Neutral": {
    "zh": "Neutral",
    "en": "Neutral"
  },
  "Custom": {
    "zh": "Custom",
    "en": "Custom"
  },
  "SHADOWMAP_TYPE_BASIC": {
    "zh": "SHADOWMAP_TYPE_BASIC",
    "en": "SHADOWMAP_TYPE_BASIC"
  },
  "SHADOWMAP_TYPE_PCF": {
    "zh": "SHADOWMAP_TYPE_PCF",
    "en": "SHADOWMAP_TYPE_PCF"
  },
  "SHADOWMAP_TYPE_PCF_SOFT": {
    "zh": "SHADOWMAP_TYPE_PCF_SOFT",
    "en": "SHADOWMAP_TYPE_PCF_SOFT"
  },
  "SHADOWMAP_TYPE_VSM": {
    "zh": "SHADOWMAP_TYPE_VSM",
    "en": "SHADOWMAP_TYPE_VSM"
  },
  "ENVMAP_TYPE_CUBE": {
    "zh": "ENVMAP_TYPE_CUBE",
    "en": "ENVMAP_TYPE_CUBE"
  },
  "ENVMAP_TYPE_CUBE_UV": {
    "zh": "ENVMAP_TYPE_CUBE_UV",
    "en": "ENVMAP_TYPE_CUBE_UV"
  },
  "ENVMAP_MODE_REFLECTION": {
    "zh": "ENVMAP_MODE_REFLECTION",
    "en": "ENVMAP_MODE_REFLECTION"
  },
  "ENVMAP_MODE_REFRACTION": {
    "zh": "ENVMAP_MODE_REFRACTION",
    "en": "ENVMAP_MODE_REFRACTION"
  },
  "ENVMAP_BLENDING_NONE": {
    "zh": "ENVMAP_BLENDING_NONE",
    "en": "ENVMAP_BLENDING_NONE"
  },
  "ENVMAP_BLENDING_MULTIPLY": {
    "zh": "ENVMAP_BLENDING_MULTIPLY",
    "en": "ENVMAP_BLENDING_MULTIPLY"
  },
  "ENVMAP_BLENDING_MIX": {
    "zh": "ENVMAP_BLENDING_MIX",
    "en": "ENVMAP_BLENDING_MIX"
  },
  "ENVMAP_BLENDING_ADD": {
    "zh": "ENVMAP_BLENDING_ADD",
    "en": "ENVMAP_BLENDING_ADD"
  },
  "KHR_parallel_shader_compile": {
    "zh": "KHR_parallel_shader_compile",
    "en": "KHR_parallel_shader_compile"
  },
  "RectAreaLight": {
    "zh": "RectAreaLight",
    "en": "RectAreaLight"
  },
  "WebGL": {
    "zh": "WebGL",
    "en": "WebGL"
  },
  "OpenGL ES": {
    "zh": "OpenGL ES",
    "en": "OpenGL ES"
  },
  "Depth Texture with cube render targets is not supported": {
    "zh": "不支持对立方体渲染目标使用深度纹理",
    "en": "Depth Texture with cube render targets is not supported"
  },
  "Unknown depthTexture format": {
    "zh": "未知的深度纹理格式",
    "en": "Unknown depthTexture format"
  },
  "WEBGL_compressed_texture_s3tc_srgb": {
    "zh": "WEBGL_compressed_texture_s3tc_srgb",
    "en": "WEBGL_compressed_texture_s3tc_srgb"
  },
  "WEBGL_compressed_texture_etc": {
    "zh": "WEBGL_compressed_texture_etc",
    "en": "WEBGL_compressed_texture_etc"
  },
  "WEBGL_compressed_texture_astc": {
    "zh": "WEBGL_compressed_texture_astc",
    "en": "WEBGL_compressed_texture_astc"
  },
  "EXT_texture_compression_bptc": {
    "zh": "EXT_texture_compression_bptc",
    "en": "EXT_texture_compression_bptc"
  },
  "EXT_texture_compression_rgtc": {
    "zh": "EXT_texture_compression_rgtc",
    "en": "EXT_texture_compression_rgtc"
  },
  "WEBGL_lose_context": {
    "zh": "WEBGL_lose_context",
    "en": "WEBGL_lose_context"
  },
  "Control": {
    "zh": "Control",
    "en": "Control"
  },
  "KHR_binary_glTF": {
    "zh": "KHR_binary_glTF",
    "en": "KHR_binary_glTF"
  },
  "KHR_draco_mesh_compression": {
    "zh": "KHR_draco_mesh_compression",
    "en": "KHR_draco_mesh_compression"
  },
  "KHR_lights_punctual": {
    "zh": "KHR_lights_punctual",
    "en": "KHR_lights_punctual"
  },
  "KHR_materials_clearcoat": {
    "zh": "KHR_materials_clearcoat",
    "en": "KHR_materials_clearcoat"
  },
  "KHR_materials_dispersion": {
    "zh": "KHR_materials_dispersion",
    "en": "KHR_materials_dispersion"
  },
  "KHR_materials_ior": {
    "zh": "KHR_materials_ior",
    "en": "KHR_materials_ior"
  },
  "KHR_materials_sheen": {
    "zh": "KHR_materials_sheen",
    "en": "KHR_materials_sheen"
  },
  "KHR_materials_specular": {
    "zh": "KHR_materials_specular",
    "en": "KHR_materials_specular"
  },
  "KHR_materials_transmission": {
    "zh": "KHR_materials_transmission",
    "en": "KHR_materials_transmission"
  },
  "KHR_materials_iridescence": {
    "zh": "KHR_materials_iridescence",
    "en": "KHR_materials_iridescence"
  },
  "KHR_materials_anisotropy": {
    "zh": "KHR_materials_anisotropy",
    "en": "KHR_materials_anisotropy"
  },
  "KHR_materials_unlit": {
    "zh": "KHR_materials_unlit",
    "en": "KHR_materials_unlit"
  },
  "KHR_materials_volume": {
    "zh": "KHR_materials_volume",
    "en": "KHR_materials_volume"
  },
  "KHR_texture_basisu": {
    "zh": "KHR_texture_basisu",
    "en": "KHR_texture_basisu"
  },
  "KHR_texture_transform": {
    "zh": "KHR_texture_transform",
    "en": "KHR_texture_transform"
  },
  "KHR_mesh_quantization": {
    "zh": "KHR_mesh_quantization",
    "en": "KHR_mesh_quantization"
  },
  "KHR_materials_emissive_strength": {
    "zh": "KHR_materials_emissive_strength",
    "en": "KHR_materials_emissive_strength"
  },
  "EXT_materials_bump": {
    "zh": "EXT_materials_bump",
    "en": "EXT_materials_bump"
  },
  "EXT_texture_webp": {
    "zh": "EXT_texture_webp",
    "en": "EXT_texture_webp"
  },
  "EXT_texture_avif": {
    "zh": "EXT_texture_avif",
    "en": "EXT_texture_avif"
  },
  "EXT_meshopt_compression": {
    "zh": "EXT_meshopt_compression",
    "en": "EXT_meshopt_compression"
  },
  "EXT_mesh_gpu_instancing": {
    "zh": "EXT_mesh_gpu_instancing",
    "en": "EXT_mesh_gpu_instancing"
  },
  "TRANSLATION": {
    "zh": "TRANSLATION",
    "en": "TRANSLATION"
  },
  "ROTATION": {
    "zh": "ROTATION",
    "en": "ROTATION"
  },
  "SCALE": {
    "zh": "SCALE",
    "en": "SCALE"
  },
  "OPAQUE": {
    "zh": "OPAQUE",
    "en": "OPAQUE"
  },
  "MASK": {
    "zh": "MASK",
    "en": "MASK"
  },
  "BLEND": {
    "zh": "BLEND",
    "en": "BLEND"
  },
  "Firefox": {
    "zh": "Firefox",
    "en": "Firefox"
  },
  "CUBICSPLINE": {
    "zh": "CUBICSPLINE",
    "en": "CUBICSPLINE"
  },
  "COLOR_0": {
    "zh": "COLOR_0",
    "en": "COLOR_0"
  },
  "Contact data layout mismatch": {
    "zh": "接触数据布局不匹配",
    "en": "Contact data layout mismatch"
  },
  "Invalid contact frame offsets": {
    "zh": "接触帧偏移量无效",
    "en": "Invalid contact frame offsets"
  },
  "Contact data unavailable": {
    "zh": "接触数据不可用",
    "en": "Contact data unavailable"
  },
  "热点暂不可用": {
    "zh": "热点暂不可用",
    "en": "Hotspots temporarily unavailable"
  },
  "接触力数据暂时无法加载": {
    "zh": "接触力数据暂时无法加载",
    "en": "Contact force data cannot be loaded right now"
  },
  "0 N · 无接触力": {
    "zh": "0 N · 无接触力",
    "en": "0 N · No contact force"
  },
  "实验室三维场景，拖动旋转，滚轮或加减键缩放，方向键平移，Shift 加方向键旋转": {
    "zh": "实验室三维场景，拖动旋转，滚轮或加减键缩放，方向键平移，Shift 加方向键旋转",
    "en": "Laboratory 3D scene: drag to rotate, use the scroll wheel or plus/minus keys to zoom, use arrow keys to pan, or Shift + arrow keys to rotate"
  },
  "Room manifest unavailable": {
    "zh": "房间清单不可用",
    "en": "Room manifest unavailable"
  },
  "Z-up": {
    "zh": "Z-up",
    "en": "Z-up"
  },
  "Invalid room camera manifest": {
    "zh": "房间相机清单无效",
    "en": "Invalid room camera manifest"
  },
  "正在加载三维场景… {0}%": {
    "zh": "正在加载三维场景… {0}%",
    "en": "Loading 3D scene… {0}%"
  },
  "M12 仿真三维场景，拖动旋转，滚轮或加减键缩放，方向键平移，Shift 加方向键旋转": {
    "zh": "M12 仿真三维场景，拖动旋转，滚轮或加减键缩放，方向键平移，Shift 加方向键旋转",
    "en": "M12 simulation 3D scene: drag to rotate, use the scroll wheel or plus/minus keys to zoom, use arrow keys to pan, or Shift + arrow keys to rotate"
  },
  "播放三维轨迹": {
    "zh": "播放三维轨迹",
    "en": "Play 3D trajectory"
  },
  "{0}<span>播放轨迹</span>": {
    "zh": "{0}<span>播放轨迹</span>",
    "en": "{0}<span>Play trajectory</span>"
  },
  "Scene asset unavailable": {
    "zh": "场景资产不可用",
    "en": "Scene asset unavailable"
  },
  "Motion layout mismatch": {
    "zh": "运动数据布局不匹配",
    "en": "Motion layout mismatch"
  },
  "Scene body map mismatch": {
    "zh": "场景刚体映射不匹配",
    "en": "Scene body map mismatch"
  },
  "暂停三维轨迹": {
    "zh": "暂停三维轨迹",
    "en": "Pause 3D trajectory"
  },
  "{0}<span>暂停轨迹</span>": {
    "zh": "{0}<span>暂停轨迹</span>",
    "en": "{0}<span>Pause trajectory</span>"
  },
  "打开导航": {
    "zh": "打开导航",
    "en": "Open navigation"
  },
  "关闭导航": {
    "zh": "关闭导航",
    "en": "Close navigation"
  },
  "Escape": {
    "zh": "Escape",
    "en": "Escape"
  },
  "正在加载烘焙后的三维场景…": {
    "zh": "正在加载烘焙后的三维场景…",
    "en": "Loading baked 3D scene…"
  },
  "场景配置加载失败：{0}": {
    "zh": "场景配置加载失败：{0}",
    "en": "Scene configuration failed to load: {0}"
  },
  "Viewer disposed": {
    "zh": "查看器已释放",
    "en": "Viewer disposed"
  },
  "实验室三维场景。拖动旋转，滚轮缩放，右键平移。方向键平移，Shift 加方向键旋转。": {
    "zh": "实验室三维场景。拖动旋转，滚轮缩放，右键平移。方向键平移，Shift 加方向键旋转。",
    "en": "Laboratory 3D scene. Drag to rotate, scroll to zoom, and right-click and drag to pan. Use arrow keys to pan, or Shift + arrow keys to rotate."
  },
  "WebGL 上下文已丢失": {
    "zh": "WebGL 上下文已丢失",
    "en": "WebGL context lost"
  },
  "网格缺少烘焙纹理：{0}": {
    "zh": "网格缺少烘焙纹理：{0}",
    "en": "Mesh is missing baked textures: {0}"
  },
  "从 Ego 视频中识别对象、接触与操作顺序。": {
    "zh": "从第一视角视频中识别对象、接触与操作顺序。",
    "en": "Identify objects, contacts, and action sequences in first-person video."
  },
  "从空间线索重建几何、材质与可交互环境。": {
    "zh": "从空间线索重建几何、材质与可交互环境。",
    "en": "Reconstruct geometry, materials, and interactive environments from spatial cues."
  },
  "将操作映射到机器人，组织末端动作轨迹。": {
    "zh": "将操作映射到机器人，组织末端动作轨迹。",
    "en": "Map actions to the robot and organize end-effector trajectories."
  },
  "以观察、动作和反馈组成面向任务的执行策略。": {
    "zh": "以观察、动作和反馈组成面向任务的执行策略。",
    "en": "Build task-oriented execution policies from observations, actions, and feedback."
  },
  "暂停转换演示": {
    "zh": "暂停转换演示",
    "en": "Pause conversion demo"
  },
  "重播转换演示": {
    "zh": "重播转换演示",
    "en": "Replay conversion demo"
  },
  "播放转换演示": {
    "zh": "播放转换演示",
    "en": "Play conversion demo"
  },
  "重播": {
    "zh": "重播",
    "en": "Replay"
  },
  "流程示意 {0} 秒，共 {1} 秒": {
    "zh": "流程示意 {0} 秒，共 {1} 秒",
    "en": "Process illustration: {0} seconds of {1} seconds"
  },
  "固定动态滴管、相机和原始候选，逐段优化拇指与食指关节，保持骨段长度。相同的 12 mm／12 px 门槛下，接触候选由 81/192 提高到 185/192；更严格的逐指投影检查则从 60/192 提高到 160/192。未通过项保留时间、距离和原因，不能当作物理抓持成功。": {
    "zh": "固定动态滴管、相机和原始候选，逐段优化拇指与食指关节，保持骨段长度。相同的 12 mm／12 px 门槛下，接触候选由 81/192 提高到 185/192；更严格的逐指投影检查则从 60/192 提高到 160/192。未通过项保留时间、距离和原因，不能当作物理抓持成功。",
    "en": "Keep the dynamic dropper, camera, and original candidates fixed; optimize thumb and index-finger joints segment by segment while preserving bone lengths. Under the same 12 mm／12 px thresholds, contact candidates improve from 81/192 to 185/192; stricter per-finger projection checks improve from 60/192 to 160/192. Retain the time, distance, and reason for every failed check; these results do not establish physical grasp success."
  },
  "三维接触与距离": {
    "zh": "三维接触与距离",
    "en": "3D contacts and distances"
  }
};
