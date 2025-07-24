# Client Code Configuration Guide

The client code (`cod_cliente`) is a unique identifier for your company in the cuco360 system. This guide explains how the system automatically detects it and how to configure it manually if needed.

## Automatic Detection

The extensions automatically try to detect your client code using multiple methods:

### 1. **Form Data Detection** (Most Reliable)
- Searches for hidden input fields with names like `cod_cliente`, `cliente`, or `client`
- Extracts from existing form submissions on the page

### 2. **URL Parameters**
- Looks for `cod_cliente`, `client_code`, or `cliente` in the current page URL
- Useful when navigating directly with parameters

### 3. **JavaScript Variables**
- Checks `window.Laravel.clientCode` if available
- Common in Laravel-based applications like cuco360

### 4. **Form Data Mining**
- Scans all forms on the page for client-related fields
- Extracts from any forms that contain `cod_cliente` parameter

### 5. **Data Attributes**
- Searches for HTML elements with `data-client`, `data-cliente`, or `data-cod-cliente` attributes

### 6. **Script Content Analysis**
- Parses inline JavaScript for client code patterns
- Looks for JSON objects containing client information

## Common Client Codes

While codes vary by company, some examples include:
- Sequential company numbers (3-digit codes like 123, 456, 789)
- Zero-padded sequences (001, 002, etc.)
- Various 3-digit combinations assigned by the cuco360 system

## Manual Configuration

If automatic detection fails, you can manually set the client code:

### Browser Extensions
1. Open the extension popup
2. Go to the "Credentials" tab
3. Enter your client code in the "Client Code" field
4. Save the credentials

### Core System
Edit your `config-local.json` file:
```json
{
  "token": "your-token",
  "cookies": "your-cookies",
  "clientCode": "your-actual-client-code",
  "extractedAt": "..."
}
```

## Finding Your Client Code

If you need to find your company's client code manually:

### Method 1: Browser Developer Tools
1. Log into cuco360.cucorent.com
2. Navigate to "Registro de Jornada" (face2face)
3. Open Developer Tools (F12)
4. Go to Network tab
5. Click "Obtener informe"
6. Find the POST request to `/face2face/f2ffilter`
7. Look for `cod_cliente` in the request body

### Method 2: Page Source
1. On the face2face page, right-click and "View Page Source"
2. Search for `cod_cliente` in the source code
3. The value will typically be in a hidden input or JavaScript variable

### Method 3: Form Inspection
1. On the face2face page, right-click on the form
2. Select "Inspect Element"
3. Look for hidden input fields with name `cod_cliente`

## Troubleshooting

### Wrong Client Code Symptoms
- API requests return "Unauthorized" or "Forbidden" errors
- No data appears after clicking "Obtener informe"
- Extension shows "No work data found"

### Solutions
1. **Verify the code**: Use browser dev tools to confirm the correct value
2. **Clear storage**: Reset extension and re-extract credentials
3. **Manual override**: Set the code manually in extension settings
4. **Check company policy**: Some companies use different codes for different departments

## Technical Details

The client code is sent as `cod_cliente` parameter in all API requests:
```
POST /face2face/f2ffilter
Content-Type: application/x-www-form-urlencoded

_token=...&cod_cliente=YOUR_CODE&rango=...&order=nom_empleado&type=empleado&document=pantalla&orientation=v
```

## Security Notes

- Client codes are not sensitive security credentials
- They're company identifiers, not authentication tokens
- Safe to share within your organization
- Different from tokens and cookies which should remain private
