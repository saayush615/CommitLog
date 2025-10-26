# Frontend Notes

## Note 1: Project Setup & Configuration
### Vite Configuration
```js
// [vite.config.js]

export default defineConfig({
  plugins: [react(), tailwindcss()], // Added tailwind plugin
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Enables @/components imports
    },
  },
})
```
#### Environment Variables
```env
VITE_API_URL=http://localhost:3000
```
> **Note**: Vite requires `VITE_` prefix for environment variables to be accessible in frontend. `import.meta.env.VITE_API_URL`

---

## Note 2: CSS 
#### Design System Variables (:root)
```css
:root {
  color: #6EEB83;           /* Neon green - your brand color */
  background-color: #000000; /* Terminal black background */
  --radius: 0.625rem;       /* Consistent border radius (10px) */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
```
The extensive CSS custom properties (`--background`, `--foreground`, etc.) is because of shadcn **shadcn/ui**. These variables enable:

- Consistent theming across components
- Easy theme switching (light/dark mode)
- Component reusability

#### Dark Mode Support
```css
.dark {
  --background: oklch(0.145 0 0);  /* Dark background */
  --foreground: oklch(0.985 0 0);  /* Light text */
}
```

#### Rich Text Editor Styling(Tiptap -> using prosemirror underneath)
```css
.ProseMirror {
  white-space: pre-wrap;
}
```
- **Preserve whitespace**: Spaces, tabs, and line breaks in your text are kept as they are (like with `pre`).
- **Wrap lines**: If a line is too long for its container, it will wrap onto the next line (like with normal).

#### Base Layer Styling
`@layer base` is a Tailwind CSS directive that creates a specific CSS layer for base styles - fundamental styling that affects raw HTML elements globally.
```css
@layer base {
  h1 { @apply text-2xl; }     /* ALL h1 elements get this styling */
  code { @apply bg-gray-800; } /* ALL code elements get this styling */
}
```
_Rich Text Editor Gets Affected_
Tiptap editor uses ProseMirror, which renders actual HTML elements:
```html
<!-- When you type in Tiptap editor, it creates real HTML -->
<div class="ProseMirror">
  <h1>My Heading</h1>          <!-- This h1 gets @layer base styling! -->
  <p>Some text with <code>code</code></p>  <!-- code gets base styling! -->
  <blockquote>A quote</blockquote>         <!-- blockquote gets base styling! -->
</div>
```
```css
@layer base {
  h1 { @apply text-2xl; }     /* ← This affects ALL h1 elements */
  code { @apply bg-gray-800 text-pink-300; } /* ← This affects ALL code elements */
}
```
**Result**: When you type `# Heading` in Tiptap → it creates `<h1>Heading</h1>` → your base styles apply automatically! 

_Scoped Base Styles (Better Approach)_
```css
@layer base {
  /* Scope styles to only affect editor content */
  .ProseMirror h1 { @apply text-2xl font-bold text-neon; }
  .ProseMirror h2 { @apply text-xl font-semibold; }
  .ProseMirror code { @apply bg-gray-800 text-pink-300; }
  
  /* This won't affect h1 elements outside the editor */
}
```
_Conditional base style_
```css
@layer base {
  /* Only apply in dark mode */
  .dark h1 { @apply text-white; }
  .dark code { @apply bg-gray-900; }
  
  /* Only apply in editor */
  .prose h1 { @apply text-4xl; }
  .prose code { @apply text-sm; }
}
```
_@theme - Modern CSS Feature_
@theme is a Tailwind CSS v4.0+ feature (currently in beta) that defines design tokens as CSS variables:
```css
/* @theme = Global design tokens */
@theme {
  --color-neon: #6EEB83;
}

/* @theme inline = Calculated/derived values */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```
**What This Does**:
- Creates Tailwind utilities: `bg-neon`, `text-neon`, `border-neon`
- Makes variables available: Use `var(--color-neon)` anywhere
- Enables calculations: Dynamic radius values based on base radius

> **Imp Note**: Tailwind organizes CSS into 3 layers with specific precedence:
> ```css
> /* Layer Priority (lowest to highest) */
> @layer base;       /* 1. HTML element defaults */
> @layer components; /* 2. Reusable component classes */
> @layer utilities;  /* 3. Utility classes (highest priority) */
> ```

