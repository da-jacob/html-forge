# HtmlForge

**HtmlForge** is a simple tool for working with plain HTML files, without the need for complex templating engines or frameworks. It adds basic include functionality to help you keep your code clean and DRY — perfect for beginners or small static websites.

## ✨ Features

- `<!--- include "nav.html" -->` support (like partials/snippets)
- Create projects with a basic HTML file structure
- Live server with auto-reload
- Static build output (includes are compiled into final HTML)
- Easy setup, no config required

## 🛠️ How It Works

1. Select a **root directory** where your projects will live.
2. Create a **new project** – HtmlForge will generate a folder with basic structure (`index.html`, `assets/`, etc.).
3. Use `<!--- include "file.html" -->` anywhere in your HTML to reuse components.
4. Start the **live server** for previewing and editing with instant reload.
5. Use **Build** to generate fully resolved static HTML files. The output will be placed in the `.out` directory within your project folder.

## 📁 Example

**index.html**
```html
<html>
  <head>
    <title>My Site</title>
  </head>
  <body>
    <!--- include "components/nav.html" -->
    <h1>Welcome!</h1>
    <!--- include "components/footer.html" -->
  </body>
</html>
```

**nav.html**
```html
<nav>
  <a href="/">Home</a>
  <a href="/about.html">About</a>
</nav>
```

On build, **index.html** will be compiled with the contents of **nav.html** and **footer.html** injected.

## 📦 Installation

HtmlForge is available for **Windows** and can be downloaded from the [Releases section](https://github.com/da-jacob/html-forge/releases) on GitHub.

1. Go to the [Releases](https://github.com/da-jacob/html-forge/releases) page.
2. Download the latest `.exe` installer.
3. Run the installer and start using HtmlForge right away.

> 🛠️ macOS and Linux support is planned for the future.

## 🔧 Roadmap / Ideas

* Use HTML-like attributes to them inside included files (eg. `<!-- include "components/button.html" text="..." -->`)
* Support for macOS and Linux
* Option to initialize Git repo on new project
* Button to open project in external editor (e.g. VS Code)
* Dark mode / themes

## 📃 License
MPL-2.0
