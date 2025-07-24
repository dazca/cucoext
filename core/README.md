# Core Work Time Tracking System

## 📋 Overview

The Core module provides the foundation for work time tracking and management, featuring automated credential handling, working hours calculation, and comprehensive time tracking capabilities for the Spanish time tracking system cuco360.cucorent.com.

## 🏗️ Architecture

```
core/
├── work-time-tracker.js           # Main tracking engine
├── credential-manager.js          # Credential management system
├── config.json                    # Stored credentials (auto-generated)
├── automation/
│   └── automated-token-extractor.js  # Browser automation for credentials
├── resources/
│   ├── working-hours-config.js    # Working hours definitions
│   └── README-working-hours.md    # Working hours documentation
└── tests/
    ├── simple-minutes-test.js     # Get current working minutes
    ├── detalle-marcajes-test.js   # Extract marcajes column
    ├── theoretical-exit.js        # Calculate exit times
    ├── manage-working-hours.js    # Configure working schedules
    ├── working-summary.js         # Comprehensive status dashboard
    └── test-*.js                  # Test suites
```

## � Quick Start

### Initial Setup
```bash
cd core
npm install
```

### Basic Usage
```bash
# Get current working minutes (with auto-retry on credential expiration)
node tests/simple-minutes-test.js

# Get detailed work status with progress visualization
node tests/working-summary.js

# Calculate when you can leave based on entry time
node tests/theoretical-exit.js

# Extract raw marcajes data
node tests/detalle-marcajes-test.js
```

### Working Hours Management
```bash
# View current working hours configuration
node tests/manage-working-hours.js show

# Set to intensive schedule (summer)
node tests/manage-working-hours.js set intensive

# Preview working hours for specific month
node tests/manage-working-hours.js preview 2025 8
```

## 🔧 Core Components

### 1. WorkTimeTracker (`work-time-tracker.js`)
**Purpose**: Main engine for fetching and parsing work time data from cuco360.

**Key Features**:
- Fetches work data via POST requests to `/face2face/f2ffilter`
- Parses HTML responses using regex (jsdom caused issues with table structure)
- Extracts entry/exit times from "Detalle marcajes" column
- Calculates working minutes and remaining time
- Handles different time formats and edge cases
- Automatic retry with credential refresh on 419 errors

**Usage**:
```javascript
const WorkTimeTracker = require('./work-time-tracker');
const tracker = new WorkTimeTracker();
const workData = await tracker.fetchWorkTimeData(credentials);
```

**Data Structure**:
```javascript
{
  date: "24/07/2025",
  workingMinutes: 485,          // Current working time in minutes
  remainingMinutes: 25,         // Minutes until can leave
  presenceMinutes: 510,         // Total presence including breaks
  status: "working",            // "working", "out", "can_leave", "not_working"
  entries: ["09:18:45"],        // Entry timestamps
  exits: ["10:53:07"],          // Exit timestamps
  marcajes: "09:18:45 E 000 | 10:53:07 S 000 | 10:55:14 E 000",
  rawData: "..."                // Raw HTML response
}
```

### 2. CredentialManager (`credential-manager.js`)
**Purpose**: Handles credential storage, validation, and automatic refresh.

**Key Features**:
- Saves/loads credentials from `config.json`
- Validates credential freshness (checks for 419 errors)
- Automatic credential refresh using browser automation
- Secure token and cookie management
- Session persistence with "Recordarme" option

**Usage**:
```javascript
const CredentialManager = require('./credential-manager');
const credManager = new CredentialManager();

// Load existing credentials
const credentials = await credManager.loadCredentials();

// Auto-refresh if expired
const freshCredentials = await credManager.ensureFreshCredentials();
```

### 3. Automated Token Extractor (`automation/automated-token-extractor.js`)
**Purpose**: Browser automation for extracting fresh credentials when expired.

**Key Features**:
- Uses Playwright for headless browser automation
- Navigates to cuco360 login page
- Handles login form submission
- Extracts CSRF tokens and session cookies
- Saves credentials automatically
- Handles "Recordarme" checkbox for extended sessions

**Usage**:
```javascript
const { extractCredentials } = require('./automation/automated-token-extractor');
const credentials = await extractCredentials();
```

### 4. Working Hours Configuration (`resources/working-hours-config.js`)
**Purpose**: Defines Spanish working hour regulations and schedules.

**Available Schedules**:
- **Common**: 8.5h Mon-Thu + 6h Fri + 30min eating
- **Standard**: 8h Mon-Fri + 30min eating  
- **Intensive**: 6.5h Mon-Fri + 30min eating (August)

