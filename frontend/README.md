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

#### Note 5: JS topics
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
- date.toLocaleString()/toLocaleDateString()/toLocaleTimeString(options) — localized output

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

