# 🚨 Runtime Error Troubleshooting Guide

## Common Runtime Error: Turbopack Module Resolution

### Error Message:
```
Error: Cannot find module '../chunks/ssr/[turbopack]_runtime.js'
```

## Quick Fix (Recommended)

### Step 1: Stop All Node Processes
```bash
# Windows (PowerShell)
taskkill /f /im node.exe

# Mac/Linux
killall node
```

### Step 2: Clear Build Cache
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force .next

# Mac/Linux
rm -rf .next
```

### Step 3: Start Without Turbopack
```bash
npm run dev:safe
```

## Alternative Solutions

### Option 1: Use Standard Development Mode
```bash
# Instead of: npm run dev
# Use:
npm run dev:safe
```

### Option 2: Complete Cache Clear
```bash
# Stop all processes
taskkill /f /im node.exe

# Clear all caches
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache
npm cache clean --force

# Restart
npm run dev:safe
```

### Option 3: Node Modules Reinstall (Nuclear Option)
```bash
# Only if other methods fail
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev:safe
```

## Root Causes

### 1. Turbopack Cache Corruption
- **Cause:** Build cache becomes corrupted
- **Solution:** Clear `.next` directory
- **Prevention:** Use `dev:safe` script

### 2. Port Conflicts
- **Cause:** Multiple Node processes running
- **Solution:** Kill all Node processes before restart
- **Prevention:** Always stop server before restart

### 3. Module Resolution Issues
- **Cause:** Next.js 15 with Turbopack beta conflicts
- **Solution:** Use standard webpack mode
- **Prevention:** Use stable build tools in production

## Script Commands Added

### Development Scripts
```json
{
  "dev": "next dev --turbopack",      // Fast but may have issues
  "dev:safe": "next dev",             // Stable webpack mode
  "build": "next build",
  "start": "next start"
}
```

### Usage
```bash
# Fast development (Turbopack)
npm run dev

# Safe development (Webpack)
npm run dev:safe

# Production build
npm run build
npm run start
```

## Prevention Tips

### 1. Always Stop Before Restart
```bash
# Stop current server (Ctrl+C)
# Then restart with:
npm run dev:safe
```

### 2. Use Safe Mode for Important Work
```bash
# When working on critical features
npm run dev:safe
```

### 3. Clear Cache Weekly
```bash
# Weekly maintenance
Remove-Item -Recurse -Force .next
npm run dev:safe
```

## When to Use Each Mode

### Use `npm run dev` (Turbopack) When:
- ✅ Rapid prototyping
- ✅ Testing new features
- ✅ Development environment
- ✅ Fast iteration needed

### Use `npm run dev:safe` (Webpack) When:
- ✅ Production-like testing
- ✅ Debugging build issues
- ✅ Stable development needed
- ✅ CI/CD pipeline testing
- ✅ Demo preparations

## Google Maps Integration Status

### ✅ Current Status: Working
- Google Maps picker: Fully functional
- Location selection: Working correctly
- Form integration: Complete
- Error handling: Implemented

### Testing Steps
1. **Start Safe Mode:** `npm run dev:safe`
2. **Navigate to:** http://localhost:3000/report-issue
3. **Test Google Maps:** Click "📍 Use Map" button
4. **Verify Features:** Location search, GPS, marker dragging

## Production Deployment

### Build Configuration
```bash
# For production builds, always use:
npm run build
npm run start
```

### Environment Variables Required
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
MONGODB_URI=your_mongodb_connection
RAZORPAY_KEY_ID=your_razorpay_key
# ... other variables
```

## Support Contacts

### Technical Issues
- **Development Errors:** Use `npm run dev:safe`
- **Build Errors:** Clear cache and rebuild
- **Module Errors:** Reinstall dependencies

### Google Maps Issues
- **API Key:** Check Google Cloud Console
- **Billing:** Ensure billing is enabled
- **Restrictions:** Verify domain whitelist

---

**Quick Recovery Command:**
```bash
taskkill /f /im node.exe && Remove-Item -Recurse -Force .next && npm run dev:safe
```