---

## Note 3: HTTP Client - Fetch vs Axios
### Native Fetch API
**API** stands for **Application Programming Interface**. It’s a set of rules and tools that lets different software programs communicate with each other. In web development, APIs often let your app talk to a server to get or send data.

**Fetch** is a _built-in_ JavaScript function for making HTTP requests (like GET, POST, etc.) from the browser. It lets you request data from APIs or send data to them. For example, you can use fetch to get user info from a server or submit a form.
```js
// GET Request with Fetch
// Using .then() [Promise-based approach]
fetch(`${import.meta.env.VITE_API_URL}/blogs`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();  // fetch api method to convert json response -> js object.
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Using async/await [Async/await approach]
async function fetchBlogs() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// POST Request with Fetch
async function signupUser(userData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
      method: 'POST',  // 'PUT' or 'Delete'
      headers: { // headers object lets you specify extra information (metadata) about the request., Think of headers as labeled envelopes for your data—telling the server how to interpret what you’re sending.

        'Content-Type': 'application/json',  // means you’re sending data as JSON (JavaScript Object Notation)
      },
      credentials: 'include',  // always send credentials (like cookies) with the request, even for cross-origin requests.
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}
```
- JSON is always a string (text), following strict syntax rules. ex: {"name": "Alice","age": 30}
- JavaScript objects are actual objects in memory, used directly in code. ex: const person = {name: "Alice",age: 30}
> - To convert JSON to a JS object:
> `JSON.parse(jsonString)`
> - To convert a JS object to JSON:
> `JSON.stringify(jsObject)`

