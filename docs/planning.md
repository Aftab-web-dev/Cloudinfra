# CloudInfra — Cloud Architecture Visualization Platform

## Vision
A universal platform where developers, architects, and teams can **visually design, connect, and understand** cloud infrastructure, backend systems, and software architecture — across ALL major cloud providers and tech stacks.

---

## Problem Statement
1. Architects juggle multiple tools (draw.io, Lucidchart, Miro) — none are cloud-native aware
2. No single tool supports AWS + Azure + GCP + Alibaba + DigitalOcean in one canvas
3. Design patterns (microservices, event-driven, CQRS) are hard to visualize and teach
4. Switching between diagram tools, project management, and documentation is painful
5. Existing tools don't validate architecture or show how components actually connect

---

## Core Modules

### Module 1: Visual Canvas (Priority 1 — BUILD FIRST)
The heart of the platform. An infinite canvas where users drag, drop, connect, and design.

**Features:**
- Infinite canvas with zoom, pan, minimap
- Drag-and-drop component library (sidebar)
- Smart connectors (arrows, data flow lines, bidirectional)
- Grouping / containers (VPC, subnet, region, availability zone)
- Labels, annotations, sticky notes
- Snap-to-grid, alignment guides
- Undo/redo history
- Export: PNG, SVG, PDF, JSON
- Import: JSON (re-load saved diagrams)
- Dark mode / Light mode

**Tech:** React + TypeScript + React Flow (node-based canvas library)

---

### Module 2: Cloud Provider Component Libraries
Pre-built, categorized component libraries for every major cloud platform.

#### AWS Components
| Category | Components |
|----------|-----------|
| Compute | EC2, Lambda, ECS, EKS, Fargate, Batch, Lightsail |
| Storage | S3, EBS, EFS, Glacier, Storage Gateway |
| Database | RDS, DynamoDB, Aurora, ElastiCache, Redshift, Neptune, DocumentDB |
| Networking | VPC, Subnet, Route53, CloudFront, API Gateway, ELB/ALB/NLB, Direct Connect |
| Security | IAM, Cognito, WAF, Shield, KMS, Secrets Manager |
| Messaging | SQS, SNS, EventBridge, Kinesis, MQ |
| DevOps | CodePipeline, CodeBuild, CodeDeploy, CloudFormation, CDK |
| AI/ML | SageMaker, Rekognition, Comprehend, Bedrock |
| Monitoring | CloudWatch, X-Ray, CloudTrail |

#### Azure Components
| Category | Components |
|----------|-----------|
| Compute | Virtual Machines, App Service, AKS, Functions, Container Instances |
| Storage | Blob Storage, Files, Queue, Table, Data Lake |
| Database | SQL Database, Cosmos DB, PostgreSQL, MySQL, Redis Cache |
| Networking | VNet, Load Balancer, Application Gateway, Front Door, DNS, ExpressRoute |
| Security | Active Directory, Key Vault, Sentinel, Firewall |
| Messaging | Service Bus, Event Hubs, Event Grid |
| DevOps | Azure DevOps, Pipelines |
| AI/ML | Cognitive Services, ML Studio, OpenAI Service |
| Monitoring | Monitor, Log Analytics, Application Insights |

#### GCP Components
| Category | Components |
|----------|-----------|
| Compute | Compute Engine, Cloud Run, GKE, Cloud Functions, App Engine |
| Storage | Cloud Storage, Persistent Disk, Filestore |
| Database | Cloud SQL, Firestore, Bigtable, Spanner, Memorystore |
| Networking | VPC, Cloud Load Balancing, Cloud CDN, Cloud DNS, Cloud Armor |
| Security | IAM, Secret Manager, Security Command Center |
| Messaging | Pub/Sub, Cloud Tasks |
| DevOps | Cloud Build, Cloud Deploy |
| AI/ML | Vertex AI, AutoML, Vision AI |
| Monitoring | Cloud Monitoring, Cloud Logging, Cloud Trace |

#### Alibaba Cloud Components
| Category | Components |
|----------|-----------|
| Compute | ECS, Function Compute, Container Service, Serverless App Engine |
| Storage | OSS, NAS, CPFS |
| Database | ApsaraDB RDS, PolarDB, Tair, Lindorm, AnalyticDB |
| Networking | VPC, SLB, CDN, Direct Connect, NAT Gateway |
| Security | RAM, KMS, WAF, Anti-DDoS |
| Messaging | Message Service, EventBridge |
| AI/ML | Machine Learning Platform, Model Studio |

