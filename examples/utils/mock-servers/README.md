# RudderStack Mock Servers

Mock servers for testing RudderStack SDK sample applications without requiring real credentials or external services.

## Overview

This utility provides two mock servers:

- **Control Plane Server** (Port 8001): Serves mock source configuration
- **Data Plane Server** (Port 8002): Accepts analytics events and returns success responses

## Usage

### Install Dependencies
```bash
cd examples/utils/mock-servers
npm install
```

### Start Both Servers
```bash
npm start
```

### Start Individual Servers
```bash
# Control plane only
npm run start:control

# Data plane only  
npm run start:data
```

## Integration with Sample Apps

Sample apps should be configured to use these mock servers:

```bash
# Environment variables for manual testing
WRITE_KEY=test-write-key  
DATAPLANE_URL=http://localhost:8002
CONFIG_SERVER_HOST=http://localhost:8001

# RudderStack SDK configuration
analytics.load('test-write-key', 'http://localhost:8002', {
  configUrl: 'http://localhost:8001',
  onLoaded: () => console.log('SDK loaded with mock servers!')
});
```

## Automated Sample App Integration

Sample apps are automatically configured to use these mock servers when:

1. **Environment Setup**: Run `./scripts/setup-examples-env.sh` with mock server URLs:
   ```bash
   # Set in root .env file
   WRITE_KEY=test-write-key
   DATAPLANE_URL=http://localhost:8002  
   CONFIG_SERVER_HOST=http://localhost:8001
   ```

2. **Verification**: Sample apps read these values and configure the SDK:
   - React: `REACT_APP_RUDDERSTACK_CONFIG_URL`  
   - Next.js: `NEXT_PUBLIC_RUDDERSTACK_CONFIG_URL`
   - Angular: `NG_APP_RUDDERSTACK_CONFIG_URL` 
   - Gatsby: `GATSBY_RUDDERSTACK_CONFIG_URL`

## Server Details

### Control Plane (Port 8001)
- `GET /health` - Health check
- `GET /sourceConfig` - Returns mock source configuration

### Data Plane (Port 8002) 
- `GET /health` - Health check
- `POST /v1/track` - Mock track events
- `POST /v1/page` - Mock page events
- `POST /v1/identify` - Mock identify events
- `POST /v1/alias` - Mock alias events
- `POST /v1/group` - Mock group events
- `POST /v1/batch` - Mock batch events

All analytics endpoints return 200 OK responses and log received events to console.

## Testing

The servers are designed for testing and development only. They:
- Accept all requests and return successful responses
- Log all received events for debugging
- Provide realistic response formats
- Support graceful shutdown (Ctrl+C)

Perfect for validating that sample apps can successfully initialize the RudderStack SDK and send events!