#### Axios Library
**Third-party library** that simplifies HTTP requests with better error handling and request/response interceptors.
```js
import axios from 'axios';

// GET Request with Axios
// Using .then()
axios.get(`${import.meta.env.VITE_API_URL}/blogs`)
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error.response?.data || error.message));

// Using async/await
async function fetchBlogs() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// POST Request with Axios
async function signupUser(userData) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
}

// File Upload with Axios (FormData)
async function uploadBlogWithImage(blogData, imageFile) {
  try {
    //  ... code
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/blog/create`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data', // Axios sets this automatically for FormData
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data);
    throw error;
  }
}
```

---

## Note 4: Small & Random mistakes

#### Mistake 1:
```js
// pages/Home.jsx
useEffect(async () => {  // ❌ WRONG!
  setLoading(true);
  try {
    const blogs = await axios.get(`${import.meta.env.VITE_API_URL}/blog/read`);
    console.log(blogs);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
},[])
```
_Why This Is Wrong_:
useEffect expects a function that returns either:
- Nothing (undefined)
- A cleanup function
> But async functions ALWAYS return a Promise, even if you don't explicitly return anything. Hooks have specific rules about what they can return

---

## Note 5: JS topics
#### Date and Time
_Overview_

- The Date object represents a point in time as milliseconds since the Unix epoch 1970-01-01T00:00:00Z.
- Internally it's an integer number of milliseconds; formatting/parsing and timezone display are separate concerns.

_Creating dates_

- **new Date()** — now
- **new Date(value)** — from milliseconds since epoch
- **new Date(dateString)** — parsed string (implementation-dependent; prefer ISO 8601)
- **new Date(year, monthIndex, day, hours, minutes, seconds, ms)** — local time (monthIndex is 0–11)

_Important static functions_

- **Date.now()** — returns current time in milliseconds (number)
  - Example: const ms = Date.now(); // ms since epoch
- **Date.parse(string)** — returns milliseconds or NaN (like new Date(string).getTime())
- **Date.UTC(year, monthIndex, ...)** — returns ms for a UTC date

_Common instance methods_

- **getTime()** — ms since epoch (same as Number(date))
- **getFullYear()**, **getMonth()** (0–11), **getDate()** (1–31)
- getHours(), getMinutes(), getSeconds(), getMilliseconds()
- getUTCFullYear(), getUTCMonth(), ... — UTC equivalents
- setTime(ms), setFullYear(...), setMonth(...), ... — mutators

_Formatting / serialization_

- date.toISOString() — ISO 8601 in UTC (recommended for network/storage)
- date.toUTCString(), date.toString() — human readable
- date.toLocaleString()/**toLocaleDateString()**/toLocaleTimeString(options) — localized output

_Reference for parsing/formatting safety_

- Use ISO 8601 with timezone when possible: 'YYYY-MM-DDTHH:mm:ss.sssZ'
- For human-friendly output, prefer toLocaleDateString with options.

#### Arrow functions

_Arrow functions have two body styles_:

- **Concise body** (no { }) — the single expression after => is **implicitly returned**.
- **Block body** ({ }) — you get a statement block and **must use return to return a value**; otherwise the function returns undefined.

_Parameter parentheses_:

- Single parameter: you may omit parentheses: `x => x + 1`
- Zero or multiple parameters: use parentheses: `() => …, (a, b) => …`
- Returning an object literal: wrap the object in parentheses in a concise body: `() => ({ a: 1 })` (otherwise {} is parsed as a block).

_Example:_

```js
// concise body -> implicit return
const add = (a, b) => a + b;

// concise body returning an object -> need parentheses
const makeObj = () => ({ ok: true });

// block body -> explicit return required
const addBlock = (a, b) => {
    return a + b;
};

// block body for side-effects (no return needed)
const handleCardClick = () => {
    navigate(`/blog/${blogId}`); // this is fine — it's a side effect
};
```

_Points to remember:_

- If you use { } and forget `return`, the function returns `undefined` (your original confusion).
- If you want to both do side effects and return a value, use the block form and `return`.
- Use concise form when the function is a **single expression** and you want to return it.
- Use block form when you need **multiple statements**, **side effects**, **control flow**, or to **explicitly `return`**.

#### `scrollIntoView()` Method
The `scrollIntoView()` method smoothly scrolls the webpage so that a specific element becomes visible in the viewport.

What it does:
- **Finds the element**: Locates the DOM element referenced by commentsRef
- **Calculates position**: Determines where to scroll to make the element visible
- **Animates scroll**: Smoothly moves the page to that position

> [Read this](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) for better understanding

#### Optional Chaining (?.)
**What it does**: Safely accesses nested object properties without throwing errors if intermediate values are null or undefined.

> Syntax: `object?.property` or `array?.[index]` or `function?.()`

**Key Points**:

- Returns `undefined` instead of throwing an error
- Short-circuits evaluation (stops at first `null`/`undefined`)
- Works with properties, arrays, and function calls
- Cleaner than manual null checks

_Examples from Your Code_:
```jsx
// ❌ Without optional chaining - Risky!
const errorMessage = error.response.data.error; 
// ☠️ Throws error if response or data is undefined

// ✅ With optional chaining - Safe!
const errorMessage = error.response?.data?.error || "Signup failed.";
// Returns "Signup failed." if any part is null/undefined
```
_Common Patterns:_
```js
// 1. Nested object access
const username = user?.profile?.name; 
// undefined if user or profile doesn't exist

// 2. Array access
const firstBlog = blogs?.[0]?.title;
// undefined if blogs is null or empty

// 3. Function calls
const result = obj.method?.(); 
// undefined if method doesn't exist (won't crash)

// 4. With nullish coalescing (??)
const error = err.response?.data?.error ?? "Unknown error";
// Combines safely with default values
```

#### Spread Operator (...)
**What it does**: Expands (unpacks) an array or object into individual elements/properties.

**Syntax**: `...arrayOrObject`

**Key Points**:
- Creates **shallow copies** (not deep clones)
- Works with arrays, objects, and function arguments
- Commonly used for immutability in React
- Order matters when spreading multiple objects (later properties override earlier ones)

**Common Patterns**:

```js
// 1. Array spreading
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// 2. Object spreading
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, age: 31 }; // { name: 'John', age: 31 }

// 3. Removing properties (from Signup.jsx)
const { confirmPassword, ...submitData } = data;
// submitData has all properties EXCEPT confirmPassword

// 4. Combining objects
const defaults = { color: 'blue', size: 'M' };
const custom = { color: 'red' };
const final = { ...defaults, ...custom }; 
// { color: 'red', size: 'M' } ← custom.color overrides defaults.color

