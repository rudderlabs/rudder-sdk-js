# System Architecture

## 🏗️ High-Level Architecture

### **Data Flow**

```
User Event → SDK Core → Plugin Processing → Destination Routing → External APIs
```

### **Core Components**

- **Analytics Core** - Event collection and processing engine
- **Plugin System** - Modular feature extensions
- **Storage Layer** - User identity and session persistence

## 🔌 Plugin Architecture

### **Plugin Types**

- **Core Plugins** - Essential functionality (always loaded)
- **Optional Plugins** - Feature extensions (loaded on demand)

### **Plugin Lifecycle**

1. **Registration** - Plugin registers with SDK core
2. **Initialization** - Plugin receives configuration
3. **Event Processing** - Plugin processes events in pipeline

## **Device Mode Destinations**

- Third-party SDK loaded directly in browser
- Events sent directly to destination APIs
- Full destination feature access
- Higher client-side load

## 🔄 Event Processing Pipeline

1. **Event Capture** - User calls SDK methods (`track`, `page`, etc.)
2. **Validation** - Event structure and required fields checked
3. **Plugin Processing** - Events pass through plugin chain
4. **Destination Routing** - Events routed based on configuration
5. **Delivery** - Events sent to destinations (device/RudderStack backend)

## 💾 Data Persistence

### **Storage Types**

- **Cookies** - User ID, session, consent state
- **LocalStorage** - Event queue, configuration cache
- **Memory** - Runtime state and processing queues

### **Identity Management**

- **Anonymous ID** - Generated for unknown users
- **User ID** - Set when user identifies
- **Session ID** - Generated per session
- **Traits** - User and group characteristics

## 🚨 Error Handling & Monitoring Architecture

### **Error Filtering System**

The SDK implements intelligent error filtering to reduce noise from non-actionable errors:

```
Error Occurs → Error Classification → Filtering Logic → Notification Decision
     ↓              ↓                    ↓                    ↓
Raw Error    Script/Plugin/      CSP Check +         Allow/Suppress
             Integration        Ad Blocker Check     Notification
```

### **Multi-Stage Filtering Process**

1. **Error Classification** - Categorize error type (script load, integration, etc.)
2. **URL Extraction** - Extract relevant URLs from error messages
3. **CSP Violation Check** - Check if URL was blocked by Content Security Policy
4. **Ad Blocker Detection** - Detect if ad blockers are interfering with requests
5. **Notification Decision** - Suppress notifications for environmental issues

### **Error Categories**

#### **Suppressible Errors** (Environmental Issues)

- Plugin/Integration script loading failures due to CSP
- Plugin/Integration script loading failures due to ad blockers
- Dynamic import failures for blocked resources
