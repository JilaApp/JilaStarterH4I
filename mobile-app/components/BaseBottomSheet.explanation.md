# How BaseBottomSheet Works

## Overview
`BaseBottomSheet` is a wrapper around `@gorhom/bottom-sheet` that simplifies the API and provides sensible defaults.

## How It Translates Features

### 1. **Height Prop → Snap Points**
```typescript
// User provides simple height
height="70%"
// OR multiple heights
height={["40%", "70%"]}

// BaseBottomSheet converts it to snapPoints array
const snapPoints = Array.isArray(height) ? height : [height];
// Result: ["70%"] or ["40%", "70%"]
```

**Why?** The underlying library requires `snapPoints` array. We abstract this so users don't need to think about "snap points" - they just think "height".

---

### 2. **Auto-Expand on Mount**
```typescript
useEffect(() => {
  bottomSheetRef.current?.expand();
}, []);
```

**What it does:** Automatically opens the bottom sheet when component mounts.

**Why?** Most bottom sheets should open immediately. Without this, you'd need to manually call `expand()` every time.

---

### 3. **Ref Management**
```typescript
const bottomSheetRef = useRef<BottomSheet>(null);
```

**What it does:** Creates an internal ref to control the bottom sheet.

**Why?** The underlying library needs a ref to control the sheet (expand, collapse, etc.). We handle this internally so users don't need to manage refs.

---

### 4. **Default Styling**
```typescript
backgroundStyle={{
  backgroundColor: backgroundColor || colors.white[400],
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  ...style,
}}
```

**What it does:** Provides default white background and rounded corners.

**Why?** Consistent styling across all bottom sheets without repeating code.

---

### 5. **Scrollable Content**
```typescript
<BottomSheetScrollView
  contentContainerStyle={{
    flex: 1,
    padding,
  }}
>
  {children}
</BottomSheetScrollView>
```

**What it does:** Wraps content in a scrollable view that works with bottom sheet gestures.

**Why?** The underlying library requires `BottomSheetScrollView` (not regular `ScrollView`) to properly handle gestures. We handle this automatically.

---

### 6. **Sensible Defaults**
```typescript
// Hardcoded defaults that work for most cases
index={0}                           // Start at first snap point
enablePanDownToClose={true}         // Allow closing by dragging
enableOverDrag={false}              // Prevent dragging beyond max
enableContentPanningGesture={true}  // Allow scrolling
maxDynamicContentSize={...}         // Limit max height
```

**Why?** These are the most common settings. Users only override when needed.

---

## Feature Translation Map

| User-Friendly Prop | → | Underlying Library Feature |
|-------------------|---|---------------------------|
| `height="70%"` | → | `snapPoints={["70%"]}` |
| `padding={20}` | → | `contentContainerStyle={{ padding: 20 }}` |
| `backgroundColor="red"` | → | `backgroundStyle={{ backgroundColor: "red" }}` |
| `maxHeight={400}` | → | `maxDynamicContentSize={400}` |
| Auto-expand | → | `useEffect(() => ref.current?.expand())` |
| Scrollable content | → | `<BottomSheetScrollView>` wrapper |

---

## Example: Before vs After

### ❌ Without BaseBottomSheet (Complex)
```typescript
const bottomSheetRef = useRef<BottomSheet>(null);

useEffect(() => {
  bottomSheetRef.current?.expand();
}, []);

return (
  <BottomSheet
    ref={bottomSheetRef}
    index={0}
    snapPoints={['70%']}
    enablePanDownToClose={true}
    enableOverDrag={false}
    maxDynamicContentSize={sizes.screen.height * 0.6}
    backgroundStyle={{
      backgroundColor: colors.white[400],
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }}
    enableContentPanningGesture={true}
  >
    <BottomSheetScrollView
      contentContainerStyle={{
        flex: 1,
        padding: 20,
      }}
    >
      {children}
    </BottomSheetScrollView>
  </BottomSheet>
);
```

### ✅ With BaseBottomSheet (Simple)
```typescript
return (
  <BaseBottomSheet height="70%" maxHeight={sizes.screen.height * 0.6}>
    {children}
  </BaseBottomSheet>
);
```

---

## How It Works Internally

1. **Receives simple props** from user (height, padding, etc.)
2. **Converts props** to library format (snapPoints, styles, etc.)
3. **Sets up ref** and auto-expand logic
4. **Wraps children** in BottomSheetScrollView
5. **Passes everything** to underlying BottomSheet component

The abstraction handles all the complexity so users can focus on their content!