// 5. Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers); // Same as Math.max(1, 2, 3)
```

---
## Note 6: Understanding Tailwind classes
#### 1. `overflow-hidden` - Clips Content That Exceeds Boundaries
**What it does**: Hides any content that goes beyond the element's size.
```jsx
// In your Card.jsx - Title (Example for this and other two classes)
<h3 className='line-clamp-2 overflow-hidden text-ellipsis'>
  {title}
</h3>
```
_Visual Example:_
```
┌─────────────────┐
│ This is a very  │  ← Container with overflow-hidden
│ long title th...│  ← Text gets cut off at border
└─────────────────┘

Without overflow-hidden:
┌─────────────────┐
│ This is a very long title that goes way beyond the box │
└─────────────────┘
```
_Why you need it_:

- Prevents layout breaking when text is too long
- Required for `text-ellipsis` to work

#### 2. `text-ellipsis` - Adds "..." to Truncated Text
What it does: Shows `...` (ellipsis) when text is cut off.

⚠️ **Important**: Must be used with `overflow-hidden` and `whitespace-nowrap` (or `line-clamp-*`)
_visual Exmaple:_
```
With text-ellipsis:
"This is a very long blog title that..."

Without text-ellipsis:
"This is a very long blog title that" ← Just cuts off, no ...
```

#### 3. `line-clamp-2` - Limits Text to N Lines with Ellipsis
**What it does**: Shows only 2 lines of text, adds ... if content exceeds.
_Visual Example:_
```
line-clamp-2 (your title):
┌──────────────────────────┐
│ How to Build a Full Stack│  ← Line 1
│ React Application with...│  ← Line 2 (cuts here with ...)
└──────────────────────────┘

line-clamp-4 (your content preview):
┌──────────────────────────┐
│ This is my blog content  │  ← Line 1
│ about building amazing   │  ← Line 2
│ applications using React │  ← Line 3
│ and Node.js. We will...  │  ← Line 4 (cuts here with ...)
└──────────────────────────┘
```

#### 4. `flex-1` - Grow to Fill Available Space
**What it does**: Makes an element expand to fill remaining space in a flex container.
_Example:_
```jsx
// In your Card.jsx - Date section
<div className='mb-4 flex-1 flex items-start'>
  <p className='-rotate-90 origin-right text-sm truncate max-w-[100px]'>
    {`@${username}`}
  </p>
</div>
```
_Visual Example:_
```
Your Card Layout (col-span-7):
┌────────────────────────────────┐
│ Title (fixed height)           │ ← Takes only space it needs
├────────────────────────────────┤
│                                │
│ Content (flex-1)               │ ← Grows to fill remaining space
│                                │
│                                │
└────────────────────────────────┘

Without flex-1, content would only take space it needs:
┌────────────────────────────────┐
│ Title                          │
├────────────────────────────────┤
│ Content (2 lines only)         │
├────────────────────────────────┤
│ [Empty space wasted]           │
└────────────────────────────────┘
```
_In your Card_:
```jsx
<div className='col-span-7 flex flex-col overflow-hidden'>
  {/* Title - takes only needed space */}
  <div className='text-xl mb-3 font-bold'>
    <h3 className='line-clamp-2'>...</h3>
  </div>
  
  {/* Content - grows to fill rest of the 200px card height */}
  <div className='text-gray-300 text-sm flex-1 overflow-hidden'>
    <p className='line-clamp-4'>...</p>
  </div>
</div>
```
#### 5. `leading-relaxed` - Increases Line Height (Spacing Between Lines)
**What it does**: Adds more vertical space between lines of text (line-height: 1.625).
_Example_
```jsx
// In your Card.jsx
<p className='line-clamp-4 overflow-hidden text-ellipsis leading-relaxed'>
  {displayContent}
</p>
```
_Visual Example:_
```
Without leading-relaxed (default):
┌──────────────────────┐
│This is line one      │
│This is line two      │  ← Lines are close together
│This is line three    │
└──────────────────────┘

