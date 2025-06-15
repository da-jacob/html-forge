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
4. Nested includes are supported (e.g., components can include other components).
5. If you want, you can also define parameters: `<!-- include "components/button.html" text="Click me" link="/contact" -->`
6. Start the **live server** for previewing and editing with instant reload.
7. Use **Build** to generate fully resolved static HTML files. The output will be placed in the `.out` directory within your project folder.

> During build, the `components/` folder (used for include templates) is excluded from the output.

## 📁 Example

**index.html**
```html
<html>
  <head>
    <title>My Site</title>
  </head>
  <body>
    <!--- include "components/header.html" -->
    <h1>Welcome!</h1>
    <!--- include "components/footer.html" -->
  </body>
</html>
```

**components/header.html**
```html
<nav>
  <a href="/">Home</>
  <a href="/about.html">About</a>
  <!--- include "components/button.html" text="Contact" link="/contact.html" -->
</nav>
```

**components/button.html**
```html
<a href="{{ link }}">{{ text }}</a>
```

On build, **index.html** will be compiled with the contents of **nav.html** and **footer.html** injected.

## 📦 Installation

HtmlForge is available for **Windows** and can be downloaded from the [Releases section](https://github.com/da-jacob/html-forge/releases) on GitHub.

1. Go to the [Releases](https://github.com/da-jacob/html-forge/releases) page.
2. Download the latest `.exe` installer.
3. Run the installer and start using HtmlForge right away.

> 🛠️ macOS and Linux support is planned for the future.

## 🔧 Roadmap / Ideas

* Support for macOS and Linux
* Button to open project in external editor (e.g. VS Code)
* Dark mode / themes

## 📃 License
HtmlForge is licensed under the **Mozilla Public License 2.0 (MPL 2.0)**.  
See the `LICENSE` file for details.

## 💬 Feedback & Contributing
Found a bug or have an idea?  
Please open an issue or PR — all ideas and contributions are welcome!

## 🙋‍♂️ About
Made by Jakub Lipár (@da‑jacob).  
Follow along or leave feedback on GitHub!

---

Let me know if you’d like tweaks to the wording, a GIF demo, or any additional sections!
