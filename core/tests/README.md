# Core Testing Suite & Utilities

This directory contains comprehensive tests, utilities, and management scripts for the CucoExt core functionality.

## 📋 Available Scripts

### 🔧 Utility Scripts

#### `simple-minutes-test.js`
**Purpose**: Get current working minutes with automatic credential refresh.
```bash
node simple-minutes-test.js
# Output: 485 minutes (8h 5min) - auto-retries on credential expiration
```

#### `working-summary.js`
**Purpose**: Comprehensive status dashboard with visual progress indicators.
```bash
node working-summary.js
# Output: Full dashboard with semaphore, progress bar, and detailed status
```

#### `detalle-marcajes-test.js`
**Purpose**: Extract raw "Detalle marcajes" column data.
```bash
node detalle-marcajes-test.js
# Output: 09:18:45 E 000 | 10:53:07 S 000 | 10:55:14 E 000
```

#### `theoretical-exit.js`
**Purpose**: Calculate theoretical exit times based on entry time and schedule.
```bash
node theoretical-exit.js 09:00 standard
# Output: Entry: 09:00 → Exit: 17:30 (Standard Schedule)
```

#### `manage-working-hours.js`
**Purpose**: Configure and preview working hour schedules.
```bash
# View current configuration
node manage-working-hours.js show

# Change schedule
node manage-working-hours.js set intensive

# Preview specific month
node manage-working-hours.js preview 2025 8
```

### 🧪 Test Scripts

#### `unit-tests.js`
**Purpose**: Unit tests for individual components and functions.
```bash
npm test
# Or: node unit-tests.js
```

**Test Coverage**:
- Constructor initialization
- Time parsing functions (parseTimeToMinutes, formatMinutesToTime)
- Timestamp parsing from detail columns
- Date range generation
- Work time calculations with mock data
- HTML regex parsing fallback

#### `integration-tests.js`
**Purpose**: Integration tests for component interactions.
```bash
npm run test:integration
# Or: node integration-tests.js
```

**Test Coverage**:
- Credential management (save, load, validate)
- API request formation
- End-to-end workflow with mock HTML data
- Error handling and edge cases
- Time calculation edge cases (exactly 9 hours, multiple entries/exits)

#### `manual-test.js`
**Purpose**: Interactive testing script for real-world validation.
```bash
npm run test:manual
# Or: node manual-test.js
```

**Interactive Features**:
- Interactive credential setup
- Real API communication testing
- HTML parsing fallback testing
- Complete workflow validation
- User-guided testing process

## 📊 Sample Outputs

### Working Summary Dashboard
```
🎯 CucoExt Work Time Summary
==========================
📅 Date: 24/07/2025
🔵 Status: Working... 25min left

⏰ Times:
   Entry: 09:18:45
   Working: 8h 5min
   Presence: 8h 30min
   Remaining: 25min

📊 Progress: [████████████████████████████████████████████████████▓▓▓▓] 95%

🚦 Semaphore: 🔵 (Working - time remaining)
```

### Theoretical Exit Calculator
```
📋 Theoretical Exit Times
========================
Entry Time: 09:00
Schedule: Standard (8h daily)

⏰ Exit Times:
   Eating break: 13:00-13:30
   Theoretical exit: 17:30
   Total working: 8h 0min
   Total presence: 8h 30min
```

## 🔧 Requirements

Install dependencies:
```bash
npm install
```

**Core Dependencies**:
- `playwright` - Browser automation for credential extraction
- `node-fetch` - HTTP requests (Node.js < 18)
- `jsdom` - HTML parsing (optional fallback)

## 🎯 Test Coverage

### ✅ Fully Tested Components
- ✅ Time parsing and formatting functions
- ✅ Work status calculation (working, out, can_leave, not_working)
- ✅ Presence time tracking with breaks
- ✅ HTML regex parsing with edge cases
- ✅ Credential validation and auto-refresh
- ✅ Working hours configuration management
- ✅ Spanish working hour regulation compliance
- ✅ August intensive schedule auto-detection
- ✅ Theoretical exit time calculations
- ✅ Error handling and retry mechanisms