With leading-relaxed:
┌──────────────────────┐
│This is line one      │
│                      │  ← More breathing room
│This is line two      │
│                      │
│This is line three    │
└──────────────────────┘
```
_Why use it?_

- Improves readability for paragraphs
- Makes text less cramped in blog previews
---

## Topic 1: Authentication Context & State Management
#### Context API Implementation
```js
// Understand contexts/AuthContext.jsx
// Understand createContext, useContext hook, context Provider(& wrapping whole app with context Provider).
```
#### Custom Auth Hook
A custom hook in React is a function that uses built-in hooks (like useState, useEffect, useContext, etc.) to encapsulate reusable logic. It always starts with use (e.g., useAuth). Custom hooks help you share logic across components without repeating code.
```js
// hooks/useAuth.js
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```
_Key Benefits_:
- Centralized authentication state
- Automatic auth checking on app load
- Reusable across components (Not have to import useContext and AuthContext again again, just import useAuth).
- Type-safe context usage(with TypeScript): You can enforce types inside the hook, making it safer to use.

---

## Topic 2: Form Handling with React Hook Form
#### Advanced Form Validation
```jsx
// pages/Signup.jsx
const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
} = useForm();

const password = watch("password", "");

  {/* password */}
  <input type="password"
  // ... code
  />

  {/* Confirm password */}
  <input type="password" 
  
  {...register("confirmPassword",{
    required: {value: true, message: "Please confirm your password"},
    validate: value => value === password || "Passwords do not match"
  })} 

  />
  // showing error for confirm password
  {errors.confirmPassword && (
    <p className="...">{errors.confirmPassword.message}</p>
  )}
```
#### Form State Management
```jsx
const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState('');

