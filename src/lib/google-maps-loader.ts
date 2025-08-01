// Google Maps utility for preventing multiple script loads
interface GoogleMapsLoader {
  loadScript: (apiKey: string) => Promise<void>;
  isLoaded: () => boolean;
  isLoading: () => boolean;
}

declare global {
  interface Window {
    google: any;
    googleMapsLoader?: GoogleMapsLoader;
    googleMapsScriptLoading?: boolean;
    googleMapsScriptLoaded?: boolean;
    googleMapsLoadPromise?: Promise<void>;
  }
}

class GoogleMapsScriptLoader implements GoogleMapsLoader {
  private loadPromise: Promise<void> | null = null;

  loadScript(apiKey: string): Promise<void> {
    // Return existing promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Return resolved promise if already loaded
    if (this.isLoaded()) {
      return Promise.resolve();
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      // If script exists but not loaded, wait for it
      this.loadPromise = new Promise((resolve, reject) => {
        const checkGoogleMaps = () => {
          if (this.isLoaded()) {
            resolve();
          } else {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (!this.isLoaded()) {
            reject(new Error('Google Maps script load timeout'));
          }
        }, 10000);
      });
      return this.loadPromise;
    }

    // Create and load new script
    this.loadPromise = new Promise((resolve, reject) => {
      window.googleMapsScriptLoading = true;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        window.googleMapsScriptLoading = false;
        window.googleMapsScriptLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        window.googleMapsScriptLoading = false;
        reject(new Error('Failed to load Google Maps script'));
      };
      
      document.head.appendChild(script);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isLoaded()) {
          window.googleMapsScriptLoading = false;
          reject(new Error('Google Maps script load timeout'));
        }
      }, 10000);
    });

    return this.loadPromise;
  }

  isLoaded(): boolean {
    return !!(window.google && window.google.maps);
  }

  isLoading(): boolean {
    return !!window.googleMapsScriptLoading;
  }
}

// Create singleton instance
const googleMapsLoader = new GoogleMapsScriptLoader();

// Make it globally available
if (typeof window !== 'undefined') {
  window.googleMapsLoader = googleMapsLoader;
}

export default googleMapsLoader;