**Features**:
- Automatic August intensive detection
- Holiday calendar support
- Theoretical exit time calculation
- Progress tracking with visual indicators
  presence: "9h 0min", 
  entries: ["09:18"],
  exits: ["10:53", "10:55"],
  rawDetail: "09:18:45 E 000 | 10:53:07 S 000 | 10:55:14 E 000 |"
}
```

### 2. CredentialManager (`credential-manager.js`)
**Purpose**: Manages authentication credentials for the cuco360 system.

**Key Features**:
- Loads/saves credentials from `config.json`
- Validates credential format and expiration
- Provides interactive credential setup
- Integrates with automated token extraction

**Credential Format**:
```json
{
  "token": "CSRF-TOKEN-STRING",
  "cookies": "XSRF-TOKEN=...; cuco360_session=...",
  "clientCode": "your-company-client-code",
  "extractedAt": "2025-07-24T08:43:24.867Z"
}
```

### 3. Automated Token Extractor (`automation/automated-token-extractor.js`)
**Purpose**: Browser automation for credential extraction when tokens expire.

**Key Features**:
- Playwright-based browser automation
- Detects existing login sessions
- Handles "Recordarme" checkbox automatically
- Extracts fresh CSRF tokens and session cookies
- Updates default credentials in work-time-tracker.js

**Auto-Retry Integration**:
- Triggered automatically on 419 (expired token) errors
- Seamless credential refresh without user intervention
- Maintains session state across browser restarts

## 📊 Working Hours System

### Working Hours Configuration (`resources/working-hours-config.js`)
**Purpose**: Defines company working hour policies and schedules.

**Available Schedules**:

1. **Common Schedule** (default):
   - Mon-Thu: 8h 30min work + 30min eating = 9h presence
   - Friday: 6h work + 0min eating = 6h presence

2. **Standard Schedule**:
   - Mon-Fri: 8h work + 30min eating = 8h 30min presence

3. **Intensive Schedule** (August):
   - Mon-Fri: 6h 30min work + 30min eating = 7h presence
   - Auto-detected in August

**WorkingHoursManager Class**:
- Calculates theoretical exit times
- Handles day-specific rules (Friday variations)
- Auto-detects seasonal schedules (August intensive)
- Supports multiple user configurations

## 🧪 Test Scripts & Utilities

### Core Testing Scripts

#### `simple-minutes-test.js`
**Purpose**: Returns current working minutes as plain text.

**Features**:
- Auto-retry with browser automation on credential expiration
- Handles multiple entry/exit scenarios
- Calculates accurate working time from marcajes data

**Usage**:
```bash
node simple-minutes-test.js
# Output: 106
```

#### `detalle-marcajes-test.js`
**Purpose**: Extracts raw "Detalle marcajes" column data.

**Output Format**: `09:18:45 E 000 | 10:53:07 S 000 | 10:55:14 E 000 |`

#### `theoretical-exit.js`
**Purpose**: Calculates when you should leave based on working hours.

**Usage Examples**:
```bash
# Use today's actual entry time
node theoretical-exit.js

# Manual entry time  
node theoretical-exit.js 09:00

# Specific working schedule
node theoretical-exit.js 09:00 intensive
```

**Sample Output**:
```
✅ Theoretical exit calculation for today:
   Entry time: 09:18
   Exit time: 18:18
   Working set: Common Schedule
   Day: thursday
   Total presence: 9h 0min
   Work time: 8h 30min
   Eating time: 30min
   Current time: 11:04
   Remaining: 07:14 (434 minutes)
```

### Management & Configuration

#### `manage-working-hours.js`
**Purpose**: Configure and manage working hours settings.

**Commands**:
```bash
node manage-working-hours.js show           # Current configuration
node manage-working-hours.js list           # Available schedules  
node manage-working-hours.js set standard   # Change schedule
node manage-working-hours.js preview 2025 8 # Preview August
```

#### `working-summary.js`
**Purpose**: Comprehensive working status dashboard.

**Features**:
- Current working time and progress
- Theoretical exit information
- Progress bar visualization
- Integration with all core systems

**Sample Output**:
```
🕐 WORKING HOURS SUMMARY
==================================================
📊 Current Status:
   Working time today: 1h 46min (106 minutes)
   Marcajes: 09:18:45 E 000 | 10:53:07 S 000 | 10:55:14 E 000 |

🎯 Theoretical Exit:
   Entry: 09:18
   Theoretical exit: 18:18
   Working set: Common Schedule
   Required presence: 9h 0min
   Current time: 11:04
   ⏰ Time remaining: 7h 14min

