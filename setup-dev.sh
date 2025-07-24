#!/bin/bash
# Setup script for CucoExt development

echo "🚀 Setting up CucoExt development environment..."

# Create config-local.json if it doesn't exist
if [ ! -f "core/config-local.json" ]; then
    echo "📋 Creating config-local.json from template..."
    cp core/config.json core/config-local.json
    echo "✅ Created core/config-local.json"
    echo "⚠️  Please edit core/config-local.json with your real credentials"
else
    echo "✅ config-local.json already exists"
fi

# Check if credentials are still template values
if grep -q "your-csrf-token-here" core/config-local.json 2>/dev/null; then
    echo ""
    echo "⚠️  WARNING: config-local.json still contains template values!"
    echo "   Please update it with real credentials from the browser extension"
    echo "   See CREDENTIALS-README.md for instructions"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Edit core/config-local.json with real credentials"
echo "2. Use browser extension to extract credentials automatically"
echo "3. Run tests: npm test (in core/ directory)"
echo ""
echo "📚 See CREDENTIALS-README.md for detailed instructions"
