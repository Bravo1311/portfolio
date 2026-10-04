// All content lives here. Components read from it and need no changes.
//
// status: 'working'  — runs, measured, linked
//         'progress' — building now, partial results
//         'planned'  — designed, not built
//
// Keep the status honest. The page's credibility rests on a reader
// trusting that 'working' means working.

export const profile = {
  name: 'Kartik Agrawal',
  role: 'Autonomy Engineer',
  claim:
    'I work the full path from raw sensor measurements to learned action policies: state estimation at the bottom, systems integration in the middle, policy training at the top. Three years of production software engineering underneath it.',
  location: 'Aachen, Germany',
  cv: 'Kartik_Agrawal_CV.pdf',
  // availability: 'MSc Robotic Systems Engineering (January 2027). Available from February, willing to relocate.',
  links: [
    { label: 'cartikingermany@gmail.com', href: 'mailto:cartikingermany@gmail.com' },
    { label: '+49 176 87935033', href: 'tel:+4917687935033' },
    { label: 'linkedin.com/in/kartikag1311', href: 'https://linkedin.com/in/kartikag1311' },
    { label: 'github.com/Bravo1311', href: 'https://github.com/Bravo1311' },
  ],
}

// The spine. Order matters — it reads bottom-up through the stack.
export const tracks = [
  {
    id: 'estimation',
    name: 'Estimation',
    line: 'Where measurements become a state you can act on.',
    entries: [
      {
        id: 'thesis-fgo',
        art: 'uav-team',
        // PLACEHOLDER — replace with the version worked out in the thesis project.
        period: 'Jul 2026 — Jan 2027',
        status: 'progress',
        title: 'Decentralized cooperative localization for UAV teams',
        org: "Master's thesis · Institute of Automatic Control (IRT), RWTH Aachen",
        summary:
          'A framework for drones to improve their own state estimates from their neighbours. Each agent localizes from onboard GNSS, IMU and magnetometer; pairwise UWB ranging couples agents, reconciled with MESA — manifold edge-based separable ADMM.',
        tags: ['GTSAM', 'MESA / C-ADMM', 'UWB', 'GNSS', 'ROS2', 'ArduPilot'],
        highlights: [
          'Single-agent GTSAM estimator validated at 0.3 m position RMSE in simulation',
          'Real-time GNSS simulator with live ephemeris and configurable error models',
          'UWB simulation node done; the MESA interface is in progress',
        ],
        media: [
          {
            kind: 'plot',
            caption: 'Ground truth against the fused estimate, with dead reckoning for comparison. Hover or tap to inspect.',
          },
        ],
        detailLabel: 'Framework and open questions',
        details: [
          'Single-agent GNSS/IMU/magnetometer factor graph estimator in GTSAM, validated at 0.3 m position RMSE against simulated ground truth.',
          'Real-time GNSS simulator with live ephemeris data and configurable error models, supporting loosely and tightly coupled architectures for comparative navigation studies.',
          "MESA's edge variables were designed for co-observed landmarks. Here agents share no landmarks — the coupled variable is the neighbour's pose, so the shared-variable set is defined by the ranging topology rather than by overlapping observation.",
          'Consensus ADMM chosen for asynchrony: dropouts and message loss appear as iterations where affected agents simply do not communicate, which matches real radio behaviour better than a synchronous scheme.',
          'Deliberately modality-agnostic — UWB is the first inter-agent measurement; depth or LiDAR can be added as further edge modalities.',
          'Built an ArduPilot SITL/ROS2 simulation environment with teleoperation, and a ROS2–React interface for state visualization and diagnostics.',
          'UWB simulation node implemented; the MESA interface is the current work.',
          'Open: batch versus incremental optimization, and the bandwidth cost of edge-variable exchange at scale.',
        ],
      },
    ],
  },
  {
    id: 'integration',
    name: 'Integration',
    line: 'Where components become a system that flies.',
    entries: [
      {
        id: 'autonomy-stack',
        art: 'navigation',
        period: 'Feb 2026 — present',
        status: 'working',
        title: 'UAV autonomy stack',
        org: 'ROS2, PX4 SITL, Gazebo, Nav2',
        summary:
          'A full-stack autonomous UAV system in ROS2/PX4, supporting manual gamepad control and perception-driven autonomous flight in offboard mode.',
        tags: ['ROS2', 'PX4', 'Nav2', 'LiDAR', 'C++', 'Docker', 'GitHub Actions'],
        highlights: [
          'ArUco-based localization with PD control for waypoint navigation and precision landing',
          'LiDAR collision avoidance, and Nav2 adapted to UAV dynamics',
          'Every change built in a clean Docker container through GitHub Actions',
        ],
        links: [
          { label: 'Code', href: 'https://github.com/Bravo1311/ROS2_PX4_Drone_Autonomy_POC' },
          { label: 'Demo', href: 'https://www.youtube.com/@Drononomy' },
        ],
        media: [
          {
            kind: 'video',
            videoId: 'miEoYj2KqZ8',
            title: 'Nav2 goal navigation',
            caption: 'Autonomous goal navigation on PX4 SITL in Gazebo, ROS2 offboard.',
          },
          {
            kind: 'video',
            videoId: '1jfcPgGP5Kg',
            title: 'Reactive obstacle avoidance, 2D LiDAR',
            caption: 'Obstacle avoidance',
          },
          {
            kind: 'video',
            videoId: 'zwz-KPHohZU',
            title: 'ArUco landing with reorientation',
            caption: 'Precision landing',
          },
        ],
        detailLabel: 'What it does',
        details: [
          'ArUco-based visual localization with PD closed-loop velocity control for waypoint navigation and precision landing.',
          'LiDAR collision avoidance filtering commanded velocity in obstacle-facing directions.',
          'Nav2 adapted to UAV dynamics, enabling autonomous path planning and goal navigation on a drone platform.',
          'C++ marker-map annotator producing semantic annotations that feed VLM-based reasoning into the estimation and control layers.',
          'Every change is built automatically in a clean Docker container (GitHub Actions), so the project builds the same way on any machine. Changes go through pull requests.',
        ],
      },
    ],
  },
  {
    id: 'policy',
    name: 'Policy',
    line: 'Where the state estimate becomes an action.',
    entries: [
      {
        id: 'flow-matching',
        art: 'flow-policy',
        period: 'Aug 2026 — present',
        status: 'working',
        title: 'Flow-matching UAV autonomy',
        org: 'PyTorch, MuJoCo, Gazebo/PX4',
        summary:
          'A learned policy that flies the aircraft directly. A Diffusion Transformer-style conditional flow-matching model, trained by imitation from a classical PD controller and validated in both MuJoCo and Gazebo/PX4.',
        tags: ['PyTorch', 'Flow matching', 'Transformers', 'MuJoCo', 'Imitation learning'],
        highlights: [
          'Phase 1, pose-based precision landing, is complete and public',
          'Trained by imitation from a classical PD controller, so failures trace to the policy',
          'Phase 2 in progress: vision-conditioned target following with a Siamese tracking head',
        ],
        links: [
          { label: 'Code', href: 'https://github.com/Bravo1311/Flow_Matching_UAVs' },
          { label: 'Demo', href: 'https://www.youtube.com/watch?v=w6VsROLk_S0' },
        ],
        media: [
          {
            kind: 'video',
            videoId: 'w6VsROLk_S0',
            title: 'Flow-matching policy demo',
            caption: 'Demo of the learned flow-matching policy, from the project page.',
          },
          {
            kind: 'image',
            src: 'media/flow-matching-architecture.svg',
            title: 'Policy architecture',
            alt: 'Diagram of the flow-matching policy: a noisy action chunk is tokenized and passed through N transformer blocks whose normalization is conditioned on flow time and pose history, and a linear head outputs the predicted velocity.',
            caption: 'Policy architecture (Phase 1): pose history and flow time condition every block through AdaLN.',
          },
        ],
        detailLabel: 'Architecture and the Phase 2 plan',
        details: [
          'Full pipeline: simplified MuJoCo dynamics, synthetic data generation, sliding-window dataset construction, AdaLN-conditioned transformer, closed-loop Euler-sampling inference.',
          'Trained against a classical controller rather than human demonstrations, so the target behaviour is exactly specified and failures are attributable to the policy rather than to the data.',
          'Phase 1 — privileged pose-based precision landing — is complete and public.',
          'Phase 2 in progress: vision-conditioned target following with a Siamese tracking head, cross-attention between template and search frame tokens, AdaLN conditioning from the template embedding, and localization output feeding the history encoder.',
          'Deliberate choice to train the tracking head separately before integrating with the DiT, so the two failure modes stay separable.',
        ],
      },
    ],
  },
]