📈 Progress:
   [████░░░░░░░░░░░░░░░░] 20%
```

## 🔄 Data Flow

### 1. Credential Management Flow
```
User Request → Load Config → Validate Credentials → 
  ↓ (if expired)
Browser Automation → Extract Tokens → Update Config → Retry Request
```

### 2. Work Time Calculation Flow  
```
Entry Request → Fetch HTML → Parse Marcajes → Extract Times → 
Calculate Working Minutes → Apply Working Hours Rules → Return Result
```

### 3. Theoretical Exit Flow
```
Get Entry Time → Load Working Schedule → Apply Day Rules → 
Calculate Total Presence → Add to Entry Time → Return Exit Time
```

## 🛠️ Technical Implementation Details

### HTML Parsing Strategy
**Challenge**: The cuco360 HTML structure uses CSS classes rather than standard table positions.

**Solution**: 
- Switched from jsdom to regex parsing for better reliability
- Targets specific CSS classes: `column1` (date), `column5` (marcajes)
- Handles malformed HTML and dynamic content

### Working Hours Logic
**Key Algorithms**:
- Time parsing: Converts `HH:MM:SS` to minutes since midnight
- Day detection: Uses `Date.getDay()` with proper Sunday=0 handling  
- Schedule selection: Auto-detects August + manual override support
- Exit calculation: `entryMinutes + totalPresenceMinutes`

### Error Handling & Resilience
**Strategies**:
- **419 Errors**: Auto-trigger credential refresh via browser automation
- **Network Issues**: Graceful degradation with informative error messages
- **Parse Failures**: Fallback to regex parsing when DOM parsing fails
- **Configuration Issues**: Sensible defaults with user-friendly validation

### Browser Automation Integration
**Playwright Implementation**:
- Headless browser with stealth settings
- Login detection via URL patterns and DOM elements
- Cookie and token extraction via `page.evaluate()`
- Checkbox automation for "Recordarme" functionality

## 📈 Performance & Scalability

### Optimization Strategies
- **Credential Caching**: Reuse valid tokens across requests
- **Minimal DOM Parsing**: Regex parsing for faster HTML processing
- **Smart Retry Logic**: Exponential backoff with maximum retry limits
- **Resource Cleanup**: Proper browser instance management in automation

### Scalability Considerations
- **Multi-User Support**: User-specific configuration files
- **Schedule Flexibility**: Easy addition of new working hour sets
- **Extension Points**: Modular architecture for new features
- **Platform Independence**: Core logic works across different deployment targets

## 🔐 Security & Privacy

### Security Measures
- **Local Storage**: All credentials stored locally, never transmitted to third parties
- **Token Rotation**: Automatic refresh of expired authentication tokens
- **Secure Communication**: HTTPS-only communication with cuco360
- **Minimal Permissions**: Browser automation uses minimal required permissions

### Privacy Protection
- **No External Services**: Complete client-side operation
- **Data Minimization**: Only essential data extracted and stored
- **User Control**: Full control over credential storage and deletion
- **Audit Trail**: Clear logging of authentication and data access events

## 🚀 Getting Started

### Quick Setup
1. **Install Dependencies**: `npm install` (jsdom, playwright if needed)
2. **First Run**: `node simple-minutes-test.js` (will trigger credential setup)
3. **Configure**: `node manage-working-hours.js set common`
4. **Test**: `node working-summary.js`

### Integration Examples
```javascript
// Get current working minutes
const getCurrentMinutes = require('./tests/simple-minutes-test');
const minutes = await getCurrentMinutes();

// Calculate theoretical exit
const TheoreticalExit = require('./tests/theoretical-exit');
const calculator = new TheoreticalExit();
const exitInfo = await calculator.getTodayTheoreticalExit();

// Get marcajes data
const getMarcajes = require('./tests/detalle-marcajes-test');
const marcajes = await getMarcajes();
```

## 🧪 Testing & Quality Assurance

### Test Coverage
- **Unit Tests**: Individual component functionality
- **Integration Tests**: End-to-end workflow testing  
- **Edge Case Tests**: Early/late entries, weekend handling, August detection
- **Performance Tests**: Response time and resource usage validation

### Quality Metrics
- **15 Test Cases**: All passing in theoretical-exit test suite
- **Error Coverage**: Comprehensive error handling and user feedback
- **Code Documentation**: Extensive inline documentation and examples
- **User Experience**: Clear command-line interfaces and help text

This core system provides a robust foundation for work time tracking with enterprise-level features like automated credential management, flexible working hour policies, and comprehensive testing coverage.
