# Tracking App - Dummy Route Details

## 📍 Test Route: New York City

The tracking app includes a predefined route with 12 waypoints in the New York City area for testing purposes.

```
Route Start (Times Square) ──→ 
                                 Route Goal (Upper East Side)
```

### Complete Route Waypoints

| Stop # | Latitude | Longitude | Speed | Heading | Location |
|--------|----------|-----------|-------|---------|----------|
| 1 | 40.7128 | -74.0060 | 0 mph | 45° | Times Square, NYC |
| 2 | 40.7150 | -74.0050 | 42 mph | 45° | Midtown Manhattan |
| 3 | 40.7180 | -74.0030 | 48 mph | 50° | Central Park South |
| 4 | 40.7210 | -74.0010 | 55 mph | 55° | Midtown East |
| 5 | 40.7240 | -73.9990 | 60 mph | 60° | Park Avenue |
| 6 | 40.7270 | -73.9960 | 58 mph | 65° | Upper East Side |
| 7 | 40.7300 | -73.9930 | 50 mph | 70° | Madison Avenue |
| 8 | 40.7320 | -73.9890 | 45 mph | 80° | Lexington Avenue |
| 9 | 40.7340 | -73.9850 | 40 mph | 85° | 3rd Avenue |
| 10 | 40.7360 | -73.9800 | 35 mph | 90° | East 72nd Street |
| 11 | 40.7370 | -73.9750 | 30 mph | 95° | East 79th Street |
| 12 | 40.7380 | -73.9700 | 25 mph | 100° | Gracie Mansion Area |

### Visual Route Map

```
                    UPPER EAST SIDE
                         ●12  ●11
                        /  \
                       /    \
                      ●10    ●9
                     /        \
                    ●8        ●7
                   /          \
                  ●6          ●5
                 /            |
                ●4            ●4
               /              \
              ●3              ●3
             /                \
            ●2                ●2
           /                  |
 TIMES    ●1───────────────────────→
 SQUARE   40.7128, -74.0060        40.7380, -73.9700 (Gracie Mansion)
```

### Route Statistics

- **Total Distance**: ~3.5 miles (estimated)
- **Total Duration**: ~24 seconds per loop (12 waypoints × 2 seconds each)
- **Speed Range**: 0-60 mph
- **Heading Range**: 45° to 100°
- **Auto-Restart**: Yes (loops continuously while tracking)

### Tracking Behavior Timeline

When you click "Start Tracking", here's what happens:

```
T=0s   → Vehicle at Times Square (Stop #1) - Speed: 0 mph
T=2s   → Move to Stop #2 - Speed: 42 mph
T=4s   → Move to Stop #3 - Speed: 48 mph
T=6s   → Move to Stop #4 - Speed: 55 mph
T=8s   → Move to Stop #5 - Speed: 60 mph (peak speed)
T=10s  → Move to Stop #6 - Speed: 58 mph
T=12s  → Move to Stop #7 - Speed: 50 mph (deceleration)
T=14s  → Move to Stop #8 - Speed: 45 mph
T=16s  → Move to Stop #9 - Speed: 40 mph
T=18s  → Move to Stop #10 - Speed: 35 mph
T=20s  → Move to Stop #11 - Speed: 30 mph
T=22s  → Move to Stop #12 - Speed: 25 mph
T=24s  → ┌─ Route completes, loop restarts
         └→ Back to Stop #1
```

---

## 🎨 On-Map Display

When tracking:
1. **Blue Polyline** - The entire route is shown as a blue line (opacity 70%)
2. **Vehicle Marker** - Blue arrow icon that rotates based on heading
3. **Auto-Center** - Map automatically centers on vehicle position
4. **Real-Time Updates** - Marker moves every 2 seconds

---

## 🔌 Integration with Backend

Currently, the route is hardcoded for testing. To integrate with your Single R backend:

### Current State (Dummy)
```typescript
// In tracking.service.ts
private dummyRoute: VehicleLocation[] = [
  { latitude: 40.7128, longitude: -74.0060, ... },
  // ... more hardcoded locations
];
```

### To Connect to Backend API
```typescript
// Suggested implementation pattern:
startRouteTracking(): void {
  this.http.get('/api/route/tracking-route').subscribe((route) => {
    this.dummyRoute = route;  // Get from backend
    // ... start tracking with backend data
  });
}
```

---

## 🚗 Vehicle Marker Details

The vehicle marker uses an SVG icon:
- **Shape**: Blue circle with white triangle (arrow pointing up)
- **Rotation**: Updates based on heading angle
- **Size**: 40x40 pixels
- **Auto-Rotation**: Yes - rotates to show direction of travel

---

## 📱 Responsive Testing

The app is responsive and works on:
- Desktop browsers (1024px+)
- Tablets (768px - 1024px)
- Mobile phones (320px - 768px)
- All Ionic-supported devices

---

# ⚡ Quick Reference

### To Test Different Routes
Edit the `dummyRoute` array in `src/app/services/tracking.service.ts`

### To Change Update Speed
Modify the interval value in `startRouteTracking()`:
```typescript
this.trackingInterval = interval(2000)  // milliseconds
```

### To Use Real Backend Data
Replace the hardcoded route with API calls in `startRouteTracking()`

---

**Status**: ✅ Ready for Testing