// Where the spine is going. Stated as intent, not as a result.
export const direction = {
  title: 'Closing the loop between the tracks',
  text: 'The three tracks are one system. The intended convergence is vision-based relative pose from the tracking policy entering the factor graph as an aiding factor, tested under simulated GNSS spoofing — learned perception feeding classical estimation rather than replacing it. Designed, not yet built.',
}

export const experience = [
  {
    id: 't-systems',
    period: 'Sep 2024 — Jan 2026',
    title: 'Software Engineering Intern',
    org: 'T-Systems International, Aachen',
    summary:
      'Built a Timefold AI optimization engine for Rego policy-driven automated scheduling, and the streaming infrastructure behind it.',
    tags: ['Go', 'Timefold', 'Redpanda', 'PostgreSQL', 'Grafana'],
    detailLabel: 'Scope of the work',
    details: [
      'Designed and implemented the scheduling optimizer with tuned hard and soft constraints.',
      'Developed tooling that reduced solver runtime and constraint violations, plus a web interface for results visualization.',
      'Containerized microservices for real-time data streaming using Redpanda, custom Go plugins, PostgreSQL persistence and AMQP for reliable event processing.',
      'Instrumented the system for observability with Grafana and Tempo.',
    ],
  },
  {
    id: 'ltimindtree',
    period: 'Jul 2021 — Aug 2023',
    title: 'Full-Stack Software Engineer',
    org: 'LTIMindtree, Bangalore',
    summary: 'Production microservices and full-stack applications for client-facing projects.',
    tags: ['Spring Boot', 'MERN', 'SQL', 'Graph databases'],
    detailLabel: 'Scope of the work',
    details: [
      'Production microservices and full-stack applications using Spring Boot and the MERN stack.',
      'Took multiple proofs of concept from problem definition through demonstration to client approval and deployment.',
      'Worked with relational and graph databases on automation-focused solutions.',
    ],
  },
  {
    id: 'amazon',
    period: 'Feb 2021 — Jun 2021',
    title: 'Area Management Intern, Fulfillment Center',
    org: 'Amazon India (ASSPL), Mumbai',
    summary: 'Traced defect sources in the inbound shipment phase and automated pallet sorting.',
    tags: ['VBA', 'Process analysis'],
    detailLabel: 'Scope of the work',
    details: [
      'Identified gaps and defect sources in the inbound phase through area surveying and analysis of process and defect metrics.',
      'Deployed VBA macros automating shipment-wise pallet sorting and identification via coded pallet labels.',
    ],
  },
]