#### Generic / Cloud-Agnostic Components
| Category | Components |
|----------|-----------|
| Compute | Server, Container, Serverless Function, VM |
| Storage | Object Storage, Block Storage, File Storage |
| Database | SQL DB, NoSQL DB, Graph DB, Cache, Data Warehouse |
| Networking | Load Balancer, CDN, DNS, Firewall, API Gateway, VPN |
| Messaging | Message Queue, Event Bus, Stream Processor |
| Client | Web Browser, Mobile App, Desktop App, IoT Device |
| External | Third-party API, SaaS Service, Payment Gateway |

#### Other Providers (Phase 2)
- DigitalOcean
- Oracle Cloud
- IBM Cloud
- Cloudflare
- Vercel / Netlify (frontend hosting)
- Supabase / Firebase (BaaS)

---

### Module 3: Design Pattern Templates
Pre-built architecture templates users can start from.

| Pattern | Description |
|---------|-------------|
| Monolith | Single-server traditional app |
| Microservices | Distributed services with API gateway |
| Event-Driven | Pub/Sub, event sourcing, CQRS |
| Serverless | Functions + managed services |
| Jamstack | CDN + API + Static frontend |
| Data Pipeline | ETL / streaming data architecture |
| ML Pipeline | Training + inference + monitoring |
| Multi-Region | High availability across regions |
| Hybrid Cloud | On-prem + cloud mix |
| Zero Trust | Security-first networking |
| CQRS | Command Query Responsibility Segregation |
| Saga Pattern | Distributed transaction management |
| Strangler Fig | Monolith to microservices migration |
| Circuit Breaker | Fault-tolerant service communication |
| API Gateway | Centralized API management |
| Service Mesh | Istio/Linkerd style mesh |
| Blue-Green Deployment | Zero-downtime deployment strategy |
| Canary Deployment | Gradual rollout strategy |
| Domain-Driven Design | Bounded contexts and aggregates |
| Hexagonal Architecture | Ports and adapters |

---

### Module 4: Project Manager (Phase 2)
- Create projects with multiple diagrams
- Version history for diagrams
- Comments and annotations
- Share diagrams (public link / team)
- Organize by folders/workspaces

### Module 5: Backend System Designer (Phase 2)
- Database schema visual designer (ERD)
- API endpoint designer
- Generate documentation from designs
- Validate architecture (anti-pattern detection)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| React Flow | Canvas / node-based diagramming engine |
| Zustand | State management |
| React Router | Routing |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend (Phase 2)
| Technology | Purpose |
|-----------|---------|
| Node.js + Express/Hono | API server |
| PostgreSQL | Database |
| Prisma | ORM |
| Auth.js | Authentication |

### Storage (Phase 1 — Local First)
- LocalStorage / IndexedDB for saving diagrams
- JSON export/import for sharing
- No backend needed for Phase 1

---

## Phase Plan

### Phase 1: Core Canvas + AWS Components (Current)
```
Week 1-2: Canvas foundation
  ├── Infinite canvas with zoom/pan
  ├── Drag-and-drop from sidebar
  ├── Node connection system
  ├── Properties panel (click node to edit)
  ├── Minimap
  └── Toolbar (undo/redo, zoom controls, export)

Week 3: Component Libraries
  ├── AWS components (all categories, icons)
  ├── Generic/cloud-agnostic components
  ├── Component search/filter in sidebar
  └── Component categories with collapsible groups

Week 4: Design Patterns + Polish
  ├── 5 starter templates (Microservices, Serverless, etc.)
  ├── Save/load diagrams (localStorage)
  ├── Export PNG/SVG/JSON
  ├── Dark mode
  └── Responsive layout
```

### Phase 2: All Clouds + Project Management
- Azure, GCP, Alibaba components
- User accounts + cloud save
- Project workspaces
- Version history
- Sharing and collaboration

### Phase 3: Backend Designer + Intelligence
- ERD designer
- API designer
- Architecture validation
- AI-powered suggestions
- Real-time collaboration

---

## Application Structure

