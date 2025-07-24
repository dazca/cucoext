# Working Hours Management System

## Overview

This system provides comprehensive working hours management with theoretical exit time calculations, supporting multiple working schedules and automatic detection for special periods like August intensive schedules.

## 📁 File Structure

```
core/
├── resources/
│   └── working-hours-config.js    # Working hours configurations and manager
├── tests/
│   ├── theoretical-exit.js        # Calculate theoretical exit times
│   ├── manage-working-hours.js    # Configure working hours settings
│   ├── test-theoretical-exit.js   # Test suite for exit calculations
│   ├── working-summary.js         # Comprehensive working status summary
│   ├── simple-minutes-test.js     # Get current working minutes
│   └── detalle-marcajes-test.js   # Get "Detalle marcajes" column
```

## 🕐 Working Hours Sets

### 1. Common Schedule (`common`)
- **Monday-Thursday**: 8h 30min work + 30min eating = 9h presence
- **Friday**: 6h work + 0min eating = 6h presence
- *Default for most employees*

### 2. Standard Schedule (`standard`)
- **Monday-Friday**: 8h work + 30min eating = 8h 30min presence
- *Consistent daily schedule*

### 3. Intensive Schedule (`intensive`)
- **Monday-Friday**: 6h 30min work + 30min eating = 7h presence
- *Summer intensive (automatically detected in August)*

## 🚀 Quick Usage

### Calculate Theoretical Exit Time

```bash
# Use today's actual entry time from system
node theoretical-exit.js

# Manual entry time
node theoretical-exit.js 09:00

# Manual entry + specific working set
node theoretical-exit.js 09:00 intensive
```

### Get Working Status

```bash
# Current working minutes
node simple-minutes-test.js

# Detailed marcajes
node detalle-marcajes-test.js

# Complete summary
node working-summary.js
```

### Manage Configuration

```bash
# Show current configuration
node manage-working-hours.js show

# List all working hours sets
node manage-working-hours.js list

# Set working hours
node manage-working-hours.js set standard

# Preview month working hours
node manage-working-hours.js preview 2025 8
```

## 📊 Example Outputs

### Theoretical Exit Calculation
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

### Working Summary
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

## ⚙️ Features

### Auto-Detection
- **August Intensive**: Automatically switches to intensive schedule in August
- **Day-specific Rules**: Friday has different hours in common schedule
- **Real-time Data**: Fetches actual entry times from cuco360 system

### Flexible Configuration
- **Multiple Working Sets**: Support for different employee schedules
- **User Preferences**: Saved configuration per user
- **Override Options**: Manual working set selection when needed

### Integration
- **Auto-Retry**: Automatically refreshes credentials when expired
- **Browser Automation**: Seamless token extraction
- **Error Handling**: Graceful fallbacks and clear error messages

## 🧪 Testing

Run the comprehensive test suite:

```bash
node test-theoretical-exit.js
```

Tests cover:
- All working hours sets
- Edge cases (early/late starts)
- August auto-detection
- Friday special rules
- Real-world scenarios

## 🔧 Technical Details

### WorkingHoursManager Class
- Manages working hours configurations
- Handles day-specific calculations
- Supports time parsing and formatting
- Auto-detects special periods

### TheoreticalExitCalculator Class
- Calculates exit times based on entry and working set
- Integrates with actual work data from system
- Provides detailed breakdown of time requirements

### Configuration System
- JSON-based user preferences
- Runtime configuration updates
- Persistent settings storage

## 📝 Notes

- All times are handled in 24-hour format
- Calculations account for eating/break time
- System integrates with existing credential management
- Weekend detection automatically handled
- Month-based rule application (August intensive)

## 🎯 Use Cases

1. **Daily Planning**: Know exact exit time based on entry
2. **Schedule Management**: Different working sets for different periods
3. **Compliance**: Ensure required presence hours are met
4. **Progress Tracking**: Real-time working time and remaining time
5. **Flexibility**: Support for various company working hour policies
