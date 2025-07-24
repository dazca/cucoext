// Credential management system for work time tracker
const fs = require('fs');
const path = require('path');

class CredentialManager {
    constructor(configPath = null) {
        // Try multiple config paths for credential loading
        this.possiblePaths = [
            configPath,
            path.join(__dirname, 'config-local.json'),  // Preferred (gitignored)
            path.join(__dirname, 'config.json'),        // Fallback (template)
        ].filter(Boolean);
        
        this.configPath = this.findExistingConfig() || this.possiblePaths[1]; // Default to local
        this.credentials = null;
    }

    // Find the first existing config file
    findExistingConfig() {
        for (const configPath of this.possiblePaths) {
            if (fs.existsSync(configPath)) {
                return configPath;
            }
        }
        return null;
    }

    // Load credentials from file
    loadCredentials() {
        try {
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                
                // Check if we loaded template values
                if (config.token === 'your-csrf-token-here') {
                    console.warn('⚠️  Using template credentials. Create config-local.json with real values.');
                    console.warn('   See CREDENTIALS-README.md for instructions.');
                }
                
                this.credentials = config;
                return config;
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
        }
        return null;
    }

    // Save credentials to file (always save to config-local.json for security)
    saveCredentials(credentials) {
        try {
            const savePath = path.join(__dirname, 'config-local.json');
            fs.writeFileSync(savePath, JSON.stringify(credentials, null, 2));
            this.credentials = credentials;
            this.configPath = savePath;
            return true;
        } catch (error) {
            console.error('Error saving credentials:', error);
            return false;
        }
    }

    // Get credentials interactively
    async getCredentialsInteractive() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query) => new Promise(resolve => rl.question(query, resolve));

        console.log('\n🔐 Work Time Tracker - Credential Setup');
        console.log('====================================\n');

        console.log('To get your credentials:');
        console.log('1. Open your browser and go to cuco360.cucorent.com');
        console.log('2. Login and navigate to the registro de jornada page');
        console.log('3. Open Developer Tools (F12) → Network tab');
        console.log('4. Click "Obtener informe" to load work data');
        console.log('5. Find the POST request to "/face2face/f2ffilter"');
        console.log('6. Copy the required values from the request\n');

        try {
            const token = await question('Enter your CSRF Token (_token from request body): ');
            const cookies = await question('Enter your Cookies (full Cookie header): ');
            const clientCode = await question('Enter your Client Code (cod_cliente from request, usually 3-digit number): ');

            if (!token.trim()) {
                throw new Error('CSRF token is required');
            }
            if (!cookies.trim()) {
                throw new Error('Cookies are required');
            }
            if (!clientCode.trim()) {
                throw new Error('Client code is required');
            }

            const credentials = {
                token: token.trim(),
                cookies: cookies.trim(),
                clientCode: clientCode.trim()
            };

            rl.close();

            if (this.saveCredentials(credentials)) {
                console.log('\n✅ Credentials saved successfully!');
                return credentials;
            } else {
                console.log('\n❌ Failed to save credentials');
                return null;
            }
        } catch (error) {
            rl.close();
            console.error('Error getting credentials:', error);
            return null;
        }
    }

    // Get credentials (load from file or prompt for input)
    async getCredentials(force = false) {
        if (!force && this.credentials) {
            return this.credentials;
        }

        const loaded = this.loadCredentials();
        if (!force && loaded && loaded.token && loaded.cookies) {
            return loaded;
        }

        console.log('No valid credentials found. Setting up new credentials...');
        return await this.getCredentialsInteractive();
    }

    // Validate credentials format
    validateCredentials(credentials) {
        if (!credentials) return false;
        
        const required = ['token', 'cookies', 'clientCode'];
        const missing = required.filter(field => !credentials[field]);
        
        if (missing.length > 0) {
            console.error(`Missing required fields: ${missing.join(', ')}`);
            return false;
        }

        // Basic validation
        if (credentials.token.length < 10) {
            console.error('Token seems too short');
            return false;
        }

        if (!credentials.cookies.includes('XSRF-TOKEN') || !credentials.cookies.includes('cuco360_session')) {
            console.error('Cookies should include XSRF-TOKEN and cuco360_session');
            return false;
        }

        return true;
    }

    // Clear stored credentials
    clearCredentials() {
        try {
            if (fs.existsSync(this.configPath)) {
                fs.unlinkSync(this.configPath);
            }
            this.credentials = null;
            console.log('✅ Credentials cleared');
            return true;
        } catch (error) {
            console.error('Error clearing credentials:', error);
            return false;
        }
    }
}

module.exports = CredentialManager;