```
src/
├── components/
│   ├── canvas/
│   │   ├── Canvas.tsx              # Main React Flow canvas
│   │   ├── CustomNode.tsx          # Base custom node component
│   │   ├── CloudNode.tsx           # Cloud service node renderer
│   │   ├── GroupNode.tsx           # Container/group node (VPC, subnet)
│   │   ├── CustomEdge.tsx          # Custom edge/connector
│   │   ├── Minimap.tsx             # Canvas minimap
│   │   └── Controls.tsx            # Zoom/fit controls
│   ├── sidebar/
│   │   ├── Sidebar.tsx             # Main sidebar container
│   │   ├── ComponentLibrary.tsx    # Drag-and-drop component list
│   │   ├── ComponentCategory.tsx   # Collapsible category group
│   │   ├── ComponentSearch.tsx     # Search/filter components
│   │   └── TemplateLibrary.tsx     # Design pattern templates
│   ├── toolbar/
│   │   ├── Toolbar.tsx             # Top toolbar
│   │   ├── ExportMenu.tsx          # Export options
│   │   └── UndoRedo.tsx            # Undo/redo buttons
│   ├── properties/
│   │   ├── PropertiesPanel.tsx     # Right-side properties editor
│   │   ├── NodeProperties.tsx      # Edit node details
│   │   └── EdgeProperties.tsx      # Edit connection details
│   └── layout/
│       ├── AppLayout.tsx           # Main app layout
│       └── Header.tsx              # App header/nav
├── data/
│   ├── aws.ts                     # AWS component definitions
│   ├── azure.ts                   # Azure component definitions
│   ├── gcp.ts                     # GCP component definitions
│   ├── alibaba.ts                 # Alibaba Cloud component definitions
│   ├── generic.ts                 # Cloud-agnostic components
│   └── templates/
│       ├── microservices.ts       # Microservices template
│       ├── serverless.ts          # Serverless template
│       ├── event-driven.ts        # Event-driven template
│       ├── data-pipeline.ts       # Data pipeline template
│       └── monolith.ts            # Monolith template
├── store/
│   ├── canvasStore.ts             # Canvas state (nodes, edges, viewport)
│   ├── uiStore.ts                 # UI state (sidebar, theme, panels)
│   └── projectStore.ts           # Project/diagram metadata
├── hooks/
│   ├── useCanvas.ts               # Canvas operations
│   ├── useDragDrop.ts             # Drag-and-drop logic
│   ├── useExport.ts               # Export functionality
│   ├── useHistory.ts              # Undo/redo history
│   └── useLocalStorage.ts         # Save/load from localStorage
├── types/
│   └── index.ts                   # All TypeScript types/interfaces
├── utils/
│   ├── export.ts                  # Export helpers (PNG, SVG, JSON)
│   └── layout.ts                  # Auto-layout algorithms
├── styles/
│   └── index.css                  # Global styles + Tailwind
├── App.tsx                        # Root app component
└── main.tsx                       # Entry point
```

---

## Component Data Model

```typescript
// Each draggable cloud component
interface CloudComponent {
  id: string;
  type: string;                    // 'aws-ec2', 'azure-vm', 'generic-db'
  provider: CloudProvider;         // 'aws' | 'azure' | 'gcp' | 'alibaba' | 'generic'
  category: string;                // 'compute' | 'storage' | 'database' | etc.
  name: string;                    // 'EC2 Instance'
  description: string;             // 'Virtual server in the cloud'
  icon: string;                    // SVG path or icon component
  color: string;                   // Brand color for the provider
  defaultConfig: Record<string, unknown>;  // Default properties
}

// Canvas node (extends React Flow node)
interface CanvasNode {
  id: string;
  type: 'cloudNode' | 'groupNode';
  position: { x: number; y: number };
  data: {
    component: CloudComponent;
    label: string;
    config: Record<string, unknown>;
    notes: string;
  };
  parentId?: string;              // For nodes inside groups
  style?: Record<string, unknown>;
}

// Connection between nodes
interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'default' | 'animated' | 'dashed';
  data?: {
    protocol?: string;            // 'HTTPS', 'gRPC', 'WebSocket'
    description?: string;
  };
}

// Saved diagram
interface Diagram {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: { x: number; y: number; zoom: number };
  createdAt: string;
  updatedAt: string;
  template?: string;
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo | Project Name | Save | Export | Theme Toggle │
├────────┬──────────────────────────────────┬─────────────────┤
│        │                                  │                 │
│  Side  │                                  │   Properties    │
│  bar   │         INFINITE CANVAS          │   Panel         │
│        │                                  │   (right)       │
│ Cloud  │   [Drag & drop nodes here]       │                 │
│ Comps  │   [Connect with edges]           │  - Name         │
│        │   [Zoom, pan, select]            │  - Description  │
│ ─────  │                                  │  - Config       │
│ Search │                                  │  - Notes        │
│ ─────  │                                  │  - Style        │
│ AWS    │                                  │                 │
│ Azure  │                                  │                 │
│ GCP    │                                  │                 │
│ Alibab │                                  │                 │
│ Generic│              ┌──────┐            │                 │
│ ─────  │              │Minimp│            │                 │
│ Templ. │              └──────┘            │                 │
├────────┴──────────────────────────────────┴─────────────────┤
│  Toolbar: Undo | Redo | Zoom In/Out | Fit | Grid | Snap    │
└─────────────────────────────────────────────────────────────┘
```