export const education = [
  {
    id: 'rwth',
    period: 'Oct 2023 — present',
    title: 'M.Sc. Robotic Systems Engineering',
    org: 'RWTH Aachen University',
    summary: '',
    details: [],
  },
  {
    id: 'bits',
    period: 'Aug 2017 — Jul 2021',
    title: 'B.Eng. Mechanical Engineering',
    org: 'BITS Pilani',
    summary: '',
    details: [],
  },
]

// Shared, not tied to either column above — so the pair reads as two equal
// entries rather than one with coursework and one visibly missing it.
export const educationCoursework = {
  label: 'Relevant coursework — RWTH Aachen',
  text: 'Advanced Machine Learning, Computer Vision, Simulation of Robotic Systems, Sensors and Environment, Reinforcement Learning, Mechatronics, Mobile Robotics, Industrial Logistics.',
}

export const skills = [
  {
    label: 'Estimation',
    items: [
      'Factor graph optimization',
      'GTSAM',
      'GNSS (GPS, Galileo)',
      'Inertial navigation',
      'UWB ranging',
      'Multi-sensor fusion',
      'Consensus ADMM',
    ],
  },
  {
    label: 'Robotics & simulation',
    items: ['ROS2', 'PX4', 'ArduPilot', 'Gazebo', 'MuJoCo', 'Nav2', 'MoveIt', 'Isaac Sim'],
  },
  {
    label: 'Machine learning',
    items: ['PyTorch', 'Flow matching', 'Transformers', 'Imitation learning', 'VLMs'],
  },
  { label: ' Programming Languages', items: ['Python', 'C++', 'Java', 'JavaScript (MERN)', 'SQL'] },
  {
    label: 'Infrastructure',
    items: ['Git', 'Docker', 'GitHub Actions', 'Linux', 'Redpanda', 'PostgreSQL', 'Grafana'],
  },
  { label: 'Languages', items: ['English (fluent)', 'German (A2)', 'Hindi (native)'] },
]

// Which entries show a given skill. Only skills that an entry's own text supports are listed;
// anything missing here renders as plain text instead of a link. Keys must match the skill names above.
export const evidence = {
  'Factor graph optimization': ['thesis-fgo'],
  GTSAM: ['thesis-fgo'],
  'GNSS (GPS, Galileo)': ['thesis-fgo'],
  'Inertial navigation': ['thesis-fgo'],
  'UWB ranging': ['thesis-fgo'],
  'Multi-sensor fusion': ['thesis-fgo'],
  'Consensus ADMM': ['thesis-fgo'],

  ROS2: ['thesis-fgo', 'autonomy-stack'],
  PX4: ['autonomy-stack', 'flow-matching'],
  ArduPilot: ['thesis-fgo'],
  Gazebo: ['autonomy-stack', 'flow-matching'],
  MuJoCo: ['flow-matching'],
  Nav2: ['autonomy-stack'],

  PyTorch: ['flow-matching'],
  'Flow matching': ['flow-matching'],
  Transformers: ['flow-matching'],
  'Imitation learning': ['flow-matching'],
  VLMs: ['autonomy-stack'],

  Python: ['flow-matching'],
  'C++': ['autonomy-stack'],
  Java: ['ltimindtree'],
  'JavaScript (MERN)': ['ltimindtree'],
  SQL: ['ltimindtree'],

  Git: ['autonomy-stack'],
  Docker: ['autonomy-stack', 't-systems'],
  'GitHub Actions': ['autonomy-stack'],
  Redpanda: ['t-systems'],
  PostgreSQL: ['t-systems'],
  Grafana: ['t-systems'],
}