const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    
    try {
        const { confirmPassword, ...submitData } = data; // Remove confirmPassword
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/`, submitData);
        
        navigate('/login/?auth=signup_success');
        reset(); // Clear form after success
    } catch (error) {
        setErrorMsg(error.response?.data?.error || "Signup failed.");
    } finally {
        setLoading(false);
    }
};
```
_Pattern Benefits_:

- Minimal re-renders (better performance)
- Built-in validation with custom rules
- Easy form reset and state management
- TypeScript support available

---

## Topic 3: OAuth integration
```js
// OAuth redirect pattern
const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

// Handle OAuth callbacks in components from (pages/Home.jsx)
import { useSearchParams } from 'react-router-dom'

const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  // suppose url is http://localhost:3000/?auth=google_success&error=none
    const authStatus = searchParams.get('auth');
    if (authStatus === 'google_success') {
        toast.success('Login Successfully!');
        setSearchParams({}); // Clean up URL
    }
}, [searchParams, setSearchParams]);
```
_Key Points_:

- **withCredentials**: true for cookie authentication
- URL parameters for OAuth status handling
- Environment variables for API endpoints
- Proper error handling with user feedback
- useSearchParams is a React Router hook for reading and updating URL query parameters in React components.
- Enables dynamic handling of authentication and other state via the browser address bar.

---

## Topic 4: Animation & User Experience
## Framer Motion Integration
```js
// Button animations
import { motion, scale } from "motion/react"


<motion.button 
    disabled={loading}
    whileTap={!loading ? { scale: 0.95 } : {}}
    className="..."
>
    {loading ? 'Creating...' : 'Sign Up'}
</motion.button>
```

_UX Patterns_:
- Loading states during async operations
- Visual feedback for user actions
- Consistent animation timing
- Accessible notifications
---
## Topic 5: Routing & Navigation
#### Installation & Setup
```
npm install react-router-dom
```
#### Router Configuration
```js
// main.jsx - Root setup
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Enables routing for entire app */}
      <AuthProvider> {/* Global auth state */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```
#### Route Definition
```js
// App.jsx - Route structure
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home' 
import CreateBlog from './pages/CreateBlog'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/CreateBlog' element={<CreateBlog />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}
```
#### Navigation Patterns
```js
//1. Programmatic Navigation -> You need to navigate after an event (e.g., form submit, API call)
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate();

// Navigate after successful action
const handleLogin = async (data) => {
  try {
    await axios.post('/user/login', data);
    navigate('/?auth=login_success'); // Redirect with query param
  } catch (error) {
    console.error(error);
  }
};

//2. Declarative Navigation (Link) -> You want users to navigate by clicking a link or button.
import { Link } from 'react-router-dom'

<Link to="/CreateBlog">
  <CirclePlus size={30} />
  <p>create</p>
</Link>

//3. Active Link Highlighting (NavLink) -> You want to style links differently when they match the current route.(Navbar)
import { NavLink } from 'react-router-dom'

<NavLink to="/profile" activeClassName="active">
  Profile
</NavLink>
```
#### URL Query Parameters
```js
// Reading URL parameters
import { useSearchParams } from 'react-router-dom'

const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  // URL: http://localhost:5173/?auth=login_success
  const authStatus = searchParams.get('auth');
  
  if (authStatus === 'login_success') {
    toast.success('Login Successfully!');
    setSearchParams({}); // Clean up URL: /?auth=login_success → /
  }
}, [searchParams, setSearchParams]);
```

#### URL Route Parameters
```js
// Route definition: /blog/:id
// URL: /blog/123
import { useParams } from 'react-router-dom';

const { id } = useParams(); // Get blog ID from URL, id = 123

```
---

## Topic 6: Rich Text Editor (TipTap)
> Note: Tiptap editor uses prosemirror editor under the hood
#### Installation & Dependencies
```
npm install @tiptap/pm @tiptap/react @tiptap/starter-kit
```
#### Editor Configuration
> Note: For better understanding go to src/components/Texteditor/Editor
```js
import { useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'

// components/TextEditor/Editor.jsx
const editor = useEditor({
    extensions: [  // define your extension array
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        StarterKit.configure({  //StarterKit is a collection of the most popular Tiptap extensions
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
        }),
    ],
    content: content || '', // initial content
    // .. for better understanding go to src/components/Texteditor/Editor
});

return (
    <div>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
```
#### Menubar
> Note: For better understanding go to src/components/Texteditor/Menubar
```jsx
<Toggle 
  pressed={editor.isActive('heading', { level: 1 })}
  onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
  className='hover:text-black cursor-pointer'
>
  <Heading1 className='h-4 w-4'/>
</Toggle>
```

> Read components/texteditor/TitleEditor for better understanding, Read CreateBlog for understanding Validations

---

## Topic 7: Utility Functions (Utils)
Utility functions are reusable, **pure functions** that perform specific tasks without side effects. They help keep code DRY (Don't Repeat Yourself) and maintainable.

#### Core Principles of Good Utility Functions
1. **Pure Functions** (same input = same output, no side effects)
```jsx
// ✅ GOOD - Pure function
export const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ❌ BAD - Impure (depends on external state)
let globalMaxLength = 200;
export const truncateText = (text) => {
  return text.substring(0, globalMaxLength) + '...';
};
```
2. **Single Responsibility** (one function = one job)
```jsx
// ✅ Separate concerns
export const stripHtml = (html) => { /* removes HTML */ };
export const truncateText = (text) => { /* shortens text */ };

// ✅ Composition when needed
export const stripAndTruncate = (html, maxLength = 200) => {
  const plainText = stripHtml(html);
  return truncateText(plainText, maxLength);
};
```
3. **Defensive Programming** (validate inputs, handle edge cases)
```jsx
export const stripHtml = (html) => {
  if (!html) return ''; // ✅ Handle null/undefined/empty
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || ''; // ✅ Fallback chain
};
```

#### JSDoc
JSDoc is a documentation standard for JavaScript that provides:

- **IDE Intelligence**: Your code editor (like VS Code) reads these comments to provide better autocomplete, parameter hints, and type checking
- **Documentation Generation**: Tools can automatically generate documentation websites from these comments
- **Developer Experience**: Other developers (including future you!) can quickly understand how to use your functions

_Syntax:_
```js
/**
 * Utility function to strip HTML tags from a string
 * @param {string} html - HTML string to strip tags from
 * @returns {string} Plain text without HTML tags
 */
```
- `@param {type} parameterName` - description: Describes each parameter
- `@returns {type} description`: Describes what the function returns
- `{string}`: Type annotation (string, number, boolean, object, etc.)

Your JSDoc comments make the textUtils.js functions much **more developer-friendly** by clearly documenting expected input types and return values, which is especially important for utility functions that will be reused across your project.

> Gotcha: JSDoc doesn't enforce types at runtime (unlike TypeScript), but it significantly improves the development experience!

#### File Organization
```
src/utils/
├── textUtils.js    # String manipulation
├── dateUtils.js    # Date formatting
├── validations.js  # Form validation
└── api.js          # API helpers
```

---

## Topic 8: 