### 🔄 Integration Testing
- ✅ End-to-end workflows with real API data
- ✅ Credential expiration and automatic refresh
- ✅ Multiple working hour schedule configurations
- ✅ Edge cases (no data, malformed responses, network errors)
- ✅ Cross-platform compatibility (Windows, macOS, Linux)

## 🐛 Troubleshooting

### Common Issues

#### Credential Expiration (419 Errors)
```bash
# Manual credential refresh
node automation/automated-token-extractor.js

# Test with fresh credentials
node simple-minutes-test.js
```

#### Network Connection Issues
```bash
# Test basic connectivity
node tests/test-network-connectivity.js

# Validate API endpoints
node tests/test-api-endpoints.js
```

#### Parsing Issues
```bash
# Test HTML parsing with current data
node tests/test-html-parsing.js

# Debug with raw output
DEBUG=true node simple-minutes-test.js
```

### Debug Mode
Enable detailed logging for any script:
```bash
DEBUG=true node <script-name>.js
```

## 🚀 Development

### Adding New Tests
1. Create test file in `/tests/` directory
2. Follow naming convention: `test-<feature>.js`
3. Include both unit and integration test cases
4. Update this README with new test documentation

### Test Data Management
Mock data is stored in `/tests/mock-data/` for consistent testing across environments.

### Continuous Integration
All tests are designed to run in CI/CD environments with proper exit codes and structured output.
- ✅ 9-hour completion detection
- ✅ HTML content parsing (DOM and regex fallback)

### ✅ Business Logic
- ✅ 8h30min presence requirement
- ✅ 9h from entry requirement  
- ✅ Multiple entry/exit handling
- ✅ Current time vs exit time calculations
- ✅ Date range generation for API requests

### ✅ Error Handling
- ✅ Invalid credentials
- ✅ Network errors
- ✅ Missing data scenarios
- ✅ Malformed HTML content

### ✅ Platform Integration
- ✅ Credential management system
- ✅ File-based configuration storage
- ✅ Cross-platform compatibility

## Running All Tests

```bash
# Run all automated tests
npm run test:all

# Run tests individually
npm test                 # Unit tests only
npm run test:integration # Integration tests only
npm run test:manual      # Interactive manual testing
```

## Test Results

All tests should pass with this output:
- **Unit Tests:** 38 passed, 0 failed
- **Integration Tests:** 20 passed, 0 failed

## Understanding Test Output

### Unit Test Indicators
- ✅ Test passed
- ❌ Test failed
- 📋 Test group/category

### Integration Test Indicators
- ✅ Assertion passed
- ❌ Assertion failed
- ℹ️ Information/debug output

### Manual Test Flow
1. **Credential Setup** - Interactive credential input and validation
2. **API Testing** - Real work time data retrieval
3. **Calculation Testing** - Time calculation validation
4. **Status Testing** - Work status determination
5. **Fallback Testing** - HTML parsing without API

## Key Test Scenarios

### Normal Working Day
- Entry: 09:00, Currently: 14:00 → Status: working
- Entry: 09:00, Exit: 18:00, Presence: 8h30min → Status: can_leave

### Edge Cases
- No entries → Status: not_working
- Multiple entries/exits → Correct calculation
- Exactly 9 hours → exactNineHours flag set
- Out for lunch → Status: out_of_office

### Error Scenarios
- Invalid credentials → Proper error handling
- Network issues → Graceful fallback
- Malformed data → Default values

## Credential Management Testing

The test suite includes validation for:
- ✅ Token format and length validation
- ✅ Cookie string format validation
- ✅ Client code validation
- ✅ Interactive credential input
- ✅ File-based credential storage
- ✅ Credential clearing functionality

## Next Steps

After testing core functionality:
1. Install Chrome extension from `../chrome-extension/`
2. Install Firefox extension from `../firefox-extension/`
3. Run Windows taskbar app from `../taskbar-app/`

Each platform extension uses this tested core module to ensure consistent behavior across all platforms.
